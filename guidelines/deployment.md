# Deployment

## 怎么选

| 条件 | 选 |
| --- | --- |
| 数据是文档、会话、文件这类，不需要交互式事务 | Cloudflare |
| 想要一个 Worker 跑完页面、server function 与 API，零运维 | Cloudflare |
| 要用 Workers AI 的免费额度，不想管 provider key | Cloudflare |
| 要关系型数据库、事务、复杂查询 | Vercel |
| 前端与后端要分开部署、分开扩缩 | Vercel |
| 前端必须是 Next.js | Vercel |

默认不跨搭：Cloudflare 上用 TanStack Start 加 D1，Vercel 上用 Next.js 加 Postgres。要跨搭时先在 ADR 里写明理由。

两边都没有特殊要求时选 Cloudflare，栈更小。

## Cloudflare

- 经 [Void](https://github.com/voidzero-dev/void) 部署。绑定由 import 推断并在部署时创建：`void/db` 是 D1，`void/storage` 是 R2，`void/ai` 是 Workers AI。
- 首次：`pnpm connect` 登录并记录选择，再 `pnpm run deploy`。不要用 `pnpm deploy`，那是 pnpm 自己的命令。
- 部署会创建 D1 与 R2、应用 migration、发布 Worker。`void.lock.json` 记录账号与资源，应用仓库要提交它。
- 默认关闭 `workers.dev` 路由（`workers_dev: false`）。没有账号体系时，路由一开，任何人都能消耗账号的 Workers AI 额度。
- Secret 在 `env.ts` 用 `defineEnv` 声明，生产值用 `void secret put <NAME>` 写入。
- 回滚用 `void project rollback`，只恢复代码，不恢复数据。每个 migration 都要兼容它之前的代码。
- AI 调用都经 AI Gateway，Gateway 先在 Cloudflare 里创建，否则调用被拒绝。
- CI 跑 `pnpm verify` 与端到端，不需要 Cloudflare 账号。从 CI 部署需要 API token，按需再配。

## Vercel

PostgreSQL 托管在 Supabase，Redis 如需引入用 Upstash，见 [backend.md](backend.md)。其余部分待补，目前没有一个已部署的 Vercel 项目可以提炼。需要确定的事：

- Hono 服务在 Vercel 上的部署形态。
- Graphile Worker 的常驻宿主。Vercel 函数不能运行常驻进程，worker 需要另找地方运行，并用 Supabase 的 session pooler 或 direct 连接。
- 环境变量与 secret 的管理方式。
- Preview 环境与数据库 migration 的衔接。
