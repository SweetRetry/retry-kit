# Guidelines

Retry 的技术选型与工程约定。每篇回答两件事：选什么，以及在什么边界内这样选。新项目按这里起步，偏离时在项目内记录原因。

## 先选项目形态

| 形态 | 适用 | 文档 |
| --- | --- | --- |
| Node 服务 | 需要独立后端进程、PostgreSQL、长连接事务，或要自己运维服务 | [backend.md](backend.md) |
| Edge | 数据量不大的全栈应用，要零运维部署，页面与 API 同一个 Worker | [edge.md](edge.md) |
| 桌面 | 本地文件、系统能力、离线可用的客户端 | [desktop.md](desktop.md) |

三种形态共用下面这些文档。

| 文档 | 内容 |
| --- | --- |
| [architecture.md](architecture.md) | Monorepo 切面、`apps` 与 `packages` 的归属、composition root、资料落点 |
| [frontend.md](frontend.md) | UI 基座、路由、状态、表单、请求、动效、图标 |
| [api.md](api.md) | OpenAPI 单一真源、成功响应、RFC 9457 错误、路径与方法 |
| [observability.md](observability.md) | 按形态区分的日志与 trace，脱敏 |
| [tooling.md](tooling.md) | 包管理、构建、检查门禁、Git hooks、提交约定、CI |

## 约定

- 单一方案：每个能力只选一个库，不并存替代品。要换时整体迁移并删除旧的。
- 版本基线记录选定时的主版本，不钉具体版本号。实际版本以项目的 `package.json` 与 lockfile 为准。
- 视觉取值不在这里。界面决策看 [design/DESIGN.md](../design/DESIGN.md)，界面实现约束看 `sweet-mode` skill。
- Node 服务一篇提炼自早先的 sweet-kit 全栈仓库，其代码已移除，最后一个代码版本在标签 `sweet-kit-final`。Edge 来自 void-starter，桌面来自 deja 与 ncm-lite。
