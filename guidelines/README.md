# Guidelines

Retry 的技术选型。每篇写选什么，以及这样选的边界。

先选部署目标，它决定框架和数据库，其余选型两边共用。

| 部署目标 | 前端框架 | 后端与数据 | 适用 |
| --- | --- | --- | --- |
| Cloudflare | TanStack Start（Void） | 同一个 Worker，D1 + Drizzle | 一个 Worker 跑完全栈，数据量不大，不想运维 |
| Vercel | Next.js App Router | Hono + PostgreSQL + Drizzle | 要关系型数据库、事务，或前后端分开部署 |

| 文档 | 内容 |
| --- | --- |
| [deployment.md](deployment.md) | Cloudflare 与 Vercel 怎么选，部署与回滚 |
| [frontend.md](frontend.md) | UI 基座、状态、表单、图标、动效 |
| [backend.md](backend.md) | 服务端栈、数据库、鉴权、校验、API 与错误约定 |
| [structure.md](structure.md) | 目录组织、归属规则、资料落点 |
| [observability.md](observability.md) | 日志与 trace 的实现 |
| [tooling.md](tooling.md) | 包管理、构建、检查门禁、hooks、CI |

## 约定

- 每个能力只选一个库，不并存替代品。要换时整体迁移并删除旧的。
- 版本只记主版本，实际版本以项目的 `package.json` 与 lockfile 为准。
- 视觉取值不在这里。界面决策看 [design/DESIGN.md](../design/DESIGN.md)，界面实现约束看 `sweet-mode` skill。
