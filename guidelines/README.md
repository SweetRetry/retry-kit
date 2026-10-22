# Guidelines

Retry 的技术选型与工程约定。每篇回答两件事：选什么，以及在什么边界内这样选。新项目按这里起步，偏离时在项目内记录原因。

| 文档 | 内容 |
| --- | --- |
| [architecture.md](architecture.md) | Monorepo 切面、`apps` 与 `packages` 的归属、composition root、资料落点 |
| [frontend.md](frontend.md) | Web 框架、UI 基座、状态、表单、请求、动效 |
| [backend.md](backend.md) | HTTP 框架、鉴权、数据库、环境变量、校验、AI 接入 |
| [api.md](api.md) | OpenAPI 单一真源、成功响应、RFC 9457 错误、路径与方法 |
| [observability.md](observability.md) | OpenTelemetry、W3C Trace Context、日志关联、脱敏 |
| [tooling.md](tooling.md) | 包管理、构建、检查门禁、Git hooks、提交约定、CI |

## 约定

- 单一方案：每个能力只选一个库，不并存替代品。要换时整体迁移并删除旧的。
- 版本基线记录选定时的主版本，不钉具体版本号。实际版本以项目的 `package.json` 与 lockfile 为准。
- 视觉取值不在这里。界面决策看 [design/DESIGN.md](../design/DESIGN.md)，界面实现约束看 `sweet-mode` skill。
- 本目录提炼自早先的 sweet-kit 全栈仓库。该仓库的代码已移除，完整历史保留在 git 记录中。
