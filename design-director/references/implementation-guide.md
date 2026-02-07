# 实施指南

**Design Director 参考文档 — Tailwind / Framer Motion 配置与项目启动清单**

---

## 项目启动清单

启动一个混合风格项目时，按以下顺序执行：

```
Step 1: 项目诊断
  → 运行 Director 的诊断矩阵
  → 输出：主风格 + 辅风格 + 配比
  → 交付物：诊断报告（1-2 段文字）

Step 2: 区域映射
  → 为每个路由/视图定义风格归属
  → 输出：Zone Map（ASCII 路由结构图）
  → 交付物：区域地图文档

Step 3: Token 定义
  → 根据项目品牌调性，确定唯一一套 Token 值（:root + .dark）
  → Token 与区域无关，全局统一
  → 交付物：globals.css（含 :root + .dark + @theme inline）

Step 4: 接缝策略
  → 为每个区域边界选择接缝类型（优先结构性接缝）
  → 标注在 Zone Map 上
  → 交付物：标注接缝的 Zone Map

Step 5: 区域实现
  → 按区域逐一实现，每个区域委派给对应的 style guide
  → Director 提供软约束覆盖参数
  → 不同区域的视觉差异通过组件选择和布局模式实现，而非 Token 覆盖
  → 交付物：各区域的实现代码

Step 6: 审查
  → 运行 Director 审查清单（第七章）
  → 运行 frontend-design 审查
  → 交付物：审查报告 + 修复
```

---

## Tailwind v4 CSS-First 配置

### Token 基础设施

Tailwind v4 不再使用 `tailwind.config.ts`，所有配置直接在 CSS 文件中声明。混合风格项目的 Token 配置遵循 shadcn/ui 标准模式：

```css
/* globals.css — 项目唯一的 Token 定义文件 */

@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* === 唯一一套 Token — Light Mode === */
:root {
  --background: oklch(0.08 0.02 260);     /* 品牌画布 */
  --foreground: oklch(0.95 0.01 260);     /* 主文字 */
  --primary: oklch(0.7 0.25 290);         /* 品牌色 — 全局唯一 */
  --primary-foreground: oklch(0.08 0.02 260);
  --card: oklch(0.12 0.015 260);
  --card-foreground: oklch(0.95 0.01 260);
  --secondary: oklch(0.18 0.02 260);
  --secondary-foreground: oklch(0.95 0.01 260);
  --muted: oklch(0.15 0.015 260);
  --muted-foreground: oklch(0.55 0.02 260);
  --accent: oklch(0.2 0.025 260);
  --accent-foreground: oklch(0.95 0.01 260);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.22 0.02 260);
  --input: oklch(0.22 0.02 260);
  --ring: oklch(0.7 0.25 290);
  --chart-1: oklch(0.7 0.25 290);
  --chart-2: oklch(0.7 0.2 200);
  --chart-3: oklch(0.75 0.2 340);
  --chart-4: oklch(0.8 0.18 90);
  --chart-5: oklch(0.72 0.2 155);
  --radius: 0.5rem;
}

/* === 唯一一套 Token — Dark Mode（如需） === */
.dark {
  --background: oklch(0.08 0.02 260);
  --foreground: oklch(0.95 0.01 260);
  /* ... 暗色模式覆盖值 */
}

/* === @theme inline 将 CSS Variables 映射为 Tailwind 工具类 === */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 配置要点

| 要素 | 说明 |
|------|------|
| **Token 数量** | 一个项目只有**一套** Token（`:root` + `.dark`），与风格区域无关 |
| **色彩空间** | 所有值使用 oklch。Expressive 原始的 HSL 值需转换 |
| **@theme inline** | 将 CSS Variables 映射为 Tailwind 工具类（`bg-background`、`text-primary` 等） |
| **@custom-variant dark** | 暗色模式变体，与 next-themes 的 `.dark` class 策略配合 |
| **@layer base** | 全局基础样式（边框色、文字色） |
| **--radius** | 圆角基准值。注意这是全局值，不同风格区域的组件通过直接使用 `rounded-none` / `rounded-lg` 等类来表达差异 |

### 区域差异的实现方式

不同风格区域共享同一套 Token，通过**组件代码和布局类**表达视觉差异：

```tsx
// Expressive 区域的组件 — 使用 rounded-lg、shadow、大位移动效
function ExpressiveCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="rounded-lg bg-card border border-border shadow-lg"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
    >
      {children}
    </motion.div>
  )
}

// Swiss 区域的组件 — 使用 rounded-none、无 shadow、几乎无位移
function SwissCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="rounded-none bg-card border border-border"
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// 两个组件使用同一个 bg-card、border-border Token — 颜色完全相同
// 差异来自：rounded 值、shadow、动效参数
```

---

## Framer Motion 动效配置策略

### 区域动效配置对象

不同风格区域的动效差异通过配置对象管理，可用 React Context 注入，也可直接在组件中引用：

```tsx
// lib/motion-presets.ts

export type StyleZone = 'expressive' | 'minimal' | 'swiss'

export interface MotionPreset {
  spring: { type: "spring"; stiffness: number; damping: number; mass: number }
  reveal: { duration: number; ease: number[] }
  stagger: number
  maxDisplacement: number // 最大入场位移 (px)
}

export const motionPresets: Record<StyleZone, MotionPreset> = {
  expressive: {
    spring: { type: "spring", stiffness: 280, damping: 28, mass: 1 },
    reveal: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    stagger: 0.08,
    maxDisplacement: 40,
  },
  minimal: {
    spring: { type: "spring", stiffness: 260, damping: 20, mass: 1 },
    reveal: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    stagger: 0.06,
    maxDisplacement: 10,
  },
  swiss: {
    spring: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
    reveal: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    stagger: 0.03,
    maxDisplacement: 4,
  },
}

// 跨区域通用过渡
export const universalTransition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
}
```

### 使用方式

路由级别的风格区域通常整个路由使用同一套动效预设，直接 import 即可：

```tsx
// app/(dashboard)/dashboard/page.tsx — Swiss 风格路由
import { motionPresets } from '@/lib/motion-presets'

const motion = motionPresets.swiss

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: motion.maxDisplacement }}
      animate={{ opacity: 1, y: 0 }}
      transition={motion.reveal}
    >
      {/* Swiss 风格的 Dashboard 内容 */}
    </motion.div>
  )
}
```

### 全局 Reduced Motion

```tsx
// app/layout.tsx — 全局入口
"use client"

import { useReducedMotion } from 'framer-motion'
import { createContext } from 'react'

export const ReducedMotionContext = createContext(false)

function RootLayout({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <ReducedMotionContext.Provider value={prefersReducedMotion ?? false}>
      {children}
    </ReducedMotionContext.Provider>
  )
}
```

组件内部检查：

```tsx
function AnimatedCard({ children, preset }: { children: React.ReactNode; preset: MotionPreset }) {
  const reducedMotion = useContext(ReducedMotionContext)

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: preset.maxDisplacement }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={reducedMotion ? { duration: 0 } : preset.reveal}
    >
      {children}
    </motion.div>
  )
}
```

---

## 参考文献

### 设计理论与历史

1. Müller-Brockmann, J. (1961). *The Graphic Artist and His Design Problems*. 瑞士国际主义设计的奠基著作。
2. Rams, D. (1976). *Ten Principles for Good Design*. 功能主义设计的核心原则。
3. Tufte, E. R. (1990). *Envisioning Information*. 信息密度与视觉层级的经典研究。
4. Norman, D. A. (2013). *The Design of Everyday Things* (Revised Edition). 可用性和认知负荷理论。

### 认知心理学

5. Miller, G. A. (1956). "The Magical Number Seven, Plus or Minus Two." *Psychological Review*. 工作记忆容量的经典研究。
6. Sweller, J. (1988). "Cognitive Load During Problem Solving." *Cognitive Science*. 认知负荷理论的基础。
7. Godden, D. R., & Baddeley, A. D. (1975). "Context-dependent memory in two natural environments." *British Journal of Psychology*. 情境依赖记忆的实验研究——接缝设计的理论基础。
8. Kahneman, D. (2011). *Thinking, Fast and Slow*. 系统 1 和系统 2 与用户界面快速判断的关系。

### 色彩科学

9. Ottosson, B., & Lilley, C. (2022). "OKLCH: A perceptual color space for CSS." *W3C CSS Color Level 4*. oklch 色彩空间的规范。
10. Stone, M. C. (2003). *A Field Guide to Digital Color*. 数字色彩理论的实用指南。

### Web 技术标准

11. W3C. (2023). *CSS Color Level 4*. oklch() 函数规范和色彩插值。
12. W3C. (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*. 无障碍对比度和运动安全标准。
13. Google. (2024). *Core Web Vitals*. 性能指标与渐变/动效的性能权衡。

### 建筑学与空间理论

14. Zumthor, P. (2006). *Atmospheres: Architectural Environments – Surrounding Objects*. 空间氛围与情绪的关系——接缝设计的建筑学灵感。
15. Lynch, K. (1960). *The Image of the City*. 城市空间的可读性——数字界面区域划分的类比。
