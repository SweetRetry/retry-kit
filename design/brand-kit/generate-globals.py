#!/usr/bin/env python3
"""Regenerate globals.css from tokens.json: python3 brand-kit/generate-globals.py"""
import json, sys, re
import os
here = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "tokens.json")
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(here, "globals.css")
t = json.load(open(src))
toks = {x["name"]: x for x in t["color"]["tokens"]}
def val(n, th):
    v = toks[n]["value"]; v = v if isinstance(v, str) else v.get(th, v["dark"])
    m = re.match(r"^\{(.+)\}$", v)
    return val(m.group(1), th) if m else v
def alias(n):
    v = toks[n]["value"]
    return v[1:-1] if isinstance(v, str) and v.startswith("{") else None
def block(sel, th, extra=""):
    L = [sel + " {"]
    if extra: L.append(extra)
    for n in toks:
        a = alias(n)
        L.append(f"  --{n}: {val(n, th)};" + (f" /* = {a} */" if a else ""))
    L.append("}")
    return "\n".join(L)
rem = lambda px: f"{int(px)/16:g}rem"
type_lines = []
DEFAULT_LH = {"xs":16/12,"sm":20/14,"base":24/16,"lg":28/18,"xl":28/20,"2xl":32/24,"3xl":36/30,"4xl":40/36,"5xl":1.0,"6xl":1.0}
for g in t["type"]["groups"]:
    for s in g["styles"]:
        if not s["name"].startswith("text-"): continue
        k = s["name"][5:]; fs = int(s["fontSize"][:-2]); lh = int(s["lineHeight"][:-2])
        if s["letterSpacing"] not in ("0em", "0"):
            type_lines.append(f"  --text-{k}--letter-spacing: {s['letterSpacing']};")
        if abs(lh/fs - DEFAULT_LH[k]) > 0.005:
            type_lines.append(f"  --text-{k}--line-height: {lh/fs:.4g};")
type_lines.reverse()
fam = t["type"]["families"]
ease = t["easing"]["tokens"][0]["value"]
css = f'''/* Retry — generated from tokens.json. Tailwind CSS v4 + shadcn/ui.
   Load Inter with the opsz axis (next/font/google: Inter({{ axes: ["opsz"] }}),
   or <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..600&display=swap">).
   Dark is the default: put class="dark" on <html>. */

@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme {{
  --font-sans: {fam["sans"]};
  --font-mono: {fam["mono"]};

  /* Sizes and line heights are Tailwind's defaults; Inter's optical sizing
     handles small text. Retry gives text-3xl and up tracking-tight (-0.025em)
     and opens the line height of 5xl and 6xl for multi-line headlines. */
{chr(10).join(type_lines)}

  /* Retry's curve is both the default for every transition-* utility and the
     ease-out utility; Tailwind's default duration (150ms) is kept. */
  --default-transition-timing-function: {ease};
  --ease-out: {ease};

  /* Depth is tone, not shadow: every shadow utility renders nothing. */
  --shadow-2xs: 0 0 #0000;
  --shadow-xs: 0 0 #0000;
  --shadow-sm: 0 0 #0000;
  --shadow-md: 0 0 #0000;
  --shadow-lg: 0 0 #0000;
  --shadow-xl: 0 0 #0000;
  --shadow-2xl: 0 0 #0000;
}}

{block(":root", "light", "  --radius: 0.625rem;")}

{block(".dark", "dark")}

@theme inline {{
{chr(10).join(f"  --color-{n}: var(--{n});" for n in toks)}
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}}

@layer base {{
  * {{
    @apply border-border;
  }}
  html {{
    font-optical-sizing: auto;
    font-feature-settings: "cv11", "ss03";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }}
  body {{
    @apply bg-background text-foreground font-sans;
  }}
  :focus-visible {{
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }}
}}
'''
open(out, "w").write(css)
print(len(css.splitlines()), "lines")
