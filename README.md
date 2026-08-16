# SweetRetry Skills

面向 Agent 的可复用 skill 集合。仓库按职责领域组织 skill，并将支持 skill 设计与迭代的研究证据单独落库。

## 目录

```text
engineering/   Agent、架构、代码质量与前端框架工程
generation/    AI 图片、视频、剧本与分镜生成
product/       产品诊断与数据价值判断
web-design/    界面设计、视觉审查与交互任务链审查
research/      跨 skill 的研究证据，不参与 skill discovery
```

### Engineering

- `agent-engineering`：设计、审查和改进 AI Agent。
- `system-edge-cases`：审查系统执行、状态、协议、运行与恢复链路中的可达失效。
- `future-proof-design`：为已确认的问题收敛长期 strong target。
- `reactflow-pratices`：React Flow v12+ 开发实践。
- `simplify-code`：识别并减少不改变行为的复杂度债务。
- `videojs-react`：Video.js v10 React 播放器开发实践。

### Generation

- `asset-director`：规划跨画面复用的参考素材与连续性控制。
- `image-prompt`：分析决定画面成败的视觉维度；缺少视觉上下文时先询问高影响方向，再生成图片 prompt。
- `script-director`：构思、诊断和改写不同媒介与篇幅的脚本。
- `storyboard-director`：把剧本拆成 scene、beat、shot 与 generation assembly，不编写最终生成 prompt。
- `video-prompt`：生成单次 4–15 秒的视频 prompt。

### Product

- `analytics-tracking`：从业务问题判断数据与埋点价值。
- `product-guide`：判断功能价值、用户成本、维护成本与 ROI。

### Web Design

- `interaction-gap-review`：发现用户任务中缺失的交互步骤、状态反馈、转场与恢复路径。
- `ui-critic`：对现有界面进行取证式视觉 critique。
- `ui-designer`：设计网页与 App UI 的方向和可交接 design.md 契约（默认不写代码）。

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
- 低频、重流程或容易与相邻能力竞争的 skill，在 `SKILL.md` 设置 `disable-model-invocation: true`，只接受 Claude Code 的 `/skill-name` 显式调用。
- 用户反馈驱动的修改遵循 [AGENTS.md](AGENTS.md) 中的反馈闭环。

## Claude Code

将 skill 目录安装到项目级 `.claude/skills/` 或用户级 `~/.claude/skills/`。带有 `disable-model-invocation: true` 的 skill 不会被 Claude 自动加载，只能由用户通过 `/skill-name` 调用。
