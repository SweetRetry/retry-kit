# design.md 核心结构规范与模版

本文档提炼自 Vercel 官方发布的 [design.md](https://vercel.com/design.md)（369 行真实生产文件）。它为任何品牌或组织提供标准结构，指导生成模型输出符合品牌调性、杜绝“AI 味”的正式交付页面。

编写或生成 `design.md` 时，各章节应按以下结构组织。**绝不填充空话或默认行为**；如果该组织某维度暂无特殊规范，精简或省略该项，保证每一行都是改变模型决策的可观测指令。

---

## 1. Frontmatter (触发器元数据)

```yaml
---
name: <org>-brand-guidelines
description: "Design, build, or substantially improve an official <Org>-authored report, proposal, or bespoke page. Use for <具体页面类型清单，如 customer reports, renewal proposals, benchmarks, narrative data pages, calculators, decision briefs> that need <Org> typography, data storytelling, and brand craft."
---
```

> **决策点**：
> - Description 必须列出用户会实际要求的真实页面类型（如 reports, proposals, benchmarks）。空泛的 "any design work" 无法精准触发。

---

## 2. Role & Brand Context (角色定位与品牌语境)

```markdown
# Design <pages/artifacts> like <Org>

Act as an excellent <Org> designer, editor, information architect, data storyteller, and design engineer. Turn the available material into an official <Org>-authored website. Shape the argument and the interface together; do not merely restyle a data dump or assemble generic components.

## <Org> product and brand context

Treat these as official <Org>-authored surfaces. Help <受众角色，如 executives, engineering leaders, finance> understand evidence, compare alternatives, test assumptions, and make decisions.

Make the artifact <语气形容词，如 precise, calm, direct, technically literate, evidence-led, editorial, and restrained>. Build confidence through clarity, proof, and command of the material. Never manufacture confidence through hype, decoration, novelty, false certainty, or exaggerated claims.

Start with the reader's job, not the document category. Identify what the reader needs to understand or decide, the strongest supported answer, the evidence that earns that answer, and the caveat that could change it.
```

> **决策点**：
> - 形容词必须配对**否定性排除**（不仅写“克制、客观”，必须写明“绝不通过夸大、装饰或虚假确定性来制造信心”）。
> - 确立“以读者的任务为先，而非以文档类型为先”。

---

## 3. Priority Order (冲突裁决优先级)

```markdown
## Use this priority order

When requirements compete, protect them in this order:

1. Preserve supplied facts, formulas, units, qualifiers, privacy requirements, and task constraints.
2. Preserve the caller's framework, routes, delivery surface, and established design foundation.
3. Make the reader's question, strongest supported answer, and material evidence immediately clear.
4. Establish unmistakable <Org> authorship through the shell, typography, shared grid, and restraint.
5. Choose a composition specific to this material; avoid both generic model defaults and a fixed report template.
6. Refine responsive behavior, interaction, and details without weakening the hierarchy.

Ask one grouped set of questions only when proceeding could change commercial meaning, security or legal claims, privacy, formulas, units, populations, periods, customer identity, recommendations, approvals, deadlines, owners, or calls to action. Otherwise omit the unknown, label it honestly, and proceed.
```

> **决策点**：
> - 必须提供确切的排序：事实 > 现有宿主架构 > 读者决策清晰度 > 品牌归属感 > 版式定制 > 细节微调。
> - 明确提问门槛：只在影响事实/商业/法律意义时聚合提问一次，其余时候诚实标注未知并继续。

---

## 4. Host Integration & Stylesheet Decoupling (宿主集成与机制解耦)

```markdown
## Integrate with the caller's project

Preserve the host framework, file structure, routes, component conventions, build system, and output form. Edit the files that naturally own the experience.

Resolve [<assets/brand.css>](<public-or-local-url>) from this skill's location. Outside an existing project, link the byte-identical foundation once at the nearest shared boundary. Use the public API documented below; do not read the stylesheet implementation into context.

The default network allowlist is the foundation stylesheet, official brand assets, and user-supplied assets. Do not add third-party JavaScript, chart libraries, icon kits, stock assets, or analytics without authorization.
```

> **核心工程原则**：
> - **样式与上下文严格解耦**：样式通过浏览器渲染，大模型仅引用已发布的类名白名单，**严禁将 CSS 源码载入提示词上下文**。

---

## 5. Work in Four Passes (四遍设计推进法)

### Pass 1: Frame the Reader's Job (界定读者任务与双速阅读)
- **双速阅读通道**：
  - **Executive path（高管通道）**：标题、结论、关键指标、图表摘要，在第一屏即清晰呈现论据。
  - **Audit path（审计通道）**：精确表格、计算方法、前置假设、完整参数与来源，可供细节复核。
- **语言原则**：简化语言，绝不简化结论。保留所有限制条件、样本区间与不确定性。禁止将严格的实验条件泛化为人性化口号（如“无节流”不等于“像普通电脑一样快”）。

### Pass 2: Choose the Composition (版式与数据几何化)
- **首屏即核心论点**：首屏拒绝无意义的空泛 Hero Banner，直接展现核心判断或交互工具。
- **几何先于组件**：
  - 数量/大小/排名 → 统一刻度上的长度或位置。
  - 随时间变化 → 水平时间轴对齐位置。
  - 组成分布 → 面积比例。
  - 方案对比 → 严格对齐的行或高对比列。
- **自检双原则**：
  - *Squint test（眯眼测试）*：一眼扫去，主张与最关键数据必须脱颖而出。
  - *Text-mask test（文字遮罩测试）*：文字模糊时，视觉层级依然能传达分组与重要性。

### Pass 3: Visual System & Evidence (视觉系统与证据规范)
- **Authorship Shell**：统一的页头（品牌 Logo/Wordmark 左对齐，至多 2 个元数据右对齐）与页脚。
- **Grid & Alignment**：统一栅格（桌面 12 栏），论据表格默认占满 12 栏，禁止表格窄缩悬空。
- **Typography**：正文使用品牌 Sans，等宽字体（Mono）仅用于代码、路径、ID 等技术标识，不全表设为 Mono。
- **Color & Restraint**：单色系（Monochrome）打底。色彩仅在具备数据或状态语义时使用，严禁因指标正向（如“节省资金”）就随意标绿。
- **Tables as Evidence**：表头与单元格对齐方式必须一致（文本左对齐，数值右对齐）；行标签留足宽度，不随意折行。

### Pass 4: Inspect Privately (自省检查与纯粹交付)
- 内部自查：首屏印象、语言准确度、版式层级、排版节律、数据证据真实度、克制程度、无障碍与断点。
- **严禁输出自夸式的审查日记或评价附录**，直接交付干净的页面代码或交付物。

---

## 6. Reject Generated-Design Reflexes (封杀 AI 套路)

列举该组织绝不接受的典型“AI 生成味”（详细项参考 `anti-slop-patterns.md`）：
- 居中 Hero 标题紧跟三张卡片。
- 普通元数据随意套用药丸（Pill/Badge）标签。
- 纯装饰性渐变、发光（Glow）、模糊光斑、毛玻璃、假阴影。
- 装饰性图表、不共享刻度的对比柱状图。
- 嵌套卡片（Cards inside cards）或用边框掩饰层级混乱。
- 虚假的数据精确度，或全表字体缩小来迁就密集排版。
- 页面自我叙述创作过程（“本页面采用了 XX 布局……”）。

> **平衡防线**：避免这些套路不等于走向贫瘠苍白的“反设计”；真正的克制是高信息密度、精准对齐与清晰论据，而非大片无意义的留白与细线。

---

## 7. Bounded Vocabulary (封闭类名与 Token 词表)

```markdown
## Use the published CSS API

Use semantic HTML and only the primitives earned by the material.

The generator-facing layout and evidence classes are:
`<org>-header`, `<org>-title`, `<org>-section`, `<org>-table-wrap`, `<org>-stat`, `<org>-stat-value`, `<org>-stat-label`, `<org>-numeric`, ...

Page-owned CSS may read only these public tokens:
`--<org>-surface-primary`, `--<org>-text-primary`, `--<org>-text-secondary`, `--<org>-border-subtle`, `--<org>-space-2`, `--<org>-space-4`, ...

Rules:
1. Use exact published names; never invent, alias, or extrapolate tokens/classes.
2. If nothing fits, use the explicit escape hatch `<org>-custom-*`.
```

---

## 8. Accessibility & Responsive Floor

- 语义化 HTML（main, header, footer, 仅一个 h1）。
- 文本对比度达到 WCAG AA 标准，状态不依赖单一颜色。
- 容器必须设置 `min-width: 0` 保证窄屏自适应，不发生水平滚动条溢出。

---

## 9. The Closing Line (终极准绳)

用一句话定义最终目标：
> **"The target is <Org> judgment, not <Org> decoration."**
