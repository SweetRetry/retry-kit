---
name: expressive-style-guide
description: 影院级质感 (Cinematic UI) 设计规范。针对个人品牌、创意画廊、精品播放器等高表现力应用。强制使用 Framer Motion, Tailwind CSS 与 React。使用场景：(1) 构建需要"高级感"、"电影感"、"沉浸感"的项目，(2) 审查 UI 代码是否符合 Kinetic Minimalism 规范，(3) 用户要求类似 Apple Music、Linear 或高端作品集的效果时。
---

## 快速参考

| 要素 | 规范 |
|------|------|
| 背景色 | `bg-background` (CSS Variable 层定义近黑色调) |
| 前景色 | `text-foreground` (CSS Variable 层定义高亮白) |
| 强调色 | `text-primary` / `bg-primary` (单一品牌色) |
| 圆角 | `rounded-lg` (8px) 或 `rounded-xl` (12px) |
| 动效引擎 | Framer Motion, Spring Physics 优先 |
| 视觉模式 | 聚光灯 / 视差 / 形变 / 氛围渐变 / 遮罩揭示 / 浮层玻璃 / 动态排版 (可组合) |
| 对比度 | WCAG AA (≥4.5:1)，暗色背景上的文本必须达标 |
| 硬编码 Hex | **禁止** — 组件层严格使用语义 Token |

## 核心指令 (Core Mandate)

本规范旨在构建 **"影院级质感 (Cinematic UI)"** 或 **"动效极简主义 (Kinetic Minimalism)"**。核心在于将界面视为一个受控的摄影舞台，利用光影、材质和摄像机逻辑（运镜）将数字内容提升至艺术品高度。

**强制技术栈 (Hard Constraints):**

* **UI 库:** `shadcn/ui` (仅作为底层结构，必须通过 `cn()` 合并样式进行视觉提纯，严禁硬编码样式覆盖系统 Token)。
* **样式引擎:** `Tailwind CSS` (严格使用语义化 Token 类，在 CSS Variables 层定义影院色彩)。
* **动效库:** `Framer Motion` (核心引擎。Spring Physics 为首选驱动，辅以滚动驱动和视差动效)。

## 一、设计哲学：电影感的虚无 (Cinematic Void)

1. **内容即英雄 (Content as Hero):** 界面必须绝对退后。除了内容（图片、音乐、艺术品）本身，所有装饰性元素都应被剥离。
2. **黑暗画布 (The Dark Canvas):** 背景通过 CSS Variables 定义近黑色调 (`--background`)，组件层使用 `bg-background`。利用极高的动态范围，让局部光照产生戏剧性的对比。
3. **舞台级运镜 (Camera Work):** 动画不应是"跳动"或"回弹"，而是"平滑的滑轨 (Dolly Zoom)"或"形变 (Morph)"。
4. **质感的触觉 (Tactile Material):** 界面对象应具有质量感和表面反光，模拟物理实体在暗房中的质感。

## 二、基础系统 (System Foundations)

### 1. Token 化色彩系统 (Cinematic Color Tokens)

**原则：** 所有色彩在 CSS Variables 层定义，组件层严格使用 Tailwind 语义类。**禁止在组件代码中出现任何硬编码 Hex 值。**

**CSS Variables 定义（影院色调）：**

```css
:root {
  /* 影院场景下 Light Mode 极少使用，但必须定义 */
  --background: 0 0% 98%;        /* 近白 */
  --foreground: 0 0% 4%;         /* 近黑 */
  --card: 0 0% 96%;
  --card-foreground: 0 0% 4%;
  --primary: 220 90% 56%;        /* 品牌强调色 */
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 92%;
  --secondary-foreground: 0 0% 10%;
  --muted: 0 0% 90%;
  --muted-foreground: 0 0% 40%;
  --accent: 0 0% 92%;
  --accent-foreground: 0 0% 10%;
  --border: 0 0% 85%;
  --ring: 220 90% 56%;
}

.dark {
  /* 影院核心色调 — 近黑高对比 */
  --background: 0 0% 2%;         /* 近纯黑画布 */
  --foreground: 0 0% 95%;        /* 高亮白前景 */
  --card: 0 0% 4%;               /* 卡片微提亮 */
  --card-foreground: 0 0% 92%;
  --primary: 220 85% 65%;        /* 光谱偏移后的强调色 */
  --primary-foreground: 0 0% 2%;
  --secondary: 0 0% 8%;
  --secondary-foreground: 0 0% 88%;
  --muted: 0 0% 12%;
  --muted-foreground: 0 0% 55%;
  --accent: 0 0% 10%;
  --accent-foreground: 0 0% 90%;
  --border: 0 0% 14%;            /* 极微弱边界 */
  --ring: 220 85% 65%;
}
```

**组件层用法示例：**

```tsx
// ✅ 正确 — 使用语义 Token
<div className="bg-background text-foreground">
<div className="bg-card border-border">
<span className="text-muted-foreground">

// ❌ 禁止 — 硬编码 Hex
<div className="bg-[#030303] text-[#ffffff]">
<div style={{ background: '#000000' }}>
```

### 2. 光影与反光 (Cinematic Lighting)

光影效果通过 Token 化的 `border` 和 `opacity` 表达，禁止硬编码 RGBA。

* **抛光边框 (Reflective Sheen):** 卡片顶部的微弱反光使用 Token 化边框：
  * *Primary Sheen:* `border-t border-foreground/20` (顶部边缘高亮)
  * *Ambient Border:* `border border-border` (整体微弱边界)
* **氛围灯 (Ambient Glow):** 仅在极其克制的场景下使用背景模糊光晕，不透明度控制在 **5-8%**：
  * `bg-primary/5` 或 `bg-primary/8` 作为内容的氛围背景
* **模糊层级:** 弹出层使用 `backdrop-blur-xl` 配合语义背景色：
  * `bg-background/80 backdrop-blur-xl`

### 3. 动效物理学 (Kinetic Physics)

#### Spring Physics（交互驱动）

* **运镜 (Dolly/Morph):** 针对布局切换，追求稳重与连贯。

  ```ts
  const dolly = { type: "spring", stiffness: 280, damping: 28, mass: 1 };
  ```

* **触感 (Tactile Precision):** 针对微交互（点击、悬停），快速且无波动。

  ```ts
  const tactile = { type: "spring", stiffness: 380, damping: 30, mass: 0.8 };
  ```

* **渐现 (Reveal):** 针对新元素入场，使用平滑的 Expo 公式。

  ```ts
  const reveal = { duration: 1, ease: [0.16, 1, 0.3, 1] };
  ```

#### 滚动驱动动效 (Scroll-Driven)

* **视差滚动:** 通过 `useScroll` + `useTransform` 实现前景/背景差速移动。

  ```ts
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  ```

* **遮罩揭示:** 通过 `scrollYProgress` 驱动 `clipPath` 或 `opacity` 渐现。

  ```ts
  const opacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const clipPath = useTransform(scrollYProgress, [0, 1],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );
  ```

#### 入场编排 (Stagger Orchestration)

* 列表/网格子元素使用 `staggerChildren` 实现级联入场：

  ```ts
  const container = { animate: { transition: { staggerChildren: 0.08 } } };
  const item = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: reveal }
  };
  ```

### 4. 影院排版 (Display Typography)

* **Display Heading:** 标题应具有戏剧性的对比力。
  * *Scale:* `text-5xl` 至 `text-9xl`。
  * *Tracking:* `tracking-tighter` (-0.05em+)。
  * *Color:* `text-foreground` (严禁硬编码白色)。
* **Mono Secondary:** 所有辅助信息（年代、元数据）强制使用 Mono 字体，增强工业精密感。
  * *Font:* `JetBrains Mono` 或 `Geist Mono`。
  * *Color:* `text-muted-foreground`。
* **正文:** 行高 `leading-relaxed` (1.625)，确保暗色背景下的可读性。

## 三、视觉模式菜单 (Visual Mode Palette)

以下模式可**独立使用**或**组合叠加**，根据内容类型选择最佳搭配。避免在单一项目中滥用所有模式 — 选择 2-3 种建立统一的视觉语言。

### 1. 聚光灯 (Spotlight)

鼠标追踪的局部照明，让内容从黑暗中浮现。

* 通过 `useMotionTemplate` + `useMotionValue` 追踪鼠标坐标生成 `radial-gradient`。
* 光圈半径 240-320px，仅受光区域显示边框和精细纹理。
* **适用：** 卡片网格、作品画廊、功能展示。

### 2. 视差滚动 (Parallax Depth)

前景/背景分层差速移动，创造空间纵深感。

* 背景层以 0.3-0.5 倍速跟随滚动，前景以 1.0 倍速。
* 通过 `useScroll` + `useTransform` 映射 `translateY`。
* 可叠加 `scale` 变换模拟"推近 (Dolly In)"。
* **适用：** Landing Page Hero、长滚动叙事、产品展示。

### 3. 形变过渡 (Morph Transition)

元素间的形态插值，建立空间连续性。

* 强制使用 Framer Motion 的 `layoutId` 实现跨视图无缝变形。
* 封面图在缩略图 → 详情页间进行尺寸/位置/圆角的连续插值。
* 搭配 `AnimatePresence` 确保退出动画完整。
* **适用：** 详情展开、导航切换、状态过渡。

### 4. 氛围渐变 (Ambient Gradient)

低饱和度动态渐变背景，营造沉浸氛围。

* 使用 `bg-gradient-to-*` 搭配 Token 化色彩：`from-background via-muted/10 to-background`。
* 可通过 `animate` 缓慢循环渐变角度或位置 (duration: 8-15s)。
* 饱和度严格控制在 **5-15%**，禁止高饱和渐变。
* **适用：** 音乐播放器背景、品牌页氛围、加载状态。

### 5. 遮罩揭示 (Mask Reveal)

滚动驱动的内容渐现，创造戏剧性的揭幕效果。

* 通过 `clipPath` 动画实现几何形状的展开揭示。
* 支持多种揭示形态：垂直擦除、中心圆扩、对角线切入。
* 搭配 `opacity` 过渡防止硬边闪烁。
* **适用：** 章节入场、图片展示、时间线节点。

### 6. 浮层玻璃 (Frosted Overlay)

毛玻璃面板 + 景深模糊，建立层级与聚焦。

* 面板使用 `bg-background/60 backdrop-blur-xl border border-border`。
* 背景层同步应用 `scale(1.02)` + `blur(4px)` 模拟景深。
* 浮层入场使用 `dolly` spring 参数，退场使用 `reveal` 参数。
* **适用：** Modal/Dialog、侧边栏、详情弹出面板。

### 7. 微动态排版 (Kinetic Typography)

文字入场的戏剧性编排，让排版本身成为视觉焦点。

* 标题逐字/逐词入场，通过 `staggerChildren: 0.03-0.06` 级联。
* 每个字符独立应用 `opacity` + `y` + `filter: blur()` 过渡。
* 大标题可叠加 `scale` 从 1.1 → 1.0 的微缩放。
* **适用：** Hero 标题、品牌宣言、章节标题。

## 四、组件实现 (Implementation Specs)

### shadcn/ui 影院化改造 (Cinematic Overrides)

所有改造通过 `cn()` 合并样式，使用语义 Token，禁止硬编码颜色值。

#### Button

```tsx
// Primary — 高对比动作按钮
<Button className={cn(
  "bg-primary text-primary-foreground",
  "rounded-lg tracking-wide font-medium",
  "transition-none" // 由 Framer Motion 接管
)}>
  <motion.span whileTap={{ scale: 0.97 }} transition={tactile}>
    Action
  </motion.span>
</Button>

// Ghost — 影院幽灵按钮
<Button variant="ghost" className={cn(
  "text-muted-foreground hover:text-foreground",
  "hover:bg-accent/50"
)}>
  Secondary
</Button>
```

#### Card (影院卡片)

```tsx
<motion.div className={cn(
  "bg-card border border-border rounded-xl overflow-hidden",
  "border-t-foreground/15" // 顶部反光 Sheen
)}>
  {/* 封面图默认降低亮度，交互时恢复 */}
  <motion.img
    className="w-full object-cover brightness-[0.6]"
    whileHover={{ brightness: 1 }}
  />
  <div className="p-6">
    <h3 className="text-foreground text-lg font-semibold tracking-tight">
      {title}
    </h3>
    <p className="text-muted-foreground text-sm font-mono mt-1">
      {metadata}
    </p>
  </div>
</motion.div>
```

#### Dialog (影院弹出层)

```tsx
<Dialog>
  <DialogOverlay className={cn(
    "bg-background/80 backdrop-blur-xl"
  )} />
  <DialogContent className={cn(
    "bg-card border border-border rounded-xl",
    "shadow-none"
  )}>
    {/* 内容使用 AnimatePresence 编排入场 */}
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={dolly}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  </DialogContent>
</Dialog>
```

#### Navigation (影院导航)

```tsx
<nav className={cn(
  "fixed top-0 w-full z-50",
  "bg-background/60 backdrop-blur-lg border-b border-border"
)}>
  <div className="flex items-center justify-between px-8 h-16">
    <span className="text-foreground font-semibold tracking-tight">
      {brand}
    </span>
    <div className="flex gap-6 text-muted-foreground">
      {links.map(link => (
        <motion.a
          key={link.href}
          className="hover:text-foreground transition-colors"
          whileHover={{ y: -1 }}
          transition={tactile}
        >
          {link.label}
        </motion.a>
      ))}
    </div>
  </div>
</nav>
```

### 非对称 Bento 网格 (Asymmetric Grid)

网格打破等宽单调性，创造视觉节奏：

* **Hero Item:** `col-span-2 row-span-2` — 主视觉焦点。
* **Vertical/Square:** 交错排列，创造视觉节奏。
* **Gap:** `gap-4` 或 `gap-6`，使用 Token 化间距。
* **Mobile:** 间距折半 (`gap-2`)，但保持足够的内衬空间 (`p-4`)。

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
  <div className="col-span-2 row-span-2">{/* Hero Card */}</div>
  <div className="col-span-1">{/* Vertical Card */}</div>
  <div className="col-span-1">{/* Square Card */}</div>
</div>
```

### 共享元素跳转 (Shared Element Transition)

* 强制使用 Framer Motion 的 `layoutId`。
* 封面图必须在形态间进行无缝插值过渡，严禁出现页面间的瞬间闪烁或硬切。
* 搭配 `AnimatePresence` 管理组件生命周期。

```tsx
<motion.div layoutId={`card-${id}`} transition={dolly}>
  <motion.img layoutId={`image-${id}`} src={cover} />
</motion.div>
```

## 五、代码审查清单 (The Cinematic Audit)

### Token 合规

* [ ] **Token Check** — 组件代码中是否存在硬编码 Hex (如 `#030303`, `#ffffff`)？所有颜色是否使用 `bg-background` / `text-foreground` / `border-border` 等语义类？
* [ ] **CSS Variable Check** — 影院色调是否在 `:root` / `.dark` 的 CSS Variables 中正确定义？

### 视觉与材质

* [ ] **Lighting Logic** — 是否合理使用了光影效果？是否避免了全向均匀照明？
* [ ] **Material Check** — 所有容器是否具备顶部反光 (`border-t-foreground/15`)？边框是否使用 `border-border`？
* [ ] **Imagery Authenticity** — 封面是否为高质量摄影或 3D 渲染？是否存在廉价的矢量或渐变占位？

### 动效质量

* [ ] **Physics Check** — 交互动效是否使用 Spring Physics？是否存在线性或 ease-in-out 动画？Damping 是否足够大以保证稳定性？
* [ ] **Continuity Check** — 图片转换是否应用了 `layoutId`？详情页入场是否使用了 `AnimatePresence`？
* [ ] **Scroll Motion Check** — 是否合理使用了滚动驱动动效 (视差/遮罩揭示)？是否存在不必要的 JS 滚动监听？

### 模式多样性

* [ ] **Variety Check** — 项目是否过度依赖单一视觉模式 (如仅使用聚光灯)？是否根据内容类型选择了 2-3 种互补模式？
* [ ] **Composition Check** — 多种模式叠加时，是否保持了视觉克制？是否存在过度堆叠导致的性能问题或审美疲劳？

### 可访问性

* [ ] **Contrast Safety** — 暗色背景上的所有文本 (尤其是 `text-muted-foreground`) 对比度是否 ≥ 4.5:1？
* [ ] **Motion Safety** — 是否尊重 `prefers-reduced-motion`？开启后是否禁用视差和复杂入场动画？

## 参考资源

* **示例项目**: `example/` 目录包含一个名为 **Aero Music** 的完整演示应用，展示了 Bento 布局、聚光灯遮罩及摄像机运镜的完整实现。
