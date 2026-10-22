# Observability

本篇主体是 Node 服务形态的 OpenTelemetry 方案。Edge 形态见文末，桌面应用目前没有统一约定。

## 选型

| 信号 | 选择 | 备注 |
| --- | --- | --- |
| Traces | OpenTelemetry | 业务代码只依赖 API，SDK 在应用入口装配 |
| Logs | Pino JSON 输出到 stdout | 是 application log 的事实来源，不启用 OpenTelemetry logs pipeline |
| Metrics | 未启用 | |
| 传播 | W3C Trace Context（`traceparent`、`tracestate`） | 传播器固定为 Trace Context + Baggage |

`OTEL_LOGS_EXPORTER` 与 `OTEL_METRICS_EXPORTER` 设为 `none`。日志级别用 `LOG_LEVEL`，本地要可读输出时设 `LOG_PRETTY=true`。

## 契约

| 内容 | 取值 |
| --- | --- |
| HTTP response 暴露出口 | `traceparent`（服务端 span context），不返回 `tracestate` |
| 错误体 | RFC 9457 扩展成员 `traceId`，只随 `INTERNAL_SERVER_ERROR` 出现 |
| 日志关联字段 | `trace_id`、`span_id`、`trace_flags` |
| span 投影字段 | camelCase `traceId`、`spanId`、`parentSpanId`，对齐 OTLP/JSON |

- 日志关联字段名对齐 OTel Logs Data Model 与官方 pino instrumentation，接日志后端时不需要改名。
- 形状校验与序列化一律委托 `@opentelemetry/api` 与 `@opentelemetry/core`，不自写正则。接收端接受大写 hex，发送端固定小写。
- 不用自造的 `x-trace-id`。response 里的 `traceparent` 正是调用方下一个 span 的父级，入站解析与出站序列化共用同一条代码路径。
- response 不回传 `tracestate`，vendor 数据可能泄漏给跨域调用方。
- 跨域调用方要读到 `traceparent`，需要服务端声明 `Access-Control-Expose-Headers`。忘记声明时表现为看不到 trace id，而不是报错。

## 边界

- Trace 只用于诊断，不承担业务状态、权限、幂等、恢复或审计不变量。sampling 与 export 失败不得改变业务结果。
- export 保持 vendor-neutral。OTLP 只标准化传输，不标准化查询 API，trace 查询由独立 adapter 对接本地存储或具体 backend。
- 一个共享的 tracing package 拥有传播格式、暴露出口和字段命名，保持浏览器可用，只依赖 OTel API 与 core。SDK 装配、exporter 与 span 投影不放在里面。
- 每个应用持有自己的 SDK 装配代码，约 20 行。这是有意的重复，见 [architecture.md](architecture.md)。
- 浏览器 tracing 需要单独评估数据治理、CORS、采样和收益。

## 本地与生产

- 本地未设置 `OTEL_TRACES_EXPORTER` 的非生产环境，把 span 投影成 JSONL 落盘。用 `jq -c --arg id <traceId> 'select(.traceId == $id)'` 按行检索，检索前把输入归一成小写。
- 生产用标准 OTel 环境变量发送 OTLP：`OTEL_TRACES_EXPORTER=otlp`、`OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`、`OTEL_EXPORTER_OTLP_ENDPOINT`。endpoint 写 base 地址，不附加 `/v1/traces`。

## 脱敏

- URL query、认证信息、cookie、password、secret 与 api key 类数据不得进入持久化的 log 或 trace projection。
- log 按字段名逐层匹配排除，覆盖顶层与嵌套路径，如 `*.password`、`*.*.accessToken`。
- span 投影按 key 语义判定。凭据类 key 整值替换，URL 的 query 与 fragment 剔除。
- `token` 只有作为独立 key 段（如 `session.token`）才算凭据。`input_tokens`、`token_count` 是指标，保留原值。
- 两处脱敏都配回归测试。新增字段命中上述语义时，先补测试再合入。

## Edge 形态

Cloudflare Workers 不自己装配 OpenTelemetry SDK，日志与 trace 由平台采集。

- 在 `void.config.ts` 的 `cloudflare.observability` 里开启 `logs` 与 `traces`。
- 日志直接用 `console.log`、`console.warn`、`console.error`，平台会把它们挂到请求的 trace 上。
- 事件名用简短的点分键，数据放对象里，如 `console.error("api.failed", { path, error })`。
- 记录 `Error` 时写成 `{ name, message, stack }`，直接序列化会得到 `{}`。
- 不记录 secret、cookie、session token、密码和完整请求体。
- 用户的错误报告靠 `cf-ray` 关联。每个 `/api/*` 错误的 `instance` 都是 `urn:cf-ray:<id>`，见 [api.md](api.md)。
- 本地开发时 Cloudflare 的 Vite 插件记录每个请求的 span 与日志，可在 `/cdn-cgi/local/explorer/` 浏览，或用 SQL 查询 `spans` 与 `logs` 两张表。本地请求没有 `cf-ray`，按时间或路径查找。
- 部署后用 `void project logs` 查看实时日志，AI Gateway 的日志里能看到每次模型调用的延迟、token 与缓存状态。
