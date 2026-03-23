# 响应式设计

## Mobile-First

从移动端基础样式开始，用 `min-width` 查询逐层增加复杂性。Desktop-first（`max-width`）意味着移动端先加载不需要的样式。

---

## 断点：内容驱动

不要追设备尺寸——让内容告诉你在哪里断。从窄开始拉宽，设计崩坏的地方加断点。

三个断点通常够了（640、768、1024px）。用 `clamp()` 做流式值，减少对断点的依赖。

---

## 检测输入方式，不只是屏幕尺寸

**屏幕尺寸不等于输入方式**。笔记本有触屏，平板有键盘。

```css
/* 精确指针（鼠标、触控板） */
@media (pointer: fine) {
  .button { padding: 8px 16px; }
}

/* 粗略指针（触控、手写笔） */
@media (pointer: coarse) {
  .button { padding: 12px 20px; }  /* 更大触控目标 */
}

/* 设备支持 hover */
@media (hover: hover) {
  .card:hover { transform: translateY(-2px); }
}

/* 设备不支持 hover（触控） */
@media (hover: none) {
  .card { /* 无 hover 状态——用 active 代替 */ }
}
```

**关键**：不要依赖 hover 实现功能。触控用户无法 hover。

---

## Container Queries

视口查询用于页面布局。**容器查询用于组件**：

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: grid;
  gap: var(--space-md);
}

/* 卡片布局基于容器宽度变化，不是视口 */
@container (min-width: 400px) {
  .card {
    grid-template-columns: 120px 1fr;
  }
}
```

**为什么重要**：窄侧边栏中的卡片保持紧凑，同一张卡片在主内容区自动展开——无需视口 hack。

---

## Safe Area：处理刘海

现代手机有刘海、圆角和 home 指示器。用 `env()`：

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* 带回退 */
.footer {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

启用 viewport-fit：
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

---

## 响应式图片

### srcset + width descriptors

```html
<img
  src="hero-800.jpg"
  srcset="
    hero-400.jpg 400w,
    hero-800.jpg 800w,
    hero-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Hero 图片"
>
```

`srcset` 列出可用图片和实际宽度（`w` 描述符），`sizes` 告诉浏览器图片显示宽度，浏览器根据视口宽度和设备像素比自动选择。

### picture 元素（Art Direction）

需要不同裁剪/构图时（不只是不同分辨率）：

```html
<picture>
  <source media="(min-width: 768px)" srcset="wide.jpg">
  <source media="(max-width: 767px)" srcset="tall.jpg">
  <img src="fallback.jpg" alt="...">
</picture>
```

---

## 布局适配模式

### 导航

三阶段：移动端 hamburger + 抽屉 → 平板水平紧凑 → 桌面完整带标签。

### 表格

移动端转卡片：`display: block` + `data-label` 属性。

### 渐进式折叠

用 `<details>/<summary>` 做移动端可折叠内容。

---

## 流式间距

用 `clamp()` 让间距在大屏上呼吸：

```css
.section {
  padding-block: clamp(2rem, 5vw, 6rem);
}

.container {
  max-width: clamp(320px, 90vw, 1200px);
  margin-inline: auto;
}
```

---

## 测试：不要只信 DevTools

DevTools 设备模拟对布局有用，但遗漏：

- 真实触控交互
- 真实 CPU/内存限制
- 网络延迟模式
- 字体渲染差异
- 浏览器 chrome/键盘弹出

**至少在以下设备测试**：一台真 iPhone、一台真 Android、如果相关加一台平板。便宜 Android 手机能暴露模拟器永远看不到的性能问题。

---

**避免**：Desktop-first 设计、设备检测代替特性检测、移动端/桌面端分离代码库、忽略平板和横屏、假设所有移动设备性能都好。
