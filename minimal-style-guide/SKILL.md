---
name: minimal-style-guide
description: 针对追求极致信噪比产品的"极简主义 (Minimalism)"设计规范。强制使用 shadcn/ui, Tailwind CSS 与 Framer Motion。
allowed-tools: view_file, grep_search, multi_replace_file_content
---

## 核心指令 (Core Mandate)

本规范旨在构建 **2026 范式的 "智能极简 (Smart Simplicity)"**。设计的目标不仅是“做减法”，更是**“管理认知负荷”**。利用数学秩序和 AI 适应性，让用户在更少的时间内完成更多。

**强制技术栈 (Hard Constraints):**

* **UI 库:** `shadcn/ui` (必须移除所有默认的装饰性效果，如过度的 Shadow 和 Gradient)。
* **样式引擎:** `Tailwind CSS` (严格限制使用的 Utility Class 范围)。
* **动效库:** `Framer Motion` (仅用于模拟物理世界的必然性，杜绝炫技)。

## 一、 设计哲学：做减法 (The Art of Subtraction)

1. **信噪比最大化 (Maximize Signal-to-Noise):** 每一个元素必须有且仅有一个明确的功能。如果一个元素删除后不影响功能，必须删除。
2. **留白即内容 (Whitespace is Content):** 留白（Negative Space）是主动的设计元素，用于构建视线流和层级，而非填充。
3. **排版即界面 (Typography is Interface):** 在极简界面中，字体的字重、字号和行高承担了 90% 的结构划分任务。
4. **诚实的设计 (Honest Design):** 拒绝拟物、拒绝装饰性的材质（如无意义的 Glassmorphism），材质必须服务于层级。

## 二、 基础系统 (System Foundations)

### 1. 空间与呼吸 (Space & Breathing)

* **呼吸率:** 界面必须拥有 **40% 以上** 的留白率。
* **间距系统:**
  * 使用 **4px / 0.25rem** 作为基准单位。
  * **Tight:** 4px, 8px (用于组件内部组装)。
  * **Loose:** 32px, 64px, 128px (用于区块分割)。
  * *Rule:* 宁可留白过大，不可过于拥挤。Section 之间默认 margin 需大于 `64px`。
* **移动端适配 (Fluid Density):**
  * 在移动端 (<768px)，40% 留白率会导致信息密度过低。
  * **Strategy:** 强制开启 "Compact Mode"。将所有 Loose Class 间距折半 (e.g., `my-32` -> `my-16`)，将留白率压缩至 **15-20%**。
  * **Touch Target:** 移动端交互热区严禁小于 **44x44px**。
* **布局网格 (Bento Grid Standard):**
  * 采用 **4列 / 6列** 模块化便当盒布局。
  * **Gaps:** 16px - 24px (保持视觉节奏)。
  * **Radius:** 面性卡片使用 **12px - 24px** (亲和感)，非功能性装饰保持直角。

### 2. 几何与形态 (Geometry & Form)

* **有形边界 (Tangible Boundaries):**
  * **Anti-Floating (拒绝漂浮感):** 极简主义需要比复杂设计更强的结构感。内容不能在真空中漂浮，必须有明确的归属域。
  * **容器锚点 (Surface Anchors):**
    * 当留白超过 128px 时，必须引入 **Surface Tones** (e.g. `bg-secondary/30`) 或 **Micro-Borders** (`border-border/40`) 来锁定视觉区块。
    * **Bento Grid** 必须有清晰的物理边缘定义，不可仅依赖间距。
  * **结构分割线 (Structural Dividers):** Section 之间应当使用极细分割线 (`h-px bg-border/20`) 来重置用户的认知节奏。
* **圆角 (Radius):**
  * 保持视觉统一。推荐 **`rounded-md` (6px)** 或 **`rounded-lg` (8px)**，保持柔和但克制的现代感。
  * 避免全圆角 (Pill shape) 滥用，仅用于 Primary Button 或 Tag。

### 3. 色彩：克制的情绪 (Restrained Emotion)

* **单色主导 (Monochrome Dominance):**
  * 界面 90% 区域应为无彩色（黑、白、灰）。
  * **Surface:**
    * Light: `#ffffff` (Base), `#F9FAFB` (Subtlety).
    * Dark: **禁止纯黑 (#000000)**。使用 `#121212` 或 `#1A1A1A` 避免 OLED 拖影并降低视觉疲劳。
* **单一强调色 (Single Accent):**
  * 全局仅允许一种品牌色（Accent Color）。
  * 仅在 **Primary Action** (主按钮) 或 **Active State** (选中态) 出现。
  * 严禁大面积色块背景，提倡使用文字颜色或极细的线条表达强调。
* **极简反馈 (Minimalist Signal):**
  * **State Definition:** 拒绝高饱和度的背景色块 (Alert/Toast)。
  * **Implementation:** 仅允许使用 **文字变色 (Text Color)** 或 **1px 侧边指示条 (Side Stroke)**。例如：Error 状态仅由一段红色文字或左侧红线表达。

### 4. 排版体系 (Hierarchical Typography)

* **字体选择:** 使用具有高阅读性的无衬线字体 (`Inter`, `San Francisco`, `Helvetica Now`)。
* **层级构建:**
  * **H1/Display:** 极大字号，极细字重 (Light/Thin) 或 极粗字重 (Bold/Black)，形成强对比。
  * **Body:** 保持舒适的行高 (Line-height: 1.6 - 1.8)。
  * **Micro:** 弱化辅助信息，使用 `text-muted-foreground`。
* **无障碍红线 (Accessibility Redline):**
  * **WCAG AA 强制:** 严禁为了追求极简而牺牲可读性。
  * *Constraint:* 所有文本（含 Muted/Disabled）与背景对比度必须符合 **WCAG AA Standard (> 4.5:1)**。那种“几乎看不见的灰色”是极简主义的典型反模式，必须杜绝。

## 三、 组件实现 (Implementation Specs)

### 1. shadcn/ui 极简改造 (Minimalist Overrides)

* **Buttons:**
  * 移除所有 `shadow`。
  * Variant: 优先使用 `ghost` 或 `link` 样式，仅主要操作保留 `default` (Solid)。
  * Hover: 仅做透明度变化 (`opacity-80`)，避免位移或强变色。
* **Cards:**
  * `border-none shadow-none bg-transparent` (默认)。
  * 仅需要强调时使用 `bg-muted/30` (极淡背景)。
* **Inputs:**
  * 极简线条风格 (`border-b` only) 或 极淡填充 (`bg-muted/20 border-none`)。
  * Focus 时仅加深边框颜色或改变背景色，避免厚重的 Ring。

### 2. 交互深度 (Interaction Depth)

极简主义不依赖 Z 轴的堆叠 (Shadow)，而依赖 **遮罩 (Dimming)** 和 **模糊 (Blur)**。

* **Modal/Dialog:** 使用高强度的 Backdrop Blur (`backdrop-blur-sm`) 配合纯色背景层，去除投影。
* **Dropdown:** 使用极细边框 (`border border-border/50`)，无投影或极轻微投影。

### 3. 图像处理 (Imagery)

* 图像必须高质量。
* 图像周围必须有足够的 Padding。
* 避免在该有的图像上叠加文字，若必须叠加，使用纯色遮罩而非渐变。

### 4. 动态响应：智性的流动 (Smart Motion)

* **生物反应 (Bio-Reaction):** 动效不是装饰，而是界面的“第二层皮肤”。它必须像生物反应一样传递材质信息。
* **高信噪比 (High SNR):** 拒绝无意义的翻转。动效目的是增强**操控感**（精密感）和构建**空间深度**（如：遮罩层级）。
* **高级玩法 (Advanced Techniques):**
  * **Layout Morphing:** 元素变形而非弹出（新窗口），符合“诚实的设计”。
  * **Staggered Entry:** 列表如波浪般逐行浮现（交错节奏），用排版构建“流”。
  * **Micro-strain:** 悬停时的极微小缩放，制造细腻的“呼吸感”。
* **参数 (Mechanical Precision):** 追求“机械表的精密感”。

  ```ts
  const minimalMotion = {
    type: "spring",
    stiffness: 260,
    damping: 20, // 模拟真实阻尼，无回弹 (No Bounce)
    mass: 1
  }
  ```

* **Fade Over Slide:** 优先使用 Opacity 变化，减少位移。

## 四、 代码审查清单 (The Minimalist Audit)

* [ ] **Structure Check**: 是否因去除边框而导致内容“漂浮”？(需增加 Surface Tone 或 Divider)。
* [ ] **Subtractive Check**: 还能删掉界面上的什么东西而不影响功能吗？
* [ ] **Whitespace Check**: 元素之间是否太挤？尝试将 Margin 翻倍。
* [ ] **Color Constraint**: 屏幕上的颜色种类（不含灰阶）是否超过了 1 种？
* [ ] **Depths Check**: 是否去除了所有不必要的阴影 (Shadow)？
* [ ] **Typography Check**: 标题和正文的对比是否足够强烈？(Text Contrast > 4.5:1 check included).
* [ ] **Responsive Check**: 移动端是否开启了 Compact Mode？Touch Target 是否 > 44px？
* [ ] **Green & Performance**: 首屏加载体积是否 < 500KB？是否使用了本地字体？
* [ ] **OLED Safety**: Dark Mode 背景是否避免了纯黑 (#000000)？
