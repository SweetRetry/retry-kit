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
| `--destructive-foreground` | 与 destructive 高对比色 |
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
  --color-sidebar: var(--sidebar-background);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
```

### 输出清单

1. **每个 token 值后必须注释来源色名**（如 `/* Tailwind emerald-600 */`、`/* Radix blue-9 */`）
2. **必须包含所有 shadcn/ui token**：background, foreground, card, card-foreground, popover, popover-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, destructive-foreground, border, input, ring, chart-1~5, sidebar-background, sidebar-foreground, sidebar-primary, sidebar-primary-foreground, sidebar-accent, sidebar-accent-foreground, sidebar-border, sidebar-ring
3. **所有值使用 oklch 色彩空间**，不可混用 hsl() / rgb()
4. **`@custom-variant dark` 写法**：`(&:is(.dark *))`
5. **一个项目一套 token**：不创建多个 `:root` 或 `[data-zone]` 分区
6. **WCAG 对比度**：正文 ≥ 4.5:1（AA），标题/大字 ≥ 3:1（AA），输出后列出关键对比度数值

---

## 四、端到端完整示例

**场景**：开发者工具 / 极客科技 / 开发者 → Tailwind · 翠绿方向（Supabase 风格） · 中饱和 · AA

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.98 0.002 106);         /* Tailwind zinc-50 */
  --foreground: oklch(0.21 0.012 106);         /* Tailwind zinc-900 */
  --card: oklch(0.97 0.003 106);               /* Tailwind zinc-100 */
  --card-foreground: oklch(0.21 0.012 106);    /* Tailwind zinc-900 */
  --popover: oklch(0.97 0.003 106);            /* Tailwind zinc-100 */
  --popover-foreground: oklch(0.21 0.012 106); /* Tailwind zinc-900 */
  --primary: oklch(0.56 0.155 163);            /* Tailwind emerald-600 */
  --primary-foreground: oklch(0.98 0.010 163); /* Tailwind emerald-50 */
  --secondary: oklch(0.93 0.003 106);          /* Tailwind zinc-100 */
  --secondary-foreground: oklch(0.37 0.013 106); /* Tailwind zinc-700 */
  --accent: oklch(0.75 0.165 70);              /* Tailwind amber-500 */
  --accent-foreground: oklch(0.25 0.050 70);   /* Tailwind amber-950 */
  --muted: oklch(0.93 0.003 106);              /* Tailwind zinc-100 */
  --muted-foreground: oklch(0.55 0.010 106);   /* Tailwind zinc-500 */
  --destructive: oklch(0.55 0.200 27);         /* Tailwind red-600 */
  --destructive-foreground: oklch(0.97 0.013 17); /* Tailwind red-50 */
  --border: oklch(0.87 0.005 106);             /* Tailwind zinc-200 */
  --input: oklch(0.87 0.005 106);              /* Tailwind zinc-200 */
  --ring: oklch(0.56 0.155 163);               /* Tailwind emerald-600 */
  --chart-1: oklch(0.56 0.155 163);            /* Tailwind emerald-600 */
  --chart-2: oklch(0.75 0.165 70);             /* Tailwind amber-500 */
  --chart-3: oklch(0.55 0.200 245);            /* Tailwind blue-600 */
  --chart-4: oklch(0.64 0.200 15);             /* Tailwind rose-500 */
  --chart-5: oklch(0.55 0.010 106);            /* Tailwind zinc-500 */
  --sidebar-background: oklch(0.93 0.003 106); /* Tailwind zinc-100 */
  --sidebar-foreground: oklch(0.21 0.012 106); /* Tailwind zinc-900 */
  --sidebar-primary: oklch(0.50 0.150 163);    /* Tailwind emerald-700 */
  --sidebar-primary-foreground: oklch(0.98 0.010 163); /* Tailwind emerald-50 */
  --sidebar-accent: oklch(0.90 0.060 70);      /* Tailwind amber-100 */
  --sidebar-accent-foreground: oklch(0.35 0.070 70);   /* Tailwind amber-800 */
  --sidebar-border: oklch(0.87 0.005 106);     /* Tailwind zinc-200 */
  --sidebar-ring: oklch(0.56 0.155 163);       /* Tailwind emerald-600 */
}

.dark {
  --background: oklch(0.15 0.008 106);         /* Tailwind zinc-950 */
  --foreground: oklch(0.93 0.003 106);         /* Tailwind zinc-50 */
  --card: oklch(0.20 0.010 106);               /* Tailwind zinc-900 */
  --card-foreground: oklch(0.93 0.003 106);    /* Tailwind zinc-50 */
  --popover: oklch(0.20 0.010 106);            /* Tailwind zinc-900 */
  --popover-foreground: oklch(0.93 0.003 106); /* Tailwind zinc-50 */
  --primary: oklch(0.70 0.150 163);            /* Tailwind emerald-400 */
  --primary-foreground: oklch(0.15 0.040 163); /* Tailwind emerald-950 */
  --secondary: oklch(0.27 0.012 106);          /* Tailwind zinc-800 */
  --secondary-foreground: oklch(0.87 0.005 106); /* Tailwind zinc-200 */
  --accent: oklch(0.72 0.140 70);              /* Tailwind amber-400 */
  --accent-foreground: oklch(0.18 0.040 70);   /* Tailwind amber-950 */
  --muted: oklch(0.27 0.012 106);              /* Tailwind zinc-800 */
  --muted-foreground: oklch(0.62 0.008 106);   /* Tailwind zinc-400 */
  --destructive: oklch(0.60 0.190 27);         /* Tailwind red-500 */
  --destructive-foreground: oklch(0.26 0.092 26); /* Tailwind red-950 */
  --border: oklch(0.34 0.013 106);             /* Tailwind zinc-700 */
  --input: oklch(0.34 0.013 106);              /* Tailwind zinc-700 */
  --ring: oklch(0.70 0.150 163);               /* Tailwind emerald-400 */
  --chart-1: oklch(0.70 0.150 163);            /* Tailwind emerald-400 */
  --chart-2: oklch(0.72 0.140 70);             /* Tailwind amber-400 */
  --chart-3: oklch(0.65 0.190 245);            /* Tailwind blue-400 */
  --chart-4: oklch(0.68 0.180 15);             /* Tailwind rose-400 */
  --chart-5: oklch(0.62 0.008 106);            /* Tailwind zinc-400 */
  --sidebar-background: oklch(0.20 0.010 106); /* Tailwind zinc-900 */
  --sidebar-foreground: oklch(0.93 0.003 106); /* Tailwind zinc-50 */
  --sidebar-primary: oklch(0.65 0.145 163);    /* Tailwind emerald-500 */
  --sidebar-primary-foreground: oklch(0.15 0.040 163); /* Tailwind emerald-950 */
  --sidebar-accent: oklch(0.35 0.050 70);      /* Tailwind amber-800 */
  --sidebar-accent-foreground: oklch(0.80 0.070 70);   /* Tailwind amber-200 */
  --sidebar-border: oklch(0.34 0.013 106);     /* Tailwind zinc-700 */
  --sidebar-ring: oklch(0.70 0.150 163);       /* Tailwind emerald-400 */
}

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
  --color-sidebar: var(--sidebar-background);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
```

关键对比度验证：`--foreground` on `--background` = 14.5:1 (AAA)，`--primary` on `--background` = 5.2:1 (AA)
