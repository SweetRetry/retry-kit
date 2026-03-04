---
name: visual-design
description: >
  Web UI 审美约束层。消除 LLM 默认视觉惯性（Inter 字体、居中 Hero、紫蓝渐变、3列卡片、纯黑色），
  用强主张规则驱动高品质 UI 输出。Claude 根据上下文自判场景，不向用户提问，直接应用对应档位的审美标准。
  触发场景：(1) 设计或实现任何 Web UI 页面/组件，(2) 审查 UI 代码视觉质量，
  (3) 用户提到 UI 风格、视觉规范、设计系统，(4) 用户提到"好看"、"有质感"、"高级感"、"设计感"。

  职责边界：本 skill 只管视觉样式约束（字体、色彩 token、圆角、动效、布局反模式）。
  landing-page-design 管落地页的页面结构与信息架构（模块组合、叙事顺序、转化策略）；
  两者独立运作，各管各的职责，不存在优先级冲突。
---

## 核心任务

**在写任何 UI 代码之前，完成以下两步：**

1. **自判档位**：根据上下文判断是 Tool 还是 Brand 场景（见下方判断规则），不向用户提问
2. **输出锁定声明**：用一行声明告诉用户你用哪个档位，让用户可以纠正

```
[visual-design] 档位：Tool / Brand | 字体：X | 圆角：X | 深度：X | 动效：X
```

若用户纠正档位，重新输出锁定声明并重新生成。若用户在纠正后再次确认，静默应用不重复声明。

**组件 scope**：若任务是单个组件（Button、Badge、Card 等，而非完整页面），跳过锁定声明，直接从上下文推断档位，仅应用 token 禁令 + 圆角 + 动效规则。

---

## shadcn/ui 色彩 Token 速查

若项目未使用 shadcn/ui，用 CSS 自定义属性（`--color-bg`、`--color-text` 等）替代 token，禁止硬编码十六进制色值。以下表格仅适用于 shadcn/ui 项目。

使用 shadcn/ui 项目时，**优先使用语义 token，不硬编码 zinc/slate 色值**。Token 通过 CSS variable 自动适配亮色/暗色模式。

| 用途 | Token（Tailwind class） | 说明 |
|------|------------------------|------|
| 页面背景 | `bg-background` | 最底层，亮色=白，暗色=近黑 |
| 卡片背景 | `bg-card` | 比 background 略有区分 |
| 悬浮层/弹出层 | `bg-popover` | Dropdown、Tooltip、Dialog |
| 次级区块/输入底 | `bg-muted` | Sidebar、代码块、禁用态 |
| 主要文字 | `text-foreground` | |
| 次要文字 | `text-muted-foreground` | 描述、标签、占位符 |
| 主色（品牌色） | `bg-primary` / `text-primary` | CTA、选中态、Link |
| 主色前景（白/黑） | `text-primary-foreground` | primary 背景上的文字 |
| 次要操作 | `bg-secondary` / `text-secondary-foreground` | Ghost 按钮底色 |
| 描边 | `border-border` | 通用描边 |
| 表单/输入描边 | `border-input` | Input、Select 边框 |
| 危险/错误 | `text-destructive` / `bg-destructive` | 删除、错误状态 |
| 强调色（可选） | `bg-accent` / `text-accent-foreground` | Hover 态背景 |
| Sidebar 背景 | `bg-sidebar` / `text-sidebar-foreground` | Dashboard Shell 侧边栏底色（shadcn/ui sidebar 组件专用） |

**Brand 场景例外**：Cinematic 深色底的叠层效果（`bg-white/5`、`border-white/10`）是透明度手法，不是硬编码色值，可以与 token 共存。

---

## 场景自判规则

| 信号 | 判定 |
|------|------|
| 用户说"仪表盘"、"后台"、"管理界面"、"SaaS"、"工具" | **Tool** |
| 用户说"落地页"、"官网"、"营销页"、"品牌页"、"发布页" | **Brand** |
| 用户提供参考产品（Linear、Notion、Raycast 类） | **Tool** |
| 用户提供参考产品（Apple、Stripe、Framer 类） | **Brand** |
| 上下文不明确 | 默认 **Tool**（更安全，不容易出错） |

若信号互相冲突（如"SaaS 落地页"），在锁定声明中标注冲突原因：`[visual-design] 档位：Brand（信号冲突：SaaS→Tool，落地页→Brand，取后者）`，让用户显式确认。

**混合场景处理**：产品内的关键体验页（onboarding、空状态、付费升级页、关键成就页）按以下规则判定：

- 该页面是否是用户**首次或低频**看到？→ 是，则用 **Brand**（允许更丰富的视觉表达）
- 该页面是否嵌套在高频工作流程中？→ 是，则用 **Tool**（不打断任务心流）
- 两者都满足（如 onboarding 第一步）→ 用 **Brand**，但动效强度降到 Tool 级别（见下方混合场景动效规则）

**混合场景动效规则**：Brand 动效降至 Tool 强度 = 入场 `y: 20px→0, opacity 0→1, 200ms ease-out`，`staggerChildren 30ms`（不用 Spring，不用鼠标跟随，不用视差）。其余 Brand 动效约束（只 animate `transform` 和 `opacity`）保持不变。

---

## TOOL 档位（工具型 UI）

> 参照：Linear、Vercel、Raycast、Notion

**核心原则**：界面退到后台，任务本身最显眼。每个视觉决策都在问："这会分散注意力吗？"

### 字体

- **Sans**：Geist Sans 或 Inter（仅 Tool 场景允许）
- **Mono**：Geist Mono（数字、ID、代码、时间戳）
- 禁用 Display 字体（Cal Sans、Instrument Serif 等）
- 禁用 extralight / thin 字重——高频界面读起来费力
- **加载方式**：Next.js 项目必须用 `next/font`（零 CLS，无 FOUT）；非 Next.js 项目用 `<link rel="preconnect">` + `font-display: swap`。禁止裸 `@import url()` 放在 CSS 顶层（阻塞渲染）

### 排版

- H1：`text-2xl font-semibold tracking-tight`，不超过 `text-3xl`
- Body：`text-sm text-muted-foreground leading-relaxed`，行宽不超过 `max-w-[65ch]`
- 标题层级不跳级（h1 → h2 → h3）
- **等宽数字**：表格、列表、指标、财务数字必须加 `tabular-nums`，防止数字变化时宽度抖动

### 色彩

- **90% 无彩色**：`bg-background`（页面底）/ `bg-muted`（次级区块）/ `text-foreground` + `text-muted-foreground`
- 品牌色只出现在主操作节点（主 CTA、选中态、Link），使用 `bg-primary` / `text-primary`
- 品牌色饱和度上限：HSL saturation ≤ 70%。禁用饱和度 > 80% 的纯蓝/纯紫（`#7c3aed`、`#2563eb` 等）作为品牌色
- 一屏内最多 1 个彩色焦点，其余全部无彩色
- 状态色用语义 Token：`text-destructive`（错误）/ 绿橙参照项目 design token，品牌色不复用为状态色
- 禁用纯黑 `#000000`，用 `bg-background`（dark 模式下自动映射深色）

### 圆角

`rounded-md`（8px）全局统一，弹出层（popover/modal/tooltip）同值。

### 深度模型（三选一，全局统一）

- `border border-border`：极淡描边分组
- `bg-muted` / `bg-card`：色差分层（`bg-card` 比 `bg-background` 略亮一级）
- 纯留白：靠间距区分，不加任何描边和背景色
- **不混用**。弹出层（popover/modal）例外，可加轻投影 `shadow-md`

### 暗色模式色阶

shadcn/ui CSS variable 已内置，直接使用语义 token，无需手写色值：

- 页面背景：`bg-background`
- 卡片：`bg-card`
- Popover / 浮层：`bg-popover`
- 描边：`border-border`（主层）/ `border-input`（表单/浮层）
- 禁止直接把亮色模式色值取反——dark 模式由 `.dark` class + CSS variable 自动处理

### 动效

- **默认不加动效**
- 仅允许三处：
  - 路由切换：`opacity 0→1, 200ms ease`
  - 主 CTA hover：`scale-[1.02], 150ms`
  - 列表项入场：`y: 4px→0, opacity 0→1, 200ms, staggerChildren 30ms`
- 禁用：bounce、spring、parallax、鼠标跟随

### 间距

- Section 间距：`py-12` 到 `py-16` 为主
- 元素间距：4/8px 网格，严格对齐
- 禁止连续 3 个以上等间距 section

---

## BRAND 档位（展示型 UI）

> 参照：Apple、Stripe、Loom、Framer

**核心原则**：界面是体验的一部分，用户第一屏就要感受到产品的气质和主张。

### 字体

- **Hero H1**：Cal Sans、Instrument Serif 或 Geist Sans extralight（三选一，全局统一）
- **Body**：Geist Sans 或 Outfit
- 禁用 Inter——太通用，无辨识度
- H1 light + subheading semibold，字重反差要强
- **加载方式**：Next.js 项目必须用 `next/font`；非 Next.js 项目用 `<link rel="preconnect">` + `font-display: swap`。禁止裸 `@import url()` 放在 CSS 顶层（阻塞渲染）

### 排版

- Hero H1：`text-6xl md:text-8xl font-extralight tracking-tighter`
- 大标题必须 `tracking-tight`，`text-7xl` 以上用 `tracking-tighter`
- Body：`text-base md:text-lg leading-relaxed max-w-[60ch]`
- **禁止居中 Hero**（除非单词数 ≤ 5）——改用左对齐或 Split 50/50

### 色彩

- 可以打破 90/10——大面积深色底、Mesh 渐变背景、光晕点缀均合法
- 渐变只用**同色相**（`hsl(var(--primary) / 0.8) → hsl(var(--primary) / 0.2)`），禁止跨色相渐变（蓝→橙）
- 视觉焦点必须有逻辑递进：Hero 区 > 功能介绍 > CTA，每一层视觉权重依次降低。同一屏内不允许出现 2 个以上等对比度的彩色块
- 禁用纯黑 `#000000`，深色底用 `bg-background`（dark 模式下自动映射）
- 禁用"AI 紫/蓝"——`#7c3aed` 系列的不饱和渐变是 AI 告示牌

### 圆角

`rounded-2xl`（16px）全局统一；若走 Neo-brutalism 风则改为 `rounded-none`（两者不可混用）。

### 暗色模式色阶（Cinematic 深度模型下）

Brand 场景常用深色底叠加透明度手法，shadcn token 之外允许使用透明度修饰符：

- 页面背景：`bg-background`（dark 模式自动深色）
- 卡片：`bg-card` 或 `bg-white/5`（深色底上的微透明叠层）
- Popover / 浮层：`bg-popover`
- 描边：`border-white/10`（主层）/ `border-white/15`（浮层）——透明叠加在深底上比 `border-border` 更有光感

### 深度模型（两选一，全局统一）

- **暗光 Cinematic**：极暗底色 + `border border-white/10` 切割卡片 + `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]` 顶部光带
- **重质感**：Neo-brutalism `border-2 border-black shadow-[4px_4px_0_#000]`，或局部浮层用 Glassmorphism `backdrop-blur-xl bg-white/10`（仅限 Dropdown、Sidebar、浮层等局部元素；全页面 glassmorphism 已过气，禁用）

### 动效

- 动效是叙事的一部分，赋予页面生命感
- 入场：`y: 40px→0, scale: 0.96→1, opacity 0→1`，`staggerChildren 60ms`
- **Spring 参数**：标准流畅感 `stiffness: 300, damping: 30`；需要更沉稳时用 `stiffness: 200, damping: 40`。damping < 20 会产生 bounce 效果，禁止使用
- 允许：Spring、鼠标跟随 Spotlight、视差滚动
- 使用 Framer Motion `useMotionValue` + `useTransform`，**禁止** useState 做动效
- 永久动效（旋转、呼吸）必须隔离在独立 Client Component
- 性能底线：只 animate `transform` 和 `opacity`，禁止 animate `width`、`height`、`top`、`left`
- 掉帧就移除。代理判断标准：使用 Framer Motion `layoutId` 的列表超过 50 项时跳过动效；Spotlight Border Card 的 `radial-gradient` 鼠标跟随在移动端无条件禁用

### 间距

- Hero 区：`py-24 md:py-32`，让内容撑住整屏
- 内容少时：放大标题 + 放大留白 = 张力感（不要堆砌元素填满）
- 相邻 section 用不同构图制造节奏变化（全宽图 → Bento → 不对称双列）

---

## Anti-Slop 全局禁令（两个档位均适用）

这些是 LLM 训练数据里出现频率最高的模式，不主动禁止就会自动出现。

以下禁令分两级：`[严重]` 影响可用性/无障碍，必须遵守；`[品味]` 影响视觉质量，强烈建议遵守。Token 压力下优先遵守 `[严重]`。

### 禁用字体

- `[品味]` ❌ Inter（Brand 场景）——改用 Geist / Outfit / Cabinet Grotesk
- `[品味]` ❌ 任何 serif 字体用于 SaaS/Dashboard——serif 只用于 editorial

### 禁用色彩

- `[严重]` ❌ 纯黑 `#000000`——改用 `bg-background`（dark 模式自动映射，不硬编码色值）
- `[严重]` ❌ 硬编码灰色系（`#f4f4f5`、`#18181b` 等）——改用 `bg-muted`、`bg-card`、`text-muted-foreground` 等 shadcn token
- `[严重]` ❌ 非 shadcn 项目直接硬编码 zinc/slate 色值——改用项目自有 CSS variable
- `[品味]` ❌ 跨色相渐变（蓝→紫→粉）用于 Brand——只用同色相渐变
- `[品味]` ❌ 过饱和 neon 发光（`shadow: 0 0 20px #7c3aed`）——改用内阴影或 tinted shadow
- `[品味]` ❌ gradient text fill 用于大标题——文字渐变在小标签可接受，大 H1 禁用

### 禁用布局

- `[品味]` ❌ 3列卡片网格——改用 2列 Zig-Zag 或 Bento 不对称网格
- `[品味]` ❌ 居中 Hero（Brand 场景，超过 5 个词的大标题）——改用左对齐或 Split
- `[品味]` ❌ 全部 section 等间距——至少有 2 种间距节奏

### 禁用内容

- `[严重]` ❌ 占位数据：John Doe、Acme Corp、<foo@example.com>
- `[品味]` ❌ 创业黑话：Seamless、Powerful、Unleash、Next-generation、Revolutionary
- `[品味]` ❌ 完美数字：99.99%、10,000+ users（除非用户提供了真实数据）

### 禁用动效

- `[品味]` ❌ CSS `transition` 做复杂动效——用 Framer Motion
- `[品味]` ❌ `useState` 控制 hover 动效——用 `useMotionValue`
- `[严重]` ❌ animate `width`、`height`、`top`、`left`——只 animate `transform` 和 `opacity`

### 禁用组件习惯

- `[严重]` ❌ emoji 替代图标——用 Lucide / Phosphor / Radix Icons（全项目统一一套）
- `[品味]` ❌ 混用圆角值——Tool 档统一 `rounded-md`，Brand 档统一 `rounded-2xl`（Neo-brutalism 用 `rounded-none`）
- `[严重]` ❌ border + shadow 同时用于同一个元素——选一种深度模型统一
- `[严重]` ❌ mutation 刷新时回到骨架屏态——已有内容操作刷新时，用 `opacity-50 pointer-events-none transition-opacity` 降权原容器 + 按钮级 Spinner，禁止大面积视觉惊跳
- `[严重]` ❌ 横向滚动容器裸露原生滚动条——必须隐藏（`scrollbar-width: none` / `::-webkit-scrollbar { display: none }`）或收细为 `scrollbar-thin`

---

## 高品质技法库

每个技法标注适用档位和触发条件，不满足条件不要主动引入。

### 布局构图

| 技法 | 适用档位 | 触发条件 | 实现要点 |
|------|---------|---------|---------|
| **Bento Grid** | Tool / Brand | 内容块 ≥ 4 且各块信息密度差异明显 | `grid-cols-[2fr_1fr]`，用 `row-span-2` 制造主次 |
| **Split Hero** | Brand 优先 | Hero 有配套产品截图或演示动效 | `grid-cols-2 gap-16`，左文右图 |
| **Sticky Scroll Stack** | Brand | 有 3+ 个需要逐步展开的功能亮点 | `sticky top-24` + `translateY` 偏移，移动端退化为普通堆叠 |
| **Dashboard Shell** | Tool | 需要固定导航的多页面应用 | 左侧 `w-[240px]` + 右侧 `flex-1`，顶部 `h-14` header |

### 卡片与组件

| 技法 | 适用档位 | 触发条件 | 实现要点 |
|------|---------|---------|---------|
| **Spotlight Border Card** | Brand | 卡片是页面主焦点，需要引导视线 | 鼠标位置驱动 `radial-gradient` 边框，移动端禁用。`@media (prefers-reduced-motion: reduce) { 禁用 radial-gradient 鼠标跟随，改为静态渐变边框 }` |
| **Parallax Tilt** | Brand 仅限 Hero 区 | Hero 有核心产品展示图，需要立体感 | `rotateX/Y`，`perspective-1000`，移动端禁用，`prefers-reduced-motion` 时回退为 static |
| **Command Input** | Tool / Brand | 产品核心交互是输入/搜索/命令 | Typewriter 循环 placeholder，带 processing 状态 |
| **Live Status** | Tool | 有实时数据需要展示（监控、指标、状态） | `animate-pulse` 呼吸圆点 + spring 数字跳动（`stiffness: 300, damping: 30`） |
| **Infinite Carousel** | Brand | 需要展示 logo 墙、客户列表或产品截图序列 | `x: ["0%", "-100%"]`，`duration: 20s, ease: linear`，`pointer-events-none` |

### 背景与氛围

| 技法 | 适用档位 | 触发条件 | 实现要点 |
|------|---------|---------|---------|
| **Mesh Gradient** | Brand | 深色底 + 需要有机感/温度感，非极简风 | `radial-gradient` 多色叠加，动画周期 ≥ 8s，颜色不超过 3 种 |
| **Grain Texture** | Brand | 任何深色底场景，增加质感层 | `::before` 伪元素叠 `url(noise.svg)`，`opacity-[0.03]`，`pointer-events-none`。若无 noise.svg，用 inline SVG filter：`filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/></filter></svg>#n")` |
| **暗光底色** | Brand | 选择了暗光 Cinematic 深度模型 | `bg-background` + `border-t border-white/5` 切割层级（dark 模式下 `--background` 自动映射深色） |

### 微交互

| 技法 | 适用档位 | 触发条件 | 实现要点 |
|------|---------|---------|---------|
| **CTA Magnetic** | Brand | 主 CTA 是页面唯一焦点，需要强吸引力 | `useSpring({ stiffness: 150, damping: 25 })` 跟随回弹，移动端禁用 |
| **Button Press** | Tool / Brand | 所有主操作按钮 | `whileTap={{ scale: 0.97 }}`，比 `active:scale-95` 更流畅 |
| **数字跳动** | Tool / Brand | 展示核心指标数字（增长、统计、计数） | `useMotionValue` + `useTransform`，不用 `useState` 轮询 |

---

## 无障碍底线（不可违反）

- 文本对比度 WCAG AA ≥ 4.5:1（正文），≥ 3:1（大文字/图标）
- 所有可交互元素有可见的 `:focus-visible` 样式，统一用 `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1` 替换原生粗糙焦圈
- 触控目标 ≥ 44×44px（移动端）
- 动效必须处理 `prefers-reduced-motion: reduce`
- 暗色模式：用背景阶梯 `background → card → popover` 逐级提亮，禁止直接反色

---

## 移动端收敛规则

断点边界：本规则在 Tailwind 默认 md（≥ 768px）以下生效。若项目自定义断点，以项目配置为准。

不对称高方差布局在 `md:` 以下必须强制收敛：

```
w-full px-4 py-8
flex-col（不用 grid）
单列，无不对称
```

禁止横向滚动出现在移动端。

---

## References 加载时机

| 文件 | 何时加载 |
|------|---------|
| `references/visual-patterns.md` | 需要决定页面或区域的构图骨架时（选 Hero 变体、Feature Section 排布、应用页面模板） |
| `references/case-studies.md` | 需要判断"这个场景该参照哪种产品风格"或需要决策依据时（案例以西方 SaaS 为主；中文产品场景参照飞书（Tool）/ 得物（Brand）的设计语言进行类比判断） |

默认不加载。按需读取，不要每次都全量载入。
