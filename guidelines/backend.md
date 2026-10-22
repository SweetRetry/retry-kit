# Backend

## 选型

| 能力 | Cloudflare | Vercel |
| --- | --- | --- |
| 运行时 | Worker，经 Void | Node.js 24，Hono |
| 数据库 | D1 | PostgreSQL，托管在 Supabase |
| ORM | Drizzle | Drizzle，node-postgres |
| 文件 | R2 | 待补 |
| 队列 | `void/queues`（未接入，用到再 import） | Graphile Worker，跑在 PostgreSQL 上 |
| Redis | 不使用 | Upstash，仅在必要时引入 |
| AI | Workers AI，经 AI Gateway | Vercel AI SDK |
| API 描述 | 不要求 | `@hono/zod-openapi`（OpenAPI 3.1），Scalar 文档页 |
| 日志 | `console`，平台采集 | Pino，`hono-pino` |

两边共用：

- 鉴权用 Better Auth。应用要有账号时再加。
- 校验用 Zod v4。
- 限流用 `hono-rate-limiter`（Vercel 栈）。
- 测试用 Vitest。

## 数据库

- Drizzle 管理全部 schema，业务表与 Better Auth 表在同一处。
- schema 变更走 migration，不手工改库。先 `pnpm db:generate`，再应用。
- D1 没有交互式事务。真需要时改走 Vercel 栈的 PostgreSQL，或加 Hyperdrive。
- 集成测试依赖外部资源时，缺少连接配置就跳过。测试不自行启动容器运行时。

## 队列（Vercel 栈）

默认用 Graphile Worker，任务存在 PostgreSQL 里，不引入 Redis。

- 入队用 `add_job`，可以和业务写入放在同一个事务里，要么都提交，要么都回滚。Redis 队列做不到这一点。
- 并发取任务靠 `FOR UPDATE SKIP LOCKED`。失败的任务按 `e^attempts` 秒退避重试，退避上限约 6 小时，重试耗尽后留在表里，`last_error` 记录最后一次错误。
- 完成的任务直接删除，不保留历史。需要历史时在任务内部自己写表。
- worker 是常驻进程，不能跑在 Vercel 函数里，要有单独的常驻宿主，见 [deployment.md](deployment.md)。
- worker 用专用连接 `LISTEN` 来更早醒来，同时仍在轮询，所以连接断开只会让任务变慢，不会丢任务。
- 连接 Supabase 要分两种。worker 用 session pooler（5432）或 direct 连接，因为 transaction pooler（6543）不支持 `LISTEN/NOTIFY` 与预处理语句。运行在 Vercel 函数里的应用查询用 transaction pooler，并关闭预处理语句。见 Supabase 文档 [Supavisor FAQ](https://supabase.com/docs/guides/troubleshooting/supavisor-faq-YyP5tI) 与 [连接术语说明](https://supabase.com/docs/guides/troubleshooting/supavisor-and-connection-terminology-explained-9pr_ZO)。

## Redis（Vercel 栈）

默认不用。出现下面的情况再引入 Upstash，并在 ADR 里写明触发原因：

- 需要跨实例共享、读写频繁的缓存或限流计数，PostgreSQL 扛着不合适。
- 任务吞吐或延迟超出 PostgreSQL 队列能承受的范围，改用 Redis 队列。

## 环境变量

- 每个应用在 `src/env.ts` 用 Zod 校验自己的环境变量，在入口显式传给下游。
- 本地配置放 `.env.local`（Cloudflare 栈放 `.env`），生产变量参考相邻的 `.env.example`。
- 生产环境必须提供高熵的鉴权密钥。
- AI provider 的 key 未配置时，相关 endpoint 返回 `503 SERVICE_UNAVAILABLE`。

## Zod v4

生成代码时用 v4 API，不写 v3 模式。

- 字符串格式用 standalone 构造器：`z.email()`、`z.url()`、`z.uuid()`、`z.iso.datetime()`，替代 `z.string().email()` 这类链式写法。
- 错误消息用 `error` 字段，替代 `message`。
- `z.record()` 必须给出 key 与 value 两个 schema，key 不需穷尽时用 `z.partialRecord()`。
- `.deepPartial()` 已移除，改用 `z.deepPartial(schema)`。
- `.default()` 的值要匹配 output 类型，值匹配 input 并需经过 transform 时用 `.prefault()`。
- 环境变量解析用 `z.stringbool()` 与 `z.coerce.*`。

废弃 API 用一个小脚本在门禁里扫描，命中即错、几乎没有误报。

## API 约定

适用于应用控制的 HTTP 出口。`/api/auth/*` 由 Better Auth 接管。

- 成功直接返回资源或结果，用符合语义的 2xx，不加 `{ success, data }` 包装。`204` 不发响应体。
- 失败用 4xx 与 5xx，不以 `200` 加 `success: false` 表达。
- 错误一律是 RFC 9457 Problem Details，媒体类型 `application/problem+json`，经一个 `problemResponse(c, input)` 构造，不手写错误 JSON。`status` 同时决定 HTTP 状态码。
- `instance` 默认取请求路径。Cloudflare 上改用 `urn:cf-ray:<id>`，用户的错误报告凭它能在 Workers Logs 里找到那次请求。
- 错误体不含堆栈、SQL、内部主机名和 Zod 原始错误。
- 公开错误类型用绝对 URI `https://<域名>/problems/<slug>`，不对外承诺的类别省略 `type`。
- Vercel 栈的 `/api/openapi.json` 由 Zod schema 派生，不手写，不提交静态副本。
- 校验失败要并入 problem 响应。`@hono/zod-openapi` 默认返回带 Zod 原始错误的 JSON，创建 `OpenAPIHono` 时统一配置 `defaultHook`。

| code | 语义 |
| --- | --- |
| `VALIDATION_ERROR` | 输入不符合 schema，字段错误放进 `invalidParams` |
| `UNAUTHORIZED` | 凭据缺失、无效或过期 |
| `FORBIDDEN` | 资源可见，但当前身份无权执行该操作 |
| `NOT_FOUND` | 资源不存在，或身份无权知道其存在 |
| `CONFLICT` | 与当前资源状态冲突 |
| `TOO_MANY_REQUESTS` | 超过限流阈值，配合 `Retry-After` |
| `SERVICE_UNAVAILABLE` | 依赖未配置或暂时不可用 |
| `INTERNAL_SERVER_ERROR` | 未预期的服务端失败，带 `traceId` |

- 无权知道资源是否存在时返回 `404`，用 `403` 会泄漏存在性。认证缺失或无效一律 `401`。
- 新增 `code` 前先问：状态码是否已经说清这个错误？能说清就复用。多个字段的校验失败用 `invalidParams`，不拆成多个 `code`。
- 改名或删除已发布的 `type` 与 `code` 是破坏性变更。
- 路径用资源加 HTTP 方法。非 CRUD 操作用子资源，如 `POST /orders/{id}/cancel`。部分更新用 `PATCH`，全量替换用 `PUT`。`POST` 不承诺幂等，可重试的写操作由调用方带幂等键或由唯一约束兜底。
- 早期不引入版本前缀，破坏性变更优先以新增字段或新资源路径的兼容方式演进。
- 客户端以共享 request 包为唯一解析点，业务分支只看 `code` 与 `status`，不解析 `title` 或 `detail` 的内容。

验证靠 HTTP 测试断言状态码、`content-type` 与 body，不做源码正则扫描。
