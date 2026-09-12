# SweetRetry Skills

面向 Agent 的可复用 skill 集合。仓库按职责领域组织 skill，并将支持 skill 设计与迭代的研究证据单独落库。

## 目录

```text
engineering/   Agent、架构、代码质量与前端框架工程
generation/    AI 图片、视频、剧本与分镜生成
product/       产品诊断与数据价值判断
web-design/    界面设计与交互任务链审查
research/      跨 skill 的研究证据，不参与 skill discovery
```

### Engineering

- `agent-engineering`：AI Agent Harness 架构工程：循环引擎、沙盒抽象、工具契约、上下文管理、死循环熔断与验证门禁。
- `find-edgecases`：审查系统执行、状态、协议、运行与恢复链路中的可达失效。
- `future-proof-design`：为已确认的问题收敛长期 strong target。
- `reactflow-practices`：React Flow v12+ 开发实践。
- `simplify-code`：识别并减少不改变行为的复杂度债务。
- `videojs-react`：Video.js v10 React 播放器开发实践。

### Generation

- `generation-director`：AIGC 叙事导演总控，涵盖世界观设定、剧本创作/诊断、资产建档与分镜装配。
- `image-prompt`：分析决定画面成败的视觉维度；缺少视觉上下文时先询问高影响方向，再生成图片 prompt。
- `video-prompt`：按目标模型与入口限制编写单次生成、编辑或延长视频的 prompt。

### Product

- `analytics-tracking`：从业务问题判断数据与埋点价值。
- `product-guide`：判断功能价值、用户成本、维护成本与 ROI。

### Web Design

- `information-clarity`：确保用户获得该知道的信息，拒绝过分极简省略与一股脑倒数据。
- `find-interaction-gap`：补全交互过程实现与用户感知，专治 Agent 只写头尾、中间黑盒的缺陷。
- `grilling-design`：通过分轮追问或用户明确委托的判断收敛界面方向，交付方向摘要；原请求包含其他产物时继续完成。
- `refactor-design`：界面重新设计与排版链路重构，消除卡片嵌套、排版层级塌陷、多余弹窗与窒息密度等设计债务。

### 外部 Skills（按需使用，不在本仓库手写维护）

以下能力的 source of truth 是各自上游；本仓库只记录其适用范围，不复制、改写或维护规则。

- [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md)：审查 UI 代码的 Web Interface Guidelines、accessibility、UX 与实现质量。
- [Emil Kowalski Skills](https://emilkowal.ski/skill)：design engineering、动画设计、动画审查与 UI library 选择。
- [Matt Pocock Skills](https://github.com/mattpocock/skills)：可组合的工程工作流，覆盖需求对齐、调试、TDD、规格与架构改进。
- [Impeccable](https://github.com/pbakaus/impeccable)：面向 AI coding agent 的设计工作流，覆盖视觉 critique、a11y / responsive audit、motion 与浏览器迭代。

### Research

`research/` 保存支持 skill 决策的一手来源研究。研究记录应区分事实、推断与建议；研究结论只有回写到对应 `SKILL.md` 后，才会改变 skill 行为。

## 维护约定

- 每个 skill 使用独立目录，目录名与 `SKILL.md` 中的 `name` 一致；`name`、`display_name` 和一级标题统一使用英文。
- skill 专属的按需资料放在该 skill 的 `references/`；跨 skill 研究放在根目录 `research/`。
- 保持 skill 职责独立，避免通过目录分层掩盖能力重叠。
- 显式调用策略按宿主配置：Claude Code 使用 `SKILL.md` 的 `disable-model-invocation: true`；Codex 使用 `agents/openai.yaml` 的 `policy.allow_implicit_invocation: false`。两者不能互相替代；修改后检查显式可调用、隐式不触发。
- 用户反馈驱动的修改遵循 [AGENTS.md](AGENTS.md) 中的反馈闭环。

## Claude Code

将 skill 目录安装到项目级 `.claude/skills/` 或用户级 `~/.claude/skills/`。带有 `disable-model-invocation: true` 的 skill 不会被 Claude 自动加载，只能由用户通过 `/skill-name` 调用。
