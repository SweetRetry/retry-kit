# UI 表达技法目录 (Technique Catalog)

> 技法 ≠ 风格。技法叠加在任何风格原型之上，不改变基础风格身份。
> 一个区域可同时使用多种技法（如 Cinematic + Scroll Storytelling），但需确保彼此不冲突。

## 技法速览表

| 技法 | 核心效果 | 兼容风格 | 主要注意事项 |
|------|----------|----------|-------------|
| **Cinematic** | 暗色画布 · 聚光灯 · 视差 · 形变 | Swiss (Hero) · Minimal (特色文章) | 要求暗色模式区域 |
| **Liquid Glass** | 折射透镜 · 动态高光 · 环境响应 | Minimal (克制) | 折射仅 Chromium；需 fallback |
| **Glassmorphism** | 毛玻璃面板 · 背景模糊 · 半透明 | Minimal (克制) | Swiss 禁用；需 `prefers-reduced-transparency` |
| **Scroll Storytelling** | 滚动驱动动画 · 叙事编排 | 所有风格的长页面 | 必须 `prefers-reduced-motion` fallback |

---

## 1. 影院级 (Cinematic)

**何时用：** 需要沉浸感和戏剧性——产品 Hero、品牌宣言页、特色文章全屏展示。

### 核心实现要点

- **色调：** Token 化暗色画布，禁止硬编码 Hex。画布 `oklch(0.08 0 0)` → 通用暗色 `oklch(0.145 0 0)` → 卡片 `oklch(0.205 0 0)`
- **光影反光：** 抛光边框 `border-t border-foreground/20` + 氛围灯 `bg-primary/5`
- **动效引擎：** Framer Motion Spring Physics 优先。运镜 `stiffness: 280, damping: 28`；触感 `stiffness: 380, damping: 30`
- **入场编排：** `staggerChildren: 0.08`，初始态 `opacity: 0, y: 24`
- **滚动驱动：** `useScroll` + `useTransform` 实现视差和遮罩揭示

### 注意事项

| 规则 | 说明 |
|------|------|
| 暗色画布 | 要求当前区域为暗色模式 |
| Token 化 | 组件层使用语义 Token，禁止硬编码 |
| 内容即英雄 | 装饰性元素必须退后于内容 |
| 对比度 | WCAG AA ≥4.5:1，暗色背景文本必须达标 |

---

## 2. 液态玻璃 (Liquid Glass)

**何时用：** 需要"透镜"而非"磨砂"的高级材质感——产品 Hero、悬浮导航、品牌差异化亮点。

### 核心实现要点

- **三层结构：** 底层（背景内容）→ 折射层（SVG `feDisplacementMap` 扭曲背景）→ 高光层（伪元素径向渐变）
- **折射效果：** SVG filter + `backdrop-filter: blur()` 组合
- **高光响应：** 伪元素 `radial-gradient` 模拟顶部光泽，随交互/滚动微调
- **Fallback：** 不支持时降级为标准 Glassmorphism（`backdrop-filter: blur(16px)` + 半透明背景）

### 注意事项

- **浏览器兼容：** SVG `feDisplacementMap` 在 Safari 渲染差异大，需逐端测试
- **性能：** 折射 + 模糊组合 GPU 开销高，移动端限制为单层 `backdrop-filter`
- **与 Glassmorphism 区别：** Glassmorphism 是静态毛玻璃；Liquid Glass 增加折射扭曲和动态高光，呈现"透镜"质感

### 风格兼容性

| 风格 | 兼容度 | 用法 |
|------|--------|------|
| Minimal | 中 | 克制使用，仅 Hero 或单个亮点 |
| Swiss | 低 | 与边框深度模型冲突，不推荐 |

---

## 3. 玻璃拟态 (Glassmorphism)

**何时用：** 浮层需要深度层次但保留对底层内容的上下文可见性。

### 核心实现要点

- **核心三件套：** `backdrop-filter: blur(12-16px)` + `bg-background/60` + `border border-foreground/10`
- **背景要求：** 毛玻璃依赖丰富的背景内容（渐变、图片），纯色背景上无效果

### 注意事项

- **无障碍：** 实现 `prefers-reduced-transparency` fallback，降级为不透明背景
- **性能：** `backdrop-filter` 触发合成层，嵌套使用 GPU 开销叠加
- **Swiss 禁用：** 与边框层级深度模型冲突

### 风格兼容性

| 风格 | 兼容度 | 用法 |
|------|--------|------|
| Minimal | 中 | 仅用于浮层，主体保持纯色 |
| Swiss | 禁用 | 使用边框 + 不透明背景替代 |

---

## 4. 滚动叙事 (Scroll Storytelling)

**何时用：** 长页面需要叙事节奏——产品特性展示、品牌故事、年度报告、作品集 case study。

### 核心实现要点

- **CSS 原生方案：** `animation-timeline: scroll()` + `animation-range`，零 JS 开销
- **Framer Motion 方案：** `useScroll({ target })` + `useTransform` 精细控制
- **编排模式：** pin-and-reveal（固定背景 + 滚动前景）· stagger fade（段落级渐现）· parallax layers（视差差速）
- **性能关键：** 仅动画 `transform` 和 `opacity`（GPU 合成属性）

### 注意事项

- **prefers-reduced-motion：** 必须提供 fallback，降级为静态布局或简单 fade
- **移动端：** 触摸滚动惯性与动画节奏不同，需单独调试 `animation-range`
- **内容可达性：** 关键信息不能仅依赖动画展示，静态状态下也必须可读
- **浏览器支持：** CSS `animation-timeline` Chrome 115+ / Edge 115+ / Safari 26+；Firefox 需 flag，建议 Framer Motion fallback

### 风格兼容性

| 风格 | 兼容度 | 用法 |
|------|--------|------|
| Swiss | 中 | 数据可视化叙事、年度报告 |
| Minimal | 高 | 内容长页面的克制渐现 |
