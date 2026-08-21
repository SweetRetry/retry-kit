---
name: ui-designer
description: >-
  人机协作确定界面设计方向：确认 surface、visual authority 与用户旅程，在对话中提出固定 3 个真正不同的候选，由用户选择后交付方向摘要。Use when 用户要求页面或组件的设计方向、配色、排版、视觉语言或构图；不用于直接实现 UI、只读视觉审查、功能价值诊断或单独生成 website background 素材。默认不读技术栈，不生成 design plan / design.md 文件，不写代码。
---

# UI Designer

**判断给人，发散给 AI。** 人提供约束并选择方向；AI 理解 surface、提出候选并收敛用户选中的方向。

## 交付边界

`design plan` 是对话中的工作状态，不是落盘文档。它依次包含：surface 上下文、设计目的、用户旅程、3 个候选方向和用户选中的方向。

本 skill 默认只在对话中交付方向摘要、未决项与边界。它不读取依赖、framework 或构建方式，不输出具体 color、字号或 spacing 数值，不做组件实现、技术栈映射或代码生成，也不创建 `design plan`、`design.md` 等文件。用户明确要求文档、实现契约或代码时，作为独立任务处理。

## Pipeline

`理解 surface` → `T1 约束注入` → `设计目的与用户旅程` → `固定 3 个候选方向` → `T2 用户选择` → `交付选定方向`

### 1. 理解 surface

读取用户要求、surface 职责、真实内容与现有 visual authority，例如 design token、theme、共享组件、相邻页面、品牌资产或 live render。只回答“是什么、为谁、什么不能动”，不因缺少设计文档就把项目视为 greenfield。

按现状判断 authority：

- **局部扩展**：继承当前 composition 与视觉语言，只设计新增内容、状态和连接关系。
- **既有世界的新 surface**：沿用 visual grammar，为新任务重组 hierarchy、topology 和 interaction。
- **不完整品牌**：保留已确认资产与识别特征，只补当前任务缺失的规则。
- **重设计**：保留产品事实、真实内容、品牌承诺和明确不变项；旧外观不约束新方向。
- **Greenfield**：从受众、任务、产品机制和使用环境建立视觉世界。

**T1 约束注入：**非平凡任务先问一轮 2–3 个最高影响问题，覆盖受众现实、anti-goals、visual authority 与非协商项。目标和边界已经精确时直接继续。

**完成标准：**surface、受众、authority、真实内容、保留项、可修改边界与 anti-goals 均已明确。

### 2. 确定设计目的与用户旅程

选择一个主 mode，按用户如何成功而不是产品类别判断：

- **Persuade**：理解 offer、相信 proof、采取行动。
- **Operate**：高效完成任务，优先 scanability、状态清晰、熟悉 affordance 与低操作成本。
- **Read**：理解内容，优先结构、measure、节奏和 wayfinding。
- **Experience**：进入作品、媒介或空间，让内容主导 first viewport，弱化 navigation 与 chrome。

复杂 surface 可以分区采用不同策略，但必须有一个主 mode。写清用户从进入到完成主任务的路径：先理解什么 → 再做什么 → 到达什么状态，并覆盖相关的 default、loading、empty 与 error 状态。

**完成标准：**mode 能解释 primary task、第一焦点、信息密度和表达自由度；用户旅程覆盖主路径与相关关键状态。

### 3. 生成固定 3 个候选方向

先归纳产品独有机制、受众真实场景、文化归属、surface 必须证明什么，以及该类别最常见的模板套路。读取 [visual-grammar.md](references/visual-grammar.md)，用其基线与反默认测试约束方向，不把参考中的具体参数写进 design plan。

生成**恰好 3 个**真正不同的候选，不能用近亲变体凑数，也不能只替换 palette、字体或装饰。每个候选只写：

- **THESIS**：一句话说明该方向独有的主张，以及拒绝的类别默认。
- **核心构图**：一句话说明去掉 logo 与品牌名后，仍能由产品机制、内容和受众解释的 composition。
- **代价**：一句话说明选择该方向的真实 trade-off。

AI 不替用户选择。visual authority 不足时标注 `authority gap`：哪些判断使用了 fallback baseline，以及用户最值得补充判断的位置。

**完成标准：**候选恰好 3 个，彼此真正不同；每个候选均可解释且有真实代价；所有候选通过 visual grammar 的反默认测试；需要时已标注 `authority gap`。

### 4. T2 用户选择

请用户选择一个方向、组合不同方向，或全部否决并说明原因。全部否决时回到阶段 3，重新生成 3 个候选。

**Gate：**只有用户明确选择或给出组合指令后，才进入交付；方向未选定时停在本阶段。

### 5. 交付选定方向

在对话中只交付：

- 选定方向的 THESIS 与核心构图；
- 与该方向相关的 surface 上下文、mode 和用户旅程要点；
- 未决项、资产缺口与已知边界。

**完成标准：**选定方向及其依据已清楚说明；未决项与边界可判断；没有创建文件或代码。
