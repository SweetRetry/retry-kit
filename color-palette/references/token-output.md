# Token 映射与输出规范

生成 `globals.css` 时参照本文件完成 token 映射、格式输出和质量检查。

---

## 一、shadcn/ui Token 映射规则

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
| `--chart-1` ~ `--chart-5` | 按角色取色：主色 → 强调色 → 辅色 → 互补色 → 中性色变体，确保相邻色相差 ≥ 30° |
| `--sidebar-background` | 辅色浅色版本 |
| `--sidebar-foreground` | 同 foreground |
| `--sidebar-primary` | 比主色深一级的同色系色 |
| `--sidebar-primary-foreground` | 与 sidebar-primary 高对比 |
| `--sidebar-accent` | 强调色浅色版本 |
| `--sidebar-accent-foreground` | 与 sidebar-accent 高对比 |
| `--sidebar-border` | 同 border |
| `--sidebar-ring` | 同 ring |

---

## 二、Dark Mode 规则

- **`--primary` 保持品牌色相**：H 值不变，C 可微调，L 提升至 0.65-0.80 以确保在深色背景上可读
- **`--background`**：极深色（L 0.13-0.18），保留主色的色彩倾向（H 相近），避免纯黑
- **`--foreground`**：极浅色（L ≥ 0.90）
- **中性 token**（muted/border/input）：L 值整体下移，保持相对层次关系
- **暖色 accent 降温**：若 light 模式 accent 为高饱和暖色（H < 60），dark 模式降低 C 值以减少暗底刺激
- **允许微调**：dark mode 可在来源色基础上调整 L/C 值（±0.05），不必严格匹配数据库原值

---

## 三、输出格式

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

### 输出清单

1. **每个 token 值后必须注释来源色名**（如 `/* 朱砂 */`、`/* Tailwind blue-600 */`、`/* Radix indigo-9 */`）
2. **必须包含所有 shadcn/ui token**：background, foreground, card, card-foreground, popover, popover-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, destructive-foreground, border, input, ring, chart-1~5, sidebar-background, sidebar-foreground, sidebar-primary, sidebar-primary-foreground, sidebar-accent, sidebar-accent-foreground, sidebar-border, sidebar-ring
3. **所有值使用 oklch 色彩空间**，不可混用 hsl() / rgb()
4. **`@custom-variant dark` 写法**：`(&:is(.dark *))`
5. **一个项目一套 token**：不创建多个 `:root` 或 `[data-zone]` 分区
6. **WCAG 对比度**：正文 ≥ 4.5:1（AA），标题/大字 ≥ 3:1（AA），输出后列出关键对比度数值

---

## 四、端到端完整示例

**场景**：SaaS 后台工具 / 专业严肃 / B 端专业用户 → Radix · 冷色 · 低饱和 · AAA

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
