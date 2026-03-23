# 视觉技法库

技法是**增强表达的工具**，不是必选项。原则是骨架，技法是衣裳。

**核心原则**：
- 结构优先于技法
- 每个技法必须回答"它解决了什么问题"
- 技法过多 = 噪音

---

## 技法评估框架

在添加任何技法前，问自己：

1. **必要性**：这个技法服务什么目标？（可读性/聚焦/反馈/品牌）
2. **节制性**：同屏已有多少技法？（重技法 ≤2）
3. **降级性**：移动端和 reduced-motion 如何处理？
4. **回退性**：如果失效，静态样式是否依然可用？

---

## 动效技法

### Duration：100/300/500 法则

时序比缓动更重要。这些时长在大多数 UI 中感觉正确：

| 时长 | 用途 | 示例 |
|------|------|------|
| **100-150ms** | 即时反馈 | 按钮按下、开关、颜色变化 |
| **200-300ms** | 状态变化 | 菜单展开、tooltip、hover |
| **300-500ms** | 布局变化 | 手风琴、modal、抽屉 |
| **500-800ms** | 入场动画 | 页面加载、Hero 渐显 |

**退出动画比进入更快**——用进入时长的 ~75%。

### 缓动：选对曲线

**不要用 `ease`**。它是妥协，很少最优。

| 曲线 | 用途 | CSS |
|------|------|-----|
| **ease-out** | 元素进入 | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **ease-in** | 元素离开 | `cubic-bezier(0.7, 0, 0.84, 0)` |
| **ease-in-out** | 状态切换 | `cubic-bezier(0.65, 0, 0.35, 1)` |

**微交互用指数曲线**——模拟真实物理（摩擦、减速）：

```css
/* Quart out - 平滑精致（推荐默认值） */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
/* Quint out - 稍更戏剧性 */
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
/* Expo out - 干脆、自信 */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

**避免 bounce 和 elastic 曲线**。2015 年潮流，现在显得俗气。真实物体不弹跳——它们平滑减速。过冲效果把注意力吸引到动画本身而非内容。

### 只动两个属性

**transform** 和 **opacity** 只此两个——其他都触发布局重计算。

高度动画（手风琴）用 `grid-template-rows: 0fr → 1fr`，不要直接动 `height`。

### Stagger 动画

用 CSS 自定义属性做更干净的错开：

```css
.item { animation-delay: calc(var(--i, 0) * 50ms); }
```
```html
<div class="item" style="--i: 0">...</div>
<div class="item" style="--i: 1">...</div>
```

**总 stagger 时间封顶**——10 个元素 × 50ms = 500ms。元素多时降低单元素延迟或限制 stagger 数量。

### Reduced Motion（非可选）

前庭功能障碍影响 ~35% 的 40 岁以上成人。

```css
/* 替代方案：空间运动 → 淡入淡出 */
@media (prefers-reduced-motion: reduce) {
  .card {
    animation: fade-in 200ms ease-out;  /* 代替 slide-up */
  }
}
```

**保留的功能动画**：进度条、加载旋转（减速）、焦点指示器——只去掉空间移动。

### 感知性能

**没人关心你网站有多快——只关心它感觉有多快。**

- **80ms 阈值**：大脑缓冲感知输入约 80ms 来同步。80ms 以内感觉即时。这是微交互的目标
- **主动 vs 被动等待**：被动等待（盯着 spinner）感觉更长。策略：
  - **预先开始**：加载时立即开始过渡（skeleton UI）
  - **提前完成**：渐进展示内容，不要等全部加载完
  - **Optimistic UI**：立即更新界面，后台同步。用于低风险操作；支付和破坏性操作不用
- **缓动影响感知时长**：ease-in（向完成加速）让任务感觉更短，因为峰终效应更重视最后时刻

---

## 排版工程技法

### 字体加载优化

布局偏移（CLS）的修复——匹配回退字体度量：

```css
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}

@font-face {
  font-family: 'CustomFont-Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 90%;
  descent-override: 20%;
  line-gap-override: 10%;
}

body {
  font-family: 'CustomFont', 'CustomFont-Fallback', sans-serif;
}
```

工具：[Fontaine](https://github.com/unjs/fontaine) 自动计算 override 值。

### OpenType 精致度提升

```css
.data-table { font-variant-numeric: tabular-nums; }   /* 表格数字对齐 */
.recipe { font-variant-numeric: diagonal-fractions; }  /* 分数 */
abbr { font-variant-caps: all-small-caps; }            /* 缩写词小型大写 */
code { font-variant-ligatures: none; }                 /* 代码禁用连字 */
body { font-kerning: normal; }                         /* 字距调整 */
```

### Fluid Type 公式

```css
/* 标题：流式缩放 */
.hero-title {
  font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
}

/* 正文：固定 rem，不用 fluid */
body { font-size: 1rem; }
```

中间值（`5vw + 1rem`）控制缩放速率。加 rem 偏移防止小屏幕缩到 0。

---

## 结构技法

### Bento Grid

**效果**：通过网格主次创造视觉层次
**实现**：`grid-cols-[2fr_1fr]` + 主卡 `row-span-2`
**适用**：信息块 ≥4，且重要性不均
**回退**：等宽两列 → 单列

---

### Spotlight Border

**效果**：鼠标驱动的边框高光，创造焦点
**实现**：CSS 渐变边框 + 鼠标位置追踪
**适用**：需要突出单一焦点卡片
**注意**：移动端关闭（无 hover）
**回退**：静态渐变描边

---

### Parallax / Depth Layer

**效果**：多层滚动速度不同，创造深度感
**实现**：不同 `transform: translateY` 速率
**适用**：品牌叙事页、情感型首屏
**风险**：性能、眩晕感
**回退**：静态层叠布局

---

## 氛围技法

### Mesh Gradient

**效果**：有机流动的色彩背景
**实现**：CSS 动画渐变或 WebGL
**参数**：颜色 ≤3，周期 ≥8s，低饱和度
**适用**：品牌氛围、暗色模式背景
**回退**：静态渐变

---

### Grain Texture

**效果**：细微噪点质感，减少数字冰冷感
**实现**：SVG 噪点滤镜，透明度 2-5%
**适用**：深色背景、大面积纯色区
**回退**：纯渐变/纯色

---

### Glassmorphism

**效果**：半透明毛玻璃质感
**实现**：`backdrop-blur` + 半透明背景
**适用**：浮层、导航、卡片叠加
**风险**：可读性（需确保背景对比）
**回退**：纯色半透明背景

---

## 交互技法

### Command Input

**效果**：命令行式输入框，循环占位文案
**实现**：打字机动画或淡入淡出
**参数**：循环频率低，避免干扰输入
**适用**：搜索、命令面板
**回退**：静态 placeholder

---

### Live Status Pulse

**效果**：实时状态的轻柔呼吸动画
**实现**：状态点缩放或透明度变化
**参数**：周期 2-3s，幅度小
**适用**：实时数据、在线状态
**回退**：静态纯色指示

---

### Micro-interactions

**效果**：精细的按钮/卡片反馈
**实现**：
- `whileTap={{ scale: 0.97 }}` — 按压感
- `whileHover={{ y: -2 }}` — 浮起感
**适用**：主 CTA、可点击卡片
**原则**：限定单个焦点元素，不全局使用

---

## 强度上限

| 限制项 | 上限 | 原因 |
|--------|------|------|
| 同屏重技法 | 2 个 | 防止噪音过载 |
| 单屏主焦点 | 1 个 | 决策疲劳 |
| CTA 数量 | 2 个（1 主 1 次）| 行动清晰度 |
| 动画层级 | 3 层 | 性能与认知负荷 |

**重技法定义**：Parallax、Infinite Carousel、Spotlight Border、Mesh Gradient

---

## 动效性能

- 不要预防性使用 `will-change`——只在动画即将发生时（`:hover`、`.animating`）
- 滚动触发动画用 Intersection Observer，不要监听 scroll 事件；动画一次后 unobserve
- 创建动效 token 保持一致性（时长、缓动、常用过渡）

---

## 技法输出模板

```md
技法：<name>
服务目标：<可读性/聚焦/反馈/品牌>
实现要点：
- 核心代码/参数
- 触发条件

降级策略：
- mobile: <处理方式>
- reduced-motion: <处理方式>

验证：
- [ ] 不阻塞交互
- [ ] 60fps 流畅
- [ ] 回退可用
```

---

## 一句话原则

> "技法应该像好的配乐——存在时能感受，消失时不觉得缺。"
>
> 如果去掉一个技法，页面依然成立，它就是好的加法。
> 如果去掉一个技法，页面就崩塌了，它就是坏的依赖。
