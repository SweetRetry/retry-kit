---
name: design-md-creator
description: Create or update design.md for reusable brand or design guidance for agents. A complaint about one page alone does not trigger this skill.
---

# Create a design.md

Distill project evidence and human corrections into reusable, observable design decisions. Keep page-specific fixes in the current artifact unless they reveal a reusable rule.

## 1. Inspect the affected sources

Read relevant tokens, CSS, shipped pages, authorship elements, voice and recurring artifact types. For a local update, inspect only affected rules and evidence. Prefer shipped code when it conflicts with drafts; ask only about critical conflicts affecting brand identity or facts.

## 2. Place each rule at its responsibility layer

- **Judgment → design.md**: reader tasks, information architecture, composition and evidence priorities.
- **Mechanics → existing tokens or stylesheet**: exact colors, fonts, spacing and class names. Read definitions only to verify tokens or diagnose conflicts; document the public vocabulary and extension mechanism.
- **Mechanical verification → deterministic checks**: assertions such as overflow, contrast or unregistered classes.

Express judgment as observable behavior, with a reason where misapplication is likely. Use supplied corrections; do not require a fixed number of complaints or turn sample values into universal rules.

## 3. Synthesize the guidance

When creating or restructuring the file, read [design-md-template.md](references/design-md-template.md); a narrow edit does not need the full template. Keep only project-backed sections and decisions, with no target line count.

Preserve facts and caller constraints before reader clarity, brand authorship, material composition and micro-details. Reuse existing style definitions; only include exact public classes, tokens and documented extensions.

When reusable feedback rejects generated design patterns, read [anti-slop-patterns.md](references/anti-slop-patterns.md) and select applicable patterns. Do not import the full catalogue as a default style.

## 4. Verify and deliver

Check changed rules against project evidence and existing guidance. For a new behavioral principle needing comparison, read [eval-and-verification.md](references/eval-and-verification.md) and compare baseline with guided output on one representative scenario. Require structural differences only for structural rules; wording edits do not require page regeneration.

Deliver design.md. Add a token or class contract only when the requested guidance needs it. When integration is requested, add one context pointer to AGENTS.md or CLAUDE.md; keep the guidance in design.md.
