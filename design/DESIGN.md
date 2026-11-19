---
version: alpha
name: Retry
description: A personal design language on Tailwind CSS v4 and shadcn/ui (Base UI), for a site, notes, slides and tools.
omitted:
  - section: colors
    reason: In brand-kit/globals.css as oklch (:root light, .dark dark, the default).
  - section: typography
    reason: Tailwind v4's scale; Retry's tracking-tight on 3xl and up and the 5xl/6xl line heights are in brand-kit/globals.css @theme.
  - section: rounded
    reason: shadcn's default --radius (0.625rem) in brand-kit/globals.css; rounded-* derive from it.
  - section: spacing
    reason: Tailwind defaults, used as listed under Layout.
  - section: motion
    reason: Motion (motion/react) with MotionConfig defaults; rules under Motion.
  - section: components
    reason: shadcn/ui on Base UI; the deltas are in brand-kit/SETUP.md.
---

# Retry

Decisions live here. Values live in `brand-kit/globals.css` and are not repeated; setup and the shadcn component deltas live in `brand-kit/SETUP.md`, applied once in the component files.

Retry is a personal design language for a site, notes, slides and small tools: quiet surfaces, careful type, and one color that only shows up when it means something.

## Overview

- **Restrained**: no gradients, glows, decorative glass or shadows to fake polish.
- **Precise**: exact alignment, numbers and wording. No filler, no fake stats.
- **Warm**: not corporate. First person, room to breathe.

Made for peers and collaborators who judge the thinking, not the packaging. It aims for product clarity, a quiet finish, and quiet craft: small details with a job, unnoticed at first glance and rewarding on the second. Never: terminal or hacker styling, neo-brutalism, the SaaS template (blue-purple gradient, centered hero, three feature cards), showpieces made to be admired rather than used, an untouched shadcn default.

**Signature.** Its nearest neighbor is an untouched dark shadcn; a page is Retry when these five hold:

1. Groups are set apart by tone steps and space, with no border and no shadow.
2. Emerald appears once per view, where it means something.
3. Status is a dot plus a word, never a badge.
4. An action sits on its object, as an icon when the icon is universal.
5. Fields are filled, not outlined.

When rules compete: facts and constraints › the host project's framework › task clarity › Retry's look › polish.

**Floor**, which no surface overrides: the three traits and the never list, the signature, the voice, the order above, the Don'ts, the closed vocabulary under Components, and access (text contrast as recorded in `brand-kit/tokens.json`, a visible focus ring, status never by color alone, motion off under reduced motion). Everything else is a default, and a surface file may override it with a reason.

## Voice

- **Language**: English first. A product shipped in another language keeps the same voice, written natively rather than translated.
- **By surface**: site, notes and slides speak in the first person ("I design and build…"); product UI speaks as the product, with the object as subject ("Your projects", "Note published").
- **Rhythm**: short sentences, conclusion first. Short parallel lines ("Fewer things. Better.") only in site and slide headlines; product UI states things plainly.
- **Tone** moves with what is at stake for the person; the voice does not. A moment with room for warmth (a start, an empty state, a first success) may say one human thing: "Nothing here yet. Start with a note." A moment that must stay plain (an error, a permission, billing, deletion) says what happened and what to do next, with no apology and no cheer: "Couldn't save. Check your connection and try again."
- Sentence case everywhere. No emoji, no exclamation marks, never narrate the design on the page.

## Colors

- **Depth is lightness.** Background, card and popover are containers; secondary, muted and accent are fills and sit one rung above every container, so a fill or a hover reads on any of them. Stack a container on a fill, never a fill on a fill. New neutrals stay on hue 286 and step L only.
- **Text**: `text-foreground` to read, `text-muted-foreground` to support, `text-subtle-foreground` only for placeholders, timestamps and column headers on background, surface-1 or sidebar. Never set text hierarchy with opacity (a transient state such as stale data while reloading may fade).
- **Emerald (`primary`) is scarce**: one primary button per view, links, checked controls, focus, success. Under 5% of the screen; never decoration, never "good" numbers.
- **Status** (`success`, `warning`, `destructive`) always comes with a word; notices use the `*-soft` fills.
- **Direction colors** (up green, down red) are off unless a surface's core information is direction; then always with + or −, declared in that surface's file.
- `accent` is shadcn's neutral hover, not a brand color. Charts: `chart-1` for the series that matters, `chart-5` for the rest.

## Typography

The theme already sets tracking and line height on large sizes, so headings take no `tracking-*` or `leading-*`. `font-mono` only for code and data.

| Class | Role |
| --- | --- |
| `text-6xl` / `text-5xl` | Cover / site hero, once per page |
| `text-4xl` · `text-3xl` · `text-xl` | h1 · h2 · h3 (`font-semibold`) |
| `text-2xl` | Slide subheads, stat numbers |
| `text-lg` | Article body, `max-w-2xl` |
| `text-base` | Site copy |
| `text-sm` | Interface text; labels `font-medium` |
| `text-xs` | Metadata, timestamps, column headers, help |

Weights 400, 500, 600 only. `tabular-nums` on numbers that line up; `text-balance` on headings.

## Layout

Tailwind spacing, in these steps: `gap-1` icon to label · `gap-2` buttons, label to field · `p-4` cards · `p-6` tool panels · `gap-8` blocks · `py-12` tool sections · `py-16` site sections. Group with space and tone, never a border around a group. Left-aligned by default. Articles `max-w-2xl`, sidebar `w-54`, controls `h-8` / `h-9` / `h-10`. On a narrow screen the sidebar gives way first, into a Sheet, then secondary columns; type sizes and the reading width hold.

## Elevation & Depth

Lines appear only between table rows and around floating layers. At most two floating layers at once. Blur only on chrome that content scrolls under: `bg-background/85 backdrop-blur`.

## Shapes

`rounded-md` for controls, popovers, menus and tooltips; `rounded-sm` for items inside them; `rounded-lg` for dialogs; `rounded-xl` for cards; `rounded-2xl` for emphasised containers and slides. Nested corners follow inner = outer − padding, rounded down to a step. `rounded-full` only for switches, avatars and dots. Change `--radius`, never single classes.

## Components

Theme utilities only: no arbitrary values (`bg-[#…]`, `text-[13px]`). A new value goes into the tokens first. Use the shadcn/ui components as they stand in the project; their look is already Retry's.

- **States**: hover is one rung up the tone ladder; disabled reads flat, never faded. Empty is a line of words and the one action that fills it. An error is `text-destructive` words beside the thing that failed.
- **Button**: `default` once per view, then `secondary`, `ghost`, `destructive`, `link`. No `outline`. Icon-only buttons use the square `icon` sizes, matched to the control height around them.
- **Input group**: a field with things inside it (a submit, a chip line, a unit) is one field; the control inside is bare.
- **Badge**: not for metadata. Status is a 6px dot plus a word.
- **Table**: numbers and their headers `text-right tabular-nums`; full width.

## Iconography

Icons are part of the language, like type: they carry actions and meaning, never decoration. Lucide (`lucide-react`) at its default stroke, sized by the control it sits in (the `icon` button sizes, `data-icon` beside a label).

- **An action's face follows how well its icon is known and how often it is met.** A universal action (send, close, play and pause, add, remove from a list, copy, search, more, previous and next, expand) is an icon-only button wherever it sits in a field, a row, a toolbar or a repeated item. Its `aria-label` names it, and a tooltip names it and gives the shortcut. An action whose icon a newcomer could misread gets a word, with the icon in front when it helps recognition. Removing the one item in front of you stays an icon; an action that can't be undone on something bigger than that item (an account, a project, a whole batch) is a word. The one decision a view exists for is a word on the single `default` button.
- **An action sits on its object.** A field that sends on its own (a message, a comment, a search) holds its submit inside, bottom right, as an input group; a form's submit follows the form. A row's actions are at the row's end. A media control is on the media. Actions lined up in a separate row of text buttons, away from what they act on, are placed by default rather than by design.
- **Meaning, not ornament.** An icon may stand for a kind (file type, media kind) or a state (playing, recording) where a word won't fit. Status stays a dot plus a word.
- **No illustration.** No spot art, mascots or empty-state graphics; the words carry those moments.

## Motion

Only Retry's own choices are here; general interaction craft (waiting states, hover alternatives, loading, reduced motion) is assumed.

- **Quiet craft**: a detail earns its place only if it has a job, stays invisible at first glance, lives where the person touches, and disappears under reduced motion. Adopted: changing numbers roll only the digits that changed; text links draw their underline in from the left on hover and out to the right.
- **Motion**: CSS transitions for hover, press and color, naming only the property (`transition-colors`); `duration-200` for movement. Motion (`motion/react`) for anything that appears, leaves or changes place; springs only with `bounce: 0`. No decorative entrances.

## Surfaces

| Surface | Job | Density |
| --- | --- | --- |
| Site | Show the work; left-aligned `text-5xl` claim, one primary button | Low |
| Articles | Reading; `text-lg` in `max-w-2xl` | Low |
| Slides | One claim per slide; emerald on one phrase at most | Low |
| Tools | Get it done; sidebar, `text-sm`, `h-10` rows | Medium |

A surface that needs other parameters gets a `<surface>.md` beside this file: what it inherits, what it overrides, why.

## Do's and Don'ts

- Centered hero with three feature cards → a real claim or the work, left-aligned.
- Boxes around groups, cards in cards → space, tone, type size.
- Gradients, glows, glass cards, grid backdrops, shadows → flat tone steps.
- Untouched shadcn components → the deltas above.
- Badges on metadata → `text-xs text-muted-foreground`.
- Icons on headings, icons for symmetry → icons only where they act or carry meaning.
- Universal actions spelled out, a row of text buttons under a field → icon buttons where the object is.
- Mono headlines, heavy borders, all caps → mono stays in code.
- Squeezed tables, mixed alignment → full width, numbers right.
- Green for good numbers → `text-muted-foreground`.
- Arbitrary values → theme utilities.

Restraint isn't emptiness: tension comes from type scale contrast, space, exact alignment, and the one emerald moment.
