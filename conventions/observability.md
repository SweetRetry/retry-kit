# Observability

| 信号 | Cloudflare | Vercel | 通用机器 |
| --- | --- | --- | --- |
| Logs | `void/log` | Pino JSON 到 stdout | Pino JSON 到 stdout |
| Traces 与 Metrics | 待定 | `@vercel/otel` | OpenTelemetry NodeSDK，经 OTLP 导出 |

传播用 W3C Trace Context，日志不走 OTel logs pipeline。导出后端在真正接入时再选。

## 原则

- 业务代码只依赖 `@opentelemetry/api`，SDK 在应用入口装配。
- Trace 与 metric 只用于诊断，sampling 与 export 失败不得改变业务结果。
- 指标名遵循 OTel 语义约定，属性必须低基数，路由用模板（`/orders/{id}`），不放用户标识等无界取值。

## 脱敏

- URL query、认证信息、cookie、password、secret 与 api key 不得进入 log、trace 或 metric。
- 按字段名逐层匹配嵌套路径；`token` 只在作为独立 key 段时算凭据，`input_tokens` 这类指标保留原值。
- 脱敏规则配回归测试。
