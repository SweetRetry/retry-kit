---
name: ui-blueprint
description: >
  在实际设计或编码 UI 之前，生成纯结构的 Markdown Blueprint 草图作为中间表征。
  输出布局骨架、组件类型、内容文案和层级关系，不包含色彩/字体/间距等视觉参数。
  Use when: (1) 用户要求设计或实现任何 UI 页面/组件之前，作为前置步骤生成结构草图，
  (2) 用户提到草图、线框图、wireframe、blueprint、布局规划、结构图，
  (3) 在调用 Pencil 设计工具或编写 UI 代码之前，先输出 blueprint 供用户确认，
  (4) 需要多屏/多步骤 UI 的整体结构规划，
  (5) 用户想快速对齐 UI 结构意图而不需要像素级设计。
---

# UI Blueprint

Generate a structural blueprint before any UI design or code implementation. The blueprint serves as an explicit, verifiable intermediate representation between user intent and pixel-level output.

## Why Blueprint First

```
User intent (natural language)
    ↓  ← implicit, lossy
Pixel-level design / code
```

vs.

```
User intent
    ↓  ← semantic → structure (verifiable)
Blueprint
    ↓  ← structure → pixels (mechanical, low error)
Pixel-level design / code
```

The blueprint makes the intent→structure mapping explicit. Users can correct course at this stage instead of after a full design is built.

## Workflow

1. Clarify scope: page count, platform (desktop/mobile/responsive), and core user goal
2. Output blueprint in the format below
3. Present to user for confirmation — the blueprint is a **contract**, not a suggestion
4. Only proceed to design (Pencil) or code after user approves

### Complexity-based routing

| Task | Action |
|------|--------|
| Single component (button, card) | Skip blueprint, execute directly |
| Single-screen page | Output blueprint, then proceed |
| Multi-screen / complex flow | Output blueprint per screen + flow overview |

## Blueprint Format

Use indented Markdown list. Each node = one UI element.

### Syntax

```
## Screen: {name} ({platform} {width}×{height}?)

- {Element} [{layout}, {constraints}?]
  - {Child} → "{content text}"
  - {Child} [{modifier}]
    - {Grandchild} × {count} [{pattern}]
      - "{item1}" / "{item2}" / "{item3}"
```

### Notation reference

| Notation | Meaning |
|----------|---------|
| `[row]` / `[col]` | Flex direction |
| `[grid:3]` | Grid with 3 columns |
| `[row:4, equal-width]` | 4 equal-width items in a row |
| `→ "text"` | Content / label |
| `× 3` | Repeat count |
| `[scroll]` / `[sticky-top]` | Scroll behavior |
| `[active]` | Current state |
| `icon:name` | Icon placeholder |
| `[required]` / `[optional]` | Form field validation |
| `[primary]` / `[ghost]` | Button variant |
| `[flex:2]` | Flex proportion |
| `[space-between]` / `[center]` | Alignment |
| `[fixed-left]` / `[fixed-bottom]` | Position |
| `[w:240]` / `[h:56]` / `[max-w:480]` | Dimension hints |

Notations are hints, not prescriptions. Use only what aids clarity. Do not add visual parameters (colors, font sizes, specific spacing values) — those belong to downstream skills.

### Multi-screen flows

For flows (onboarding, checkout, wizards), add a flow header:

```
## Flow: {name} ({platform}, {count} screens)

### Screen 1/{count}: {screen name}
- Progress Bar [step:1/{count}] → "Step1" > Step2 > Step3
- ...

### Screen 2/{count}: {screen name}
- ...
```

### ASCII preview (optional)

For complex spatial relationships that the tree structure alone cannot convey, append an ASCII preview below the tree:

```
### Spatial Preview
┌─[Header]──────────────────┐
│ Logo    Nav         [CTA] │
├──────────┬────────────────┤
│ Sidebar  │   Main Content │
│          │                │
│          │  ┌──┐┌──┐┌──┐ │
│          │  │C1││C2││C3│ │
│          │  └──┘└──┘└──┘ │
└──────────┴────────────────┘
```

Use ASCII preview only when the layout has non-obvious spatial relationships (sidebar + main, overlapping layers, complex grid). For linear top-to-bottom layouts, the tree alone is sufficient.

## Content Guidelines

- Write realistic placeholder text, not "Lorem ipsum" — realistic content reveals layout issues (text too long, CTA unclear)
- Use Chinese for Chinese-market products, English for English-market products, matching the user's language context
- Include actual data examples in dashboards/tables (e.g., "¥234K ↑23%", not "value")
- Mark interactive states when relevant: `[active]`, `[disabled]`, `[hover]`

## Blueprint as Contract

Once the user confirms a blueprint:
- Downstream implementation (Pencil / Code) must follow the structure faithfully
- Any deviation requires explicit explanation
- If implementation reveals structural problems, propose amendments to the blueprint before changing

## Examples

See [references/examples.md](references/examples.md) for full examples covering:
- SaaS Landing Page
- Analytics Dashboard
- Mobile App
- Multi-step Form Flow
