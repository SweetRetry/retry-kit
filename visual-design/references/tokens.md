# shadcn/ui Token 速查 & Motion Spring 参数

## shadcn/ui 色彩 Token

**原则**：优先语义 token，不硬编码 zinc/slate 色值。Token 通过 CSS variable 自动适配亮/暗模式。

| 用途 | Token（Tailwind class） | 说明 |
|------|------------------------|------|
| 页面背景 | `bg-background` | 最底层，亮色=白，暗色=近黑 |
| 卡片背景 | `bg-card` | 比 background 略有区分 |
| 悬浮层/弹出层 | `bg-popover` | Dropdown、Tooltip、Dialog |
| 次级区块/输入底 | `bg-muted` | Sidebar、代码块、禁用态 |
| 主要文字 | `text-foreground` | |
| 次要文字 | `text-muted-foreground` | 描述、标签、占位符 |
| 主色（品牌色） | `bg-primary` / `text-primary` | CTA、选中态、Link |
| 主色前景 | `text-primary-foreground` | primary 背景上的文字 |
| 次要操作 | `bg-secondary` / `text-secondary-foreground` | Ghost 按钮底色 |
| 描边 | `border-border` | 通用描边 |
| 表单/输入描边 | `border-input` | Input、Select 边框 |
| 危险/错误 | `text-destructive` / `bg-destructive` | 删除、错误状态 |
| 成功/绿色 | `text-emerald-500` + `bg-emerald-500/10` | shadcn 无内置 success token，直接用 Tailwind 色阶 |
| 警告/橙色 | `text-amber-500` + `bg-amber-500/10` | 同上，避免用 success/warn 语义 token（历史 UI 实践，现代设计系统不推荐） |
| 强调色（可选） | `bg-accent` / `text-accent-foreground` | Hover 态背景 |
| Sidebar 背景 | `bg-sidebar` / `text-sidebar-foreground` | shadcn/ui sidebar 组件专用 |

**Brand Cinematic 例外**：深色底透明叠层（`bg-white/5`、`border-white/10`、`border-white/15`）是透明度手法，非硬编码色值，可与 token 共存。

---

## Motion Spring 参数

| 场景 | stiffness | damping | 说明 |
|------|-----------|---------|------|
| 标准流畅（Brand 入场） | 300 | 30 | 绝大多数 Brand 动效 |
| 沉稳厚重 | 200 | 40 | 大元素、Hero 产品图 |
| CTA Magnetic 跟随 | 150 | 25 | 鼠标跟随回弹 |
| 数字跳动 | 300 | 30 | `useMotionValue` + `useTransform`（实现细节见 techniques.md） |

**禁止**：`damping < 20`（产生 bounce 效果）。
