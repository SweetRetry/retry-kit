# Setup

What a project applies once to become Retry. After this the code carries these choices, and `DESIGN.md` does not repeat them.

## Theme

Use `brand-kit/globals.css` as the global stylesheet; it replaces shadcn's and is generated from `brand-kit/tokens.json` by `brand-kit/generate-globals.py`. Components are shadcn/ui on Base UI primitives: initialise with `shadcn init --base base` and add no Radix packages. Put `class="dark"` on `<html>`. Load Inter with the `opsz` axis. Animate with Motion (`motion/react`), with the app wrapped once in `<MotionConfig reducedMotion="user" transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}>`, so components set no `transition` unless they need a different duration.

Dark (`.dark`) is the default; light (`:root`) is a full theme. Every `shadow-*` is emptied, including those inside shadcn components. Transitions default to 150ms on a curve that starts fast and settles gently, because Tailwind's default starts slow. Focus is a 2px `ring` outline with a 2px offset; disabled is `bg-surface-1 text-subtle-foreground`.

## Component deltas

Applied once in the shadcn/ui component files.

- **Card**: no border; `bg-card` alone.
- **Input, Textarea, Select**: filled `bg-muted` with the `border-input` edge; focus `border-ring` plus a soft ring.
- **Input group**: a field with things inside it (a submit, a chip line, a unit). The field delta applies to the group and the control inside is bare; a `ghost` button inside hovers to `surface-3`, one rung above the field.
- **Button**: `default` once per view, then `secondary`, `ghost`, `destructive` (`bg-destructive-soft text-destructive`), `link`. No `outline`. Icon-only buttons use the square `icon` sizes, matched to the control height around them.
- **Badge**: not for metadata. Status is a 6px dot plus a word.
- **Tabs**: the list is `bg-muted`, the active tab `bg-surface-3`, one rung above it; no underline, no emerald.
- **Popover, Dropdown, Toast**: `bg-popover`, `border`, `rounded-md`. **Dialog, Sheet**: `bg-background`, `border`, Dialog `rounded-lg`. **Tooltip**: `bg-foreground text-background`, `rounded-md`.
- **Table**: `border-t` rows, no outer border or zebra; numbers and their headers `text-right tabular-nums`.
- **Sidebar**: separated by tone, no line; active `bg-sidebar-accent`.
- **Switch, Checkbox, Radio**: off `bg-surface-2` / `bg-surface-3`, on `bg-primary`. **Skeleton**: shadcn's `bg-accent`.
