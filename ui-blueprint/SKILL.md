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

1. Check skip conditions (see below) — if matched, execute directly without a blueprint
2. Diagnose user intent with the questions below — ask only what's missing
3. Output blueprint in the format below
4. Present to user for confirmation — the blueprint is a **contract**, not a suggestion
5. Only proceed to design (Pencil) or code after user approves

### When to skip blueprint

Skip and execute directly when ANY of these conditions are true:

| Condition | Reason |
|-----------|--------|
| Single component with clear spec (e.g., "add a submit button") | No structural ambiguity |
| User provides a complete design spec or mockup | Blueprint already exists |
| User is amending an already-confirmed blueprint | Amend in place, don't regenerate |
| Micro-interaction or style-only change | No layout decision needed |

### Complexity-based routing

| Task | Action |
|------|--------|
| Single component (button, card) | Skip blueprint, execute directly |
| Single-screen page | Output blueprint, then proceed |
| Multi-screen / complex flow | Output blueprint per screen + flow overview |

### Intent diagnosis

Before generating a blueprint, confirm these — ask only the ones not already clear from context. Prefer asking 1–2 at a time, not all at once.

| Question | Why it matters |
|----------|---------------|
| 这个界面的核心用户任务是什么？（用户来这里完成什么目标） | 决定信息层级和主操作位置 |
| 目标平台？Desktop / Mobile / Responsive | 决定布局骨架 |
| 是新建还是改版现有界面？ | 改版需要了解现有结构约束 |
| 有现有设计系统或组件库吗？（shadcn、Ant Design、自建…） | 决定组件命名和复用策略 |
| 数据是静态的还是异步加载的？ | 决定是否需要骨架屏和空状态 |

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
| `[required]` / `[optional]` | Form field validation / component can be omitted |
| `[primary]` / `[ghost]` / `[destructive]` | Button variant |
| `[flex:2]` | Flex proportion |
| `[space-between]` / `[center]` / `[end]` | Alignment |
| `[fixed-left]` / `[fixed-bottom]` / `[fixed-right]` | Position |
| `[w:240]` / `[max-w:480]` | Layout-critical dimension hints — only when the value directly constrains the surrounding layout (e.g., sidebar width, modal width). Omit for decorative sizing. |
| `[h:fixed]` | Fixed-height element (e.g., top bar, tab bar) — use `[h:fixed]` not a specific value unless the exact height is a layout dependency |
| `[hidden]` / `[collapsed]` | Visibility state — element exists in DOM but not shown |
| `[visible-on-hover]` | Element only appears on hover interaction |
| `[P0]` / `[P1]` | Implementation priority — P0 = must-have for MVP, P1 = should-have |

Notations are hints, not prescriptions. Use only what aids clarity.

**Boundary rule — structural vs visual:**

| Allowed (structural decisions) | Forbidden (visual parameters) |
|--------------------------------|-------------------------------|
| `[w:240]` — layout-critical width | `px:16`, `p:24`, `gap:8` — spacing/padding |
| `[h:fixed]` — fixed-height element | `h:56`, `h:48` — specific height values |
| `[fixed-left]`, `[sticky-top]` — position | `border-top`, `border-right` — decorative borders |
| `[flex:1]`, `[col]`, `[row]` — layout | `color:success`, `bg:muted` — colors |
| `[active]`, `[disabled]`, `[loading]` — semantic state | `opacity:50`, `shadow-md` — visual effects |
| `[success]`, `[error]`, `[warning]` — semantic variant | `text-sm`, `font-bold` — typography |
| `[hidden]`, `[collapsed]`, `[visible-on-hover]` — visibility | `rounded`, `rounded-full` — border radius |
| `[slide-in-right]`, `[slide-in-bottom]` — entry direction | `animate:fade`, `duration:200` — animation parameters |

**Entry direction** (`[slide-in-right]`) is structural — it tells implementers which side the element appears from, affecting layout expectation. Animation parameters (easing, duration) are visual.

**Decision test:** ask "does this constrain the layout structure or user flow?" If yes, include it. If it only affects visual appearance, omit it — that belongs to downstream skills.

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

## Self-check before delivering

After drafting a blueprint, verify:

| Check | Question |
|-------|----------|
| **Coverage** | Does every interactive entry point have a target screen/state defined? |
| **Empty states** | Does every list, table, or data view have an empty state? |
| **Async states** | If data is async, is there a skeleton or loading placeholder? |
| **Form validation** | Does every form define valid / invalid / loading states? |
| **Error paths** | Are error states (load failure, submit failure) covered? |
| **Priority clarity** | Are P0 / P1 / optional components marked where implementation order matters? |
| **Platform completeness** | If responsive, are both desktop and mobile layouts described? |

Not every check applies to every blueprint — skip checks that aren't relevant to the current scope.

## References

| File | Content | When to load |
|------|---------|--------------|
| [references/examples.md](references/examples.md) | Full examples: Landing Page, Dashboard, Mobile App, Form Flow, Responsive, State Variants | Need a complete blueprint example |
| [references/component-patterns.md](references/component-patterns.md) | Component-level patterns: Empty State, Skeleton, Modal, Drawer, Toast, Inspector Panel, Pagination vs Infinite Scroll, Form Field States | Need standardized notation for a specific component type |
| [references/page-structure.md](references/page-structure.md) | Page type standard flows, 3-layer functional zoning, navigation selection, CTA hierarchy, state placement | Confirming page structure and user flow before generating blueprint |

## Reference Read Gate

### When reading is mandatory

1. Single simple component blueprint (no flow/state complexity): references optional.
2. Multi-screen flow, responsive blueprint, or full-page structure planning: references required.

### Minimum read set

1. Page-level structure work: must read [references/page-structure.md](references/page-structure.md)
2. Component-heavy or state-heavy work: must read [references/component-patterns.md](references/component-patterns.md)
3. Pattern calibration or end-to-end examples needed: add [references/examples.md](references/examples.md)
