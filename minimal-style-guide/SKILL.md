---
name: minimal-style-guide
description: 针对追求极致信噪比产品的"极简主义 (Minimalism)"设计规范。推荐使用 shadcn/ui, Tailwind CSS 与 Framer Motion。使用场景：(1) 用户要求创建内容优先、轻量级的网站或应用，(2) 审查 UI 代码是否过度设计，(3) 用户提到极简主义、少即是多、信噪比、Bento Grid 布局时。
---

## 核心指令 (Core Mandate)

本规范旨在构建 **"智能极简 (Smart Simplicity)"**。设计的目标是**平衡视觉表达与信息效率**，而非一味做减法。极简不等于冷淡，保留必要的视觉层次和交互反馈。

**推荐技术栈:**

* **UI 库:** `shadcn/ui` (可适度调整装饰性效果，保留功能性阴影和层次)。
* **样式引擎:** `Tailwind CSS` (合理使用 Utility Class)。
* **动效库:** `Framer Motion` (用于增强交互反馈和空间感知，避免过度炫技)。

---

## 一、 设计哲学：有克制的表达 (Restrained Expression)

1. **信噪比优化 (Optimize Signal-to-Noise):** 去除真正冗余的装饰，但保留有助于理解和交互的视觉元素。
2. **留白与密度的平衡:** 留白是工具而非教条，根据内容类型灵活调整。
3. **排版作为基础结构:** 字体层级承担主要的信息划分任务，但允许色彩、阴影作为辅助层次。
4. **诚实的设计 (Honest Design):** 材质服务于功能，拒绝无意义的拟物，但允许表达品牌个性的视觉处理。

---

## 二、 基础系统 (System Foundations)

### 1. 空间与呼吸 (Space & Breathing)

* **留白率:** 根据产品类型调整，**20-40%** 为合理范围。内容密集型产品（如创作工具）可适当降低。
* **间距系统:**
  * 使用 **4px / 0.25rem** 作为基准单位。
  * **Tight:** 4px, 8px (组件内部)。
  * **Loose:** 24px, 32px, 48px (区块分割，避免过度留白)。
* **移动端适配:**
  * 适度压缩间距，但保持可读性。
  * **Touch Target:** 移动端交互热区严禁小于 **44x44px**。
* **布局网格:**
  * 采用灵活的网格系统 (2列/3列/4列)。
  * **Gaps:** 12px - 24px。
  * **Radius:** `rounded-lg` (8px) 或 `rounded-xl` (12px)，保持统一即可。

### 2. 几何与形态 (Geometry & Form)

* **功能性边界:**
  * 使用 **Surface Tones** (`bg-muted`, `bg-secondary`) 或 **Borders** (`border-border`) 定义区块。
  * 允许适度的阴影表达层级 (`shadow-sm`, `shadow-md` 用于卡片、浮层)。
* **圆角 (Radius):**
  * 保持视觉统一，推荐 `rounded-lg` (8px) 或 `rounded-xl` (12px)。
  * 按钮可使用 `rounded-full` (Pill) 作为品牌特征。

### 3. 色彩：层次与情绪 (Hierarchy & Emotion)

* **基础色调:**
  * 界面以无彩色为基底（黑、白、灰）。
  * **Surface:** Light: `#ffffff`, `#F9FAFB`, `#f3f4f6`。
  * Dark: 可使用 `#121212` 或 `#0f0f0f`。
* **品牌色使用:**
  * 允许 1-2 种品牌色用于强调。
  * 可用于 Primary Button、Active State、重要提示。
  * 允许 subtle 的品牌色背景 (`bg-primary/10`) 表达选中状态。
* **反馈色彩:**
  * Error、Success、Warning 状态可使用标准语义色彩。
  * 允许使用浅色背景 + 深色文字的组合 (`bg-destructive/10 text-destructive`)。

### 4. 排版体系 (Hierarchical Typography)

* **字体选择:** 使用高阅读性的无衬线字体 (`Inter`, `SF Pro`, `Helvetica Now`)。
* **层级构建:**
  * **H1/Display:** 大字号 + 适中字重 (Medium/Semibold)。
  * **Body:** 舒适的行高 (Line-height: 1.5 - 1.7)。
  * **Micro:** 辅助信息使用 `text-muted-foreground`，但保持可读对比度。
* **无障碍红线:**
  * 所有文本对比度符合 **WCAG AA Standard (> 4.5:1)**。
  * 避免使用 `text-muted-foreground/50` 等过低对比度。

---

## 三、 组件实现 (Implementation Specs)

### 1. shadcn/ui 调整建议

* **Buttons:**
  * 可保留 subtle 的 `shadow-sm` 用于提升层级。
  * Hover: 可使用 `opacity` 变化或 `bg` 色阶变化。
* **Cards:**
  * 默认使用 `border border-border bg-card`。
  * 可保留 `shadow-sm` 用于区分层次。
* **Inputs:**
  * 使用 `border` 或 `bg-muted` 风格。
  * Focus 时显示清晰的聚焦状态（边框色变化或 ring）。

### 2. 交互深度 (Interaction Depth)

* **阴影使用:**
  * `shadow-sm`: 卡片、按钮默认状态。
  * `shadow-md`: 悬浮卡片、下拉菜单。
  * `shadow-lg`: 模态框、重要浮层。
* **Modal/Dialog:** 可使用 `backdrop-blur-sm` 配合半透明遮罩。

### 3. 动效设计 (Motion Design)

* **核心原则:** 动效服务于交互反馈，而非装饰。
* **推荐动效:**
  * **Opacity:** 淡入淡出，最基础的过渡。
  * **Scale:** 悬停时 subtle 的缩放 (`scale-[1.02]`) 表达可点击性。
  * **Translate:** 滑入滑出用于页面/面板切换。
* **参数建议:**

  ```ts
  const smoothMotion = {
    type: "spring",
    stiffness: 300,
    damping: 25,
    mass: 0.8
  }
  ```

* **避免:** 过度弹跳、旋转、翻转等炫技动效。

---

## 四、 代码审查清单 (The Minimalist Audit)

* [ ] **Structure Check**: 内容层级是否清晰？是否需要更多/更少的视觉分隔？
* [ ] **Subtractive Check**: 是否存在真正冗余的元素（删除后不影响功能）？
* [ ] **Whitespace Check**: 间距是否一致？是否过度拥挤或过度稀疏？
* [ ] **Color Check**: 色彩使用是否有明确目的？对比度是否足够？
* [ ] **Shadow Check**: 阴影是否用于表达层级？是否过度使用？
* [ ] **Typography Check**: 字体层级是否清晰？可读性是否良好？
* [ ] **Motion Check**: 动效是否增强交互理解？是否过度干扰？
* [ ] **Responsive Check**: 移动端体验是否流畅？Touch Target 是否足够？

---

## 五、 使用建议

本规范是**指南而非法律**。在审查代码时：

1. **优先修复明显的反模式：** 对比度不足、过度拥挤、无意义的装饰。
2. **保留产品的个性：** 如果是创意工具、音乐产品等需要氛围感的场景，允许适度的视觉表达。
3. **与开发者沟通：** 对于边界情况，询问设计意图，而非机械执行规则。

**记住：目标是让界面更好用，而非更单调。**

## 参考资源

- **设计理论深度报告**: 如需了解极简主义的历史渊源、Bento Grid 布局、暗黑模式最佳实践和完整设计原则，请参阅 [reference.md](reference.md)
- **示例项目**: `example/` 目录包含一个完整的 Minimalist 风格示例应用，展示了规范的实际实现，包括布局组件、页面模板和主题配置
