---
name: color-palette
description: >
  产品级配色方案生成与 shadcn/ui design token 输出。通过 3 问诊断产品意图，基于多种色彩来源（中国传统色、Radix Colors、Open Color、Tailwind CSS Colors），
  输出可直接使用的 globals.css design tokens。
  触发场景：(1) 用户需要为项目生成配色方案或 design tokens，
  (2) 用户提到"配色"、"color palette"、"design tokens"、"globals.css"、"主题色"等关键词，
  (3) 用户希望基于特定色彩来源（中国传统色、Radix、Open Color、Tailwind）生成方案，
  (4) 用户需要将配色方案映射为 shadcn/ui globals.css。
---

# Color Palette

产品级配色方案生成器。通过产品意图诊断，从多种色彩来源中选色，输出 shadcn/ui `globals.css` design tokens。

## 工作流总览

```
1. 诊断  → 向用户提 3 个问题（产品类型 / 品牌调性 / 目标用户）
2. 推荐  → 基于诊断结果，输出推荐色板来源 + 色彩参数，获得用户确认
3. 选色  → 从推荐来源中按五角色模型挑选配色方案，获得用户确认
4. 输出  → 生成完整 globals.css（:root + .dark + @theme inline + @layer base）
```

每个阶段需要用户确认后再进入下一阶段。

---

## I. 色彩来源

### 内置数据

**中国传统色** — `references/chinese-traditional.json`（526 色，oklch 格式）

```json
{"乳白": {"group": "yellow", "oklch": "oklch(0.96 0.032 97.3)"}, ...}
```

- 色系（11 个）：`orange`(102) · `red`(101) · `pink`(65) · `green`(48) · `yellow`(43) · `blue`(43) · `gray`(42) · `brown`(41) · `cyan`(34) · `black`(4) · `purple`(3)
- 使用场景：国风、文化类产品，或用户明确要求中国传统色

### 外部色彩系统（Claude 内置知识）

| 来源 | 规模 | 特点 | 适用场景 |
|------|------|------|----------|
| **Radix Colors** | 30 色阶 × 12 级 | 专为 UI 设计，内置可访问性对比度 | SaaS、工具类产品 |
| **Open Color** | 13 色系 × 10 级 | 简洁、通用、高可读性 | 通用 Web 项目 |
| **Tailwind CSS Colors** | 22 色系 × 11 级 | 生态最广、开发者最熟悉 | 已使用 Tailwind 的项目 |

- 使用这三个来源时，直接基于已知色值工作，所有值输出前转换为 oklch
- 可跨来源混合选色（如主色从 Tailwind 取、强调色从中国传统色取）

---

## II. 产品意图诊断 SOP

**在输出任何配色方案前，必须完成以下 3 问诊断。**

### 问题 1：产品类型

> 你的产品属于哪个类型？

| 选项 | 典型特征 |
|------|----------|
| SaaS / 后台工具 | 大量表格、表单、数据面板，需要长时间使用不疲劳 |
| 电商 / 交易 | 强调信任感和行动引导，CTA 突出 |
| 内容 / 媒体 | 阅读为主，色彩克制，内容优先 |
| 工具 / 效率 | 简洁功能导向，低干扰 |
| 社交 / 社区 | 活跃、互动性强，个性化 |
| 文化 / 品牌 | 强文化调性，视觉表达为核心 |

### 问题 2：品牌调性

> 你希望品牌传递什么感觉？

| 选项 | 色彩方向 |
|------|----------|
| 专业严肃 | 低饱和、冷色调、高对比度 |
| 活泼年轻 | 中高饱和、暖色或多色、圆润 |
| 温暖亲和 | 暖色中低饱和、柔和过渡 |
| 极客科技 | 冷色、高对比、深色优先 |
| 文化国风 | 中国传统色优先、特定色系组合 |
| 克制高级 | 极低饱和、大面积留白、单色系 |

### 问题 3：目标用户

> 产品的核心用户是？

| 选项 | 影响 |
|------|------|
| B 端专业用户 | 严格对比度、低疲劳、信息密度优先 |
| C 端大众 | 友好、清晰、情感引导 |
| 创意设计师 | 审美敏感、允许更大胆配色 |
| 开发者 | 深色模式重要、代码风格审美 |

### 诊断决策表

品牌调性是主要决策轴，产品类型和目标用户作为修正因子：

| 品牌调性 | 推荐来源 | 色温 | 饱和度 | Primary L | 对比度 |
|----------|----------|------|--------|-----------|--------|
| 专业严肃 | Radix | 冷 | 低 C<0.05 | 0.40-0.55 | AAA |
| 活泼年轻 | Open Color / Tailwind | 暖 | 高 C>0.15 | 0.50-0.65 | AA |
| 温暖亲和 | Tailwind / Open Color | 暖 | 中 0.05-0.15 | 0.55-0.65 | AA |
| 极客科技 | Radix / Tailwind | 冷 | 中 0.05-0.15 | 0.45-0.55 | AA |
| 文化国风 | 中国传统色 | 暖 | 中-高 0.08-0.20 | 0.45-0.60 | AA |
| 克制高级 | Radix | 中性 | 极低 C<0.03 | 0.35-0.50 | AAA |

**修正规则**：
- 产品类型为 SaaS / 工具 → 对比度升一级（AA→AAA），饱和度降一档
- 目标用户为 B 端专业用户 → 背景 L ≥ 0.95（更白），减少视觉疲劳
- 目标用户为开发者 → dark mode 为主模式，优先验证 dark 配色

### 诊断输出

基于决策表，向用户输出：

1. **推荐色板来源**（1-2 个）
2. **色温方向**（冷/暖/中性）
3. **饱和度区间**（含具体 C 值范围）
4. **明度策略**（background L 范围、primary L 范围）
5. **对比度要求**（AA / AAA）

将诊断结论明确告知用户，获得确认后再进入配色阶段。

---

## III. 配色方案生成

### 五角色模型

每个方案必须覆盖 5 个色彩角色：

| 角色 | 功能 | 选色约束 |
|------|------|----------|
| **主色 Primary** | 品牌识别、CTA、关键交互 | 诊断推荐饱和度区间内，H 值符合色温方向 |
| **辅色 Secondary** | 次要按钮、标签、辅助信息 | 与主色同温但饱和度更低，或互补色的低饱和版本 |
| **强调色 Accent** | 高亮、通知、特殊状态 | 与主色色相距离 ≥ 60°，提供视觉跳跃 |
| **中性色 Neutral** | 文字、边框、分隔线 | C < 0.02，保留极微色彩倾向（暖中性 / 冷中性） |
| **背景色 Background** | 页面底色、卡片底色 | L ≥ 0.90（light）/ L ≤ 0.20（dark），与主色同温 |

### 色板选色策略

根据诊断推荐来源执行：

**中国传统色**：从 `references/chinese-traditional.json` 中查询，按色系和 L 值筛选，oklch 值必须与数据文件完全一致。

**Radix / Open Color / Tailwind**：基于已知色值直接选取，引用时标注来源和色阶名（如 `Tailwind blue-600`、`Radix indigo-9`）。

**混合选色**：允许跨来源组合，但同一角色层级内（如 primary + primary-foreground）应来自同一色系以保证和谐。

### 配色方案输出格式

```
## 配色方案：{方案名称}

**诊断依据**：{产品类型} · {品牌调性} · {目标用户}
**色板来源**：{使用的来源}

| 角色 | 色名/色阶 | oklch | 来源 | 用途 |
|------|-----------|-------|------|------|
| 主色 | blue-600 | oklch(0.55 0.20 262) | Tailwind | CTA、品牌色 |
| ... | ... | ... | ... | ... |
```

用户确认方案后，进入 token 映射阶段。

---

## IV. shadcn/ui Token 映射

### 映射规则

| Token | 选色策略 |
|-------|---------|
| `--background` | 背景色（L ≥ 0.90） |
| `--foreground` | 深色（L ≤ 0.35），与 background 对比度 ≥ 7:1 |
| `--card` / `--popover` | 辅色的浅色版本，比 background 略有色彩倾向 |
| `--card-foreground` / `--popover-foreground` | 同 foreground |
| `--primary` | 主色 |
| `--primary-foreground` | 与 primary 高对比色（深色主色用白/浅，浅色主色用深色） |
| `--secondary` | 辅色 |
| `--secondary-foreground` | 与 secondary 高对比色 |
| `--accent` | 强调色 |
| `--accent-foreground` | 与 accent 高对比色 |
| `--muted` | 中性色浅色版（L 0.90-0.95，C < 0.02） |
| `--muted-foreground` | 中性色中等明度（L 0.40-0.50） |
| `--border` / `--input` | 中性色（L 0.80-0.88） |
| `--ring` | 同 primary |
| `--destructive` | 红系色（从选定来源取红色系），若主色为红系则选更深/更饱和的红色以区分 |
| `--destructive-foreground` | 极浅色，与 destructive 对比 ≥ 4.5:1 |
| `--chart-1` ~ `--chart-5` | 按角色取色：主色 → 强调色 → 辅色 → 互补色 → 中性色变体，确保相邻色相差 ≥ 30° |
| `--sidebar-background` | 辅色浅色版本 |
| `--sidebar-foreground` | 同 foreground |
| `--sidebar-primary` | 比主色深一级的同色系色 |
| `--sidebar-primary-foreground` | 与 sidebar-primary 高对比 |
| `--sidebar-accent` | 强调色浅色版本 |
| `--sidebar-accent-foreground` | 与 sidebar-accent 高对比 |
| `--sidebar-border` | 同 border |
| `--sidebar-ring` | 同 ring |

### Dark Mode 规则

- **`--primary` 保持品牌色相**：H 值不变，C 可微调，L 提升至 0.65-0.80 区间以确保在深色背景上可读
- **`--background`**：极深色（L 0.13-0.18），保留主色的色彩倾向（H 相近），避免纯黑
- **`--foreground`**：极浅色（L ≥ 0.90）
- **中性 token**（muted/border/input）：L 值整体下移，保持相对层次关系
- **暖色 accent 降温**：若 light 模式 accent 为高饱和暖色（H < 60），dark 模式降低 C 值以减少暗底刺激
- **允许基于来源色做微调**：dark mode 可在来源色基础上调整 L/C 值（±0.05），不必严格匹配数据库原值

---

## V. 输出格式

输出完整 `globals.css`，遵循 shadcn/ui 标准结构：

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.98 0.005 90);    /* Tailwind stone-50 */
  --foreground: oklch(0.15 0.010 90);    /* Tailwind stone-950 */
  /* ... 全部 token ... */
}

.dark {
  --background: oklch(0.15 0.010 90);    /* Tailwind stone-950 */
  --foreground: oklch(0.98 0.005 90);    /* Tailwind stone-50 */
  /* ... 全部 token ... */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... 全部 @theme 映射 ... */
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
```

### 输出要求

1. **每个 token 值后必须注释标注来源色名**（如 `/* 朱砂 */`、`/* Tailwind blue-600 */`、`/* Radix indigo-9 */`）
2. **必须包含所有 shadcn/ui token**：background, foreground, card, card-foreground, popover, popover-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, destructive-foreground, border, input, ring, chart-1~5, sidebar-background, sidebar-foreground, sidebar-primary, sidebar-primary-foreground, sidebar-accent, sidebar-accent-foreground, sidebar-border, sidebar-ring
3. **所有值使用 oklch 色彩空间**
4. **`@custom-variant dark` 写法**：`(&:is(.dark *))`

---

## VI. 注意事项

- **中国传统色数据完整性**：使用中国传统色时，色名和 oklch 值必须与 `references/chinese-traditional.json` 完全一致，不可编造色名或修改精度
- **外部色彩系统准确性**：引用 Radix / Open Color / Tailwind 色值时，确保色阶名和 hex 值准确，转 oklch 时保留 3 位小数
- **WCAG 对比度验证**：正文文字 ≥ 4.5:1（AA），标题/大字 ≥ 3:1（AA），推荐在输出后列出关键对比度数值
- **不可混用色彩空间**：输出中不得出现 hsl() 或 rgb()，统一 oklch
- **一个项目一套 token**：不创建多个 `:root` 或 `[data-zone]` 分区，遵循全局单 token 集原则
- **SOP 不可跳过**：即使用户直接给出了色值偏好，也应先完成 3 问诊断以确保方案完整性（诊断可结合用户已表达的偏好快速完成）

---

## VII. 端到端示例

**输入**：用户回答 → SaaS 后台工具 / 专业严肃 / B 端专业用户

**诊断输出**：Radix · 冷色 · 低饱和 C<0.05 · Primary L 0.40-0.55 · 背景 L ≥ 0.95 · AAA

**配色方案**：

| 角色 | 色阶 | oklch | 来源 |
|------|------|-------|------|
| 主色 | indigo-9 | oklch(0.48 0.155 264) | Radix |
| 辅色 | slate-3 | oklch(0.94 0.006 264) | Radix |
| 强调色 | teal-9 | oklch(0.56 0.115 180) | Radix |
| 中性色 | slate-8 | oklch(0.55 0.015 264) | Radix |
| 背景色 | slate-1 | oklch(0.99 0.002 264) | Radix |

**输出片段**（globals.css）：

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.99 0.002 264);         /* Radix slate-1 */
  --foreground: oklch(0.21 0.020 264);         /* Radix slate-12 */
  --card: oklch(0.97 0.004 264);               /* Radix slate-2 */
  --card-foreground: oklch(0.21 0.020 264);    /* Radix slate-12 */
  --popover: oklch(0.97 0.004 264);            /* Radix slate-2 */
  --popover-foreground: oklch(0.21 0.020 264); /* Radix slate-12 */
  --primary: oklch(0.48 0.155 264);            /* Radix indigo-9 */
  --primary-foreground: oklch(0.98 0.005 264); /* Radix indigo-1 */
  --secondary: oklch(0.94 0.006 264);          /* Radix slate-3 */
  --secondary-foreground: oklch(0.31 0.020 264); /* Radix slate-11 */
  --accent: oklch(0.56 0.115 180);             /* Radix teal-9 */
  --accent-foreground: oklch(0.98 0.008 180);  /* Radix teal-1 */
  --muted: oklch(0.94 0.006 264);              /* Radix slate-3 */
  --muted-foreground: oklch(0.55 0.015 264);   /* Radix slate-8 */
  --destructive: oklch(0.55 0.200 27);         /* Radix red-9 */
  --destructive-foreground: oklch(0.98 0.008 27); /* Radix red-1 */
  --border: oklch(0.88 0.008 264);             /* Radix slate-6 */
  --input: oklch(0.88 0.008 264);              /* Radix slate-6 */
  --ring: oklch(0.48 0.155 264);               /* Radix indigo-9 */
  --chart-1: oklch(0.48 0.155 264);            /* Radix indigo-9 */
  --chart-2: oklch(0.56 0.115 180);            /* Radix teal-9 */
  --chart-3: oklch(0.58 0.165 305);            /* Radix purple-9 */
  --chart-4: oklch(0.65 0.150 55);             /* Radix amber-9 */
  --chart-5: oklch(0.55 0.015 264);            /* Radix slate-8 */
  --sidebar-background: oklch(0.94 0.006 264); /* Radix slate-3 */
  --sidebar-foreground: oklch(0.21 0.020 264); /* Radix slate-12 */
  --sidebar-primary: oklch(0.40 0.140 264);    /* Radix indigo-10 */
  --sidebar-primary-foreground: oklch(0.98 0.005 264); /* Radix indigo-1 */
  --sidebar-accent: oklch(0.88 0.040 180);     /* Radix teal-4 */
  --sidebar-accent-foreground: oklch(0.30 0.060 180);  /* Radix teal-11 */
  --sidebar-border: oklch(0.88 0.008 264);     /* Radix slate-6 */
  --sidebar-ring: oklch(0.48 0.155 264);       /* Radix indigo-9 */
}

.dark {
  --background: oklch(0.16 0.012 264);         /* Radix slate-1 dark */
  --foreground: oklch(0.93 0.006 264);         /* Radix slate-12 dark */
  --card: oklch(0.20 0.014 264);               /* Radix slate-2 dark */
  --card-foreground: oklch(0.93 0.006 264);    /* Radix slate-12 dark */
  --popover: oklch(0.20 0.014 264);            /* Radix slate-2 dark */
  --popover-foreground: oklch(0.93 0.006 264); /* Radix slate-12 dark */
  --primary: oklch(0.65 0.155 264);            /* Radix indigo-9 dark */
  --primary-foreground: oklch(0.16 0.030 264); /* Radix indigo-1 dark */
  --secondary: oklch(0.25 0.015 264);          /* Radix slate-3 dark */
  --secondary-foreground: oklch(0.85 0.010 264); /* Radix slate-11 dark */
  --accent: oklch(0.65 0.100 180);             /* Radix teal-9 dark */
  --accent-foreground: oklch(0.18 0.020 180);  /* Radix teal-1 dark */
  --muted: oklch(0.25 0.015 264);              /* Radix slate-3 dark */
  --muted-foreground: oklch(0.60 0.010 264);   /* Radix slate-8 dark */
  --destructive: oklch(0.60 0.190 27);         /* Radix red-9 dark */
  --destructive-foreground: oklch(0.18 0.020 27); /* Radix red-1 dark */
  --border: oklch(0.32 0.015 264);             /* Radix slate-6 dark */
  --input: oklch(0.32 0.015 264);              /* Radix slate-6 dark */
  --ring: oklch(0.65 0.155 264);               /* Radix indigo-9 dark */
  --chart-1: oklch(0.65 0.155 264);            /* Radix indigo-9 dark */
  --chart-2: oklch(0.65 0.100 180);            /* Radix teal-9 dark */
  --chart-3: oklch(0.68 0.150 305);            /* Radix purple-9 dark */
  --chart-4: oklch(0.72 0.140 55);             /* Radix amber-9 dark */
  --chart-5: oklch(0.60 0.010 264);            /* Radix slate-8 dark */
  --sidebar-background: oklch(0.20 0.014 264); /* Radix slate-2 dark */
  --sidebar-foreground: oklch(0.93 0.006 264); /* Radix slate-12 dark */
  --sidebar-primary: oklch(0.58 0.145 264);    /* Radix indigo-10 dark */
  --sidebar-primary-foreground: oklch(0.16 0.030 264); /* Radix indigo-1 dark */
  --sidebar-accent: oklch(0.30 0.040 180);     /* Radix teal-4 dark */
  --sidebar-accent-foreground: oklch(0.80 0.050 180);  /* Radix teal-11 dark */
  --sidebar-border: oklch(0.32 0.015 264);     /* Radix slate-6 dark */
  --sidebar-ring: oklch(0.65 0.155 264);       /* Radix indigo-9 dark */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... 全部 token 按相同模式映射 ... */
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
```

关键对比度验证：`--foreground` on `--background` = 15.2:1 (AAA)，`--primary` on `--background` = 5.8:1 (AAA)
