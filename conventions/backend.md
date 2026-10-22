# Backend

## API 约定

与语言无关，任何后端都遵守。

- 业务接口放在所在平台的 API 层，Cloudflare 上是 TanStack Start 的 server function 与 server route，其他平台是独立的 Hono 应用。
- 有独立 Hono 时，前端框架的服务端能力只做 BFF，克制使用，只为当前前端聚合、持有服务端凭据、裁剪数据。
- 路径是资源加 HTTP 方法，非 CRUD 操作用子资源（`POST /orders/{id}/cancel`）。
- 成功直接返回资源，用语义 2xx，不包 `{ success, data }`；`204` 无响应体。
- 失败用 4xx 与 5xx，错误体是 `{ code, message, issues?, traceId? }`，只经一个 helper 构造。
- `issues` 只在校验失败时出现，形如 `[{ path, message }]`。
- 错误体不含堆栈、SQL、内部主机名和校验库的原始错误。
- 可重试的 `POST` 由调用方带幂等键或由唯一约束兜底。
- 不加版本前缀，以新增字段或新资源路径兼容演进。
- 客户端只按 `code` 与 `status` 分支，不解析 `message`。
- 约定由 HTTP 测试断言状态码与 body。

| code | 语义 |
| --- | --- |
| `VALIDATION_ERROR` | 输入不符合 schema，字段错误放进 `issues` |
| `UNAUTHORIZED` | 凭据缺失、无效或过期 |
| `FORBIDDEN` | 资源可见，但当前身份无权执行该操作 |
| `NOT_FOUND` | 资源不存在，或身份无权知道其存在 |
| `CONFLICT` | 与当前资源状态冲突 |
| `TOO_MANY_REQUESTS` | 超过限流阈值，配合 `Retry-After` |
| `SERVICE_UNAVAILABLE` | 依赖未配置或暂时不可用 |
| `INTERNAL_SERVER_ERROR` | 未预期的服务端失败，带 `traceId` |

- 无权知道资源是否存在时返回 `404`，不用 `403` 泄漏存在性。
- 状态码已能说清的错误不新增 `code`。
- 改名或删除已发布的 `code` 是破坏性变更。

## 选型

平台原生服务优先，平台没有时用 Supabase 或通用方案。Cloudflare 上经 Void 使用平台能力，Void 没有的再直接用 binding。

| 能力 | Cloudflare | Vercel | 通用机器 |
| --- | --- | --- | --- |
| 运行时 | TanStack Start + `voidPlugin()`，API 用 server route，与前端同一个 Worker | Node 24，Hono | Node 24，Hono |
| 数据库 | `void/db`（D1），有需求时切到 Supabase PG（经 Hyperdrive） | Supabase PG | Supabase PG |
| 队列 | `void/queues` | Vercel Queues（public beta） | Graphile Worker |
| 文件 | `void/storage`（R2） | Vercel Blob | Supabase Storage，代码只写 S3 API |
| 限流 | Rate Limiting binding | Vercel Firewall | `hono-rate-limiter` |
| 日志 | `void/log` | Pino | Pino |
| Redis | 不使用 | Upstash，必要时引入 | Upstash，必要时引入 |
| AI | `void/ai` | AI SDK，经 Vercel AI Gateway | AI SDK |
| 定时任务 | `crons/`（Void） | Vercel Cron | Graphile Worker crontab |
| 邮件 | `void/email` | Resend | Resend |

共用 Drizzle、Better Auth（应用要有账号时再加）与 Vitest。

- 校验失败统一转成 `VALIDATION_ERROR` 错误体，不透出校验库的原始错误。
- 只在接口提供给外部客户时输出 OpenAPI。
- 业务配额记在数据库里，不算限流。
- Void 部署到自己的 Cloudflare 账号，提交 `void.config.ts` 与 `void.lock.json`；回滚不撤销 migration，migration 要兼容上一版代码。
- Cloudflare 上 API 要服务外部客户端或独立扩缩时，拆成用 Hono 写的单独 Worker，经 service binding 调用。

## 数据库

- Drizzle 管理全部 schema，包括 Better Auth 的表；变更只走 migration。
- D1 需要交互式事务或 PostgreSQL 能力时迁到 Supabase PG。
- 连 Supabase 时，常驻进程用 session pooler（5432）或 direct，无服务器环境用 transaction pooler（6543）并关闭预处理语句。
- 集成测试缺少连接配置就跳过，不自行启动容器。

## Graphile Worker

- 选它是因为入队能和业务写入放在同一个事务里。
- 完成的任务会被删除，需要历史时在任务内自己写表。
- worker 是常驻进程，因为依赖 `LISTEN/NOTIFY`，不能走 transaction pooler。

## Redis

默认不用。跨实例的高频缓存或限流计数、或任务吞吐超出 PostgreSQL 队列时才引入，并在 `docs/architecture.md` 写明原因。

## 环境变量

- Node 应用在 `src/env.ts` 用 Zod 校验，由入口显式传给下游；Void 项目在 `env.ts` 声明、经 `void/env` 读取，本地只认根目录 `.env`。
- 变量与 secret 由平台 CLI 管理：Cloudflare 用 `void secret put`，Vercel 用 `vercel env`（本地 `vercel env pull`）。
- 通用机器本地放 `.env.local`，生产变量列在相邻的 `.env.example`。
- 生产环境必须提供高熵的鉴权密钥。
- AI provider 的 key 未配置时，相关 endpoint 返回 `503 SERVICE_UNAVAILABLE`。
