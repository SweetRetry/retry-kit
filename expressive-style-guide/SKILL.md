---
name: expressive-style-guide
description: 影院级质感 (Cinematic UI) 设计规范。针对个人品牌、创意画廊、精品播放器等高表现力应用。强制使用 Framer Motion, Tailwind CSS 与 React。使用场景：(1) 构建需要"高级感"、"电影感"、"沉浸感"的项目，(2) 审查 UI 代码是否符合 Kinetic Minimalism 规范，(3) 用户要求类似 Apple Music、Linear 或高端作品集的效果时。
---

## 核心指令 (Core Mandate)

本规范旨在构建 **"影院级质感 (Cinematic UI)"** 或 **"动效极简主义 (Kinetic Minimalism)"**。核心在于将界面视为一个受控的摄影舞台，利用光影、材质和摄像机逻辑（运镜）将数字内容提升至艺术品高度。

**强制技术栈 (Hard Constraints):**

* **UI 库:** `shadcn/ui` (仅作为底层结构，必须进行全方位的视觉提纯)。
* **样式引擎:** `Tailwind CSS` (强制使用 **Cinematic Color Palette**)。
* **动效库:** `Framer Motion` (核心引擎。强制使用 **Spring Physics** 驱动所有交互，严禁线性或 Ease 动画)。

## 一、 设计哲学：电影感的虚无 (Cinematic Void)

1. **内容即英雄 (Content as Hero):** 界面必须绝对退后。除了内容（图片、音乐、艺术品）本身，所有装饰性元素都应被剥离。
2. **黑暗画布 (The Pure Black):** 背景强制使用 `#030303` 或 `#000000`。利用极高的动态范围，让局部光照 (Spotlight) 产生戏剧性的对比。
3. **舞台级运镜 (Camera Work):** 动画不应是“跳动”或“回弹”，而是“平滑的滑轨 (Dolly Zoom)”或“形变 (Morph)”。
4. **质感的触觉 (Tactile Material):** 界面对象应具有质量感和表面反光，模拟物理实体在暗房中的质感。

## 二、 基础系统 (System Foundations)

### 1. 光影与聚光灯 (Cinematic Lighting)

* **聚光灯 (Spotlight):** 页面严禁被均匀照亮。内容需通过鼠标追踪的 `Radial Gradient` 局部现形。
  * *Radius:* 240px - 320px。
  * *Implementation:* 只有受光区域才允许显示边框和精细纹理 (Border Reveal)。
* **氛围灯 (Ambient Glow):** 仅在极其克制的场景下使用背景模糊光晕，不透明度控制在 **5-8%**，作为内容的“影子”。

### 2. 动效物理学 (Kinetic Physics)

* **运镜 (Dolly/Morph):** 针对布局切换，追求稳重与连贯。
  * `stiffness: 280, damping: 28, mass: 1`
* **触感 (Tactile Precision):** 针对微交互（点击、悬停），快速且无波动。
  * `stiffness: 380, damping: 30, mass: 0.8` (模拟 iOS 系统的受控手感)。
* **渐现 (Reveal):** 针对新元素入场，使用平滑的 Expo 公式。
  * `duration: 1, ease: [0.16, 1, 0.3, 1]`

### 3. 几何与材质 (Materials & Refraction)

* **抛光边框 (Reflective Sheen):** 卡片必须拥有顶部的微弱反光（Edge Highlight）。
  * *Primary:* `border-top: 1px solid rgba(255, 255, 255, 0.2)`
  * *Secondary:* `border: 1px solid rgba(255, 255, 255, 0.08)`
* **模糊层级:** 详情页弹出时，背景必须使用 `backdrop-blur-xl` 并配合 **不透明度渐变 (Dimming)**。

### 4. 影院排版 (Display Typography)

* **Display Heading:** 标题应具有戏剧性的对比力。
  * *Scale:* `text-5xl` 至 `text-9xl`。
  * *Tracking:* `tracking-tighter` (-0.05em+)。
* **Mono Secondary:** 所有辅助信息（年代、元数据）强制使用 Mono 字体，增强工业精密感。
  * *Font:* `JetBrains Mono` 或 `Inter Light`。

## 三、 组件实现 (Implementation Specs)

### 1. 聚光灯卡片 (Spotlight Card)

核心交互不是卡片的回弹，而是**光在表面掠过**。

* 必须使用 `useMotionTemplate` 追踪鼠标坐标。
* 封面图默认 `opacity-60`，受光后切换为 `opacity-100`。
* 严禁在卡片上使用高饱和度的装饰性渐变。

### 2. 非对称 Bento (Asymmetric Grid)

网格应打破等宽单调性：

* **Hero Item:** `col-span-2 row-span-2`。
* **Vertical/Square:** 交错排列，创造视觉节奏。
* **Mobile:** 间距折半，但保持大的内衬空间。

### 3. 共享元素跳转 (Shared Element Transition)

* 强制使用 Framer Motion 的 `layoutId`。
* 封面图必须在形态间进行无缝插值过渡，严禁出现页面间的瞬间闪烁或硬切。

## 四、 代码审查清单 (The Cinematic Audit)

* [ ] **Blackness Check** - 背景是否使用了 `#030303` 或 `#000000`？拒绝中灰色。
* [ ] **Lighting Logic** - 是否实现了鼠标追踪的高光反光？还是全向均匀光？
* [ ] **Physics Check** - 动效是否包含“不专业的跳跃”？Damping 是否足够大以保证稳定性？
* [ ] **Imagery Authenticity** - 封面是否为高质量摄影或 3D 渲染？是否存在廉价的矢量或渐变占位。
* [ ] **Continuity Check** - 图片转换是否应用了 `layoutId`？详情页的入场是否使用了 `AnimatePresence` 配合沉浸式模糊？
* [ ] **Refraction Check** - 所有的容器是否具备顶部的边缘高亮线 (Edge Sheen)？

## 参考资源

* **示例项目**: `example/` 目录包含一个名为 **Aero Music** 的完整演示应用，展示了 Bento 布局、聚光灯遮罩及摄像机运镜的完整实现。
