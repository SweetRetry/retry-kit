---
name: minimal-style-guide
description: 极简主义 UI 设计规范，用于创建内容优先、高信噪比的网站/应用。触发场景：(1) 用户要求极简主义设计，(2) 审查 UI 代码是否过度设计，(3) 提到"少即是多"、Bento Grid、信噪比等关键词。强制使用 shadcn/ui + Tailwind CSS + Framer Motion。
---

## 快速参考

| 要素 | 规范 |
|------|------|
| 留白率 | 桌面 40%+, 移动端 15-20% |
| 圆角 | `rounded-md` (6px) 或 `rounded-lg` (8px) |
| Dark 背景 | `#121212` 或 `#1A1A1A`（禁止 #000）|
| Touch Target | ≥44px |
| 强调色 | 全局仅 1 种 |

## 核心指令 (Core Mandate)

构建 **2026 范式的 "智能极简 (Smart Simplicity)"** —— 利用数学秩序和 AI 适应性管理认知负荷。

**强制技术栈:**

- **UI 库:** `shadcn/ui` (移除所有默认装饰性效果)
- **样式引擎:** `Tailwind CSS` (严格限制 Utility Class 范围)
- **动效库:** `Framer Motion` (仅用于模拟物理世界的必然性)

## 一、设计哲学

1. **信噪比最大化:** 每个元素必须有且仅有一个明确功能。删除后不影响功能的元素必须删除。
2. **留白即内容:** 留白是主动的设计元素，用于构建视线流和层级。
3. **排版即界面:** 字体的字重、字号和行高承担 90% 的结构划分任务。
4. **诚实的设计:** 拒绝拟物、拒绝装饰性材质，材质必须服务于层级。

## 二、基础系统

### 1. 空间与呼吸

- **留白率:** 桌面端 **40%+**，移动端 Compact Mode **15-20%**
- **间距系统:** 4px 基准
  - Tight: `4px`, `8px` (组件内部)
  - Loose: `32px`, `64px`, `128px` (区块分割)
- **移动端适配:** `<768px` 时所有 Loose 间距折半 (`my-32` → `my-16`)，Touch Target **≥44px**
- **Bento Grid:** 4列/6列，Gap `16-24px`，Radius `12-24px`

### 2. 几何与形态

- **有形边界:** 内容不能在真空中漂浮
  - 留白 >128px 时引入 **Surface Tones** (`bg-secondary/30`) 或 **Micro-Borders** (`border-border/40`)
  - Section 之间使用极细分割线 (`h-px bg-border/20`)
- **圆角:** 统一使用 `rounded-md` (6px) 或 `rounded-lg` (8px)，仅 Primary Button/Tag 可用全圆角

### 3. 色彩

- **单色主导:** 界面 90% 为无彩色
  - Light: `#ffffff` (Base), `#F9FAFB` (Subtlety)
  - Dark: **禁止纯黑 #000000**，使用 `#121212` 或 `#1A1A1A`
- **单一强调色:** 全局仅一种品牌色，仅用于 Primary Action 或 Active State
- **极简反馈:** 拒绝高饱和度背景色块，仅使用 **文字变色** 或 **1px 侧边指示条**

### 4. 排版体系

- **字体:** `Inter`, `San Francisco`, `Helvetica Now`
- **层级:**
  - H1/Display: 极大字号 + 极细/极粗字重形成强对比
  - Body: 行高 `1.6-1.8`
  - Micro: `text-muted-foreground`
- **无障碍:** 所有文本对比度必须符合 **WCAG AA (>4.5:1)**

## 三、组件实现

### shadcn/ui 极简改造

```tsx
// Button - 移除所有 shadow，优先使用 ghost/link
<Button variant="ghost" className="hover:opacity-80">
  Action
</Button>

// Card - 默认透明，必要时使用极淡背景
<Card className="border-none shadow-none bg-transparent">
  {/* 或 bg-muted/30 */}
</Card>

// Input - 极简线条或极淡填充
<Input className="border-b rounded-none bg-transparent focus-visible:ring-0" />
// 或
<Input className="bg-muted/20 border-none" />
```

### 交互深度

- **Modal/Dialog:** 使用 `backdrop-blur-sm` + 纯色背景，去除投影
- **Dropdown:** 极细边框 (`border border-border/50`)，无投影

### 动效参数

```ts
const minimalMotion = {
  type: "spring",
  stiffness: 260,
  damping: 20, // 无回弹
  mass: 1
};

// 优先使用 Opacity 变化，减少位移
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 }
};
```

## 四、代码审查清单

- [ ] **Structure Check:** 内容是否"漂浮"？需增加 Surface Tone 或 Divider
- [ ] **Subtractive Check:** 还能删除什么而不影响功能？
- [ ] **Whitespace Check:** 尝试将 Margin 翻倍
- [ ] **Color Constraint:** 屏幕上的颜色种类（不含灰阶）是否超过 1 种？
- [ ] **Depths Check:** 是否去除所有不必要的 shadow？
- [ ] **Typography Check:** 文本对比度是否符合 WCAG AA？
- [ ] **Responsive Check:** 移动端是否开启 Compact Mode？Touch Target ≥44px？
- [ ] **OLED Safety:** Dark Mode 背景是否避免纯黑 #000000？

## 五、不适用场景

- 数据密集型 Dashboard（使用 swiss-style-guide）
- 需要丰富视觉层次的品牌营销页
- 游戏或娱乐类应用
