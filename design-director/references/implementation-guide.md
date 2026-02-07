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
  → 为每个页面/路由定义区域
  → 输出：Zone Map（ASCII 图）
  → 交付物：区域地图文档

Step 3: Token 统一
  → 定义统一的 CSS Variables（oklch 色彩空间）
  → 配置 Tailwind data-zone 变体
  → 交付物：app.css（含 @theme + @custom-variant + CSS Variables）

Step 4: 接缝策略
  → 为每个区域边界选择接缝类型
  → 标注在 Zone Map 上
  → 交付物：标注接缝的 Zone Map

Step 5: 区域实现
  → 按区域逐一实现，每个区域委派给对应的 style guide
  → Director 提供软约束覆盖参数
  → 交付物：各区域的实现代码

Step 6: 审查
  → 运行 Director 审查清单（第七章）
  → 运行 frontend-design 审查
  → 交付物：审查报告 + 修复
```

---

## Tailwind 配置策略

### Tailwind v4 CSS-First 配置

Tailwind v4 不再使用 `tailwind.config.ts`，所有主题和变体直接在 CSS 文件中声明。混合风格项目的完整配置如下：

```css
/* app.css — Tailwind v4 CSS-First 配置 */

@import "tailwindcss";

/* === 主题 Token（通过 @theme 注册为 Tailwind 工具类） === */
@theme {
  /* 语义色彩 — 引用 CSS Variables（oklch 色彩空间） */
  --color-background: oklch(var(--background));
  --color-foreground: oklch(var(--foreground));
  --color-card: oklch(var(--card));
  --color-card-foreground: oklch(var(--card-foreground));
  --color-primary: oklch(var(--primary));
  --color-primary-foreground: oklch(var(--primary-foreground));
  --color-secondary: oklch(var(--secondary));
  --color-secondary-foreground: oklch(var(--secondary-foreground));
  --color-muted: oklch(var(--muted));
  --color-muted-foreground: oklch(var(--muted-foreground));
  --color-border: oklch(var(--border));
  --color-ring: oklch(var(--ring));
  --color-destructive: oklch(var(--destructive));

  /* 区域圆角 — 各区域通过 CSS Variable 覆盖 */
  --radius-zone: var(--zone-radius);
}

/* === 区域变体（替代 v3 的 addVariant 插件） === */
@custom-variant zone-expressive (&:is([data-zone="expressive"] *));
@custom-variant zone-minimal (&:is([data-zone="minimal"] *));
@custom-variant zone-swiss (&:is([data-zone="swiss"] *));

/* === 全局共享 Token（所有区域统一） === */
:root {
  --primary: 0.45 0.2 270;           /* 品牌色 — 全局唯一 */
  --primary-foreground: 0.985 0 0;
  --destructive: 0.577 0.245 27.325;
  --ring: 0.708 0 0;
  --foreground: 0.145 0 0;
  --muted-foreground: 0.556 0 0;
}

.dark {
  --foreground: 0.985 0 0;
  --muted-foreground: 0.708 0 0;
}

/* === Minimal 区域（默认表面 Token） === */
:root {
  --background: 1 0 0;
  --card: 0.985 0 0;
  --card-foreground: 0.145 0 0;
  --secondary: 0.97 0 0;
  --secondary-foreground: 0.205 0 0;
  --muted: 0.97 0 0;
  --border: 0.922 0 0;
  --zone-radius: 6px;
}

.dark {
  --background: 0.145 0 0;
  --card: 0.205 0 0;
  --card-foreground: 0.985 0 0;
  --secondary: 0.205 0 0;
  --secondary-foreground: 0.97 0 0;
  --muted: 0.269 0 0;
  --border: 0.269 0 0;
}

/* === Expressive 区域 — 表面 Token 覆盖 === */
[data-zone="expressive"] {
  --background: 0.985 0 0;
  --card: 0.97 0 0;
  --border: 0.88 0 0;
  --zone-radius: 10px;
}

.dark [data-zone="expressive"] {
  --background: 0.08 0 0;
  --card: 0.12 0 0;
  --border: 0.2 0 0;
}

/* === Swiss 区域 — 表面 Token 覆盖 === */
[data-zone="swiss"] {
  --background: 0.985 0 0;
  --card: 1 0 0;
  --border: 0.88 0 0;
  --zone-radius: 0px;
}

.dark [data-zone="swiss"] {
  --background: 0.145 0 0;
  --card: 0.175 0 0;
  --border: 0.25 0 0;
}
```

### 配置要点说明

| 要素 | Tailwind v3 做法（已弃用） | Tailwind v4 做法 |
|------|--------------------------|------------------|
| 主题颜色 | `tailwind.config.ts` → `theme.extend.colors` | `@theme { --color-* }` 直接在 CSS 中声明 |
| 自定义变体 | `plugin(({ addVariant }) => ...)` 在 JS 中 | `@custom-variant` 直接在 CSS 中声明 |
| 暗色模式 | `darkMode: 'class'` 在 config 中 | Tailwind v4 默认支持 `.dark` class 策略 |
| 内容扫描 | `content: ['./src/**/*.{ts,tsx}']` | 自动检测，无需声明 |
| 圆角扩展 | `borderRadius: { zone: ... }` | `--radius-zone` 在 `@theme` 中注册 |

---

## Framer Motion 配置策略

### Zone Motion Provider

使用 React Context 为组件树注入当前区域的动效配置：

```tsx
// lib/zone-motion.tsx
import { createContext, useContext } from 'react'

type ZoneType = 'expressive' | 'minimal' | 'swiss'

interface ZoneMotionConfig {
  spring: { type: "spring"; stiffness: number; damping: number; mass: number }
  reveal: { duration: number; ease: number[] }
  stagger: number
  maxDisplacement: number // 最大入场位移 (px)
}

const configs: Record<ZoneType, ZoneMotionConfig> = {
  expressive: {
    spring: { type: "spring", stiffness: 280, damping: 28, mass: 1 },
    reveal: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    stagger: 0.08,
    maxDisplacement: 40, // Expressive 允许较大位移
  },
  minimal: {
    spring: { type: "spring", stiffness: 260, damping: 20, mass: 1 },
    reveal: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    stagger: 0.06,
    maxDisplacement: 10, // Minimal 严格限制 ≤10px
  },
  swiss: {
    spring: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
    reveal: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    stagger: 0.03,
    maxDisplacement: 4, // Swiss 几乎无位移
  },
}

// 跨区域通用过渡
export const universalTransition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
}

const ZoneMotionContext = createContext<ZoneMotionConfig>(configs.minimal)

export function ZoneProvider({
  zone,
  children
}: {
  zone: ZoneType
  children: React.ReactNode
}) {
  return (
    <ZoneMotionContext.Provider value={configs[zone]}>
      <div data-zone={zone}>
        {children}
      </div>
    </ZoneMotionContext.Provider>
  )
}

export function useZoneMotion() {
  return useContext(ZoneMotionContext)
}
```

### 使用示例

```tsx
// pages/index.tsx — 混合风格页面
import { ZoneProvider } from '@/lib/zone-motion'

export default function HomePage() {
  return (
    <>
      <ZoneProvider zone="expressive">
        <HeroSection />
      </ZoneProvider>

      {/* 渐变接缝 */}
      <GradientSeam from="expressive" to="minimal" />

      <ZoneProvider zone="minimal">
        <FeaturesSection />
        <PricingSection />
      </ZoneProvider>

      {/* 硬边界接缝 */}
      <div className="h-px bg-border" />

      <ZoneProvider zone="minimal">
        <Footer />
      </ZoneProvider>
    </>
  )
}
```

### 全局 Reduced Motion

```tsx
// app/layout.tsx — 全局入口
import { useReducedMotion } from 'framer-motion'

function RootLayout({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <ReducedMotionContext.Provider value={prefersReducedMotion}>
      {children}
    </ReducedMotionContext.Provider>
  )
}
```

组件内部检查：

```tsx
function AnimatedCard({ children }: { children: React.ReactNode }) {
  const motion = useZoneMotion()
  const reducedMotion = useContext(ReducedMotionContext)

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: motion.maxDisplacement }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={reducedMotion ? { duration: 0 } : motion.reveal}
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
