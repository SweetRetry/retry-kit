# Edge

全栈应用部署到 Cloudflare 的形态。一个 Worker 同时服务页面、server function 与 `/api/*`。来源是 void-starter，适合不需要独立后端进程、数据量不大的应用。需要关系型数据库的长连接事务、或要跑自有 Node 服务时，改用 [backend.md](backend.md)。

## 选型

| 能力 | 选择 | 备注 |
| --- | --- | --- |
| 部署平台 | Cloudflare Workers，经 [Void](https://github.com/voidzero-dev/void) | 绑定由 import 推断并在部署时创建 |
| 框架 | TanStack Start，运行在 Void 的 framework mode | React 19、SSR、server function、文件路由 |
| 数据库 | D1，经 Drizzle | 无交互式事务，真需要时再加 Hyperdrive 与 Postgres |
| 文件 | R2，`void/storage` | |
| AI | Workers AI，经 AI Gateway，`void/ai` | 免费额度内不需要 provider key |
| 鉴权 | Better Auth | 应用要有账号时再加 |
| 其余绑定 | `void/kv`、`void/queues`、`void/email`、`void/durable`、`crons/` | 用到再 import，不预先接入 |
| 工具链 | Vite+（`vp fmt`、`vp lint`、`vp test`） | 见 [tooling.md](tooling.md) |
| 端到端 | Playwright | |

前端、校验、状态、表单等沿用 [frontend.md](frontend.md)。

## 结构

- 一个 Worker，没有独立 API server。页面、server function 与 `/api/*` 同源、同 deploy、同 session cookie，省掉 CORS、第二次部署和第二套 secret。
- `*.server.ts` 只在服务端。TanStack Start 的 import protection 会让客户端可达的文件导入它们时构建失败。
- server function（`createServerFn`）放在 `*.functions.ts`，可以导入 `*.server.ts`，组件和 `src/lib` 不可以。
- server function 服务应用自己的页面，不是公开 API。上传、下载和流式响应走 `/api/*`，错误遵循 [api.md](api.md)。

## 数据与 migration

- schema 在应用的 `db/schema.ts`，改完用 `pnpm db:generate` 生成 migration，部署时由 `void deploy` 应用，本地 `pnpm dev` 启动前自动应用。不手工改库。
- rollback 只恢复代码，不恢复数据。每个 migration 都要兼容它之前的代码。

## AI

- Workers AI 的每次调用都显式指定 AI Gateway，日志、成本与缓存集中在一处。Gateway 必须先在 Cloudflare 里创建，否则调用被拒绝。
- 需要别家模型时用 `ai.provider(name).fetch(path, init)`，走同一个 Gateway，密钥作为 secret 保存。

## Secret 与环境

- 在 `env.ts` 用 `defineEnv` 声明，本地值放 `.env`，生产值用 `void secret put <NAME>` 写入。应用没有 secret 就不声明。
- 默认不开放 `workers.dev` 路由（`workers_dev: false`）。没有账号体系时，路由一开，任何人都能消耗账号的 Workers AI 额度。

## 没有账号时

- 用 HttpOnly cookie 里的随机 visitor id 归属数据，其他访客访问时一律返回 `404`，与不存在同义。
- 代价是清 cookie 就丢数据、同一人两个浏览器是两个访客、拿到 URL 的人都能消耗额度。放入任何私有内容之前先加鉴权和按用户的限额。

## 部署与验证

- 首次部署：`pnpm connect` 登录并记录选择，再 `pnpm run deploy`。不要用 `pnpm deploy`，那是 pnpm 自己的命令。
- `void.lock.json` 记录账号与已创建的资源。模板仓库忽略它，自己的应用要提交它。
- CI 并行跑 `pnpm verify` 与端到端。端到端不发 AI 请求，也不需要 Cloudflare 账号。从 CI 部署需要 API token，按需再配。
- 可观测性见 [observability.md](observability.md)。
