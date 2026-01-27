---
name: frontend-design
description: UI design review and enforcement. Use this skill to review React/Next.js components for design consistency, semantic tokens, accessibility, and shadcn/ui patterns.
allowed-tools: Read, Grep, Glob
---

## OUTPUT FORMAT (MANDATORY)

```text
FILE: <file_path>
SEVERITY: CRITICAL | WARNING | INFO
RULE: <rule-id>
MESSAGE: <short-description>
LINE: <line-number>
SUGGESTION: <how-to-fix>
---
```

**If no issues:** `FILE: <file_path>\nSTATUS: PASSED\n---`

## CRITICAL CHECKS

**Run all Grep searches in parallel for performance.**

### 1. Magic Numbers (Arbitrary Values)

```bash
Grep("w-\[|h-\[|p-\[|m-\[|text-\[|gap-\[|top-\[|left-\[|right-\[|bottom-\[", path="<file>", output_mode="content", -n=true)
```

- `w-[350px]` → CRITICAL: `magic-number` - Use `w-full max-w-sm` (384px) or `max-w-md` (448px)
- `p-[13px]` → CRITICAL: `magic-number` - Use `p-3` (12px) or `p-4` (16px)
- `text-[14px]` → CRITICAL: `magic-number` - Use `text-sm`

### 2. Raw Colors

```bash
Grep("bg-gray-|bg-blue-|bg-red-|bg-green-|bg-yellow-|text-gray-|text-blue-|text-red-|border-gray-|#[0-9a-fA-F]{3,6}|rgb\(|rgba\(", path="<file>", output_mode="content", -n=true)
```

**Semantic mappings:**

- `bg-gray-50` → `bg-background` | `bg-gray-100` → `bg-muted` | `text-gray-500` → `text-muted-foreground`
- `text-gray-900` → `text-foreground` | `bg-red-500` → `bg-destructive` | `bg-blue-500` → `bg-primary`
- `border-gray-200` → `border-border` | `#F5F5F5` → Use CSS variables

### 3. Grid Violations (4px/8px system)

```bash
Grep("p-\[.*[1357]px\]|m-\[.*[1357]px\]|gap-\[.*[1357]px\]", path="<file>", output_mode="content", -n=true)
```

- `p-[7px]` → WARNING: `grid-violation` - Use `p-2` (8px)
- Spacing scale: `0.5`=2px, `1`=4px, `1.5`=6px, `2`=8px, `3`=12px, `4`=16px, `6`=24px

### 4. shadcn/ui Primitives & Component replacement

```bash
# HTML primitives
Grep("<button|<input|<textarea|<select|<dialog|<label|<table|<hr", path="<file>", output_mode="content", -n=true)
# Custom components shadowing shadcn names
Grep("const (Modal|Tabs|Accordion|Popover|Tooltip|Badge|Checkbox|Switch|Separator|ScrollArea|Dialog|Sheet|Drawer) = ", path="<file>", output_mode="content", -n=true)
```

- Raw `<button>` / `<input>` → WARNING: `primitive-usage` - Use shadcn equivalents (`Button`, `Input`).
- Raw `<table>` → WARNING: `primitive-usage` - Use shadcn `@/components/ui/table`.
- Raw `<hr>` → INFO: `primitive-usage` - Use shadcn `<Separator />`.
- Custom implementation of `Tabs/Accordion/Modal/Tooltip` → WARNING: `reinventing-the-wheel` - Replace with shadcn/ui equivalents. Benefits: Accessibility (ARIA), keyboard support, and consistent design language.
- Re-implementing `Badge/Checkbox/Switch` → INFO: `component-standardization` - Use shadcn components to maintain visual consistency across the app.

### 5. Responsive (Mobile-First)

```bash
Grep("w-1/2 sm:|w-1/3 sm:|flex-row sm:flex-col", path="<file>", output_mode="content", -n=true)
```

- `w-1/2 sm:w-full` → WARNING: `responsive-order` - Use `w-full md:w-1/2`

### 6. Accessibility

```bash
Grep("<button|<a href|<input|onClick=", path="<file>", output_mode="content", -B=1, -A=1)
```

- Icon-only button without `aria-label` → INFO: `accessibility` - Add descriptive label
- Click on `<div>` → WARNING: `accessibility` - Use `<button>` or add keyboard support

### 7. className Merging

```bash
Grep('className=\{`.*\$\{|className=\{.*\?', path="<file>", output_mode="content", -n=true)
```

- Template literal without `cn()` → INFO: `className-merge` - Use `cn()` for proper Tailwind merging

### 8. Excessive className Overrides (Common LLM Pattern)

```bash
Grep("<[A-Z][a-zA-Z]*.*className=.*(rounded-|h-|w-|px-|py-|text-)", path="<file>", output_mode="content", -n=true)
```

- `<Button className="rounded-md px-4 py-2 h-10 ...">` → WARNING: `excessive-styling` - `shadcn/ui` components (like `Button`) already have default styles and variants. Avoid mindlessly adding classNames that replicate or override the internal design of the library.
- Rule: Trust the component's default styles and use provided variants (e.g., `variant="outline"`, `size="sm"`) instead of manually overriding with utility classes unless it's a specific, justified layout requirement.

## WORKFLOW

1. Read file(s) with `Read()`
2. Run all 8 Grep checks **in parallel** (single message, multiple tool calls)
3. Analyze findings and output in mandatory format
4. Do NOT make changes unless explicitly asked
5. Prioritize CRITICAL for magic numbers and raw colors
6. **Proactive Replacement**: Even if a pattern isn't caught by Grep, if you notice complex DIV/SPAN structures mimicking components like Tabs, Accordion, or Tooltips, suggest using shadcn/ui to improve accessibility and maintainability.
