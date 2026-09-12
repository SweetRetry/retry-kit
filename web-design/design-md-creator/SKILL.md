---
name: design-md-creator
description: "Create or update design.md when the user requests reusable brand or design guidance for agents. A complaint about one page’s appearance alone does not trigger this skill."
metadata:
  keywords: design.md, brand guidelines, on-brand pages, anti-slop, design tokens, v0, Claude artifacts, agent design system, Vercel design.md, 品牌规范, 设计规范, 消除AI味
---

# Create a design.md

A `design.md` transforms vague requirements like "make it on-brand" into concrete decisions an AI agent can execute.
It is itself a skill: YAML frontmatter with trigger conditions, followed by authoritative guidance that page-generating agents (v0, Claude, Cursor) load into context.

The core premise: **a `design.md` is distilled, not written**. It captures real human corrections on generated pages and translates them into observable behaviors.

---

## The Three-Tier Architecture

A complete agent design system decouples decisions into three distinct layers. `design.md` is only Layer 1:

1. **Layer 1: Prose (`design.md`) carries Judgment**
   - Framing the reader's job (executive speed path vs audit verification path).
   - Information architecture, evidence structure, and layout geometry.
   - Named rejections: explicit catalogue of banned AI template defaults (Anti-Slop).
2. **Layer 2: Bounded Vocabulary / Stylesheet carries Mechanics**
   - Precise tokens, colors, type scales, and CSS class names.
   - **Context Decoupling**: The stylesheet is loaded by the browser at render time. Read only the relevant stylesheet definitions when verifying tokens or diagnosing style conflicts; otherwise use the documented vocabulary.
   - **Closed Vocabulary Rule**: Use documented classes, tokens, and any explicitly provided extension mechanism; do not invent foundation API names.
3. **Layer 3: Deterministic Checks carry Physical Verification**
   - Script-checkable assertions (e.g. table width not 100%, missing landmarks, unregistered classes, mobile overflow).

---

## Workflow: 4-Step Distillation

### Step 1: Inspect (Proactive Asset Extraction)

**Inspect before asking.** Read the repository or provided sources relevant to the requested guidance; a local update only needs the affected rules and their evidence:

1. **Tokens and CSS**: Check `tailwind.config.*`, CSS modules, `globals.css`, theme definitions, or design tokens. Extract the actual palette, font families, and spacing tokens.
2. **Authorship Furniture**: Inspect existing pages, headers, footers, and logo placement.
3. **Voice & Artifact Types**: Inspect docs, marketing pages, or PRDs for tone, capitalization rules, and which pages the team repeatedly generates (reports, proposals, benchmarks).
4. **Clarification Threshold**: Do not run lengthy questionnaires. If sources disagree, prioritize **shipped production code** over static design drafts. Ask at most 1–2 grouped questions only if a critical conflict affects brand identity or facts.

### Step 2: Translate Corrections into Observable Rules

Use corrections and steering notes already provided. Ask only for missing feedback that would materially change the guidance; do not require a fixed number of complaints.

Triage every correction using this decision tree:
```
A feedback item or correction:
├── Can it be verified mechanically by a script? (overflow, contrast, unregistered class)
│       → Note as Layer 3: Deterministic Check
├── Is it a specific color code, font, gap size, or CSS class?
│       → Add to Layer 2: Bounded Vocabulary / Stylesheet
└── Otherwise it is judgment (layout, voice, evidence, restraint)
        → Write into Layer 1: design.md as an OBSERVABLE BEHAVIOR
```

**Rule for Observable Phrasing**:
- Reject subjective vibes: *"Make the table feel less cramped"* ❌
- Enforce observable behavior: *"Evidence tables own the full 12-column width of their section"* ✅
- Add the *Why* when a rule could be misapplied: *"Never turn a savings figure green merely because it is favorable, because it reads as advocacy rather than neutral evidence."*

### Step 3: Synthesize `design.md`

Use the relevant sections of [references/design-md-template.md](references/design-md-template.md). Keep only rules that change decisions for this project's actual artifacts; no target line count.

Include the following sections only where the project has relevant guidance:
1. **Frontmatter**: Descriptive triggers naming concrete artifact types.
2. **Role & Stance**: Define the persona and establish that the reader's job outranks document category.
3. **Brand Context**: Voice traits paired with **explicit negations** (e.g., "precise and calm; never manufactured through hype or decoration"). Dual reading speeds (Executive path vs Audit path).
4. **Priority Order**: Concrete conflict-resolution order:
   `Supplied Facts > Caller Framework > Reader Clarity > Brand Authorship > Material Composition > Micro-details`.
5. **Project Integration**: Specify stylesheet resolution URL/path and forbid third-party unapproved dependencies.
6. **Four-Pass Method**:
   - *Pass 1: Frame reader's job* (simplify language, never the claim).
   - *Pass 2: Choose composition* (squint test, text-mask test; map data to geometry before picking components).
   - *Pass 3: Visual system* (authorship shell, 12-column grid, table evidence rules, monochrome baseline).
   - *Pass 4: Inspect privately* (internal review order; deliver clean work without review journals).
7. **Named Rejections (Kill AI Slop)**: Selectively import relevant patterns from [references/anti-slop-patterns.md](references/anti-slop-patterns.md).
8. **Bounded Vocabulary**: Document permitted CSS classes and tokens with strict closure rules.
9. **Accessibility Floor**: Landmarks, single `h1`, WCAG AA, `min-width: 0`.
10. **Closing Line**: *"The target is <Brand> judgment, not <Brand> decoration."*

### Step 4: Verify & Deliver

Check changed rules for consistency with the project's evidence and existing guidance. Read [references/eval-and-verification.md](references/eval-and-verification.md) when a behavioral comparison is needed:

1. **Matched Comparison (when needed to validate a new design principle)**:
   - Pick one representative scenario (e.g., a customer renewal proposal or performance report).
   - Compare Baseline (no design.md) vs Guided (with design.md).
   - Verify the intended decision changes; require structural changes only when the new rule concerns structure. Do not regenerate pages for wording-only updates.
2. **Deliverables**:
   - `design.md`: The requested brand guidance, limited to applicable decisions.
   - Associated `tokens.css` or bounded class contract only when necessary for the requested deliverable; reuse existing definitions.
   - *AGENTS.md / CLAUDE.md Hook*: When integration is requested, add a single-line Context Pointer (`When building or modifying pages, follow [design.md](design.md)`). Never inline the full `design.md` into `AGENTS.md`.
