# Guidelines

Retry 的技术选型与适用边界。

| 文档 | 内容 |
| --- | --- |
| [frontend.md](frontend.md) | 框架、UI 基座、状态、表单、按场景的库 |
| [backend.md](backend.md) | API 与错误约定、按部署目标的服务端选型 |
| [structure.md](structure.md) | 目录组织、归属规则、资料落点 |
| [observability.md](observability.md) | trace、log、metric |
| [tooling.md](tooling.md) | TS 工具链、Zod、门禁、hooks、CI |

## 约定

- 选型是默认倾向，框架原生能力优先。同一项目内同一能力不并存两个库，要换时整体迁移。
- 版本只记主版本，以 `package.json` 与 lockfile 为准。
- 视觉取值看 [design/DESIGN.md](../design/DESIGN.md)，界面实现约束看 `sweet-mode` skill。
