---
version: alpha
name: Retry
description: Zimin's design language on Tailwind CSS v4 and shadcn/ui, for the site, notes, slides and tools.
omitted:
  - section: colors
    reason: In globals.css as oklch (:root light, .dark dark, the default).
  - section: typography
    reason: Tailwind v4's scale; Retry's tracking-tight on 3xl and up and the 5xl/6xl line heights are in globals.css @theme.
  - section: rounded
    reason: shadcn's default --radius (0.625rem) in globals.css; rounded-* derive from it.
  - section: spacing
    reason: Tailwind defaults, used as listed under Layout.
  - section: motion
    reason: Motion (motion/react) with MotionConfig defaults; rules under Interaction patterns.
  - section: components
    reason: shadcn/ui with the deltas listed under Components.
---

# Retry

Retry is Zimin's design language for the site, notes, slides and small tools: quiet surfaces, careful type, and one color that only shows up when it means something. It grows on Tailwind CSS v4 and shadcn/ui: their scales unchanged, Retry's values in `globals.css`, and a short list of shadcn deltas.

## Overview

- **Restrained**: no gradients, glows, decorative glass or shadows to fake polish.
- **Precise**: exact alignment, numbers and wording. No filler, no fake stats.
- **Warm**: not corporate. First person, room to breathe.

Made for peers and collaborators who judge the thinking, not the packaging. References: Linear's clarity, Apple's quiet finish, and quiet craft: small details with a job, unnoticed at first glance and rewarding on the second. Never: terminal or hacker styling, neo-brutalism, the SaaS template (blue-purple gradient, centered hero, three icon cards), Dribbble showpieces, an untouched shadcn default.

When rules compete: facts and constraints › the host project's framework › task clarity › Retry's look › polish.

### Setup

Use `globals.css` as the global stylesheet (it replaces shadcn's). Put `class="dark"` on `<html>`. Load Inter with the `opsz` axis. Animate with Motion (`motion/react`), with the app wrapped once in `<MotionConfig reducedMotion="user" transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}>`, so components set no `transition` unless they need a different duration.

### Voice

- English, sentence case, short sentences, conclusion first.
- First person on the site and in notes; product UI speaks as the product ("Your projects").
- Buttons are verbs ("Save draft"), never "Submit" or "OK". Confirmations in past tense, no "successfully".
- Errors say what happened, then what to do. Empty states name the space and offer one verb.
- No emoji, no exclamation marks, never narrate the design on the page.

## Colors

shadcn names, so every color is a utility (`bg-card`, `text-muted-foreground`). Retry adds `surface-1…3`, `subtle-foreground`, `success`, `warning`, `*-hover` and `*-soft`. Values are `oklch()`; dark (`.dark`) is the default, light (`:root`) a full theme.

- **Depth is lightness.** `bg-background` › `bg-surface-1` (= card, muted) › `bg-surface-2` (= secondary, accent) › `bg-surface-3`. New neutrals stay on hue 286 and step L only.
- **Text**: `text-foreground` to read, `text-muted-foreground` to support, `text-subtle-foreground` only for placeholders, timestamps and column headers on background, surface-1 or sidebar. Never set text hierarchy with opacity (a transient state such as stale data while reloading may fade).
- **Emerald (`primary`) is scarce**: one primary button per view, links, checked controls, focus, success. Under 5% of the screen; never decoration, never "good" numbers.
- **Status** (`success`, `warning`, `destructive`) always comes with a word; notices use the `*-soft` fills.
- `accent` is shadcn's neutral hover, not a brand color. Charts: `chart-1` for the series that matters, `chart-5` for the rest.

## Typography

Inter (`font-sans`) with optical sizing, which already tightens large text. Sizes are Tailwind's; the theme gives `text-3xl` and up `tracking-tight`, and `text-5xl`/`text-6xl` room between lines, so don't add `tracking-*` or `leading-*` to headings. `font-mono` only for code and data.

| Class | Role |
|---|---|
| `text-6xl` / `text-5xl` | Cover / site hero, once per page |
| `text-4xl` · `text-3xl` · `text-xl` | h1 · h2 · h3 (`font-semibold`) |
| `text-2xl` | Slide subheads, stat numbers |
| `text-lg` | Article body, `max-w-2xl` |
| `text-base` | Site copy |
| `text-sm` | Interface text; labels `font-medium` |
| `text-xs` | Metadata, timestamps, column headers, help |

Weights 400, 500, 600 only. `tabular-nums` on numbers that line up; `text-balance` on headings.

## Layout

Tailwind spacing, in these steps: `gap-1` icon to label · `gap-2` buttons, label to field · `p-4` cards · `p-6` tool panels · `gap-8` blocks · `py-12` tool sections · `py-16` site sections. Group with space and tone, never a border around a group. Left-aligned by default. Articles `max-w-2xl`, sidebar `w-54`, controls `h-8` / `h-9` / `h-10`.

## Elevation & Depth

No shadows: `globals.css` empties every `shadow-*`, including those inside shadcn components. Lines appear only between table rows and around floating layers (`border`). Popover, menu and toast use `bg-popover`; Dialog and Sheet use `bg-background` over their overlay; Tooltip inverts (`bg-foreground text-background`). The sidebar sits beside the page, not on it, so in dark it is a step darker than `background` on purpose. At most two floating layers at once.

## Shapes

shadcn's default `--radius` (0.625rem) is the base. `rounded-md` (8px) for controls, popovers, menus and tooltips; `rounded-sm` (6px) for items inside them; `rounded-lg` (10px) for dialogs; `rounded-xl` (14px) for cards; `rounded-2xl` (18px) for emphasised containers and slides. Nested corners follow inner = outer − padding, rounded down to a step. `rounded-full` only for switches, avatars and dots. Change `--radius`, never single classes.

## Components

Theme utilities only: no arbitrary values (`bg-[#…]`, `text-[13px]`). A new value goes into the tokens first. Components are shadcn/ui with these deltas, applied once in the component files:

- **Card**: no border; `bg-card` alone.
- **Input, Textarea, Select**: filled `bg-muted` with the `border-input` edge; focus `border-ring` plus a soft ring.
- **Button**: `default` once per view, then `secondary`, `ghost`, `destructive` (`bg-destructive-soft text-destructive`), `link`. No `outline`.
- **Badge**: not for metadata. Status is a 6px dot plus a word.
- **Tabs**: active is `bg-surface-2`; no underline, no emerald.
- **Popover, Dropdown, Toast**: `bg-popover`, `border`, `rounded-md`. **Dialog, Sheet**: `bg-background`, `border`, Dialog `rounded-lg`. **Tooltip**: `bg-foreground text-background`, `rounded-md`.
- **Table**: `border-t` rows, no outer border or zebra; numbers and their headers `text-right tabular-nums`.
- **Sidebar**: separated by tone, no line; active `bg-sidebar-accent`.
- **Switch, Checkbox, Radio**: off `bg-surface-2` / `bg-surface-3`, on `bg-primary`. **Skeleton**: `bg-surface-2`.

## Interaction patterns

- **States**: design rest, hover, focus and disabled. Focus is a 2px `ring` outline, 2px offset. Disabled is `bg-surface-1 text-subtle-foreground`, never `opacity-50`.
- **Undoable, rarely failing actions** (create, rename, move, toggle): update instantly, show a quiet dot until confirmed, revert with a toast on failure.
- **Money, other people, or irreversible**: spinner inside the button, no optimistic update.
- **First loads**: Skeleton in the shape of the content; nothing under 300ms; never a full-page spinner.
- **Hover-only actions** need a second route: shortcut, context menu or swipe. Primary actions are always visible.
- **Direction colors** (up green, down red) are off unless a surface's core information is direction; then always with + or −, declared in that surface's file.
- **Quiet craft**: a detail earns its place only if it has a job, stays invisible at first glance, lives where the person touches, and falls back to no motion under reduced motion. Adopted: numbers that change roll only the digits that changed (tabular, no layout shift); text links draw their underline in from the left on hover and out to the right.
- **Blur** only on chrome that content scrolls under: `bg-background/85 backdrop-blur`.
- **Motion**: CSS transitions for hover, press and color: name the property and nothing else (`transition-colors`, `transition-transform`); the theme already defaults every transition to 150ms on Retry's curve. Add `duration-200` only for movement. Motion for anything that appears, leaves or changes place: `AnimatePresence` for enter and exit, `layout` / `layoutId` for reflow and shared elements (a thumbnail opening to full view). Same curve everywhere (`ease-out` = `[0.2, 0, 0, 1]`); a spring only as `{ type: "spring", bounce: 0 }`. Animate only `transform` and `opacity`. Motion answers a state change: no decorative entrances, no bounce.

## Surfaces

| Surface | Job | Density |
|---|---|---|
| Site | Show the work; left-aligned `text-5xl` claim, one primary button | Low |
| Articles | Reading; `text-lg` in `max-w-2xl` | Low |
| Slides | One claim per slide; emerald on one phrase at most | Low |
| Tools | Get it done; sidebar, `text-sm`, `h-10` rows | Medium |

A surface that needs other parameters gets `design/<surface>.md`: what it inherits, what it overrides, why.

## Do's and Don'ts

- Centered hero with three icon cards → a real claim or the work, left-aligned.
- Boxes around groups, cards in cards → space, tone, type size.
- Gradients, glows, glass cards, grid backdrops, shadows → flat tone steps.
- Untouched shadcn components → the deltas above.
- Badges on metadata → `text-xs text-muted-foreground`.
- Decorative icons on headings → icons only on actions.
- Mono headlines, heavy borders, all caps → mono stays in code.
- Squeezed tables, mixed alignment → full width, numbers right.
- Green for good numbers → `text-muted-foreground`.
- Arbitrary values → theme utilities.

Restraint isn't emptiness: tension comes from type scale contrast, space, exact alignment, and the one emerald moment.
