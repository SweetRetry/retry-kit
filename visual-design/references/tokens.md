# Token 与工程落地

把视觉决策转化为可维护的代码。Token 是**设计意图的工程表达**。

---

## Token 变更策略

| 模式 | 改动范围 | 典型动作 |
|------|---------|---------|
| `Preserve` | 组件级 class | 修正对比度、边界，保持现有体系 |
| `Elevate` | 页面级 + 少量语义 token | 增强层级，不改核心变量 |
| `Forge` | 全局变量 + 组件级 class | 重设视觉语言，同步组件映射 |

---

## Token 双层架构

用两层：**原始 token**（`--blue-500`）和**语义 token**（`--color-primary: var(--blue-500)`）。深色模式只重定义语义层——原始 token 不变。

语义化命名：`--text-body`、`--text-heading`，不要 `--font-size-16`。

> 语义 token 与 Tailwind class 的详细映射（`bg-background`、`text-foreground` 等）由 `frontend-code-corrector` skill 管理。本文件只关注**如何定义和组织 token 变量**。

---

## 色彩 Token

### OKLCH 变量定义

```css
--primary: oklch(60% 0.15 250);
--primary-light: oklch(85% 0.08 250);  /* 明度升高时降低 chroma */
--primary-dark: oklch(35% 0.12 250);

/* 用 color-mix 做变体 */
--primary-hover: color-mix(in oklch, var(--primary), black 10%);
--primary-subtle: color-mix(in oklch, var(--primary), transparent 90%);
```

### Tinted Neutral

```css
/* 暖调灰（品牌暖感）—— chroma 0.01 微小但可感知 */
--gray-100: oklch(95% 0.01 60);
--gray-900: oklch(15% 0.01 60);

/* 冷调灰（科技、专业） */
--gray-100: oklch(95% 0.01 250);
--gray-900: oklch(15% 0.01 250);
```

### 深色模式 Token

不是反转亮色模式——需要独立设计：

| 差异 | 亮色模式 | 深色模式 |
|------|---------|---------|
| 深度 | 阴影 | 更亮的表面色（无阴影） |
| 文字 | 深色文字 | 亮色文字（降低字重） |
| 强调色 | 鲜艳 | 略降饱和度 |
| 背景 | 白色 | 暗灰 oklch(12-18%)，永不纯黑 |

```css
:root[data-theme="dark"] {
  --surface-1: oklch(15% 0.01 250);
  --surface-2: oklch(20% 0.01 250);  /* "更高" = 更亮 */
  --surface-3: oklch(25% 0.01 250);
  --body-weight: 350;  /* 深色背景上减轻字重 */
}
```

---

## 动效 Token

```css
:root {
  /* 时长 */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  /* 缓动 */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* 常用组合 */
  --transition-default: var(--duration-fast) var(--ease-out-quart);
  --transition-enter: var(--duration-normal) var(--ease-out-expo);
  --transition-exit: var(--duration-instant) var(--ease-in);
}
```

---

## 间距 Token

```css
:root {
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-6: 24px;  --space-8: 32px;
  --space-12: 48px; --space-16: 64px; --space-24: 96px;
}
```

---

## 变更示例

```txt
/* Preserve */
Before: className="bg-white text-zinc-900 border-zinc-200"
After : className="bg-card text-foreground border-border"

/* Elevate */
Before: className="bg-background"
After : className="bg-background md:bg-muted/30"

/* Forge */
Before: --primary: 222.2 47.4% 11.2%;    /* HSL */
After : --primary: oklch(45% 0.18 250);   /* OKLCH */
```

---

## 裸色使用白名单

允许使用裸色的场景：数据可视化分组色、品牌素材不可替换色。必须写明原因 + 提供回退 token。

---

## 可访问性硬门槛

### 对比度

| 内容 | AA 最低 | AAA 目标 |
|------|---------|---------|
| 正文（< 18pt） | 4.5:1 | 7:1 |
| 大文字 / UI 组件 / 图标 | 3:1 | 4.5:1 |

**注意**：placeholder 也需要 4.5:1。灰色文字在彩色背景上——用背景色的深色版本。

### 焦点样式

```css
button:focus { outline: none; }
button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

焦点环：对比度 ≥ 3:1、2-3px 粗、偏移外部、所有交互元素一致。

### 触控目标

移动端 ≥ 44×44px，推荐 ≥ 48×48px。

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 常见错误

| 错误 | 修正 |
|------|------|
| 裸色写死在 class | 替换为语义 token |
| 同屏多个主色 | 收敛到 1 主 + 1 强调 |
| 大量 rgba/hsla | 定义明确的覆盖色 |
| HSL 做色阶 | 迁移到 OKLCH |
| 深色模式简单反转 | 独立设计深色 token |
