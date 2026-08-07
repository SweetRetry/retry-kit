# 设计文档写法调研：design plan 与 design spec

> 产出日期：2026-08-07
> 方法：WebSearch + WebFetch 交叉验证一手来源（设计系统官方文档、GitHub 设计契约项目、权威设计写作参考）。

---

## 1. design plan / design brief 写法惯例

### 1.1 定义与目的

Design brief 是项目启动前产出的管理型文档，说明项目核心细节、目标和期望，对齐设计师与决策者（客户/PM/利益相关人）。它是共享路线图，也是衡量设计是否成功的基准。
— 来源：Asana [Design Brief 指南](https://asana.com/resources/design-brief) · Canva [Design Brief 模板](https://www.canva.com/docs/design-brief/)

### 1.2 行业标准结构

跨来源收敛后的核心节（非全部必需，按项目裁剪）：

1. **项目概览与背景**：一句话说明项目是什么、为什么需要、范围边界。
2. **问题陈述**：当前产品/体验的具体问题，或要抓住的机会；没有明确问题就没有衡量标准。
3. **目标与成功标准**：SMART 目标（Specific, Measurable, Achievable, Relevant, Time-bound）。不可衡量的目标不是目标——"提升体验"没有意义，"将移动端 checkout 放弃率从 38% 降至 25% 以下"有意义。
4. **目标受众**：角色（role）、设备、环境、约束、技能水平。避免"business users"这种空泛标签——需要具体到"穿着手套在户外阳光下使用 ruggedized 平板的荷兰建筑工地经理"这种程度才能推导信息密度、语言复杂度和输入方式的约束。
5. **竞品与参考**：竞争对手分析、灵感参考、需避免的反模式。
6. **预算与时间线**：里程碑、deadline、审批节点。
7. **交付物清单**：格式、尺寸、文件类型、依赖。
8. **约束与边界**：品牌指南、技术限制、法律/合规、时间/地点限制。
9. **设计方向/感觉**：视觉方向的一句话概括，可附 aspirational 参考，但必须以可观察的机制描述，忌 mood 词。
— 来源：HBS [Design Brief for Design in Management](https://www.hbs.edu/rethinking-the-mba/docs/case-western-reserve-u-design-brief-for-design-in-management-course.pdf) · BEDA [Briefing Template](http://www.beda.org/system/files/Briefing%20template.pdf) · Page Flows [Design Brief Template](https://pageflows.com/resources/design-brief-template/#content)

### 1.3 最佳实践

- **1–3 页足矣**：短、可扫描，不用设计术语堆砌。
- **可复用模板**：团队可重复使用的结构。
- **协作撰写**：涉及所有负责方，从头脑风暴到定稿。
- **视为活文档**：meeting 中或异步协作更新。
- **每项陈述可验证**：软动词（improve / optimize / streamline）不配数字就不可验证。
— 来源：Design Shack [Design Brief 指南](https://designshack.net/articles/business-articles/what-is-a-design-brief/) · Miro [Design Brief 模板](https://miro.com/templates/design-brief-sim-bansal/)

### 1.4 推荐模板骨架（markdown，适配 ui-designer 的 design plan 阶段）

```markdown
# Design Plan: <surface 名称>

## 一句话 THESIS
<这个 surface 独有的一件事> + <拒绝的类别默认>

## 推荐方向
- 名称 + 核心构图思路
- 去掉品牌名后，仍能由产品机制、内容和受众解释

## 关键参数（仅影响方向判断的）
- Color: <角色 / fallback>
- Type: <家族 / scale>
- Layout: <grid / spacing rhythm / density>

## 真实 trade-off
<推荐方向的代价；若存在会造成显著不同身份或风险的替代方向，附简短说明>

## 待确认项
<2–3 个最高影响问题；无分歧时标注"直接锁定">

## 预计范围
<design.md 将锁定的内容边界>
```

### 1.5 design brief 质量 rubric

来自 `@hegemonart/get-design-done` 的 brief quality rubric：
- 每项软动词配有数字/百分比/阈值
- 受众命名具体到角色、设备、上下文、约束
- in-scope 与 out-of-scope 明确列出
- 成功标准可观察/可测量（非感觉词）
- 每个 constraint 有理由说明
— 来源：[@hegemonart/get-design-done brief-quality-rubric](https://cdn.jsdelivr.net/npm/@hegemonart/get-design-done@1.60.1/reference/brief-quality-rubric.md)

---

## 2. design spec / design contract 写法惯例

### 2.1 定义与定位

Design spec（又称 design contract、design handoff doc、engineering-grade UX contract）是设计输出给实现的**唯一事实来源**。任何 builder（人/AI agent）应能仅凭该文档产出 on-brand UI，无需再追问。它不是灵感参考，是 contract——实现验收标准由此派生。
— 来源：FerroxLabs [Design Contract](https://github.com/FerroxLabs/ijfw/blob/main/docs/design-contract.md) · AWS [Design Specification](https://github.com/aws-samples/sample-claude-code-agents-for-product-teams/blob/main/phases/3-design/artifacts/design-specification.md)

### 2.2 权威结构对照

#### IJFW Design Contract（9 节，最简可执行）

1. **Visual Theme** — 一句话整体方向
2. **Colors** — 调色板，具体值不含形容词
3. **Typography** — 家族、scale、weights
4. **Components** — 按钮、卡片、输入等规则
5. **Layout** — grid、spacing rhythm、density
6. **Depth** — shadow、blur、elevation 约定
7. **Do's** — 保持 on-brand 的行动范本
8. **Responsive** — 断点行为
9. **Agent Prompt Guide** — 给下游 AI 的指令，保证新 agent 不重新推导即可消费
— 来源：[IJFW Design Contract](https://github.com/FerroxLabs/ijfw/blob/main/docs/design-contract.md)

#### AWS Design Specification（工程级 UX 契约，7 段）

1. Component inventory with design-system references
2. 每个 flow 的所有 states：default / hover-focus / disabled / loading / empty / error / success
3. Validation rules + microcopy（全部字符串，零 "TBD"）
4. Responsive behavior + breakpoints
5. Motion / animation specs + 触发条件
6. Accessibility annotations per flow：roles / labels / keyboard / contrast / focus order
7. Design tokens：colors / type / spacing / radii / elevation
— 来源：[AWS Design Specification](https://github.com/aws-samples/sample-claude-code-agents-for-product-teams/blob/main/phases/3-design/artifacts/design-specification.md)

#### Design Ontology 最小可执行 spec（6 节，强调特异性）

1. **Target Audience** — role / expertise / devices / physical environment / operating constraints
2. **Core User Flows and Jobs-to-be-Done** — tasks, goals, time constraints（不是页面列表）
3. **Brand Personality and Tone** — 具体 voice + 文化风格 + 偏好
4. **Market and Cultural Context** — geography / regulations / date formats / 行业约定
5. **Accessibility Requirements** — WCAG level + 环境约束（如阳光下对比度、手套触摸）
6. **What This Product is NOT** — 显式边界 = 反模式生成的基础
— 来源：[Design Ontology Writing Specs](https://github.com/michaeldoye/design-ontology/blob/main/docs/writing-specs.md)

### 2.3 推荐模板骨架（markdown，适配 ui-designer 的 design.md 8 节）

```markdown
# <产品 · surface> — Design Contract

## §0 项目边界
性质 / 目标用户与任务 / 技术栈 / 视觉 authority / 保留项

## §1 THESIS
独有命题 + 拒绝的类别默认 + 拒绝的 AI default + 视觉世界分工

## §2 STORY / TASK
mode + 用户推进顺序（先理解 → 再浏览/操作 → 最终行动）

## §3 OWN WORLD
3.1 色彩（角色制表格：role / 值 / 语义映射 / 用量规则）
3.2 字体（角色制表格：role / family / spec）
3.3 图形语言（shape / surface / icon / imagery / motif）
3.4 Motion（唯一 authored moment + 从属 motion + reduced-motion）

## §4 FIRST VIEWPORT
第一焦点 / 主内容 / primary action / 空间关系

## §5 TOPOLOGY
区域与 navigation / progressive disclosure / 跨 viewport 重组

## §6 STATES
default / loading / empty / error / disabled / success / focus / hover / active
数据边界（动态数据 / 权限 / 离线）

## §7 SIGNATURE
唯一 signature moment + 性能与可访问性风险

## §8 实现约束与交接
终态声明 / assets 清单 / 待验证项（unverified）/ 对比度-响应式-可访问性边界 / handoff contract
```

### 2.4 设计契约的核心原则（跨来源收敛）

1. **Token-first，literal-never**：每个视觉值（color/type/spacing/radius/shadow）必须解析到命名 token；缺失 token 通过 PR 提案插入，绝不以字面量硬编码。
2. **State completeness**：每个 flow/screen 必须记录 default + hover/focus + disabled + loading + empty + error + success。Happy-path only 的 spec 是未完成的 spec。
3. **Accessibility built in**：role / label / keyboard order / focus management / contrast 注在每个 flow 旁，不在末尾单独贴一个 "WCAG 2.1 AA" 标签。
4. **Zero "TBD" microcopy**：所有 validation 消息和 microcopy 字符串完整指定。"TBD" 默认为 developer-written，出现即 defect。
5. **Agent consumability**：下游 agent 无需重新推导即可消费；核心参数可映射到 authority 或 fallback baseline。
— 来源：IJFW · AWS · Design Ontology（同上）

---

## 3. 知名设计系统规范文档中的模式

### 3.1 Material Design 3（Google）

**组织方式**：Foundations → Styles → Components 三层。

- **Foundations**：accessibility、layout、interaction states、design tokens 概念。
- **Styles**：color、type、icons、motion、shape 的系统应用。
- **Components**：每个组件有 "Tokens & specs" 页面，选 variant 查看 element、attribute、token 及值。

**Token 架构（三层）**：Reference tokens（原始值）→ System tokens（语义角色）→ Component tokens（组件级）。组件 token 默认 fallback 到 system token，未显式设置时级联解析。

**值得借鉴**：
- 组件 token 继承链——降低 spec 的重复描述量；
- "Tokens & specs" 页面将 token 表与组件同时呈现，设计师和开发者视为同一事实源；
- 语义 token 命名（`md.sys.color.primary`）同时服务 human readability 和代码生成。
— 来源：[Material Design 3](https://m3.material.io/get-started) · [Material Web Styling](https://deepwiki.com/material-components/material-web/5-styling-and-theming)

### 3.2 IBM Carbon

**组织方式**：Foundations → Components → Patterns → Data Visualization → Frameworks。

- **Foundations 包**：颜色、grid、icons、motion、pictograms、shape、spacing、themes、typography、2x grid。每个是独立 npm 包（`@carbon/colors`、`@carbon/type`、`@carbon/motion` 等），汇总为 `@carbon/elements`。
- **Components**：每个组件页面含 usage 指南 + props 表 + accessibility 笔记（keyboard interactions + ARIA patterns + WCAG 2.1 AA mapping）+ 实时代码示例。
- **Themes**：white / g10 / g90 / g100 四套主题 token 集，切换主题只需换 token set。

**值得借鉴**：
- foundations 拆分为独立可引用的包——spec 引用时天然解耦，改一处级联所有组件；
- 每个组件自带 accessibility notes（keyboard + ARIA + WCAG mapping），不是单独章节；
- llms.txt 提供机器可读索引，方便 AI agent 发现结构。
— 来源：[Carbon Design System](https://carbondesignsystem.com/) · [Carbon llms.txt](https://carbondesignsystem.com/llms.txt)

### 3.3 Shopify Polaris

**组织方式**：Primitive tokens → Semantic tokens 两层。

- **Primitive tokens**（`--p-space-100`）：与上下文无关的通用的基础值。无对应语义 token 时直接用 primitive。
- **Semantic tokens**（`--p-space-table-cell-padding`）：绑定特定上下文的引用值。只能用于声明的概念，不能借用到其他场景。

**Color roles**：default / brand / info / success / caution / warning / critical / magic（AI/自动化）/ emphasis，每种 role 内结构化 bg / bg-surface / bg-fill / text / border / icon + state suffix（hover / active / selected / disabled）。

**值得借鉴**：
- primitive/semantic 两层彻底防止 token 滥用——没有语义 token 的概念只能用 primitive，迫使设计师在"创建新语义 token"与"承认是通用值"之间做显式选择；
- 颜色 role 结构化到子属性（bg / text / border / icon），spec 写作时表达力远高于"accent color + 用量说明"。
— 来源：[Polaris v12](https://polaris-react.shopify.com/previous-releases/version-12) · [Polaris Color Palettes](https://polaris-react.shopify.com/design/colors/palettes-and-roles#color-roles)

### 3.4 Atlassian Design System

**组织方式**：Foundations → Components → Content design，统一站点服务 designer + developer。

- **统一体验**：不再分设计师站/开发者站，避免信息不一致和导航摩擦；
- **foundations 涵盖**：design tokens（`@atlaskit/tokens`）、color、spacing、typography、iconography、illustration、data visualization、animation、grid；
- **组件文档**：以 "when to use" 开头 → 互动 demo → accessibility notes → do's/don'ts 成对 → 设计文件与源码链接。

**值得借鉴**：
- "when to use" 是一等信息，不是备注——反模式是在组件概览页末尾提一句"don't use for X"；
- Do's / Don'ts 成对出现，每对聚焦单一决策，不做大列表。
— 来源：[Atlassian Design](https://atlassian.design/) · [Atlassian About ADS](https://atlassian.design/get-started/about-atlassian-design-system)

### 3.5 Apple Human Interface Guidelines

**组织方式**：Design fundamentals → Foundations → Components → Patterns → Platforms。

- **Foundations**：color / typography / materials / layout / motion / accessibility / app icons / branding / SF Symbols / dark mode / privacy / RTL / inclusion / writing style / spatial layout——覆盖面广，每个都是独立页面。
- 每个 topic 页面统一结构：best practices → 概念说明 → adaptability → platform considerations。
- 2022 年合并为跨平台统一文档，保留平台特定 guidance 在 Platforms 节。

**值得借鉴**：
- Accessibility 是 foundations 而非附录；
- 跨平台 spec 同一页呈现 shared + per-platform delta，而非为每个平台 fork 整份文档。
— 来源：[Apple HIG](https://developer.apple.com/design/human-interface-guidelines)

### 3.6 跨系统收敛的可复用模式

| 模式 | 来源 | 本项目可应用 |
|---|---|---|
| Token 继承链（reference → system → component） | M3, Polaris | §3 色彩/字体角色制表格天然对应 semantic token 层；可显式标注 fallback 链 |
| Foundations 拆包（@carbon/colors, @carbon/type…） | Carbon | `references/visual-grammar.md` 已按 color/type/spacing/shape/motion/component 拆分基线 |
| Component states 全覆盖（default/hover/disabled/loading/empty/error） | AWS, Carbon, M3 | 现有 §6 STATES 已列 9 状态；建议加"数据边界"子节 |
| Accessibility inline（per component, per flow） | AWS, Carbon, HIG | 现有模板 a11y 散落在 §7 SIGNATURE 和 §8 交接中；建议收敛到 §6 STATES 和 §3 OWN WORLD 各子节 |
| llms.txt 机器可读索引 | Carbon | design.md 的 Agent Prompt Guide（IJFW §9）等价于 LLM 可消费的 contract 元描述；可考虑在模板末尾加 `<!-- llm-hint: … -->` |

---

## 4. 设计文档常见坑清单

### 4.1 用 vague mood 词代替可观察机制

- 禁止："现代感、高级感、克制、大气、科技感、清爽"。
- 原因：mood 词不可执行，不同人理解天差地别。AI agent 用 mood 词生成 UI 时，等价于随机采样。
- 正确做法：用可观察的视觉机制描述——"高调白底 + 1px 黑线稿 + 3 色 accent 标注系统，每个 accent 绑定一个内容语义域"。
— 来源：Design Ontology [Writing Specs](https://github.com/michaeldoye/design-ontology/blob/main/docs/writing-specs.md) · [brief-quality-rubric](https://cdn.jsdelivr.net/npm/@hegemonart/get-design-done@1.60.1/reference/brief-quality-rubric.md)

### 4.2 Happy-path only——缺失状态

- 最常见的缺陷：只记录 default 态，loading / empty / error / disabled / focus 都省略。
- 缺失状态的 spec 不是 spec——实现 agent 会在这些状态下自由发挥，导致产品身份断裂。
- 特别容易漏的：long text overflow、RTL、keyboard focus order、reduced motion、offline、permission denied。
— 来源：AWS Design Specification · UXPin [Common Mistakes](https://www.uxpin.com/studio/blog/common-design-system-documentation-mistakes/)

### 4.3 Microcopy "TBD"

- "TBD" = 默认由开发者写 = 文案质量不在设计控制范围内。
- Spec 中所有 validation message、empty state 引导语、error message、CTA 文案必须完整写出。
— 来源：AWS Design Specification

### 4.4 Accessibility 是附录而非设计的一部分

- 67% 的 accessibility 问题根源在设计阶段。
- 正确做法：accessibility annotation 内联在每个 flow/component 中——contrast pair、touch target 最小值、keyboard interaction、focus behavior、screen reader announcement——而不是在末尾贴一个 "WCAG 2.1 AA" 标签。
— 来源：UXPin [Common Mistakes](https://www.uxpin.com/studio/blog/common-design-system-documentation-mistakes/) · Uxcel [Accessibility in Design Systems](https://uxcel.com/lessons/accessibility-first-884)

### 4.5 缺少显式的 out-of-scope / anti-goals

- 只说做什么、不说**不做什么**的 spec，没有任何基础来生成反模式警告。
- "What this product is NOT" 是必要节——缺了它，设计探索会不必要地扩张，捡起不想要的模式。
— 来源：Design Ontology [Writing Specs](https://github.com/michaeldoye/design-ontology/blob/main/docs/writing-specs.md)

### 4.6 Ambiguous responsive behavior

- "mobile 自适应"不是 spec。需要：哪些区域 reflow、哪些 collapse、哪些 sticky、哪些 hide（且 why）；触摸目标 ≥ 44px（或 WCAG 2.2 的 24×24px 最小）写入设计 token。
— 来源：AWS Design Specification · Carbon [Accessibility](https://carbondesignsystem.com/)

### 4.7 文档腐烂（documentation rot）

- 组件更新但 spec 不变，"文档成了小说"。
- 解决方案：spec 作为组件 contract 的一部分——spec 错 = 组件没做完，同步更新。
— 来源：UXPin [Common Mistakes](https://www.uxpin.com/studio/blog/common-design-system-documentation-mistakes/) · zeroheight [Documentation Goes Stale](https://zeroheight.com/blog/why-your-design-system-documentation-goes-stale/)

### 4.8 页面列表当用户流

- "Dashboard 页、Settings 页、Reports 页"不是 spec——它不说任何关于任务、决策、时间约束、成功状态的事。
- 正确做法：描述 jobs-to-be-done + critical path + time constraint。
— 来源：Design Ontology [Writing Specs](https://github.com/michaeldoye/design-ontology/blob/main/docs/writing-specs.md)

### 4.9 语言不一致

- 同一概念多名称（"按钮 / CTA / action element"）会造成 25% 以上的沟通误差。
- 建立术语表，spec 全文统一。
— 来源：UXPin [Common Mistakes](https://www.uxpin.com/studio/blog/common-design-system-documentation-mistakes/)

### 4.10 缺失 "agent consumability"

- 写给人看的 spec 和写给 AI agent 看的 spec 不是同一份文档。AI agent 需要更结构化的 token 映射规则、更显式的 fallback 链、更少的上下文推导假设。
- IJFW 的 "Agent Prompt Guide" 节是解决之道：一段给下游 agent 的明确指令，锁定消费顺序与验收点。
— 来源：[IJFW Design Contract](https://github.com/FerroxLabs/ijfw/blob/main/docs/design-contract.md)

---

## 5. 针对本项目 ui-designer 8 节模板的改进建议

当前模板位于 `web-design/ui-designer/references/design-contract-template.md`，配套范例 `examples/arknights-endfield-landing/design.md`。以下基于调研结论逐节分析改进点。

### 5.1 §0 项目边界：加入显式 out-of-scope

**现状**：明确了性质、目标用户、技术栈、authority、保留项，但缺少 "本节 NOT 是什么"。
**建议**：加一行 "不在范围内"——例如 "不包含用户认证 / 支付 / 后台管理 / 多语言" 或按需列出。Design Ontology 将 "What this product is NOT" 列为必需节，没有它就没有反模式生成的基础。
**参考**：Design Ontology [§6](https://github.com/michaeldoye/design-ontology/blob/main/docs/writing-specs.md)

### 5.2 §3 OWN WORLD 色彩：考虑标注 token fallback 链

**现状**：角色制表格非常出色，已涵盖 role / 值 / 语义映射 / 用量规则。对比 Polaris 和 M3 的 primitive→semantic 两级，模板没有显式区分"这个颜色是 primitive 引用还是语义新定义"。
**建议**：在表格中增加可选列 "fallback"——当某颜色没有 authority 来源而是纯推导值时，标注 `fallback: visual-grammar.md baseline` 或 `fallback: 推导自 KV 实测`。这让实现 agent 知道哪些值在 authority 更新时可以自动跟随、哪些必须保持手工指定。
**参考**：[Polaris Color Roles](https://polaris-react.shopify.com/design/colors/palettes-and-roles#color-roles) · [M3 Token Architecture](https://m3.material.io/get-started)

### 5.3 §6 STATES：拆分"关键状态"与"可访问性契约"

**现状**：STATES 节列出了 default / loading / empty / error / disabled / success / focus / hover / active 9 个状态，但 a11y 信息散落在 §7 SIGNATURE 和 §8 交接中。
**建议**：
- STATES 节明确分为两个子节：**关键状态**（状态矩阵）+ **可访问性契约**（contrast pairs、touch target 最小值、keyboard interaction、focus order、reduced-motion 路径、screen reader 策略）。
- 这样实现 agent 不需要在三个节之间跳转来拼凑一个 button 的完整 a11y 要求。AWS 和 Carbon 都采用 per-component / per-flow 的 inline a11y 模式。
**参考**：[AWS Design Specification](https://github.com/aws-samples/sample-claude-code-agents-for-product-teams/blob/main/phases/3-design/artifacts/design-specification.md) · Carbon [Accessibility](https://carbondesignsystem.com/)

### 5.4 §8 实现约束与交接：加 "Agent contract" 子节

**现状**：交接节列出了 assets / 待验证项 / 边界。IJFW 的第 9 节 "Agent Prompt Guide" 更进一步——直接写下游 agent 读取契约的顺序、验收点和不允许多次追问的事项。
**建议**：在 §8 末尾增加 "Agent contract" 子节：
```
- 消费顺序：先读 §0 边界 → §1 THESIS → §3 OWN WORLD → §4 FIRST VIEWPORT → §6 STATES，再写代码
- 验收点：所有颜色解析到 token / 所有状态已覆盖 / a11y contract 全部满足 / 无 mood 词残留
- 禁止行为：不将 accent color 借用给非语义映射的内容 / 不追加本文未声明的 gradient 或 decoration
```
这样真正实现 "另一人/agent 无需歧义即可实现"。
**参考**：[IJFW Design Contract §9](https://github.com/FerroxLabs/ijfw/blob/main/docs/design-contract.md)

### 5.5 模板整体：增加 "完成后自查" checklist

**现状**：模板末尾已有去品牌名测试检查项，但可以更结构化。
**建议**：将自查扩展为简短 checklist（3-5 项），覆盖：
1. 去品牌测试（去掉 logo/品牌名后构图仍由机制/内容/受众解释）
2. 状态完整性（所有 9 状态有规则或标注"不适用"）
3. 零 mood 词（全文无"高级/现代/克制/科技感"等不可执行形容词）
4. token 可追溯（每个颜色/字体/spacing 参数可映射到 authority 或 fallback baseline）
5. Agent consumable（不依赖本文未记录的上下文推导）

### 5.6 design plan：加 "真实 trade-off" 和 "显式 anti-goals"

**现状**：SKILL.md 的阶段 4 design plan 已包含 THESIS、推荐方向、关键参数、trade-off、待确认项、预计范围。结构已很好。
**建议**：
- Trade-off 强制写：只有推荐方向没有代价说明 = 思考不完整。每个方向都有代价，写明"选择了 X，代价是 Y"。
- 如果 greenfield 项目缺少品牌 authority，design plan 应标注 "authority gap"——告知用户哪些设计决策因为缺少品牌输入而使用了 fallback baseline，建议用户在哪些点投入决策。
**参考**：HBS Design Brief（[PDF](https://www.hbs.edu/rethinking-the-mba/docs/case-western-reserve-u-design-brief-for-design-in-management-course.pdf)）强调 constraints 必须有理由说明

### 5.7 motion 与 reduced-motion：建议独立条文

**现状**：Motion 在 §3.4，reduced-motion 作为子条。在 §6 STATES 中没有 motion-specific 的状态路径。
**建议**：在 §6 STATES 中增加 "reduced-motion" 状态条——不仅是 "动画静止"，而是"静止后的静态帧是什么样"，让 reduced-motion 下的 layout 与内容完整性是设计出来的而非妥协。
**参考**：[Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines) · WCAG 2.2 [Respects User Motion Preferences](https://www.w3.org/WAI/WCAG22/Understanding/)

### 5.8 术语统一：在模板头部声明 glossary

**现状**：模板和 SKILL.md 在多处使用 surface mode、authority、token、gate 等术语，但未在任何一处集中定义。
**建议**：在 `references/design-contract-template.md` 或独立 glossary 中集中定义核心术语，确保跨 spec 一致。UXPin 指出不一致术语造成 25% 以上的沟通误差。
**参考**：[UXPin Common Mistakes](https://www.uxpin.com/studio/blog/common-design-system-documentation-mistakes/)

---

## 6. 来源索引

| 来源 | URL | 可信度 |
|---|---|---|
| IJFW Design Contract | https://github.com/FerroxLabs/ijfw/blob/main/docs/design-contract.md | 高（开源设计契约实践） |
| AWS Design Specification | https://github.com/aws-samples/sample-claude-code-agents-for-product-teams/blob/main/phases/3-design/artifacts/design-specification.md | 高（AWS 官方 AI agent 设计流程） |
| Design Ontology Writing Specs | https://github.com/michaeldoye/design-ontology/blob/main/docs/writing-specs.md | 高（学术级设计写作方法论） |
| Material Design 3 | https://m3.material.io/get-started | 高（Google 官方设计系统） |
| IBM Carbon Design System | https://carbondesignsystem.com/ | 高（IBM 官方设计系统） |
| Carbon llms.txt | https://carbondesignsystem.com/llms.txt | 高（官方机器可读索引） |
| Shopify Polaris v12 | https://polaris-react.shopify.com/previous-releases/version-12 | 高（Shopify 官方设计系统） |
| Polaris Color Roles | https://polaris-react.shopify.com/design/colors/palettes-and-roles | 高（官方文档） |
| Atlassian Design System | https://atlassian.design/ | 高（Atlassian 官方设计系统） |
| Apple HIG | https://developer.apple.com/design/human-interface-guidelines | 高（Apple 官方设计指南） |
| Asana Design Brief | https://asana.com/resources/design-brief | 中高（项目管理工具厂商，内容质量高） |
| Canva Design Brief | https://www.canva.com/docs/design-brief/ | 中（设计工具厂商，偏入门） |
| HBS Design Brief | https://www.hbs.edu/rethinking-the-mba/docs/case-western-reserve-u-design-brief-for-design-in-management-course.pdf | 高（哈佛商学院教学材料） |
| BEDA Briefing Template | http://www.beda.org/system/files/Briefing%20template.pdf | 中高（欧洲设计协会联合会） |
| Page Flows Design Brief | https://pageflows.com/resources/design-brief-template/ | 中（UX 参考网站） |
| Design Shack Design Brief | https://designshack.net/articles/business-articles/what-is-a-design-brief/ | 中（设计博客，汇总性强） |
| Miro Design Brief Template | https://miro.com/templates/design-brief-sim-bansal/ | 中（协作工具厂商模板） |
| @hegemonart brief-quality-rubric | https://cdn.jsdelivr.net/npm/@hegemonart/get-design-done@1.60.1/reference/brief-quality-rubric.md | 中高（npm 包内置质量 rubric） |
| UXPin Common Mistakes | https://www.uxpin.com/studio/blog/common-design-system-documentation-mistakes/ | 中（设计工具厂商博客，内容引用研究数据） |
| zeroheight Documentation Stale | https://zeroheight.com/blog/why-your-design-system-documentation-goes-stale/ | 中（设计文档工具厂商博客） |
| WCAG Supplement Clear Words | https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/ | 高（W3C 官方 supplement） |
