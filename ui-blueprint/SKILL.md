---
name: ui-blueprint
description: >
  在实际设计或编码 UI 之前，生成纯结构的 ASCII Blueprint 草图作为中间表征。
  输出布局骨架、组件位置、内容文案和空间关系，不包含色彩/字体/间距等视觉参数。
  Use when: (1) 用户要求设计或实现任何 UI 页面/组件之前，作为前置步骤生成结构草图，
  (2) 用户提到草图、线框图、wireframe、blueprint、布局规划、结构图，
  (3) 在调用 Pencil 设计工具或编写 UI 代码之前，先输出 blueprint 供用户确认，
  (4) 需要多屏/多步骤 UI 的整体结构规划，
  (5) 用户想快速对齐 UI 结构意图而不需要像素级设计。
---

# UI Blueprint

在 UI 设计或编码前，输出 ASCII 结构图作为中间表征，供用户确认后再进入实现。

## Workflow

1. Check skip conditions — if matched, execute directly without a blueprint
2. Diagnose user intent with the questions below — ask only what's missing
3. Output ASCII blueprint
4. Present to user for confirmation — the blueprint is a **contract**, not a suggestion
5. Only proceed to design (Pencil) or code after user approves

### When to skip blueprint

| Condition | Reason |
|-----------|--------|
| Single component with clear spec (e.g., "add a submit button") | No structural ambiguity |
| User provides a complete design spec or mockup | Blueprint already exists |
| User is amending an already-confirmed blueprint | Amend in place, don't regenerate |
| Micro-interaction or style-only change | No layout decision needed |

### Intent diagnosis

Before generating a blueprint, confirm these — ask only the ones not already clear from context. Prefer asking 1–2 at a time, not all at once.

| Question | Why it matters |
|----------|---------------|
| 这个界面的核心用户任务是什么？ | 决定信息层级和主操作位置 |
| 目标平台？Desktop / Mobile / Responsive | 决定布局骨架 |
| 是新建还是改版现有界面？ | 改版需要了解现有结构约束 |
| 有现有设计系统或组件库吗？ | 决定组件命名和复用策略 |
| 数据是静态的还是异步加载的？ | 决定是否需要骨架屏和空状态 |

## ASCII Blueprint 格式

用 ASCII box-drawing 字符画出组件级结构图。画到具体组件的位置和内容文案，接近线框图。

### 规则

- 用 `┌─┐│└─┘├┤┬┴┼` 画边框和分区
- 每个区块内标注组件类型和真实文案（不写 Lorem ipsum）
- 数据用真实示例值（如 "¥234K ↑23%"，不写 "value"）
- 交互元素用 `[按钮文案]` 方括号标注
- 重复元素用 `×N` 标注数量
- 只画结构和空间关系，不标注颜色、字号、间距、圆角等视觉参数

### 只关注结构，不关注视觉

| 应该画的（结构决策） | 不应该画的（视觉参数） |
|---|---|
| 区块划分、空间位置 | 颜色、背景色 |
| 组件类型和文案 | 字号、字重 |
| 固定/滚动/吸顶 | 间距、内边距 |
| 展开/折叠/隐藏状态 | 圆角、阴影、动画 |

### Multi-screen flows

For flows (onboarding, checkout, wizards), add a flow header and per-screen ASCII:

```
## Flow: {name} ({platform}, {count} screens)

### Screen 1/{count}: {screen name}
┌─────────────────────────┐
│ ...                     │
└─────────────────────────┘

### Screen 2/{count}: {screen name}
┌─────────────────────────┐
│ ...                     │
└─────────────────────────┘
```

## Blueprint as Contract

Once the user confirms a blueprint:
- Downstream implementation (Pencil / Code) must follow the structure faithfully
- Any deviation requires explicit explanation
- If implementation reveals structural problems, propose amendments to the blueprint before changing

## Self-check before delivering

| Check | Question |
|-------|----------|
| **Coverage** | Does every interactive entry point have a target screen/state defined? |
| **Empty states** | Does every list, table, or data view have an empty state? |
| **Async states** | If data is async, is there a skeleton or loading placeholder? |
| **Error paths** | Are error states (load failure, submit failure) covered? |
| **Priority clarity** | Are P0 / P1 / optional components marked where implementation order matters? |
| **Platform completeness** | If responsive, are both desktop and mobile layouts described? |

Not every check applies to every blueprint — skip checks that aren't relevant to the current scope.

## References

| File | Content | When to load |
|------|---------|--------------|
| [references/examples.md](references/examples.md) | Full ASCII examples: Landing Page, Dashboard, Form Flow, State Variants | Need a complete blueprint example |
| [references/component-patterns.md](references/component-patterns.md) | Component-level ASCII patterns: Empty State, Skeleton, Modal, Drawer, Pagination, Form States | Need standardized pattern for a specific component type |
| [references/page-structure.md](references/page-structure.md) | Page type standard flows, 3-layer functional zoning, navigation selection, CTA hierarchy | Confirming page structure before generating blueprint |

### Reference Read Gate

| Scope | Required reads |
|-------|---------------|
| Single simple component | References optional |
| Page-level structure | Must read page-structure.md |
| Component-heavy or state-heavy | Must read component-patterns.md |
| Full page end-to-end | Add examples.md |
