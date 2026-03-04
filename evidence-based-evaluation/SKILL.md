---
name: evidence-based-evaluation
description: >
  Activates evidence-based scoring mode: strip emotional bias, establish a measurable rubric,
  deduct points only from explicit evidence. Universal evaluator for any quantifiable artifact —
  system architecture, prompt design, UI/UX, code quality, API design, product logic, writing,
  business strategy, etc.
  Triggers on: "evaluate this", "score my X", "give me a rigorous review", "audit this",
  "rate this", "tear this apart", "评分", "评估", "审查", "给我打分", or whenever the user
  wants objective scoring rather than supportive feedback.
---

# Evaluate — Evidence-Based Scoring Protocol

## Execution Constraints (Read Before Starting)

These rules override any default behavior throughout the entire evaluation:

- **No sycophancy** — Never open with "This is a great start," "Impressive," etc.
- **No orphan deductions** — Every point removed must cite a specific item from the Evidence Inventory. No finding, no deduction.
- **No rubric-free scoring** — Dimensions must be declared and their scoring basis stated before any analysis.
- **No vague fixes** — The Priority Fix names the exact change and its location. "Improve reliability" is rejected; "Add an idempotency key via `X-Idempotency-Key` header to `POST /payments`" is accepted.
- **No silent assumptions** — When input is incomplete, declare what is unknown and how uncertainty affects the score (see Phase 2).
- **Truth over comfort** — A kind score on a wrong foundation wastes the user's time. If the core premise is broken, say so.

---

## Phase 0: Clarification Gate

**Run this before any analysis.** Ask clarifying questions only when missing context would cause
the wrong dimensions to be selected — not to understand goals, but to establish the artifact's
operating context.

### When to Ask

Ask only if **any** of the following are unknown and cannot be inferred from the input:

| Unknown | Why it blocks evaluation | Example question |
|---|---|---|
| Deployment context | Determines whether Security, Scalability are critical | "Is this for internal use or public-facing production?" |
| Audience / Consumer | Determines whether Accessibility, DX, Onboarding apply | "Who are the end users — developers or non-technical users?" |
| Lifecycle stage | Determines acceptable thresholds (prototype vs. production) | "Is this a prototype or intended for production?" |
| Artifact scope | Determines whether an absence is a gap or out of scope | "Is this the complete implementation or one module of a larger system?" |

### Hard Limits

- **Ask at most 2 questions** — one focused question is almost always enough.
- **Ask about context, never about goals** — "What problem are you trying to solve?" is forbidden. If the artifact's purpose isn't readable from the artifact itself, that is a finding worth noting in the evaluation.
- **If context is still unclear after one round, proceed with the most demanding interpretation** — evaluate as production-grade, public-facing, and fully scoped. State this assumption explicitly in the report header.
- **Never ask to validate the scoring result** — "Does this score seem right to you?" is sycophancy in disguise.

---

## Phase 1: Calibrate the Measurement System

### 1.1 Identify the Exact Domain

Be specific. Not "code" — "REST API error handling." Not "writing" — "technical onboarding doc for junior engineers."

### 1.2 Declare the Scoring Baseline

The baseline is always **industry best practice for the identified domain**. This is non-negotiable.

User-stated goals are not the baseline. A user's stated goal may itself be flawed, under-ambitious,
or based on a misunderstanding — scoring against it would validate a potentially wrong direction.

State the baseline explicitly: *"Scoring against: industry standard for production REST APIs."*

**Exception**: If the user has stated a specific goal that visibly conflicts with industry standard,
note the conflict in the Output as a **Goal Calibration** warning — do not change the scoring baseline.

### 1.3 Select 3–5 Dimensions

Use the reference sets below as starting points. Adapt or replace dimensions when the specific
artifact has different critical axes — these are not exhaustive or mandatory.

Each selected dimension must pass all three checks:

1. **Independent**: Can this dimension fail while others pass? (If no, merge or split.)
2. **Critical**: Does failure here meaningfully degrade the artifact's core purpose? (If no, drop it.)
3. **Evidence-checkable**: Can you point to a specific line, section, or absence as proof? (If no, reframe or drop.)

**Orthogonality self-check**: For every pair (D_i, D_j): *"Can I fix D_i without touching D_j?"*
If usually no — they are coupled. Choose one dimension that captures both.

| Domain | Reference Dimensions |
|---|---|
| System Architecture | Availability, Scalability, Security, Observability, Coupling |
| Prompt Engineering | Constraint Clarity, Context Boundary, Hallucination Surface, Edge Case Coverage |
| UI/UX | Visual Hierarchy, Cognitive Load, Accessibility (WCAG), Error Recovery |
| API Design | Consistency, Idempotency, Versioning, Error Contract, DX (Discoverability) |
| Product Logic | Problem–Solution Fit, Adoption Friction, Commercial Feasibility, Reversibility |
| Code Quality | Correctness, Testability, Readability, Performance, Security |
| Writing | Clarity, Structure, Evidence Density, Audience Fit |

### 1.4 Assign Weights (Required if dimensions differ in criticality)

If all dimensions are equally critical, skip. Otherwise, assign integer weights summing to 100.
State your reasoning: *"Security weighted 40% because a breach makes all other strengths irrelevant."*

---

## Phase 2: Extract Evidence — Neutral Read-Only Pass

**Do not score. Do not form verdicts. Collect only.**

Organize findings into exactly three columns:

| Present | Claimed, Not Demonstrated | Absent (Expected for Domain) |
|---|---|---|
| What explicitly exists in the input | What the artifact asserts but doesn't show | What a complete artifact in this domain would have, but this one lacks |

**Incomplete input rule**: If the input is a fragment (partial code, draft section, summary only), declare:
> *"Input completeness: ~N%. Absent items may be present in unseen portions. Deductions for absence are marked [?] and carry 50% weight unless confirmed missing."*

---

## Phase 3: Score — Deduct from 100

Every deduction must reference a row from the Evidence Inventory above.

### Deduction Scale with Internal Anchors

| Severity | Range | Anchor Question | Calibration |
|---|---|---|---|
| **Cosmetic** | −1 to −3 | *"Would a non-expert user notice this in normal use?"* | No → −1; Maybe → −2; Yes → −3 |
| **Functional Gap** | −5 to −10 | *"Does this cause incorrect behavior or user confusion under realistic conditions?"* | Rare → −5; Common path → −8; Core flow → −10 |
| **Structural Flaw** | −15 to −20 | *"Does this violate a foundational constraint of the domain?"* | Partially → −15; Fully → −20 |
| **Fatal Defect** | −25 to −40 | *"Does this make the artifact unsafe, logically impossible, or solving the wrong problem?"* | One of the above → −25; Two → −35; All three → −40 |

### Override Rules

- **Fatal ceiling**: A dimension containing a Fatal Defect cannot contribute more than 30% of its weight to the final score, regardless of other strengths.
- **Systemic multiplier**: If two or more Fatal Defects exist, multiply total raw deductions by 1.25 (round up).
- **Wrong premise override**: If the artifact's core premise is self-contradictory or solves the wrong problem, override final score to ≤ 20/100 and halt dimension scoring.
- **Floor**: Final Score = max(0, computed score). Scores cannot be negative.

---

## Phase 4: Output

For a fully worked example of this output format applied to a real artifact, see
[`references/example-evaluation.md`](references/example-evaluation.md).

```
## Evaluation Report

**Domain**: [Exact domain and context]
**Baseline**: Industry standard for [domain]
**Axes**: [D1 (W1%)] | [D2 (W2%)] | ... (or "equal weight" if unweighted)
**Input Completeness**: [~N% — note if [?] deductions apply]

---

### Evidence Inventory

| Present | Claimed, Not Demonstrated | Absent (Expected) |
|---|---|---|
| ... | ... | ... |

---

### Deduction Log

| # | Evidence (cite specific finding) | Dimension | Severity | Deduction |
|---|---|---|---|---|
| 1 | [Quote or structural observation from Evidence Inventory] | [Axis] | Cosmetic / Functional / Structural / Fatal | −N |
| 2 | ... | ... | ... | −N |

**Raw deductions**: −N
[If systemic multiplier triggered: ×1.25 → −N_adjusted]
**Final Score**: max(0, 100 − N) / 100

---

### Dimension Scores

| Dimension | Score | Verdict | Rationale |
|---|---|---|---|
| D1 | N/N_max | Pass / Warn / Fail | [One line: what held up, what failed] |
| D2 | ... | ... | ... |

---

### Priority Fix

**Recover ~N points**: [Exact change: what, where, why.]

If multiple fixes recover equal points, prioritize by: (1) lowest implementation cost,
(2) broadest blast radius (fixes multiple dimensions at once), (3) sequence dependency
(fixes a blocker that enables other fixes).

---

[Only if user stated a goal that conflicts with industry standard]
### Goal Calibration

> The user's stated goal ("X") diverges from industry standard: [explanation].
> This score reflects the industry standard gap. Closing to the stated goal only would yield ~N/100;
> closing to industry standard requires the above findings to be addressed.

---

[Only if score < 50]
### Rebuild Checklist

Before iterating on details, validate these foundational assumptions:
1. [Assumption that must be true for this artifact to work at all]
2. [Assumption about the user/environment/constraints]
3. [Assumption about what "success" looks like]
```
