# Conventions

Retry 的技术选型与适用边界。

| 文档 | 内容 | 强度 |
| --- | --- | --- |
| [frontend.md](frontend.md) | 框架、UI 基座、状态、表单、按场景的库 | 选型，默认可偏离 |
| [backend.md](backend.md) | API 与错误约定、按部署目标的服务端选型 | 约定必需，选型默认可偏离 |
| [structure.md](structure.md) | 目录组织、归属规则、资料落点 | 约定必需 |
| [observability.md](observability.md) | trace、log、metric | 约定必需 |
| [tooling.md](tooling.md) | TS 工具链、Zod、门禁、文件体积、hooks、CI、整站审计 | 门禁必需，选型默认可偏离 |
| [testing.md](testing.md) | 测试取舍、层级与 Mock、不应存在的测试、完成说明 | 硬性条款必需，按风险条款需判断 |
| [scripts/](scripts/) | 门禁脚本示范：Zod v4、文件体积、测试禁令 | 示例，按实际工程改写后接入 hooks 与 `pnpm verify` |

## 约定

- 选型是默认倾向，框架原生能力够用时优先原生，偏离时在 PR 里写明理由。
- 同一项目内同一能力不并存两个库，要换时整体迁移。
- 能写成脚本的约束给出 `scripts/` 示范，文档只留脚本判定不了的部分。脚本是举例，语言、文件范围、阈值与排除清单以实际工程为准；例如 Java 单文件普遍较长，体积阈值按项目实测放宽。
- 版本只记主版本，以 `package.json` 与 lockfile 为准。
- 视觉取值看 [design/DESIGN.md](../design/DESIGN.md)，界面实现约束看 `sweet-mode` skill。
