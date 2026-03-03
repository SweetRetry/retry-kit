# Diagnostic Walkthrough Example

**Symptom**: A form's submit button becomes unresponsive after the user edits a field — clicking it does nothing.

---

## Reading the Symptom

- **When**: Only after the user has typed into any input field; the button works fine on a fresh page load
- **What**: No error thrown, no network request fired, no visual feedback — complete silence
- **Where**: Reproducible on all forms using this shared `<FormWrapper>` component

Signal extracted: "works on fresh load, breaks after interaction" points at state mutation triggered by user input. "Complete silence" (no error, no request) suggests the handler is either never called or is short-circuiting before side effects.

---

## Initial Hypothesis Ranking

```
1. [Presentation]  Button is visually enabled but a CSS overlay is blocking clicks
2. [Value/Config]  A validation flag is incorrectly set to "invalid" after any edit, disabling submission
3. [Data/State]    An onChange handler is mutating shared state that the submit handler reads
4. [Design]        FormWrapper re-renders in a way that replaces the submit handler with a stale closure
```

---

## Investigation — First Pass

**Check Presentation**: Inspect the DOM. Button has no `disabled` attribute, no pointer-events override, no overlay element on top. → Ruled out.

**Check Value/Config — validation flag**: Read the validation logic. `isValid` is `true` after a clean edit. The submit button's `onClick` is not gated on `isValid`. → Ruled out.

**Check Data/State — onChange mutation**: Read the `onChange` handler. It calls `setFormData(prev => ({ ...prev, [field]: value }))`. Looks correct. The submit handler reads `formData` and calls `onSubmit(formData)`.

At this point, `formData` appears to be updated correctly and the submit handler appears to be wired correctly. The symptom is not explained.

---

## First Hypothesis Invalidated

The original hypothesis ranked "shared state mutation" second. Investigation shows state is being updated correctly — it is not the cause. The hypothesis is **explicitly discarded**.

**Revised mental model:**

> "I assumed the submit handler was a stable reference. But `onSubmit` is passed as a prop from the parent. If the parent re-renders and passes a new function reference, `FormWrapper` might be holding a stale closure — one that captured the original empty `formData`."

Re-rank from scratch based on this new model:

```
1. [Design/Closure]   FormWrapper captures onSubmit in a useCallback or ref without updating it
2. [Temporal/Async]   Parent re-renders on every keystroke, passing a new onSubmit that FormWrapper ignores
3. [Module/Build]     FormWrapper memo boundary prevents prop updates from propagating
```

---

## Investigation — Second Pass

**Rule out Module/Build — memo boundary**: Check if `FormWrapper` is wrapped in `React.memo`. It is not. No memo boundary exists. → Ruled out.

**Check FormWrapper source**: Found this:

```js
const handleSubmit = useCallback(() => {
  onSubmit(formData);
}, []); // ← empty dependency array
```

`handleSubmit` is memoized with no dependencies. It captures the `formData` and `onSubmit` from the initial render. Every subsequent render — triggered by every keystroke — updates `formData` in state, but `handleSubmit` still calls the version from mount. The submitted data is always the initial empty object.

**Confirm with mental model check:**

> "I believed `useCallback` was an optimization. The symptom reveals it is a bug: the optimization is preventing the handler from seeing updated state. The divergence point is the empty dependency array."

---

## Root Cause Declaration

```
Root cause: useCallback with an empty dependency array memoizes handleSubmit
            at mount time. It permanently captures the initial formData (empty)
            and the initial onSubmit reference. User edits update React state
            correctly, but the submit handler never reads the updated value.

Evidence:   useCallback([]}) in FormWrapper — formData and onSubmit are not
            listed as dependencies. Confirmed by logging formData inside
            handleSubmit: it always prints the mount-time snapshot.

Fix:        Add formData and onSubmit to the dependency array, or replace
            useCallback with a ref-based stable handler that reads current
            state at call time.
```

---

## What Made This Non-Obvious

The first investigation pass found nothing wrong. State was updating correctly. The button was not disabled. There was no error. Everything looked fine — because the bug was not in *any single piece*, but in the relationship between pieces: a memoization boundary that was silently disconnecting the handler from the state it needed to read.

The key discipline: when the obvious files don't contain the bug, **explicitly invalidate the current hypothesis** before forming a new one. Do not add a patch to an explanation that doesn't fit. Articulate the new mental model first, then re-rank, then investigate.
