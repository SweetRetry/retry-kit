---
name: frontend-design
description: Strict UI Design implementation Review. Enforces shadcn/ui, Tailwind CSS (Design Tokens), and Framer Motion compliance to prevent "adhoc" styling and reinvented UI components.
allowed-tools: view_file, view_file_outline, grep_search
---

## CORE PHILOSOPHY

Your mission is to prevent "Design Drift" and "UI Pollution". AI code often takes the path of least resistance by using raw tags (`div`, `button`) or arbitrary Tailwind values. You must proactively steer implementation toward the established design system (shadcn/ui) and token scale.

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

## REVIEW DIMENSIONS

### 1. Token Integrity (Tailwind Scalability)

* **Arbitrary Values:** Proactively flag any usage of `-[...]` (e.g., `p-[9px]`, `w-[325px]`). These break site-wide consistency.
  * *Scan Strategy:* `grep_search` for `-\[`.
* **Raw Color Hardcoding:** Flag hex codes, RGB, or specific Tailwind color shades (e.g., `text-slate-400`). Encourage semantic tokens like `text-muted-foreground`, `bg-primary`, etc.
* **Spacing Balance:** Look for uneven padding/margins that deviate from the 4px/8px grid system.

### 2. Design System Enforcement (No Reinventing the Wheel)

* **Primitive Leakage:** Proactively find raw `<button>`, `<input>`, `<table`, `<select>`, `<dialog>`, etc. These MUST be replaced by equivalents from the project's component library (e.g., shadcn/ui) to ensure theme support and accessibility.
* **Discovery:** Before suggesting imports, verify the location of components (e.g., often in `@/components/ui`, `src/components/ui`, or `packages/ui`).
* **Shadow Implementations:** Look for custom components or complex `div` structures that mimic `Tabs`, `Accordion`, `Popover`, `Badge`, or `Modal`. If it looks like a standard UI element, it should BE a component library element.
* **Variant Misuse:** Flag cases where a developer adds 10+ utility classes to a system component to change its base look (e.g., `<Button className="bg-red-500 rounded-none shadow-none ...">`) instead of adding a new `variant` or using an existing one.

### 3. Motion & Interaction (Framer Motion)

* **Raw Transitions:** Identify elements with simple CSS `transition` if the project uses `framer-motion`. Suggest `motion.div` for more premium, spring-based interactions.
* **Missing Polish:** Proactively suggest `AnimatePresence` for exit animations or `whileHover`/`whileTap` for interactive elements to improve the "premium" feel.
* **Interaction Accessibility:** Ensure `motion` elements that act as buttons have proper keyboard listeners or are wrapped in a semantic focusable element.

### 4. Code Hygiene for Styles

* **Template Literal Bloat:** Flag messy conditional class strings. Enforce the use of `cn(...)` from `@/lib/utils` for clean Tailwind merging.
* **Inlined Style Tags:** CRITICAL violation. Flag `style={{ ... }}` except for truly dynamic values (like coordinates from a mouse event).

## WORKFLOW

1. **Structural Visual Scan:** Use `view_file` to look at the JSX structure. Does it look like a "generic" implementation (lots of primitives) or a "systemic" one (using library components)?
2. **Proactive Replacement Search:**
    * Search for raw HTML primitives (`<button`, `<input`, etc).
    * Search for "ad-hoc" styling patterns: `grep_search` for `-\[`, `#[0-9a-f]`, `style=\{\{`.
3. **Motion Review:** Check if interactive elements feel "static". Suggest Framer Motion enhancements where appropriate.
4. **Synthesize Findings:** Provide specific code replacements using shadcn/ui syntax.

## RULES OF THUMB

* **Critical:** Raw hex/RGB colors, inline `style={...}` tags, arbitrary `-[...]` values.

* **Warning:** Using raw HTML tags instead of shadcn/ui components, complex manual CSS transitions instead of motion.
* **Info:** Improving `cn()` usage, adding subtle hover micro-animations.
