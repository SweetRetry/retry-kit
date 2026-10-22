# Retry Kit

Retry 的个人工具箱：面向 Agent 的可复用 skill、个人设计语言，以及技术栈选项。skill 按职责领域组织，其余内容各占一个顶层目录。

## 目录

```text
engineering/   代码质量审查与工程任务拆解
generation/    AI 图片、视频、剧本与分镜生成
product/       产品需求文档
web-design/    界面设计、文案、原型与交互审查
specific/      特定框架工程实践
design/        Retry 个人设计语言（不是 skill）
```

### Engineering

- `find-edgecases`：审查重复、中断、超时、新旧版本并存等可达条件下的系统失效。
- `raise-ambition`：动手前把任务抬高到真实结果，补齐顶尖做法、跨领域技巧、对抗视角与外部验收，改写成 prompt 后等确认。
- `simplify-code`：审查并移除不改变行为的复杂度，顺带修复预期明确的 bug。
- `task-breakdown`：基于需求或契约拆解为工程任务包（自含任务上下文、务实批判性审查、Git Worktree 隔离、变更记录 changes.md 与老代码包袱处理）。

### Generation

- `generation-director`：AIGC 叙事导演总控，涵盖世界观设定、剧本创作/诊断、资产建档与分镜装配。
- `image-prompt`：按交付物与视觉媒介选择专业语言，覆盖摄影、绘画、插画、动漫、游戏美术、像素画、3D、平面设计与材料拼贴。
- `video-prompt`：按目标模型与入口限制编写单次生成、编辑或延长视频的 prompt。
- `japanese-cinematic-ad`：日本市场全 AI 生成的情感叙事、电影感广告，覆盖洞察、概念、日文脚本、资产设定、分镜与日本法规文化审查。

### Product

- `write-prd`：编写或修订 PRD，分人看的决策部分与 Agent 看的执行契约，含冷读、流程图与需求变更记录；飞书同步为可选 reference。

### Web Design

- `sass-ux-writing`：先校准 SaaS 产品的组织模型与业务场景，以克制专业的书面产品语体改写界面文案，统一领域词表，输出对照表。
- `design-md-creator`：逐轮访谈品牌、设计规范与应用界面决策，视觉选择在可交互样张上比较，再创建或更新 `design.md`。
- `ui-prototyping`：先改需求与动线，再用临时可交互原型比较尚未定案的 UI 方案或视觉取值；模板内置 shadcn 风格组件与 Alpine，改既有界面时以现状为基线候选。
- `sweet-mode`：Tailwind + shadcn/ui 界面规范，层级、布局、表面、字体、尺寸稳定、交互反馈与动效的取值、禁令、验收与扫描脚本；面向原则，作为原型定案后实现的硬约束。

### Specific

- `reactflow-practices`：React Flow v12+ 开发实践。

### Design

`design/` 是 Retry 的个人设计语言，不是 skill：`DESIGN.md` 记录决策，`brand-kit/` 存放值与资源。`brand-kit/globals.css` 由 `tokens.json` 经 `python3 design/brand-kit/generate-globals.py` 生成，不手改。

### 相邻能力的边界

| 任务 | 入口 | 按需加载 |
| --- | --- | --- |
| 改写 SaaS 界面文案、统一领域词表 | `sass-ux-writing` | 自含语境校准与改写规则 |
| 在 Tailwind + shadcn/ui 项目中编写或修改界面，或需要界面规则与取值 | `sweet-mode` | 按改动读取层级、布局、表面、字体、稳定或交互 reference |
| 设计新功能或改进既有界面：改需求、比动线与 UI 方案 | `ui-prototyping` | HTML 模板；比视觉取值时读取值模式 reference |
| 沉淀品牌与设计规范 | `design-md-creator` | 新建／重排时读结构模板；封杀清单轮读套路候选 |
| 规划故事、资产与分镜 | `generation-director` | 当前制作阶段 reference |
| 策划日本市场 AI 生成情感叙事广告 | `japanese-cinematic-ad` | 自含流程、文化与法规审查 |
| 写单张图片／单次视频 prompt | `image-prompt`／`video-prompt` | 图片按视觉方向读取 reference；视频只读目标模型 reference |
| 编写或修订 PRD | `write-prd` | 新建／重排读章节 reference；同步飞书读 lark reference |
| 拆解工程任务 | `task-breakdown` | 任务执行契约与模板 |
| 动手前抬高任务目标、定义外部验收 | `raise-ambition` | 自含流程 |

这些入口互不引用，也不默认串联；同一任务确实包含多类问题时再组合。`find-edgecases` 检查系统在可达扰动下的失效，`simplify-code` 检查保持行为不变的复杂度，两者保留独立入口。

### 外部 Skills（按需使用，不在本仓库手写维护）

以下能力的 source of truth 是各自上游；本仓库只记录其适用范围，不复制、改写或维护规则。

- [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md)：审查 UI 代码的 Web Interface Guidelines、accessibility、UX 与实现质量。
- [Emil Kowalski Skills](https://emilkowal.ski/skill)：design engineering、动画设计、动画审查与 UI library 选择。
- [Matt Pocock Skills](https://github.com/mattpocock/skills)：可组合的工程工作流，覆盖需求对齐、调试、TDD、规格与架构改进。
- [Impeccable](https://github.com/pbakaus/impeccable)：面向 AI coding agent 的设计工作流，覆盖视觉 critique、a11y / responsive audit、motion 与浏览器迭代。

## 维护约定

- 每个 skill 使用独立目录（`design/` 不属于 skill，不受此条约束），目录名与 `SKILL.md` 中的 `name` 一致；`name`、`display_name` 和一级标题统一使用英文。
- skill 专属的按需资料放在该 skill 的 `references/`。
- 保持 skill 职责独立，避免通过目录分层掩盖能力重叠。
- 显式调用策略按宿主配置：Claude Code 使用 `SKILL.md` 的 `disable-model-invocation: true`；Codex 使用 `agents/openai.yaml` 的 `policy.allow_implicit_invocation: false`。两者不能互相替代；修改后检查显式可调用、隐式不触发。
- 用户反馈驱动的修改遵循 [AGENTS.md](AGENTS.md) 中的反馈闭环。

## Claude Code

将 skill 目录安装到项目级 `.claude/skills/` 或用户级 `~/.claude/skills/`。带有 `disable-model-invocation: true` 的 skill 不会被 Claude 自动加载，只能由用户通过 `/skill-name` 调用。
