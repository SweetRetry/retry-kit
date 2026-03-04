# 高品质技法库

触发条件不满足时禁止主动引入——技法的价值来自克制使用，不是默认堆砌。

---

## 布局构图

| 技法 | 适用档位 | 触发条件 | 实现要点 |
|------|---------|---------|---------|
| **Bento Grid** | Tool / Brand | 内容块 ≥ 4 且各块信息密度差异明显 | `grid-cols-[2fr_1fr]`，用 `row-span-2` 制造主次 |
| **Split Hero** | Brand 优先 | Hero 有配套产品截图或演示动效 | `grid-cols-2 gap-16`，左文右图 |
| **Sticky Scroll Stack** | Brand | 有 3+ 个需要逐步展开的功能亮点 | `sticky top-24` + `translateY` 偏移，移动端退化为普通堆叠 |
| **Dashboard Shell** | Tool | 需要固定导航的多页面应用 | 左侧 `w-[240px]` + 右侧 `flex-1`，顶部 `h-14` header |

---

## 卡片与组件

| 技法 | 适用档位 | 触发条件 | 实现要点 |
|------|---------|---------|---------|
| **Spotlight Border Card** | Brand | 卡片是页面主焦点，需要引导视线 | 鼠标位置驱动 `radial-gradient` 边框，移动端禁用，`prefers-reduced-motion` 时改为静态渐变边框 |
| **Parallax Tilt** | Brand 仅限 Hero 区 | Hero 有核心产品展示图，需要立体感 | `rotateX/Y`，`perspective-1000`，移动端禁用，`prefers-reduced-motion` 时回退为 static |
| **Command Input** | Tool / Brand | 产品核心交互是输入/搜索/命令 | Typewriter 循环 placeholder，带 processing 状态 |
| **Live Status** | Tool | 有实时数据需要展示（监控、指标、状态） | `animate-pulse` 呼吸圆点 + spring 数字跳动（`stiffness: 300, damping: 30`） |
| **Infinite Carousel** | Brand | 需要展示 logo 墙、客户列表或产品截图序列 | `x: ["0%", "-100%"]`，`duration: 20s, ease: linear`；外层容器 `pointer-events-none`，内层可点击项（如 logo 链接）加 `pointer-events-auto` |

---

## 背景与氛围

| 技法 | 适用档位 | 触发条件 | 实现要点 |
|------|---------|---------|---------|
| **Mesh Gradient** | Brand | 深色底 + 需要有机感/温度感，非极简风 | `radial-gradient` 多色叠加，动画周期 ≥ 8s，颜色不超过 3 种 |
| **Grain Texture** | Brand | 任何深色底场景，增加质感层 | `::before` 伪元素叠 `url(noise.svg)`，`opacity-[0.03]`，`pointer-events-none`。若无 noise.svg，用完整 inline SVG filter：`filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter></svg>#n")`。**CSP 注意**：严格 CSP 禁止 data URI 时，改用 `/public/noise.svg` 真实文件 |
| **暗光底色** | Brand | 选择了暗光 Cinematic 深度模型 | `bg-background` + `border-t border-white/5` 切割层级 |

---

## 微交互

| 技法 | 适用档位 | 触发条件 | 实现要点 |
|------|---------|---------|---------|
| **CTA Magnetic** | Brand | 主 CTA 是页面唯一焦点，需要强吸引力 | `useSpring({ stiffness: 150, damping: 25 })` 跟随回弹，移动端禁用 |
| **Button Press** | Tool / Brand | 所有主操作按钮（全档位通用，不受 Tool 动效限额约束） | `whileTap={{ scale: 0.97 }}`，比 `active:scale-95` 更流畅 |
| **数字跳动** | Tool / Brand | 展示核心指标数字（增长、统计、计数） | `useMotionValue` + `useTransform`，不用 `useState` 轮询 |
