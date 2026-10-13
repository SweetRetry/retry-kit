---
version: alpha
name: Retry
description: Personal design language for Zimin's site, notes, slides and tools. Dark is the default theme; every color has a `-light` twin for the light theme.
colors:
  background: "#1c1c1e"
  foreground: "#f5f5f7"
  surface-1: "#242426"
  surface-2: "#2c2c2e"
  surface-3: "#363638"
  card: "#242426"
  card-foreground: "#f5f5f7"
  popover: "#2c2c2e"
  popover-foreground: "#f5f5f7"
  primary: "#2fbf71"
  primary-hover: "#45cc83"
  primary-foreground: "#06120b"
  secondary: "#2c2c2e"
  secondary-hover: "#363638"
  secondary-foreground: "#f5f5f7"
  muted: "#242426"
  muted-foreground: "#98989d"
  subtle-foreground: "#6e6e73"
  accent: "#2c2c2e"
  accent-foreground: "#f5f5f7"
  destructive: "#eb6f66"
  destructive-soft: "rgba(235,111,102,0.14)"
  success: "#2fbf71"
  warning: "#e2a336"
  warning-soft: "rgba(226,163,54,0.14)"
  border: "#38383a"
  input: "#48484a"
  ring: "#2fbf71"
  ring-soft: "rgba(47,191,113,0.22)"
  sidebar: "#161618"
  sidebar-foreground: "#98989d"
  sidebar-primary: "#2fbf71"
  sidebar-primary-foreground: "#06120b"
  sidebar-accent: "#2a2a2c"
  sidebar-accent-foreground: "#f5f5f7"
  sidebar-border: "rgba(0,0,0,0)"
  sidebar-ring: "#2fbf71"
  chart-1: "#2fbf71"
  chart-2: "#6aa9ff"
  chart-3: "#e2a336"
  chart-4: "#c58af9"
  chart-5: "#8e8e93"
  background-light: "#fbfbfd"
  foreground-light: "#1d1d1f"
  surface-1-light: "#f3f3f5"
  surface-2-light: "#ebebee"
  surface-3-light: "#e1e1e5"
  card-light: "#f3f3f5"
  card-foreground-light: "#1d1d1f"
  popover-light: "#ffffff"
  popover-foreground-light: "#1d1d1f"
  primary-light: "#15804a"
  primary-hover-light: "#116b3e"
  primary-foreground-light: "#ffffff"
  secondary-light: "#ebebee"
  secondary-hover-light: "#e1e1e5"
  secondary-foreground-light: "#1d1d1f"
  muted-light: "#f3f3f5"
  muted-foreground-light: "#66666b"
  subtle-foreground-light: "#86868b"
  accent-light: "#ebebee"
  accent-foreground-light: "#1d1d1f"
  destructive-light: "#c4352c"
  destructive-soft-light: "rgba(196,53,44,0.09)"
  success-light: "#15804a"
  warning-light: "#9a6006"
  warning-soft-light: "rgba(154,96,6,0.10)"
  border-light: "#e3e3e6"
  input-light: "#d2d2d7"
  ring-light: "#15804a"
  ring-soft-light: "rgba(21,128,74,0.18)"
  sidebar-light: "#f3f3f5"
  sidebar-foreground-light: "#66666b"
  sidebar-primary-light: "#15804a"
  sidebar-primary-foreground-light: "#ffffff"
  sidebar-accent-light: "#e6e6ea"
  sidebar-accent-foreground-light: "#1d1d1f"
  sidebar-border-light: "rgba(0,0,0,0)"
  sidebar-ring-light: "#15804a"
  chart-1-light: "#15804a"
  chart-2-light: "#2f6fd6"
  chart-3-light: "#b07a0c"
  chart-4-light: "#8a4fd0"
  chart-5-light: "#8e8e93"
typography:
  display: { fontFamily: Inter, fontSize: 56px, fontWeight: 600, lineHeight: 60px, letterSpacing: -0.035em, fontFeature: "\"cv11\", \"ss03\"" }
  h1: { fontFamily: Inter, fontSize: 36px, fontWeight: 600, lineHeight: 42px, letterSpacing: -0.028em, fontFeature: "\"cv11\", \"ss03\"" }
  h2: { fontFamily: Inter, fontSize: 28px, fontWeight: 600, lineHeight: 34px, letterSpacing: -0.025em, fontFeature: "\"cv11\", \"ss03\"" }
  h3: { fontFamily: Inter, fontSize: 20px, fontWeight: 600, lineHeight: 28px, letterSpacing: -0.018em, fontFeature: "\"cv11\", \"ss03\"" }
  prose: { fontFamily: Inter, fontSize: 17px, fontWeight: 400, lineHeight: 28px, letterSpacing: -0.014em, fontFeature: "\"cv11\", \"ss03\"" }
  body: { fontFamily: Inter, fontSize: 15px, fontWeight: 400, lineHeight: 24px, letterSpacing: -0.011em, fontFeature: "\"cv11\", \"ss03\"" }
  ui: { fontFamily: Inter, fontSize: 14px, fontWeight: 400, lineHeight: 20px, letterSpacing: -0.008em, fontFeature: "\"cv11\", \"ss03\"" }
  small: { fontFamily: Inter, fontSize: 13px, fontWeight: 400, lineHeight: 18px, letterSpacing: -0.004em, fontFeature: "\"cv11\", \"ss03\"" }
  caption: { fontFamily: Inter, fontSize: 12px, fontWeight: 500, lineHeight: 16px, letterSpacing: 0em, fontFeature: "\"cv11\", \"ss03\"" }
  code: { fontFamily: ui-monospace, fontSize: 13px, fontWeight: 400, lineHeight: 20px, letterSpacing: 0em }
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 999px
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 24px
  6: 32px
  7: 48px
  8: 64px
components:
  button-primary: { backgroundColor: "{colors.primary}", textColor: "{colors.primary-foreground}", typography: "{typography.ui}", rounded: "{rounded.md}", height: "34px", padding: "0 14px" }
  button-primary-hover: { backgroundColor: "{colors.primary-hover}" }
  button-secondary: { backgroundColor: "{colors.secondary}", textColor: "{colors.secondary-foreground}", typography: "{typography.ui}", rounded: "{rounded.md}", height: "34px", padding: "0 14px" }
  button-secondary-hover: { backgroundColor: "{colors.secondary-hover}" }
  button-ghost: { backgroundColor: "transparent", textColor: "{colors.muted-foreground}", rounded: "{rounded.md}", height: "34px" }
  button-ghost-hover: { backgroundColor: "{colors.accent}", textColor: "{colors.accent-foreground}" }
  button-destructive: { backgroundColor: "{colors.destructive-soft}", textColor: "{colors.destructive}", rounded: "{rounded.md}", height: "34px" }
  button-disabled: { backgroundColor: "{colors.surface-1}", textColor: "{colors.subtle-foreground}" }
  input: { backgroundColor: "{colors.muted}", textColor: "{colors.foreground}", borderColor: "{colors.input}", rounded: "{rounded.md}", height: "34px", padding: "0 12px", typography: "{typography.ui}" }
  input-focus: { borderColor: "{colors.ring}", shadow: "0 0 0 3px {colors.ring-soft}" }
  input-error: { borderColor: "{colors.destructive}" }
  focus-ring: { outline: "2px solid {colors.ring}", outlineOffset: "2px" }
  card: { backgroundColor: "{colors.card}", textColor: "{colors.card-foreground}", rounded: "{rounded.lg}", padding: "16px" }
  popover: { backgroundColor: "{colors.popover}", textColor: "{colors.popover-foreground}", borderColor: "{colors.border}", rounded: "{rounded.lg}", padding: "5px" }
  menu-item: { height: "30px", rounded: "7px", typography: "{typography.small}" }
  segmented: { backgroundColor: "{colors.surface-1}", rounded: "{rounded.md}", padding: "2px" }
  segmented-item-active: { backgroundColor: "{colors.surface-3}", textColor: "{colors.foreground}", rounded: "{rounded.sm}", height: "28px" }
  tab-active: { backgroundColor: "{colors.surface-2}", textColor: "{colors.foreground}", rounded: "{rounded.md}", height: "32px" }
  sidebar: { backgroundColor: "{colors.sidebar}", textColor: "{colors.sidebar-foreground}", width: "216px" }
  sidebar-item-active: { backgroundColor: "{colors.sidebar-accent}", textColor: "{colors.sidebar-accent-foreground}", rounded: "7px", height: "30px" }
  table-row: { borderColor: "{colors.border}", padding: "11px 12px", typography: "{typography.small}" }
  table-row-hover: { backgroundColor: "{colors.surface-1}" }
  notice-warning: { backgroundColor: "{colors.warning-soft}", textColor: "{colors.warning}", rounded: "{rounded.md}" }
  notice-error: { backgroundColor: "{colors.destructive-soft}", textColor: "{colors.destructive}", rounded: "{rounded.md}" }
  switch-track: { backgroundColor: "{colors.surface-3}", rounded: "{rounded.full}", width: "34px", height: "20px" }
  switch-track-on: { backgroundColor: "{colors.primary}" }
omitted:
  - section: logo and iconography
    reason: No logo or icon set yet; the name is set in plain type and icons are 16px stroke icons on actions only.
  - section: fonts
    reason: Inter is loaded from Google Fonts with the opsz axis; no font files are vendored.
---
# Retry

Values live only in the front matter above. The text below says how to use them and names tokens instead of repeating values.

## Overview

Retry is a personal design language for everything Zimin makes: the site, notes and articles, slides, and small tools. Quiet surfaces, careful type, and one color that only shows up when it means something.

**Personality**, each word with what it rules out:

- **Restrained**: never manufactures polish with gradients, glows, glass or big shadows.
- **Precise**: alignment, numbers and wording are exact. No filler copy, no fake stats.
- **Warm**: not corporate. Plain first-person voice, room to breathe, an occasional personal touch.

**Audience.** Peers and potential collaborators (hiring managers, clients, people in the same field) who judge the thinking and the work, not the packaging. They should leave thinking: *this person thinks clearly and has taste.*

**References.** Linear's product clarity and Apple's quiet premium feel.

**Never looks like:** terminal or hacker aesthetics, neo-brutalism, the generic SaaS template (blue-purple gradient, centered hero, three icon cards), or Dribbble showpieces.

**When rules compete, protect in this order:** facts and user constraints › the host project's framework and existing components › clarity of the task › Retry's recognisability › finishing polish. Where no rule or token covers a case, decide by this order.

### Voice

- English first. First person on the site and in notes ("I design and build…"); product UI speaks as the product ("Your projects").
- Short sentences, conclusion first, then the reason.
- Sentence case everywhere: buttons, headings, tabs, menu items. No terminal punctuation on labels.
- Buttons are verbs: "Save draft", "Publish", "Get in touch". Never "Submit", "OK" or "Click here".
- Confirmations in past tense without "successfully": "Note published".
- Errors say what happened, then what to do: "Couldn't sync. Check your connection."
- No emoji in UI. No exclamation marks in system copy. Never narrate the design on the page ("This section uses a…").

## Colors

**Themes.** Dark is the default. Each color token `x` has a light-theme twin `x-light`. In CSS, emit the plain names under `:root, [data-theme="dark"]` and the `-light` values under `[data-theme="light"]` with the suffix dropped, so components only ever reference the plain name. Light is a complete theme, not an inversion.

**Names follow shadcn/ui** (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `sidebar-*`, `chart-1…5`), so they map one to one onto a shadcn `globals.css`. Retry adds `surface-1…3`, `subtle-foreground`, `success`, `warning`, the `*-hover` fills and the `*-soft` tints.

- **Neutrals are Apple gray, and depth is lightness.** `background` is the page. Each level of grouping steps up one tone: `surface-1` (card, muted, input fill), `surface-2` (secondary, accent, selected), `surface-3` (hover on secondary). `card`, `secondary`, `muted` and `accent` equal those steps; when a step changes, change it in all the roles that share it.
- **Three levels of text.** `foreground` for reading; `muted-foreground` for supporting text (holds 4.5:1 on `background`, `surface-1`, `surface-2` and `popover` in both themes); `subtle-foreground` only for placeholders, timestamps and column headers, and only on `background`, `surface-1` and `sidebar`. Never set body text in `subtle-foreground`, never put it on `popover`, never dim text with opacity.
- **Emerald (`primary`) is scarce.** One primary button per view, links, checked controls, focus (`ring`) and success. Keep it under 5% of any screen. It never marks "good" numbers, never decorates, never sits on a second action.
- **On emerald**, text is `primary-foreground`: near-black in dark, white in light.
- **Status**: `success` (the same emerald), `warning`, `destructive`, always paired with a word. Notice fills use `warning-soft` and `destructive-soft`.
- **`accent` is neutral.** As in shadcn, it is the hover and selected background, not the brand color.
- **Charts** use `chart-1…5`. When one series matters, give it `chart-1` and draw the rest in `chart-5`.

## Typography

One family: **Inter** with optical sizing (`font-optical-sizing: auto`), loaded from Google Fonts with the `opsz` axis, features `cv11` and `ss03`. Mono (`ui-monospace`) appears only in code and data, never in headings, labels or decoration.

| Token | Use |
|---|---|
| `display` | Site hero and cover, once per page |
| `h1` | Page and article titles |
| `h2` | Section titles |
| `h3` | Sub-sections, slide subheads |
| `prose` | Article body, 660px measure |
| `body` | Site copy |
| `ui` | Buttons, inputs, menus, list rows (labels at weight 500) |
| `small` | Table cells, metadata, sidebar items |
| `caption` | Column headers, group labels, field help |
| `code` | Code blocks and inline code |

- Each style carries its own `letterSpacing`; tracking tightens as size grows. Don't override it.
- Three weights only: 400, 500, 600. Never 700.
- Numbers that line up (tables, counts, times) use tabular figures.
- Balance headline wraps (`text-wrap: balance`) so no word sits alone on the last line.
- Only slides may scale type beyond `display`, where the claim scales with the slide width.

## Layout

- 4px grid, spacing `1` (4px) to `8` (64px): `2` between buttons and from label to field, `3` inside controls, `4` card padding, `5` tool panel padding, `6` between blocks, `7`–`8` between sections.
- **Group with space and tone, not boxes.** Related items sit closer; a group that needs a ground takes `surface-1`. Don't draw a border around a group.
- Left-aligned by default; center only single statements.
- Article text at most 660px wide; tool sidebar 216px; control heights 28 / 34 / 42px (small, default, site call to action).

## Elevation & Depth

- Depth is lightness: `sidebar` › `background` › `surface-1` › `surface-2` › `surface-3`, each one step lighter.
- No shadows, except the 1px drop on the switch thumb.
- Lines exist in exactly two places: `border` hairlines between table rows, and a 1px `border` edge on floating layers (`popover`: menus, toasts, tooltips). Fields add a 1px inset `input` edge on top of their fill.
- At most two floating layers on screen at once; a third means a dialog.

## Shapes

- Controls `md`, containers `lg`, large frames and slides `xl`.
- Nested corners are concentric: inner radius = outer radius minus padding (`sm` items inside a 2px-padded `md` track; 7px rows inside a 5px-padded `lg` menu).
- `full` only for switches, avatars and status dots. Buttons are never pills.

## Components

**Closed vocabulary.** Use only the component names in the front matter (and, in code, the matching `rt-` classes below). Don't invent aliases. If something is missing, build it from these tokens and add it here before reusing it.

| Front matter | Class | Notes |
|---|---|---|
| `button-primary` / `-secondary` / `-ghost` / `-destructive` | `rt-btn` + `--primary` … `--destructive`, sizes `--sm` `--lg` | Filled, never outlined. One primary per view; secondary is the default. |
| `input`, `input-focus`, `input-error` | `rt-field`, `rt-input`, `rt-help` | Label above, help below. Error via `aria-invalid="true"` plus one sentence of help. |
| `switch-track` | `rt-check`, `rt-check--radio`, `rt-switch__track` | Native inputs kept for keyboard and screen readers. Switch only for settings that apply immediately. |
| `segmented`, `segmented-item-active` | `rt-seg` | Two to four views of the same data. Never emerald. |
| `tab-active` | `rt-tabs` | Sections of one page. No underline bar. |
| `popover`, `menu-item` | `rt-menu` | Shortcuts right-aligned in `muted-foreground`; destructive items last. |
| `popover` | `rt-toast` | Past-tense title, one ghost action at most, no icon. |
| `notice-warning`, `notice-error` | `rt-notice` | Inline, persistent. No border, no left accent bar. |
| — | `rt-status` | 6px dot plus a word. Never a pill or badge. |
| `table-row`, `table-row-hover` | `rt-table`, `rt-num` | Full width; numbers and their headers right-aligned. |
| `sidebar`, `sidebar-item-active` | `rt-sidebar` | Separated by tone, never a line. The workspace mark is its only emerald. |

**States.** Every interactive element is drawn in all four states: rest, hover, focus, disabled. Focus is always `focus-ring` (2px solid `ring`, 2px offset), at least 3:1 on every surface it lands on. Disabled swaps to `surface-1` and `subtle-foreground`; it never uses opacity.

## Motion

Quick and quiet. Color changes take 150ms, movement (switches, theme change) 200ms, both on `cubic-bezier(0.2, 0, 0, 1)`. Motion only answers a state change: no entrance animations, no bounce, no parallax.

## Surfaces

| Surface | First job | Density | Rules |
|---|---|---|---|
| Site / portfolio | Show judgment through real work | Low | First screen is a left-aligned claim and the work list. One primary button. |
| Articles / notes | Reading | Low | `prose` at 660px, `h2` for sections, links in `primary` with a soft underline. |
| Slides | One claim per slide | Low | One sentence as the headline; emerald highlights at most one phrase or one bar. |
| Tools / prototypes | Get the task done | Medium | `sidebar` plus main area, `ui` and `small` text, 38px list rows. |

All four share the color budget: one emerald moment per view.

## Do's and Don'ts

- **Don't** open with a centered hero and three icon cards. **Do** lead with a real claim or the work, left-aligned.
- **Don't** box every group or nest cards in cards. **Do** group with space, tone and type size.
- **Don't** use gradients, glows, glassmorphism, grid backdrops or large shadows. **Do** use flat tone steps.
- **Don't** wrap ordinary metadata in badges or pills. **Do** set it in `small`, `muted-foreground`; dots only for real status.
- **Don't** put decorative icons before headings or on tinted tiles. **Do** use icons only on actions.
- **Don't** slide into terminal or brutalist styling: no mono headlines, no heavy raw borders, no all caps. **Do** keep mono in code.
- **Don't** squeeze tables into narrow columns or mix alignments. **Do** give tables full width, right-align numbers and their headers.
- **Don't** color numbers green because they are "good". **Do** state change in `muted-foreground`; emerald is for action and status only.

Restraint isn't emptiness. Tension comes from scale contrast in type (a `display` claim over `body` copy), generous space, exact alignment, and the single emerald moment.
