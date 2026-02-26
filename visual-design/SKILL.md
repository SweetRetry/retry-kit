---
name: visual-design
description: >
  Web UI 视觉品味校准层 — 纠正 agent 的平庸默认行为，给出具体的排版、间距、色彩用法、动效参数。
  触发场景：(1) 用户需要设计或实现 Web UI（页面、组件、布局），(2) 用户提到设计系统、UI 风格、视觉规范，
  (3) 审查 UI 代码的视觉质量（层级、密度、一致性），(4) 构建新组件或页面时需要确定视觉参数，
  (5) 用户要求评审或优化 UI 的视觉表现。
---

## I. 角色

你是 code agent 的视觉质量层。你的规则在 agent 写 UI 代码时生效，纠正它的平庸默认行为。

你不讲理论，不解释"为什么好看"。你直接告诉 agent：这个参数平庸，换成这个。

### 三条硬约束

| 约束 | 规则 | 例外 |
|------|------|------|
| 色彩空间 | 优先 oklch 定义 Token | 第三方组件库输出的 hsl/rgb 不改写；渐变 fallback 中可保留 rgb |
| Token 集 | 一个项目一套（`:root` + `.dark`） | 白标 / 多租户产品可按租户分 Token 集 |
| 区域 = 路由 | 视觉语言切换对齐路由/页面边界 | 营销长页面内的暗色 showcase 段落是允许的局部例外 |

---

## I-bis. 工作流

### 新项目
1. 确定页面类型（落地页 / Dashboard / 内容页）
2. 选定全局参数：圆角值、深度模型、字体族（§III, §V）
3. 确认功能分区与用户动线已在 blueprint 阶段完成（见 ui-blueprint skill）
4. 选构图模式 → 加载 [visual-patterns.md](references/visual-patterns.md)
5. 写代码，过规则总表左列（§II「平庸默认行为」）
6. 完成后，过规则总表右列（§II「自检」）+ 补充自检项

### 续写项目
1. 扫描现有代码（§VIII 扫描清单）
2. 记录现有参数，跟随现有 > 跟随本 skill
3. 仅在现有未覆盖的场景用本 skill 默认规则补位

---

## II. 规则总表

Agent 产出平庸页面的根因是一组"安全默认行为"。下表纠正它们，同时作为完成后的自检依据——**写前过左列，写后验右列**。

> **框架说明**：用 Tailwind 类名举例。非 Tailwind 项目按等价 CSS 值执行（如 `text-5xl` ≈ `font-size: 3rem`）。

| # | 平庸默认行为 | 正确做法 | 自检 |
|---|-------------|---------|------|
| 1 | 所有标题 `text-3xl` / `text-4xl` | H1 ≥ `text-5xl`（3rem）；H1 : body 字号比 ≥ 3:1；H1 : H2 ≥ 2:1 | H1 和 body 的 rem 值之比 ≥ 3? |
| 2 | 所有间距 `py-8` 或 `py-12` | section 间距交替：大(`py-20`~`py-24`) → 小(`py-10`~`py-12`) → 大。禁止 > 3 个连续等间距 section | 相邻 section 的 padding 不同? |
| 3 | 每个元素都加 `fade-in` | 只给 Hero + 关键 CTA 加动效，其余静态。如果加，用 stagger 编排。入场动效元素 ≤ 3 个 | 动效只在 Hero / CTA / 路由切换? |
| 4 | 所有卡片等大等距 | 至少一张卡片面积 ≥ 2x（Bento 不等分）；相邻 section 用不同构图 | 每屏有且仅有 1 个视觉焦点? |
| 5 | 颜色均匀分布 | 90% 无彩色底 + 只在 1–2 个焦点元素用品牌色。一屏 1 个彩色焦点 | 品牌色 ≤ 10% 可见元素? |
| 6 | 按钮全用 default variant | Primary CTA 用 `size="lg"` + 品牌色。一屏只有 1 个视觉最重的按钮 | 当前视口只有 1 个最重 CTA? |
| 7 | 圆角全用 `rounded-lg` | 选一个值全局统一（`rounded-sm` = 精确，`rounded-lg` = 柔和），不混用 | 全局 1 种圆角值（`rounded-full` 按钮除外）? |
| 8 | 容器全加 `border` + `shadow` | 优先无边框透明容器。只在需要分组时加极淡 `border` 或 `bg-muted`。深度模型全局统一 | 深度模型全局统一（弹出层例外）? |
| 9 | 深色模式直接反色 | 用背景色阶梯建立层级（`background` → `card` → `popover` 逐级提亮） | 暗色模式用阶梯而非反色? |
| 10 | 移动端只是缩小桌面版 | 移动端重新设计信息层级，不只是 responsive 缩放 | 移动端有独立层级设计? H1 ≥ text-3xl? |
| 11 | 字体混用 ≥ 3 种 | Sans + Mono 够了，Display 仅 Hero H1。≤ 2 种字体族 | 字体族 ≤ 2 种? |
| 12 | 图标来自多套库 | 一个项目一套图标库（Lucide / Phosphor / Heroicons） | 图标来自同一套库? |

**补充自检**（不对应默认行为，但必须通过）：

- [ ] 内容区有 max-width 约束?
- [ ] 所有展示图片有明确 aspect-ratio?
- [ ] `prefers-reduced-motion` 已处理?
- [ ] 文本对比度 WCAG AA ≥ 4.5:1?
- [ ] 可交互元素有可见的 `:focus-visible` 样式?
- [ ] 触控目标 ≥ 44×44px（移动端）?
- [ ] 标题语义正确（`h1` → `h2` → `h3`，不跳级）?

---

## III. 排版处方

不讲理论，直接给参数。

### 标题系统

| 级别 | 字号 | 间距 |
|------|------|------|
| H1 | `text-5xl md:text-6xl lg:text-7xl` | `tracking-tight` |
| H2 | `text-2xl md:text-3xl` | 默认 |
| H3 | `text-lg md:text-xl` | 默认 |

**H1 字重**根据页面类型选择（见下表），不是固定值。

**尺度比要求**（按 `font-size` 的 rem/px 值计算）：
- H1 : H2 字号比 ≥ 2:1
- H2 : body 字号比 ≥ 1.5:1
- 如果 H1 和 H2 差距不够大，页面层级一定是扁平的 → 拉大 H1

### 字重选择

| 页面类型 | H1 字重 | H2 字重 | 说明 |
|----------|---------|---------|------|
| 品牌 / 展示页 | `font-extralight` 或 `font-light` | `font-semibold` | 大 + 轻，与 H2 形成反差 |
| 效率 / 数据页 | `font-bold` 或 `font-extrabold` | `font-semibold` | 大 + 重，权威感 |
| 通用 / 默认 | `font-bold` | `font-semibold` | 无特殊需求时的安全选择 |

- 同一页面内字重跨度至少 3 级（如 `light` + `regular` + `bold`）

### 字体族

| 类型 | 推荐 | 说明 |
|------|------|------|
| Sans（主力） | Inter / Geist / Plus Jakarta Sans | 选一个，全项目统一 |
| Mono（数据） | JetBrains Mono / Geist Mono | 数字、ID、代码 |
| Display（仅 Hero H1） | Cal Sans / Instrument Serif | 仅品牌展示页 H1，其余场景不用 |

- 一个项目最多 2 种字体族（Sans + Mono），Display 仅限 Hero H1
- 中文 fallback：`"PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif`
- 中英混排行高：`leading-relaxed`（1.625）起步

### 字体搭配与微调

- **字重反差**：H1 与 H2 字重必须不同。品牌页用"轻重反差"（H1 light + H2 semibold），效率页用"重轻递减"（H1 extrabold + H2 semibold + body regular）
- **大标题 tracking**：≥ `text-5xl` 时必须 `tracking-tight`（-0.025em）；≥ `text-7xl` 可用 `tracking-tighter`（-0.05em）。小字号禁用负 tracking
- **中英混排基线**：中文字体视觉重心偏高，英文 Sans 搭配中文时，中文 fallback 选 PingFang SC（重心居中）优于 Noto Sans SC（重心偏低）

### 内容量与排版参数

同一页面类型，文字量不同时排版参数必须调整。不要用同一套参数套所有内容密度。

| 内容量 | 判断标准 | H1 策略 | 间距策略 | 典型场景 |
|--------|---------|---------|---------|---------|
| 极少（≤ 20 词） | Hero 只有标题 + CTA | 可放到 `text-7xl`~`text-8xl`，字重用 light/extralight | 大留白（`py-24`~`py-32`），让少量文字撑住整屏 | 品牌宣言页、发布倒计时 |
| 标准（20–80 词） | 标题 + 副标题 + CTA | 标准 `text-5xl`~`text-7xl` | 标准节奏 | 大多数 SaaS 落地页 |
| 密集（80+ 词） | 标题 + 多段描述 + 列表 | 缩至 `text-4xl`~`text-5xl`，为正文腾空间 | 紧凑（`py-12`~`py-16`），正文行间距 `leading-relaxed` | 功能详情页、文档型落地页 |

- 内容少时放大标题 + 放大留白 = 张力。内容多时缩小标题 + 收紧间距 = 可读性
- **禁止**：内容密集时仍用 `text-7xl` 标题 + `py-24` 间距 → 页面无限长，用户失去耐心

### 数据排版

| 内容类型 | 处理方式 |
|----------|---------|
| 数字 / ID / 代码 | Mono 字体（JetBrains Mono / Geist Mono） |
| 指标数字 | `text-3xl font-mono font-bold` |
| Label | `text-xs uppercase tracking-widest text-muted-foreground` |

---

## III-bis. 布局骨架

| 页面类型 | 内容区宽度 | 网格 |
|----------|-----------|------|
| 落地页 / 品牌页 | `max-w-5xl`（1024px） | 自由布局，居中为主 |
| Dashboard / 应用 | 无 max-width（flex-1 填满） | sidebar + main |
| 阅读 / 设置页 | `max-w-2xl`（672px） | 单栏 |
| 全宽展示 | `max-w-7xl`（1280px） | 12 列 grid |

- 每屏一个视觉焦点，焦点元素面积 ≥ 周围元素 2x
- 留白不是"没东西"，是层级工具 — 重要元素周围留白更大

> 具体的响应式断点（含平板中间态处理）、移动端参数、图片处理规则见 [layout-and-responsive.md](references/layout-and-responsive.md)

---

## III-ter. 页面结构与用户动线

> 页面动线、功能分区、导航选型、CTA 行动层级、状态位置等结构规则，见 ui-blueprint skill 的 [references/page-structure.md](../ui-blueprint/references/page-structure.md)。
>
> 本 skill 只管**视觉参数**（字号、间距、色彩、圆角、动效）。结构决策在 blueprint 阶段完成，视觉参数在实现阶段生效。

---

## IV. 间距与密度节奏

### 密度交替法则

- 相邻 section 的 padding **必须不同**：大 → 小 → 大 或 大 → 中 → 大
- 密集内容区（feature grid, data table）后面**必须**跟一个低密度区（大留白, 单行文案）
- 页面不允许超过 3 个连续的等间距 section

### 间距三档

| 档位 | Tailwind | CSS 等价 | 用途 |
|------|----------|---------|------|
| 紧凑 | `py-8` ~ `py-12` | 32–48px | 内容密集区内部 |
| 标准 | `py-16` ~ `py-20` | 64–80px | 大多数 section |
| 宽松 | `py-24` ~ `py-32` | 96–128px | Hero，重要断点前后，页面结尾 |

### 间距即关系

| gap 值 | 语义 |
|--------|------|
| `gap-2` ~ `gap-4` | 同一组件内的紧密元素 |
| `gap-6` ~ `gap-8` | 同一区域内的相关元素 |
| `gap-12`+ | 不同区域 / 话题之间 |

---

## V. 深度与几何

### 深度模型：选一个，全局统一

| 方案 | 做法 | 适合 |
|------|------|------|
| A 边框层级 | 无边框 → `border` → `border-2` | 效率 / 数据界面 |
| B 留白 + 透明 | 无容器 → `bg-muted` → 明确背景 | 品牌 / 内容展示 |
| C 背景色阶梯 | `bg-background` → `bg-card` → `bg-popover` 逐级提亮 | 暗色模式通用 |

**默认不混用**：边框 + 投影 = 两套深度语言，容易冲突。选了 A 就不用 `shadow`，选了 B 就不加 `border`。例外：弹出层（popover/dropdown）可加轻投影辅助脱离感，不受主深度模型约束。

### 圆角统一

- 选一个值（`rounded-sm` | `rounded-md` | `rounded-lg`），全项目统一
- 嵌套圆角：`inner = outer - padding`
- 按钮单独用 `rounded-full` 是允许的例外

---

## VI. 色彩用法

色值选择交给 color-palette skill。这里只管用法规则。

### 90/10 法则

- 按一屏内可见的 UI 元素数量计：≤ 10% 的元素使用品牌色（如一屏 20 个元素，最多 2 个带品牌色）
- 其余元素用无彩色（`bg`, `text`, `border` 的灰度系列）
- 一屏之内只有 **1 个**彩色焦点元素

### 状态色

- `success` / `warning` / `error` 用语义 Token，不另选色
- 禁止把品牌色复用为状态色

### 搭配最低规则

- 品牌色与背景色的 oklch L 值差 ≥ 0.15（确保品牌色不会"沉"在背景里）
- 渐变：≤ 2 色，方向 `to-b` 或 `to-br`，仅用于 Hero 背景或 CTA 按钮。**禁止跨色相渐变**（如蓝→橙），只允许同色相明度/色度渐变（如 `primary/80` → `primary/20`）或 无彩色渐变（如 `transparent` → `background`）。跨色相渐变是 agent 翻车率最高的视觉操作
- 装饰色只出现在 Hero / 品牌区域；功能区域只用语义色（success/warning/error）

### 暗色模式

- primary 色相、色度不变，仅提亮（oklch 的 L 值 ↑）
- 文本对比度 WCAG AA ≥ 4.5:1
- 避免纯黑 `#000` 作为背景，用 `oklch(0.15 ...)` 级别的深灰

---

## VII. 动效规则

### 默认：不加动效

只在以下场景加动效：
- Hero 区入场
- 关键 CTA 的 hover / press 反馈
- 页面路由切换过渡
- 长页面首屏以下内容的 `whileInView`（只触发一次）

### 如果加动效

| 场景 | 参数 |
|------|------|
| 入场 | `opacity: 0→1, y: 8→0`（不超过 10px），`duration: 300-400ms`，`ease: [0.16, 1, 0.3, 1]` |
| Stagger | 间隔 `0.05-0.08s`，最多 stagger 5–6 个元素 |
| Hover | `scale: 1.02`，`duration: 200ms`（不超过 `1.05`） |

### 默认不用（有例外）

| 行为 | 默认 | 允许的例外 |
|------|------|-----------|
| x 方向滑入 | 不用 | Sidebar / Drawer 展开收起 |
| `rotate` | 不用 | 加载指示器、chevron 展开/折叠 |
| > 500ms | 不用 | 页面级路由过渡（≤ 600ms） |
| `bounce` / `spring` | 禁止 | 无例外 |

### 无障碍

```tsx
// 全局一个 hook，所有动效过这个 gate
const prefersReduced = useReducedMotion()
```

> **动效之外的无障碍基线**（不因视觉策略而改变）：
> - 文本对比度 WCAG AA ≥ 4.5:1
> - 所有可交互元素必须有可见的 `:focus-visible` 样式
> - 触控目标 ≥ 44×44px（移动端）
> - 标题语义正确：`h1` → `h2` → `h3`，不跳级
> - 页面有正确的 landmark（`main`, `nav`, `footer`）

---

## VIII. 已有项目续写

进入已有项目时，一致性 > 本 skill 的规则。

### 扫描清单

在现有代码中找这些值并记录：

| 维度 | 找什么 |
|------|--------|
| 圆角 | 最常用的 `rounded-*` 值 |
| 间距 | `gap-*` / `py-*` 的常用值 |
| 深度模型 | 用边框? 投影? 背景色差? |
| 字体族 | Sans / Mono / Display 各用了什么 |
| 色彩用法 | 仅功能色? 有装饰色? |
| 动效 | 有? 什么库? 什么参数? |

### 核心规则

**跟随现有 > 跟随本 skill**。

- 现有代码用 `rounded-xl`？新组件也用 `rounded-xl`
- 现有代码用 `shadow-md`？新组件也用 `shadow-md`
- 现有代码没有动效？新组件也不加动效
- 只在**现有代码没有覆盖**的场景下，才用本 skill 的默认规则补位

---

## IX. 参考索引

| 文件 | 内容 | 何时加载 |
|------|------|----------|
| [visual-patterns.md](references/visual-patterns.md) | 具体视觉模式库（Hero 变体、Dashboard、数据展示等） | 需要选择具体构图模式时 |
| [case-studies.md](references/case-studies.md) | 真实产品的决策推理链与可迁移原则 | 需要理解"为什么选这个参数"的决策逻辑时 |
| [layout-and-responsive.md](references/layout-and-responsive.md) | 布局骨架、响应式断点、图片媒体处理 | 需要确定页面布局结构、处理响应式或图片时 |
