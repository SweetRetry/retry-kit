---
name: swiss-style-guide
description: 针对高密度数据 SaaS 的"新瑞士风格 (Neo-Swiss)"设计规范。强制使用 shadcn/ui, Tailwind CSS 与 Framer Motion。使用场景：(1) 用户要求创建 dashboard、数据密集型界面、SaaS 产品，(2) 审查 UI 代码是否符合设计系统规范，(3) 用户提到瑞士风格、极简主义、网格系统、国际主义设计风格时。
---

## 快速参考

| 要素 | 规范 |
|------|------|
| 网格系统 | 8-Point Grid (8px 原子单位)，Desktop 12 Cols |
| 圆角 | `rounded-none` 全局，仅交互热区 `rounded-sm` (2px) |
| 背景色 | `bg-background` (CSS Variable 层定义纯白/近黑) |
| 前景色 | `text-foreground` (CSS Variable 层定义近黑/近白) |
| 强调色 | International Blue (`--primary`) + Swiss Red (`--destructive`) |
| 动效引擎 | Framer Motion, Expo Out 曲线，<300ms |
| 视觉模式 | 侧边栏 Shell / 指标卡片网格 / 数据表格 / 图表容器 / 网格叠加 (可组合) |
| 对比度 | WCAG AA (≥4.5:1)，暗色模式光谱偏移 |
| 硬编码 Hex | **禁止** — 组件层严格使用语义 Token |

## 核心指令 (Core Mandate)

本规范旨在构建 **"新瑞士风格 (Neo-Swiss)"** 或 **"系统极简主义 (Systemic Minimalism)"** 的数字界面。核心在于利用数学秩序对抗信息熵，为 AI 时代的过度信息提供清晰的认知结构。

**强制技术栈 (Hard Constraints):**

* **UI 库:** `shadcn/ui` (必须通过 `cn()` 合并样式，严禁硬编码样式覆盖系统 Token)。
* **样式引擎:** `Tailwind CSS` (强制执行 **8-Point Grid System**，严格使用语义化 Token 类)。
* **动效库:** `Framer Motion` (仅限用于 <300ms 的功能性微交互)。

## 一、 设计哲学：系统极简主义 (Systemic Minimalism)

1. **全面秩序 (Comprehensive Order):** 利用 CSS Grid (Subgrid) 和 Container Queries 实现跨层级的绝对对齐。
2. **客观排版 (Objective Typography):** 字体是结构而非装饰。使用流体排版 (Fluid Typography) 适应多设备。
3. **形式追随内容 (Form Follows Content):** 网格适应内容，而非强迫内容适应网格。如果一个像素不承载信息，删除它。
4. **非对称动态 (Asymmetrical Dynamic):** 拒绝死板的居中，通过左对齐 (Flush-left) 和右侧留白创造视觉张力和阅读流。

## 二、 基础系统 (System Foundations)

### 1. Token 化色彩系统 (Neo-Swiss Color Tokens)

**原则：** 所有色彩在 CSS Variables 层定义，组件层严格使用 Tailwind 语义类。**禁止在组件代码中出现任何硬编码 Hex 值。**

**CSS Variables 定义（瑞士功能色调，oklch 色彩空间）：**

```css
:root {
  /* Neo-Swiss Light — 纯白底 + 近黑前景 + 功能双色 */
  --background: oklch(1 0 0);              /* 纯白画布 */
  --foreground: oklch(0.145 0 0);          /* 近黑前景 */
  --card: oklch(0.985 0 0);               /* 卡片微灰 */
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.45 0.25 260);        /* International Blue */
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --border: oklch(0.922 0 0);
  --ring: oklch(0.45 0.25 260);           /* 与 Primary 一致 */
  --destructive: oklch(0.6 0.25 25);      /* Swiss Red */
}

.dark {
  /* Neo-Swiss Dark — OLED 安全近黑 + 光谱偏移强调色 */
  --background: oklch(0.145 0 0);          /* ≈ #1A1A1A, OLED 安全 */
  --foreground: oklch(0.985 0 0);          /* 近白前景 */
  --card: oklch(0.205 0 0);               /* 卡片微提亮 */
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);            /* 光谱偏移后的 Primary */
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --border: oklch(0.269 0 0);
  --ring: oklch(0.556 0 0);
  --destructive: oklch(0.704 0.191 22.216); /* 光谱偏移 Swiss Red */
}
```

**功能性多巴胺原则：** 色彩仅用于 **关键交互** (Action) 或 **状态指示** (Status)。禁止装饰性色块。International Blue 用于 Primary Action，Swiss Red 仅用于 Error/Destructive。

**光谱偏移 (Spectral Shifting)：** 暗色模式下的强调色必须进行亮度提升以满足 WCAG AA 4.5:1 对比度。

**组件层用法示例：**

```tsx
// ✅ 正确 — 使用语义 Token
<div className="bg-background text-foreground">
<div className="bg-card border border-border">
<Button className="bg-primary text-primary-foreground">Action</Button>
<span className="text-destructive">Error</span>

// ❌ 禁止 — 硬编码 Hex
<div className="bg-[#FFFFFF] text-[#111111]">
<button style={{ background: '#0055FF' }}>Action</button>
<span style={{ color: '#FF3B30' }}>Error</span>
```

### 2. 网格与间距 (The 8-Point Grid)

* **原子单位:** **8px (0.5rem)**。所有间距 (`margin`, `padding`, `gap`, `height`) 必须是 8 的倍数。
  * *Scale:* 8, 16, 24, 32, 40, 48, 64, 80px。
  * *Implementation:* 严禁使用奇数或非 8 倍数值 (如 `p-[11px]`)。
* **网格系统:**
  * **Desktop:** 12 Cols, Gap 24px (3rem), Margin 80px (10rem).
  * **Tablet:** 8 Cols, Gap 16px.
  * **Mobile:** 4 Cols, Gap 16px, Margin 16px.
  * **Technique:** 使用 `grid-cols-12` 配合 `col-span-x` 进行剃刀式分割。

### 3. 几何与构造 (Strict Geometry)

* **圆角 (Radius):** **0px (Zero Radius)**。全系统默认强制直角，传递工业精密感。
  * *Exception:* 仅在 **高频人机交互点** (如 `Button`, `Badge`, `Input Focus Ring`) 允许微圆角 (**2px / `rounded-sm`**) 以符合人体工学，防止视觉刺痛。
  * *Prohibited:* Card, Dialog, Image, Container 必须保持直角。
* **边框 (Borders):** 极细锋利。默认 `1px`，Modal/Popover 可使用 `2px` 强调层级。
* **瑞士式深度 (Swiss Depth):** 禁用投影 (Shadow)，通过层级叠加和边框表达深度：
  * **Level 0 (Base):** Canvas (`bg-background`)。
  * **Level 1 (Group):** Bordered Area (`border border-border`)。
  * **Level 2 (Overlay):** Dialog/Popover 使用 **Thick Border** (`border-2 border-border`) 或高对比度背景色。

### 4. 排版体系 (Fluid Typography)

* **字体:**
  * **UI:** `Inter`, `Geist`, `Roboto Flex` (首选可变字体)。
  * **Data:** `JetBrains Mono`, `Geist Mono` (所有数字、ID、代码必须使用等宽字体)。
* **流体缩放 (Modular Scale):** 放弃固定像素，使用 `clamp()` 响应视口。
  * 遵循 **Major Third (1.250)** 或 **Perfect Fourth (1.333)** 数学比例。
  * *Display (H1):* `clamp(2.5rem, 5vw, 3.8rem)` (Letter-spacing: tight)。
  * *Body:* `1rem` (16px) (Line-height: 1.5)。
  * *Label:* `0.75rem` (12px) Uppercase, Tracking Widest (0.05em+)。
* **图标 (Geometric Icons):**
  * SVG 格式，纯描边 (Stroke) 或纯填充 (Fill)，无渐变，无 3D。
  * 语义化：图标旨在加速认知，而非装饰。

## 三、视觉模式菜单 (Data-Dense Visual Modes)

以下模式针对**数据密集型界面**优化，可**独立使用**或**组合叠加**。Dashboard 项目通常组合 Sidebar Shell + Metric Grid + Data Table。

### 1. 侧边栏 Shell (Sidebar Shell)

固定宽度侧边栏 + 流动主区域，经典 SaaS 布局骨架。

* 侧边栏 `w-64 border-r border-border bg-card`，主区域 `flex-1 bg-background`。
* 导航项使用 `text-muted-foreground hover:text-foreground hover:bg-accent` 状态切换。
* 活跃项使用 `bg-accent text-foreground font-medium` 标记，配合 `border-l-2 border-primary` 指示。
* Mobile 下侧边栏收起为抽屉 (`w-0` → `w-64` + `backdrop-blur-sm`)。
* **适用：** SaaS 产品主框架、管理后台、设置面板。

### 2. 指标卡片网格 (Metric Card Grid)

4 列 KPI 卡片网格，Mono 数字 + delta 着色。

* 网格 `grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6`。
* 每张卡片 `border border-border rounded-none p-6`。
* 指标数字使用 `font-mono text-3xl font-bold text-foreground`。
* Delta 正向 `text-primary`（蓝色 = 增长），负向 `text-destructive`（红色 = 下降）。
* Label 使用 `text-xs uppercase tracking-widest text-muted-foreground`。
* **适用：** Dashboard 顶部概览、财务摘要、运营指标。

### 3. 数据表格 (Data Table)

瑞士式精确排版的数据表格，高密度信息展示。

* 表头 `text-xs uppercase tracking-widest text-muted-foreground font-medium border-b-2 border-border`。
* 数据行使用 `border-b border-border/50 hover:bg-accent` 交替高亮。
* 数值列强制 `font-mono text-right`，文本列 `text-left`。
* 行内操作按钮使用 Ghost variant，仅在 hover 时显示。
* 排序指示器使用几何图标 (三角形)，当前排序列 `font-semibold`。
* **适用：** 交易记录、用户列表、日志数据。

### 4. 图表容器 (Chart Container)

边框框定 + Mono 表头 + 时间选择器的标准图表框架。

* 容器 `border border-border rounded-none p-6`。
* 标题区 `flex items-center justify-between mb-6`。
* 图表标题 `font-mono text-sm uppercase tracking-widest text-muted-foreground`。
* 时间选择器使用 `rounded-sm` 按钮组，Active 状态 `bg-primary text-primary-foreground`。
* 图表区域保持 `aspect-[16/9]` 或 `h-[300px]` 固定高度。
* **适用：** 趋势图、柱状图、面积图容器。

### 5. 网格叠加 (Grid Overlay)

开发时的 12 列对齐校验工具。

* 通过 `fixed inset-0 pointer-events-none z-[9999]` 叠加全屏。
* 12 列使用 `grid grid-cols-12 gap-6 h-full`，每列 `bg-primary/5`。
* 通过键盘快捷键 (如 `Ctrl+G`) 切换显示/隐藏。
* 仅在 `process.env.NODE_ENV === 'development'` 时渲染。
* **适用：** 开发阶段对齐校验、设计还原检查。

## 四、 组件实现 (Implementation Specs)

### shadcn/ui 瑞士化改造 (Neo-Swiss Overrides)

所有改造通过 `cn()` 合并样式，使用语义 Token，禁止硬编码颜色值。

#### Button

```tsx
// Primary — 功能性蓝色动作按钮
<Button className={cn(
  "bg-primary text-primary-foreground",
  "rounded-sm font-medium tracking-wide",
  "shadow-none transition-none" // 由 Framer Motion 接管
)}>
  <motion.span whileTap={{ scale: 0.98 }} transition={neoSwiss}>
    Action
  </motion.span>
</Button>

// Ghost — 工具栏/辅助操作
<Button variant="ghost" className={cn(
  "text-muted-foreground hover:text-foreground",
  "rounded-sm hover:bg-accent"
)}>
  Secondary
</Button>

// Destructive — Swiss Red 破坏性操作
<Button variant="destructive" className={cn(
  "bg-destructive text-primary-foreground",
  "rounded-sm font-medium"
)}>
  Delete
</Button>
```

#### Card / Container

```tsx
// 标准区域容器 — 边框分割，无阴影，直角
<div className={cn(
  "border border-border rounded-none bg-card",
  "shadow-none"
)}>
  {/* 分区头部 — Mono uppercase */}
  <div className="border-b border-border px-6 py-4">
    <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
      {sectionTitle}
    </h3>
  </div>
  {/* 内容区域 */}
  <div className="p-6">
    {children}
  </div>
</div>
```

#### Input

```tsx
// 直角输入 — Label 在上方，加粗
<div className="space-y-2">
  <Label className="text-sm font-semibold text-foreground">
    {label}
  </Label>
  <Input className={cn(
    "rounded-none border-input bg-background",
    "focus:ring-2 focus:ring-primary focus:ring-offset-0",
    "placeholder:text-muted-foreground"
  )} />
</div>
```

#### Dialog

```tsx
<Dialog>
  <DialogOverlay className={cn(
    "bg-background/80 backdrop-blur-sm"
  )} />
  <DialogContent className={cn(
    "bg-card border-2 border-border rounded-none",
    "shadow-none"
  )}>
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={neoSwiss}
      >
        {/* Mono 标题 */}
        <DialogTitle className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-4">
          {title}
        </DialogTitle>
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
  "bg-background border-b border-border"
)}>
  <div className="flex items-center justify-between px-8 h-16">
    {/* 几何标识 */}
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 bg-primary rounded-none" />
      <span className="font-mono text-sm uppercase tracking-widest text-foreground">
        {brand}
      </span>
    </div>
    {/* Mono uppercase 链接 */}
    <div className="flex gap-8">
      {links.map(link => (
        <motion.a
          key={link.href}
          className={cn(
            "font-mono text-xs uppercase tracking-widest",
            "text-muted-foreground hover:text-foreground"
          )}
          whileHover={{ x: 2 }}
          transition={neoSwiss}
        >
          {link.label}
        </motion.a>
      ))}
    </div>
  </div>
</nav>
```

### 动效参数 (Polite Motion)

**原则：** 交互必须是 **礼貌的 (Polite)**、**瞬时的 (<300ms)** 且 **无回弹 (No Bounce)**。

```ts
// 微交互 — Expo Out，默认所有交互
const neoSwiss = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1] // Expo Out
};

// 表格行入场 — 更快，数据密集场景
const tableRow = {
  duration: 0.15,
  ease: [0.16, 1, 0.3, 1]
};

// 数据加载揭示 — 骨架 → 内容过渡
const dataReveal = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1]
};

// 区块过渡 — 页面级布局切换
const sectionTransition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1]
};
```

#### 入场编排 (Stagger Orchestration)

```ts
// 表格/列表 — 快速级联入场
const tableContainer = {
  animate: { transition: { staggerChildren: 0.03 } }
};

const tableItem = {
  initial: { opacity: 0, y: 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: tableRow
  }
};

// 卡片网格 — 稍慢级联
const gridContainer = {
  animate: { transition: { staggerChildren: 0.06 } }
};

const gridItem = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: dataReveal
  }
};
```

#### 骨架脉冲动画

```ts
// 数据加载时的骨架占位
const skeletonPulse = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// 骨架 → 真实内容的切换
<AnimatePresence mode="wait">
  {isLoading ? (
    <motion.div
      key="skeleton"
      className="bg-muted rounded-none h-8"
      {...skeletonPulse}
      exit={{ opacity: 0, transition: tableRow }}
    />
  ) : (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={dataReveal}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

## 五、 代码审查清单 (The Neo-Swiss Audit)

### Token 合规

* [ ] **Token Check** — 组件代码中是否存在硬编码 Hex (如 `#0055FF`, `#FF3B30`)？所有颜色是否使用 `bg-background` / `text-foreground` / `border-border` 等语义类？
* [ ] **CSS Variable Check** — 瑞士色调是否在 `:root` / `.dark` 的 CSS Variables 中使用 oklch() 正确定义？

### 网格与几何

* [ ] **8-Point Compliance** — 所有的 margin/padding/gap 是否都是 8 的倍数？拒绝 `10px`, `15px`。
* [ ] **Zero Radius Default** — 默认是否为直角？圆角是否仅限于 Button/Input 等交互热区 (`rounded-sm`)？
* [ ] **Border Depth** — 深度是否通过边框表达 (Level 0/1/2)？是否存在不必要的 shadow？

### 排版

* [ ] **Mono Data** — 数字、ID、代码是否使用了 Mono 字体？
* [ ] **Fluid Scale** — 标题是否使用了 `clamp()` 流体缩放或正确的 Modular Scale 比例？
* [ ] **Label Convention** — Label 是否使用 `text-xs uppercase tracking-widest`？

### 色彩功能

* [ ] **Functional Only** — 彩色是否仅用于 Action (Primary) 或 Status (Destructive)？是否存在装饰性的背景色块？
* [ ] **Spectral Shifting** — Dark Mode 下的 Primary/Destructive 是否进行了光谱偏移以满足 WCAG AA？

### 动效质量

* [ ] **Duration Check** — 所有动效时长是否 <300ms？是否存在缓慢或拖拽感的动画？
* [ ] **Stagger Check** — 表格/列表是否使用 `staggerChildren` 级联入场？
* [ ] **Loading State** — 数据加载是否有骨架脉冲？骨架 → 内容过渡是否流畅？

### 可访问性

* [ ] **Contrast Safety** — 所有文本 (尤其是 `text-muted-foreground`) 对比度是否 ≥ 4.5:1？
* [ ] **Motion Safety** — 是否尊重 `prefers-reduced-motion`？开启后是否禁用 stagger 和入场动画？
* [ ] **Focus Ring** — 所有交互元素是否有高对比度 Focus Ring (`ring-2 ring-primary ring-offset-2`)？

### 响应式

* [ ] **Grid Adaptive** — 网格是否响应式退化 (12 → 8 → 4 cols)？
* [ ] **OLED Safety** — Dark Mode 背景是否使用 `oklch(0.145 0 0)` (≈#1A1A1A)，避免纯黑？
* [ ] **Touch Target** — 移动端交互热区是否 ≥44px？

## 参考资源

- **设计理论深度报告**: 如需了解新瑞士风格的历史渊源、理论框架和完整设计原则，请参阅 [reference.md](reference.md)
- **示例项目**: `example/` 目录包含一个完整的 Neo-Swiss 风格示例应用，展示了规范的实际实现，包括布局组件、页面模板和动效配置
