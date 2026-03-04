---
name: deep-debug
description: "Activates expert diagnostic mode for root cause analysis. Use this instead of attempting a direct fix when: the bug is non-obvious, a previous fix attempt failed, the symptom is indirect (visual glitch, wrong value, intermittent crash), or the user explicitly invokes /debug. Shifts Claude from \"guess and patch\" to \"understand then fix\" — symptom-driven inference, confirmed root cause before any code change, language-agnostic."
---

# Deep Debug

## Diagnostic Posture

The objective is to **locate the root cause** before touching any code. A fix without confirmed understanding is a guess — and wrong guesses obscure the real problem.

Read the symptom for diagnostic signal:
- **When** it occurs (always, intermittently, after a specific action, on first load) → hints at state or initialization
- **What** it looks like (wrong value, visual artifact, crash, missing data) → hints at which layer is involved
- **Where** it's reproducible (specific input, specific environment, specific sequence) → hints at a boundary condition

Use these characteristics to form hypotheses. The symptom tells you where to look.

---

## Reasoning Layers

Order hypotheses by causal proximity to the symptom — closest first:

```
Presentation → Value/Config → Module/Build → Data/State → Temporal/Async → Design/Architecture
```

Never skip a layer without stating why it's ruled out.

Before writing any fix, declare:

```
Root cause: [specific explanation]
Evidence: [what in the code or output confirms this]
Fix: [one sentence]
```

Keep the fix minimal — only change what the confirmed root cause requires.

---

## When the Investigation Stalls

If reading the obvious files doesn't locate the divergence, the root cause lives outside the current search boundary. Expand systematically:

- Is the symptom produced here, or passed in from a caller or dependency?
- Is there another code path that touches the same state or resource?
- Could the symptom depend on ordering or timing between things that appear unrelated?

If none of those open a lead, the mental model of the system may be wrong. Articulate it explicitly:

> "I believe this code does X. The symptom suggests it's actually doing Y. The divergence point is at Z."

If Z is unclear, that *is* what to find next — before forming new hypotheses.

---

## Interrogating Assumptions

When the symptom resists obvious explanation, look for violated assumptions. Every piece of code encodes implicit beliefs about the world it runs in (non-null input, single caller, sequential execution, stable external state). Ask:

- What must be true for this code to work correctly?
- Which of those conditions can the failing scenario violate?

If a design-level assumption is violated, a localized patch will be fragile. Make this explicit to the user — the fix may require a design change, not just a code change.

---

## When Context Is Insufficient

If the symptom doesn't provide enough signal to rank hypotheses, ask — but ask for the one piece of information that unlocks the most diagnostic value:

- **Reproduction pattern**: Does it happen always, or only under specific conditions?
- **Change delta**: What changed since it last worked?
- **Targeted observation**: What is the value/state at [specific point]?

When new information arrives, re-rank all hypotheses from scratch. Do not retrofit new evidence onto an existing theory.

---

## After the Fix

Verify against the original symptom — not just that the code compiles or runs. If the fix introduces a new failure, first determine causality:

- **Causally linked** (the fix changed behavior it shouldn't have touched) → invalidate the fix, re-diagnose from the root cause declaration
- **Independent** (unrelated code path, different trigger condition) → treat as a separate bug and restart from the top

Never patch on top of a broken fix.

---

## Hard Rules

- No fix without a declared root cause and evidence
- No layer skipped without a stated reason
- No abandoned hypothesis without explicit discard — state why it fails before forming the next
- No second fix that contradicts the first without explicitly invalidating the first hypothesis

---

## Example

Use this full calibration walkthrough for complex cases:

1. Symptom read:
   - When: submit works on fresh load, breaks only after editing any input.
   - What: click has no effect, no error, no network request.
   - Where: all forms that share `<FormWrapper>`.
2. Initial hypothesis ranking:
   - Presentation: invisible overlay blocks click.
   - Value/config: validation flag incorrectly disables submit after edits.
   - Data/state: `onChange` mutates shared state wrongly.
   - Design/closure: handler uses stale closure after re-render.
3. First pass investigation:
   - Rule out overlay (`disabled`, `pointer-events`, z-index blockers absent).
   - Rule out validation gate (`isValid` remains true and click path not gated).
   - State writes look correct (`setFormData(prev => ({ ...prev, [k]: v }))`).
4. Explicit invalidation:
   - "state mutation bug" is discarded because observed state is correct.
   - Re-rank from scratch using the new model: "handler reference likely stale."
5. Second pass:
   - Check memo boundary assumptions (`React.memo` not present).
   - Inspect submit handler and find:
     ```js
     const handleSubmit = useCallback(() => {
       onSubmit(formData);
     }, []);
     ```
   - Confirm stale capture: log inside handler always prints mount-time `formData`.
6. Root cause declaration:
   - `useCallback([])` froze `handleSubmit` with initial `formData` and `onSubmit`.
   - Keystrokes update state, but submit reads stale snapshot.
7. Fix pattern:
   - Add dependencies (`[formData, onSubmit]`) if recomputation is acceptable.
   - Or use a stable event handler/ref pattern that reads current state at call time.
8. Post-fix verification:
   - Re-test original symptom path first (edit then submit).
   - Verify no regression in untouched forms.

Discipline rule: if evidence and current hypothesis diverge, invalidate the hypothesis before any patch.
