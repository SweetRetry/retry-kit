---
name: swiss-style-guide
description: 针对高密度数据 SaaS 的"新瑞士风格 (Neo-Swiss)"设计规范。强制使用 shadcn/ui, Tailwind CSS 与 Framer Motion。使用场景：(1) 用户要求创建 dashboard、数据密集型界面、SaaS 产品，(2) 审查 UI 代码是否符合设计系统规范，(3) 用户提到瑞士风格、极简主义、网格系统、国际主义设计风格时。
---

## 核心指令 (Core Mandate)

本规范旨在构建 **"新瑞士风格 (Neo-Swiss)"** 或 **"系统极简主义 (Systemic Minimalism)"** 的数字界面。核心在于利用数学秩序对抗信息熵，为 AI 时代的过度信息提供清晰的认知结构。

**强制技术栈 (Hard Constraints):**

* **UI 库:** `shadcn/ui` (必须通过 `cn()` 合并样式，严禁硬编码样式覆盖系统 Token)。
* **样式引擎:** `Tailwind CSS` (强制执行 **8-Point Grid System**)。
* **动效库:** `Framer Motion` (仅限用于 <300ms 的功能性微交互)。

## 一、 设计哲学：系统极简主义 (Systemic Minimalism)

1. **全面秩序 (Comprehensive Order):** 利用 CSS Grid (Subgrid) 和 Container Queries 实现跨层级的绝对对齐。
2. **客观排版 (Objective Typography):** 字体是结构而非装饰。使用流体排版 (Fluid Typography) 适应多设备。
3. **形式追随内容 (Form Follows Content):** 网格适应内容，而非强迫内容适应网格。如果一个像素不承载信息，删除它。
4. **非对称动态 (Asymmetrical Dynamic):** 拒绝死板的居中，通过左对齐 (Flush-left) 和右侧留白创造视觉张力和阅读流。

## 二、 基础系统 (System Foundations)

### 1. 网格与间距 (The 8-Point Grid)

* **原子单位:** **8px (0.5rem)**。所有间距 (`margin`, `padding`, `gap`, `height`) 必须是 8 的倍数。
  * *Scale:* 8, 16, 24, 32, 40, 48, 64, 80px。
  * *Implementation:* 严禁使用奇数或非 8 倍数值 (如 `p-[11px]`)。
* **网格系统:**
  * **Desktop:** 12 Cols, Gap 24px (3rem), Margin 80px (10rem).
  * **Technique:** 使用 `grid-cols-12` 配合 `col-span-x` 进行剃刀式分割。

### 2. 几何与构造 (Strict Geometry)

* **圆角 (Radius):** **0px (Zero Radius)**。全系统默认强制直角，传递工业精密感。
  * *Exception:* 仅在 **高频人机交互点** (如 `Button`, `Badge`, `Input Focus Ring`) 允许微圆角 (**2px / `rounded-sm`**) 以符合人体工学，防止视觉刺痛。
  * *Prohibited:* Card, Dialog, Image, Container 必须保持直角。
* **边框 (Borders):** 极细锋利。默认 `1px`，Modal/Popvoer 可使用 `2px` 强调层级。

### 3. 色彩：功能性多巴胺 (Functional Dopamine)

* **基调:** 极致的黑白灰阶。
  * Background: `#FFFFFF` / `#121212` (Dark Mode 避免纯黑，防拖影)。
  * Foreground: `#111111` / `#EDEDED`。
* **功能色 (Dopamine Accents):** 仅用于**关键交互** (Action) 或 **状态指示** (Status)。禁止装饰性色块。
  * **Swiss Red:** `#FF3B30` (Error/Destructive) -> Dark: `#FF6B6B` (Spectral Shifted)。
  * **International Blue:** `#0055FF` (Primary Action) -> Dark: `#4D99FF`。
* **暗黑模式 (Spectral Shifting):** 必须确保深色模式下的强调色进行“光谱偏移”以满足 WCAG AA 4.5:1 对比度。

### 4. 排版体系 (Fluid Typography)

* **字体:**
  * **UI:** `Inter`, `Geist`, `Roboto Flex` (首选可变字体)。
  * **Data:** `JetBrains Mono`, `Geist Mono` (所有数字、ID、代码必须使用等宽字体)。
* **流体缩放 (Modular Scale):** 放弃固定像素，使用 `clamp()` 响应视口。
  * 遵循 **Major Third (1.250)** 或 **Perfect Fourth (1.333)** 数学比例。
  * *Display (H1):* `clamp(2.5rem, 5vw, 3.8rem)` (Letter-spacing: tight)。
  * *Body:* `1rem` (16px) (Line-height: 1.5)。
  * *Label:* `0.75rem` (12px) Uppercase, Tracking Widest (0.05em+)。

## 三、 组件实现 (Implementation Specs)

### 1. shadcn/ui 改造规范 (Neo-Swiss Overrides)

* **Buttons:**
  * `rounded-sm` (2px) 或 `rounded-none`。
  * `font-medium tracking-wide`。
  * *Micro-interaction:* Click 时 `scale(0.98)` (提供物理触感)。
  * *Focus:* 必须有高对比度 Focus Ring (2px offset 2px)。
* **Cards / Containers:**
  * `rounded-none border shadow-none bg-background`。
  * 依靠 `border` 分割区域，而非 `shadow` 堆叠。
* **Inputs:**
  * `rounded-none border-input focus:ring-2 focus:ring-primary focus:ring-offset-0`。
  * Label 必须加粗且位于上方 (Form structure).

### 2. 瑞士式深度 (Swiss Depth)

由于禁用投影 (Shadow)，需通过 **层级叠加 (Layering)** 和 **边框 (Borders)** 表达深度：

* **Level 0 (Base):** Canvas (`bg-background`).
* **Level 1 (Group):** Bordered Area (`border border-border`).
* **Level 2 (Overlay):** Dialog/Popover 必须拥有 **Thick Border** (`border-2`) 或高对比度背景色，而非模糊阴影。

### 3. 图标与图形 (Geometric Icons)

* **风格:** **Geometric Neo-Minimalism**。
* **规范:**
  * SVG 格式。
  * 纯描边 (Stroke) 或纯填充 (Fill)，无渐变，无 3D。
  * 语义化：图标旨在加速认知 (如齿轮代表设置)，而非装饰。

### 4. 动态响应 (Polite Motion)

* **原则:** 交互必须是 **礼貌的 (Polite)**、**瞬时的 (<300ms)** 且 **无回弹 (No Bounce)**。
* **参数:**

    ```ts
    const neoSwiss = {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] // Expo Out
    }
    ```

* **场景:**
  * Hover: 极细微的背景色偏移或各向异性缩放。
  * Transition: 简单的 Opacity 或 Y-axis 位移。

## 四、 代码审查清单 (The Neo-Swiss Audit)

* [ ] **Check 1: 8-Point Compliance** - 所有的 margin/padding/gap 是否都是 4/8/16/24/32... 的倍数？拒绝 `10px`, `15px`。
* [ ] **Check 2: Zero Radius Default** - 默认是否为直角？圆角是否仅限于 Button/Input 等交互热区 (rounded-sm)？
* [ ] **Check 3: Typography Logic** - 数字是否使用了 Mono 字体？标题是否使用了流体缩放或正确的比例？
* [ ] **Check 4: Color Function** - 彩色是否仅用于 Action 或 Status？是否存在装饰性的背景色块？
* [ ] **Check 5: Contrast Safety** - 所有的文本 (尤其是 Muted) 对比度是否 > 4.5:1？Dark Mode 下的主色是否进行了光谱偏移？

## 参考资源

- **设计理论深度报告**: 如需了解新瑞士风格的历史渊源、理论框架和完整设计原则，请参阅 [reference.md](reference.md)
- **示例项目**: `example/` 目录包含一个完整的 Neo-Swiss 风格示例应用，展示了规范的实际实现，包括布局组件、页面模板和动效配置
