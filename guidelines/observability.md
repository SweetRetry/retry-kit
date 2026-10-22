# Observability

## Cloudflare

平台采集日志与 trace，应用不装配 OpenTelemetry SDK。Worker 的请求量、错误与耗时等指标由平台提供，在 Dashboard 的 Observability 里查看。自定义指标的做法待补。

- 在 `void.config.ts` 的 `cloudflare.observability` 里开启 `logs` 与 `traces`。
- 日志用 `console.log`、`console.warn`、`console.error`，平台会把它们挂到请求的 trace 上。
- 事件名用简短的点分键，数据放对象里：`console.error("api.failed", { path, error })`。
- 记录 `Error` 时写成 `{ name, message, stack }`，直接序列化会得到 `{}`。
- 用户的错误报告靠 `cf-ray` 关联。每个 `/api/*` 错误的 `instance` 都是 `urn:cf-ray:<id>`。
- 本地开发时 Cloudflare 的 Vite 插件记录每个请求的 span 与日志，在 `/cdn-cgi/local/explorer/` 浏览，或用 SQL 查询 `spans` 与 `logs` 两张表。本地请求没有 `cf-ray`，按时间或路径查找。
- 部署后用 `void project logs` 看实时日志。AI Gateway 的日志能看到每次模型调用的延迟、token 与缓存状态。

## Vercel（Node 服务）

| 信号 | 实现 |
| --- | --- |
| Traces | OpenTelemetry。业务代码只依赖 API，SDK 在应用入口装配 |
| Logs | Pino JSON 输出到 stdout，是 application log 的事实来源，不启用 OTel logs pipeline |
| Metrics | OpenTelemetry，经 OTLP 导出，与 traces 共用 endpoint |
| 传播 | W3C Trace Context，传播器固定为 Trace Context + Baggage |

`OTEL_LOGS_EXPORTER` 设为 `none`，`OTEL_METRICS_EXPORTER` 与 `OTEL_TRACES_EXPORTER` 一样设为 `otlp`。`NodeSDK` 按环境变量创建 metric reader，不需要改装配代码。`OTEL_METRIC_EXPORT_INTERVAL` 控制导出间隔。

### Metrics

- HTTP 层用 `@hono/otel`，它在有 MeterProvider 时自动记录 `http.server.request.duration` 直方图与 `http.server.active_requests`。
- 业务指标在业务代码里用 `@opentelemetry/api` 的 `metrics.getMeter(...)` 创建 counter 或 histogram，业务代码仍然只依赖 API。
- 指标名遵循 OTel 语义约定，自定义指标用应用名作前缀。
- 属性必须低基数。路由用模板（`/orders/{id}`），不用原始 URL，不放用户标识、订单号这类无界取值。
- 本地开发的 SDK 装配如果清空了 metric reader，要同步改成 console 导出或保持关闭，不能让本地和生产的指标行为不一致而无人知晓。

### 契约

- HTTP response 用 `traceparent`（服务端 span context）暴露 trace，不返回 `tracestate`。不自造 `x-trace-id`。
- 错误体的 `traceId` 是 RFC 9457 扩展成员，只随 `INTERNAL_SERVER_ERROR` 出现。
- 日志关联字段是 `trace_id`、`span_id`、`trace_flags`，对齐 OTel Logs Data Model。
- span 投影用 camelCase `traceId`、`spanId`、`parentSpanId`，对齐 OTLP/JSON。
- 校验与序列化委托 `@opentelemetry/api` 与 `@opentelemetry/core`，不自写正则。接收端接受大写 hex，发送端固定小写。
- 跨域调用方要读到 `traceparent`，服务端须声明 `Access-Control-Expose-Headers`。

### 装配

- 一个共享的 tracing package 拥有传播格式、暴露出口和字段命名，保持浏览器可用，只依赖 OTel API 与 core。
- 每个应用在 `src/observability.ts` 装配自己的 NodeSDK，在入口显式启停。约 20 行的重复是有意的。
- 本地未设置 `OTEL_TRACES_EXPORTER` 时，把 span 投影成 JSONL 落盘，用 `jq -c --arg id <traceId> 'select(.traceId == $id)'` 检索。
- 生产用标准 OTel 环境变量发送 OTLP：`OTEL_TRACES_EXPORTER=otlp`、`OTEL_METRICS_EXPORTER=otlp`、`OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`、`OTEL_EXPORTER_OTLP_ENDPOINT`。endpoint 写 base 地址，不附加 `/v1/traces` 或 `/v1/metrics`。

## 共同边界

- Trace 与 metric 只用于诊断，不承担业务状态、权限、幂等或审计。sampling 与 export 失败不得改变业务结果。
- URL query、认证信息、cookie、password、secret 与 api key 不得进入持久化的 log、trace 或 metric 属性。
- 脱敏按字段名逐层匹配，覆盖嵌套路径，如 `*.password`、`*.*.accessToken`。`token` 只有作为独立 key 段（如 `session.token`）才算凭据，`input_tokens`、`token_count` 是指标，保留原值。
- 脱敏规则配回归测试。新增字段命中上述语义时，先补测试再合入。
- 浏览器端 tracing 需要单独评估数据治理、CORS、采样和收益，不随服务端自动启用。
