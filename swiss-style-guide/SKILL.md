---
name: swiss-style-guide
description: 针对高密度数据 SaaS 的"瑞士国际主义风格 (Swiss Style)"设计规范。强制使用 shadcn/ui, Tailwind CSS 与 Framer Motion。
allowed-tools: view_file, grep_search, multi_replace_file_content
---

## 核心指令 (Core Mandate)

本规范旨在将 **瑞士国际主义风格 (International Typographic Style)** 的客观性、秩序感与数学美学引入现代 SaaS 界面。

**强制技术栈 (Hard Constraints):**

* **UI 库:** `shadcn/ui` (必须通过 `cn()` 合并样式，严禁硬编码样式覆盖系统 Token)。
* **样式引擎:** `Tailwind CSS` (禁止任意值 `[]`，严格遵循 Design Token)。
* **动效库:** `Framer Motion` (仅限用于工业级、瞬时的微交互反馈)。

## 一、 设计哲学：瑞士风格工程化 (Swiss Engineering)

1. **数学网格 (The Mathematical Grid):** 界面不是画布，而是坐标系。所有元素必须严格对齐到网格系统。
2. **客观排版 (Objective Typography):** 字体大小和粗细是唯一的层级区分手段。拒绝装饰性容器。
3. **形式追随功能 (Form Follows Function):** 如果一个像素不能承载数据或引导操作，删除它。
4. **非对称平衡 (Asymmetrical Balance):** 通过内容的密度分布创造动态平衡，而非死板的中心对称。

## 二、 基础系统 (System Foundations)

### 1. 严格的几何构造 (Strict Geometry)

* **圆角 (Radius):** **0px (Zero Radius)**。全系统默认强制直角。
  * *Implementation:* 在 `globals.css` 中设置 `--radius: 0rem;` 或在类名中强制 `rounded-none`。
* **功能性豁免 (Functional Exception):** 仅在极其少数的人体工学交互场景（如 `Tooltip` 气泡、`Focus Ring` 光晕、`Badge` 胶囊）允许使用微圆角 (`rounded-sm` / 2px)，以防止视觉割裂并提供必要的视觉引导。严禁将圆角用于 Panel、Card、Image 等结构性容器。
* **边框 (Borders):** 1px `hsl(var(--border))`。SaaS 中的“墙”必须极薄且锋利。
  * *Pattern:* 优先使用 `border-r` 或 `border-b` 进行分割，而非 `gap` 留白。

### 2. 色彩：黑白与功能 (Monochrome & Function)

* **基调:** 纯粹的黑白灰阶，利用高对比度传达清晰度。
  * `bg-background` (画布)
  * `text-foreground` (主要信息)
  * `text-muted-foreground` (次要信息/结构说明)
* **功能色 (Function Colors):** 仅在极其必要时使用单一强调色。
  * Destructive: `bg-destructive` (仅用于不可逆操作)。
  * Active: `text-primary` (仅用于当前激活状态)。

### 3. 排版体系 (Typography)

* **家族:** `font-sans` (Inter/Geist) 用于 UI 框架，`font-mono` (JetBrains Mono) 用于**所有**数据值。
* **字重对比 (Weight Contrast):** 仅使用 `font-normal` (400) 和 `font-medium` (500)。严禁使用 Bold/Black，瑞士风格依靠留白而非粗细来强调。
* **标签学 (Classic Swiss Labeling):**
  * 所有非正文标签必须遵循：`text-xs uppercase tracking-widest font-medium text-muted-foreground` (严禁使用 `text-[10px]` 等任意值)。
  * *注:* 推荐在 `tailwind.config.js` 中将 `tracking-widest` 扩展为 `0.2em` 以满足对齐需求，但代码层面必须仅使用 Utility Class。
* **缩放 (Scale):** 夸大核心数据 (`text-4xl+ font-light`)，缩小辅助元素，制造极致对比。

## 三、 组件实现 (Implementation Specs)

### 1. 网格布局模式 (Grid System Pattern)

必须使用 CSS Grid 实现“剃刀”式分割，而非 `flex` 堆叠。

```tsx
// 瑞士网格容器标准写法
<div className="grid grid-cols-12 gap-px bg-border border border-border">
  {/* 侧边栏 */}
  <aside className="col-span-3 bg-background h-full">...</aside>
  {/* 主内容 */}
  <main className="col-span-9 bg-background h-full">...</main>
</div>
```

### 2. shadcn/ui 组件改造 (Strict Overrides)

所有组件必须去除非必要的装饰（阴影、圆角、背景色块）。

* **Buttons:**
  * `className="rounded-none shadow-none font-medium tracking-wide"`
  * *Primary:* `bg-primary text-primary-foreground hover:opacity-90`
  * *Outline:* `border-input bg-background hover:bg-accent hover:text-accent-foreground`
* **Depth (Swiss Depth):** 鉴于阴影被禁用，需引入“瑞士式深度 (Background Stepping)”来处理弹窗层级：
  * Level 0 (Canvas): `bg-background` (#fff/#000)
  * Level 1 (Hover/Panel): `bg-accent/50` or `bg-muted/30`
  * Level 2 (Dialog/Sheet): `bg-background` + **Thick Border** (`border-2`) + `bg-grid-pattern` (可选)

### 3. 图表与可视化 (Constructivist Data Viz)

图表必须遵循**构造主义 (Constructivism)** 美学：几何化、抽象化、去装饰化。

* **清晰度优先 (Clarity First):** 允许使用低曲率 (`0.1-0.2`) 的贝塞尔平滑以辅助视线流动，但严禁出现无数据支撑的过度震荡。
* **线条:** 极细 (`strokeWidth={1.5}`)。
* **填充:** 禁止渐变填充。使用纯色或图案纹理 (Pattern) 填充。
* **网格:** 必须保留坐标网格线，作为数据存在的坐标系证据。

### 4. 动态响应 (Kinetic Response)

严禁使用“Q弹 (Bouncy)”或“有机 (Organic)”的弹性动效。交互必须是**机械的、瞬时的**。

* **配置标准 (Industrial Precision):**
    使用极高阻尼的弹簧或以 `easeOutExpo` 为主的曲线，消除任何回弹。

    ```ts
    const swissTransition = {
      type: "spring", stiffness: 400, damping: 40, mass: 1
    }
    const mechanicalEase = {
      ease: [0.16, 1, 0.3, 1], duration: 0.15
    }
    ```

## 四、 无障碍与代码审查 (Accessibility & Audit)

### 1. 强制无障碍指标 (Mandatory Accessibility)

瑞士风格的“高对比度”有时会造成误导。必须强制执行 Web 易读性标准：

* **最小对比度:** 所有的 `text-muted-foreground` 必须保证与背景至少有 **4.5:1** (WCAG AA) 的对比度。严禁为了美观牺牲可读性。在深色模式下，推荐手动测试 `hsl(var(--muted-foreground))` 的亮度。

### 2. 代码审查清单 (The Swiss Audit)

* [ ] **Check 1: Radius Purge** - 全局搜索 `rounded-`。除了 `rounded-sm`(focus/badge) 外，是否存在其他圆角？
* [ ] **Check 2: Motion Audit** - 检查动画曲线。是否存在 `bounce` 或低阻尼弹簧？
* [ ] **Check 3: Type Integrity** - 所有的数字、ID、 금액是否包裹在 `font-mono` 中？字重是否超过了 `font-medium`？
* [ ] **Check 4: Depth Logic** - (针对弹窗) 是否用 `border-2` 或 `bg-color` 替代了 `box-shadow`？
* [ ] **Check 5: A11Y Contrast** - 是否有浅灰文字 (`text-muted-foreground`) 在浅色背景上难以辨认？
