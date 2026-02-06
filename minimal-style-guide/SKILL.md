---
name: minimal-style-guide
description: 极简主义 UI 设计规范，用于创建内容优先、高信噪比的网站/应用。触发场景：(1) 用户要求极简主义设计，(2) 审查 UI 代码是否过度设计，(3) 提到"少即是多"、Bento Grid、信噪比等关键词。强制使用 shadcn/ui + Tailwind CSS + Framer Motion。
---

## 快速参考

| 要素 | 规范 |
|------|------|
| 留白率 | 桌面 40%+, 移动端 15-20% |
| 圆角 | `rounded-md` (6px) 或 `rounded-lg` (8px) |
| 背景色 | `bg-background` (CSS Variable 层定义纯白/近黑) |
| 前景色 | `text-foreground` (CSS Variable 层定义近黑/近白) |
| 强调色 | `text-primary` / `bg-primary` (全局仅 1 种) |
| Touch Target | ≥44px |
| 动效引擎 | Framer Motion, Spring Physics 优先 |
| 视觉模式 | 减法表面 / 排版比例 / Bento 网格 / 分割线节奏 / 渐隐揭示 (可组合) |
| 对比度 | WCAG AA (≥4.5:1)，OLED 安全暗色 |
| 硬编码 Hex | **禁止** — 组件层严格使用语义 Token |

## 核心指令 (Core Mandate)

构建 **2026 范式的 "智能极简 (Smart Simplicity)"** —— 利用数学秩序和 AI 适应性管理认知负荷。

**强制技术栈:**

- **UI 库:** `shadcn/ui` (移除所有默认装饰性效果)
- **样式引擎:** `Tailwind CSS` (严格使用语义化 Token 类，在 CSS Variables 层定义极简色彩)
- **动效库:** `Framer Motion` (仅用于模拟物理世界的必然性)

## 一、设计哲学

1. **信噪比最大化:** 每个元素必须有且仅有一个明确功能。删除后不影响功能的元素必须删除。
2. **留白即内容:** 留白是主动的设计元素，用于构建视线流和层级。
3. **排版即界面:** 字体的字重、字号和行高承担 90% 的结构划分任务。
4. **诚实的设计:** 拒绝拟物、拒绝装饰性材质，材质必须服务于层级。

## 二、基础系统

### 1. Token 化色彩系统 (Minimal Color Tokens)

**原则：** 所有色彩在 CSS Variables 层定义，组件层严格使用 Tailwind 语义类。**禁止在组件代码中出现任何硬编码 Hex 值。**

**CSS Variables 定义（极简无彩色调，oklch 色彩空间）：**

```css
:root {
  /* 极简 Light — 纯白底 + 近黑前景 + 无彩 Primary */
  --background: oklch(1 0 0);              /* 纯白 */
  --foreground: oklch(0.145 0 0);          /* 近黑 */
  --card: oklch(0.985 0 0);               /* 极微灰白 */
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);            /* 无彩主色 — 单色主导 */
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --border: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --destructive: oklch(0.577 0.245 27.325);
}

.dark {
  /* 极简 Dark — OLED 安全近黑 (非纯黑) + 高亮前景 */
  --background: oklch(0.145 0 0);          /* ≈ #1A1A1A, OLED 安全 */
  --foreground: oklch(0.985 0 0);          /* 近白前景 */
  --card: oklch(0.205 0 0);               /* 卡片微提亮 */
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);            /* 反转无彩主色 */
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --border: oklch(0.269 0 0);
  --ring: oklch(0.556 0 0);
  --destructive: oklch(0.704 0.191 22.216);
}
```

**组件层用法示例：**

```tsx
// ✅ 正确 — 使用语义 Token
<div className="bg-background text-foreground">
<div className="bg-card border-border">
<span className="text-muted-foreground">

// ❌ 禁止 — 硬编码 Hex
<div className="bg-[#121212] text-[#F9FAFB]">
<div style={{ background: '#1A1A1A' }}>
```

### 2. 空间与呼吸

- **留白率:** 桌面端 **40%+**，移动端 Compact Mode **15-20%**
- **间距系统:** 4px 基准
  - Tight: `4px`, `8px` (组件内部)
  - Loose: `32px`, `64px`, `128px` (区块分割)
- **移动端适配:** `<768px` 时所有 Loose 间距折半 (`my-32` → `my-16`)，Touch Target **≥44px**
- **Bento Grid:** 4列/6列，Gap `16-24px`，Radius `12-24px`

### 3. 几何与形态

- **有形边界:** 内容不能在真空中漂浮
  - 留白 >128px 时引入 **Surface Tones** (`bg-secondary/30`) 或 **Micro-Borders** (`border-border/40`)
  - Section 之间使用极细分割线 (`h-px bg-border/20`)
- **圆角:** 统一使用 `rounded-md` (6px) 或 `rounded-lg` (8px)，仅 Primary Button/Tag 可用全圆角

### 4. 色彩原则

- **单色主导:** 界面 90% 为无彩色，通过 `bg-background`、`bg-card`、`bg-muted` 等 Token 表达灰阶层级
- **单一强调色:** 全局仅一种品牌色（通过 `--primary` 定义），仅用于 Primary Action 或 Active State
- **极简反馈:** 拒绝高饱和度背景色块，仅使用 **文字变色** (`text-primary`) 或 **1px 侧边指示条** (`border-l-2 border-primary`)
- **Dark Mode:** 背景使用 OLED 安全的近黑色 (`--background: oklch(0.145 0 0)`)，**禁止纯黑**

### 5. 排版体系

- **字体:** `Inter`, `San Francisco`, `Helvetica Now`
- **层级:**
  - H1/Display: 极大字号 + 极细/极粗字重形成强对比
  - Body: 行高 `1.6-1.8`
  - Micro: `text-muted-foreground`
- **无障碍:** 所有文本对比度必须符合 **WCAG AA (>4.5:1)**

## 三、视觉模式菜单 (Visual Mode Palette)

以下模式可**独立使用**或**组合叠加**，根据内容类型选择最佳搭配。避免在单一项目中滥用所有模式 — 选择 2-3 种建立统一的视觉语言。

### 1. 减法表面 (Subtractive Surface)

容器默认透明，仅在留白过大时最小化引入背景。

* 卡片首选 `bg-transparent border-none shadow-none`，让内容自然呼吸。
* 仅当区域间距 >128px 时引入 `bg-secondary/30` 作为微弱表面标记。
* 通过排版和间距建立层级，而非背景色分区。
* **适用：** 博客文章、关于页、内容为主的落地页。

### 2. 排版比例 (Typographic Scale)

超大标题 + 极端字重对比作为主视觉元素，替代图形装饰。

* Display 标题使用 `text-6xl md:text-8xl font-extralight tracking-tight` 创造戏剧性。
* 副标题使用 `font-bold` 形成字重两极对比。
* 标题本身即是设计元素，无需额外图形或色彩修饰。
* **适用：** 个人网站 Hero、时尚品牌、出版物封面。

### 3. Bento 网格 (Bento Grid)

非对称网格布局，通过不等分区块创造视觉节奏。

* Hero 块 `col-span-2 row-span-2`，搭配正方和竖直块交替。
* Gap 使用 `gap-4 md:gap-6`，保持呼吸感。
* 每个卡片内部留白充足 (`p-6 md:p-8`)，内容不贴边。
* Mobile 退化为单列 (`grid-cols-1`)，间距折半。
* **适用：** 作品集、功能展示、产品矩阵。

### 4. 分割线节奏 (Divider Rhythm)

发丝级分割线创造垂直方向的视觉韵律。

* 使用 `h-px bg-border/20` 在 Section 间创造极细分割。
* 分割线间距不均等 — 重要内容前留白更大，建立层级。
* 分割线可搭配 `max-w-[120px]` 短线条作为装饰性断点。
* **适用：** 长页面、多段落文章、条目列表。

### 5. 渐隐揭示 (Fade Reveal)

滚动触发的纯透明度过渡，位移克制在 ≤10px。

* 通过 `useScroll` + `useTransform` 驱动 `opacity` 从 0 → 1。
* 垂直位移严格控制在 `y: 10` 以内，拒绝夸张的滑入效果。
* 每个 Section 独立触发，使用 `whileInView` + `viewport={{ once: true }}`。
* **适用：** 内容页渐进揭示、FAQ 展开、时间线。

## 四、组件实现

### shadcn/ui 极简改造 (Minimal Overrides)

所有改造通过 `cn()` 合并样式，使用语义 Token，禁止硬编码颜色值。

#### Button

```tsx
// Primary — 克制的实心按钮
<Button className={cn(
  "bg-primary text-primary-foreground",
  "rounded-md font-medium",
  "shadow-none transition-none" // 由 Framer Motion 接管
)}>
  <motion.span whileTap={{ scale: 0.97 }} transition={microMotion}>
    Action
  </motion.span>
</Button>

// Ghost — 极简首选，大多数场景使用 Ghost
<Button variant="ghost" className={cn(
  "text-muted-foreground hover:text-foreground",
  "hover:bg-transparent hover:opacity-80"
)}>
  Secondary
</Button>
```

#### Card

```tsx
// 默认透明 — 减法表面原则
<motion.div
  className={cn(
    "border-none shadow-none bg-transparent",
    "rounded-lg"
  )}
  initial={{ opacity: 0, y: 8 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={layoutMotion}
>
  <div className="p-6">
    <h3 className="text-foreground text-lg font-semibold tracking-tight">
      {title}
    </h3>
    <p className="text-muted-foreground text-sm mt-1">
      {description}
    </p>
  </div>
</motion.div>

// 有背景变体 — 仅在留白过大时使用
<Card className={cn("bg-muted/30 border-none shadow-none rounded-lg")} />
```

#### Input

```tsx
// 底线样式 — 极简首选
<div className="space-y-2">
  <Label className="text-sm font-medium text-foreground">
    {label}
  </Label>
  <Input className={cn(
    "border-b border-border rounded-none bg-transparent",
    "focus-visible:ring-0 focus-visible:border-foreground",
    "placeholder:text-muted-foreground"
  )} />
</div>

// 填充样式 — 备选
<Input className={cn(
  "bg-muted/20 border-none rounded-md",
  "focus-visible:ring-1 focus-visible:ring-ring"
)} />
```

#### Dialog

```tsx
<Dialog>
  <DialogOverlay className={cn(
    "bg-background/80 backdrop-blur-sm"
  )} />
  <DialogContent className={cn(
    "bg-card border border-border rounded-lg",
    "shadow-none"
  )}>
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={microMotion}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  </DialogContent>
</Dialog>
```

#### Navigation

```tsx
<nav className={cn(
  "fixed top-0 w-full z-50",
  "bg-background/80 backdrop-blur-sm border-b border-border/40"
)}>
  <div className="flex items-center justify-between px-6 md:px-8 h-14">
    <span className="text-foreground font-medium tracking-tight">
      {brand}
    </span>
    <div className="flex gap-6 text-muted-foreground text-sm">
      {links.map(link => (
        <motion.a
          key={link.href}
          className="hover:text-foreground transition-colors"
          whileHover={{ opacity: 0.7 }}
          transition={microMotion}
        >
          {link.label}
        </motion.a>
      ))}
    </div>
  </div>
</nav>
```

#### Bento Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
  {/* Hero — 主视觉焦点 */}
  <motion.div
    className="col-span-1 md:col-span-2 md:row-span-2 bg-muted/30 rounded-lg p-6 md:p-8"
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={layoutMotion}
  >
    {heroContent}
  </motion.div>

  {/* 正方块 */}
  <motion.div
    className="col-span-1 bg-muted/20 rounded-lg p-6 aspect-square"
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ ...layoutMotion, delay: 0.05 }}
  >
    {squareContent}
  </motion.div>

  {/* 竖直块 */}
  <motion.div
    className="col-span-1 bg-muted/20 rounded-lg p-6"
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ ...layoutMotion, delay: 0.1 }}
  >
    {verticalContent}
  </motion.div>
</div>
```

### 动效参数

```ts
// 微交互 Spring — 按钮、悬停、小元素
const microMotion = {
  type: "spring",
  stiffness: 260,
  damping: 20,
  mass: 1
};

// 布局过渡 — Section 入场、卡片展开
const layoutMotion = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1] // Expo Out
};

// 滚动揭示 — 渐隐入场，极克制
const revealMotion = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1]
};
```

#### 滚动驱动动效

```ts
const ref = useRef(null);
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
});
const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
const y = useTransform(scrollYProgress, [0, 0.3], [10, 0]);
```

#### 入场编排 (Stagger Orchestration)

```ts
const container = {
  animate: { transition: { staggerChildren: 0.06 } }
};

const item = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: revealMotion
  }
};
```

## 五、代码审查清单 (The Minimal Audit)

### Token 合规

- [ ] **Token Check** — 组件代码中是否存在硬编码 Hex (如 `#121212`, `#F9FAFB`)？所有颜色是否使用 `bg-background` / `text-foreground` / `border-border` 等语义类？
- [ ] **CSS Variable Check** — 极简色调是否在 `:root` / `.dark` 的 CSS Variables 中使用 oklch() 正确定义？

### 视觉质量 (减法检验)

- [ ] **Structure Check** — 内容是否"漂浮"？留白 >128px 时是否增加了 Surface Tone 或 Divider？
- [ ] **Subtractive Check** — 还能删除什么而不影响功能？每个元素是否有且仅有一个功能？
- [ ] **Whitespace Check** — 尝试将 Margin 翻倍，效果是否更好？
- [ ] **Color Constraint** — 屏幕上的颜色种类（不含灰阶）是否超过 1 种？
- [ ] **Depth Check** — 是否去除所有不必要的 shadow？容器是否默认透明？

### 动效质量

- [ ] **Spring Check** — 交互动效是否使用 Spring Physics？是否存在线性或 ease-in-out 动画？
- [ ] **Displacement Check** — 位移是否克制在 ≤10px？是否存在夸张的滑入/弹跳效果？
- [ ] **Duration Check** — 所有动效时长是否 <400ms？

### 可访问性

- [ ] **Contrast Safety** — 所有文本 (尤其是 `text-muted-foreground`) 对比度是否 ≥ 4.5:1？
- [ ] **Motion Safety** — 是否尊重 `prefers-reduced-motion`？开启后是否禁用渐隐揭示和 stagger 动画？
- [ ] **OLED Safety** — Dark Mode 背景是否使用 `oklch(0.145 0 0)` (≈#1A1A1A)，避免纯黑？
- [ ] **Responsive Check** — 移动端是否开启 Compact Mode？Touch Target ≥44px？间距是否折半？

## 六、不适用场景

- 数据密集型 Dashboard（使用 swiss-style-guide）
- 需要丰富视觉层次的品牌营销页
- 游戏或娱乐类应用
