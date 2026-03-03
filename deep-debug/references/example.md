# Diagnostic Walkthrough Example

**Symptom**: A list page flickers on every navigation — content appears briefly, disappears, then reappears.

---

## Reading the Symptom

- **When**: Every time the page is navigated to, not just the first load
- **What**: Content flashes (appears → disappears → appears), not a layout shift
- **Where**: Reproducible on all routes that use this pattern, not just one page

Signal extracted: "every navigation" rules out a one-time initialization problem. "Appears then disappears" suggests state is being reset or overwritten *after* initial render, not before it.

---

## Hypothesis Ranking

```
Hypotheses (closest to symptom first):
1. [Presentation] CSS transition or animation causing visual artifact
2. [Data/State] List state is reset to empty on navigation, then repopulated
3. [Temporal/Async] Two competing sources are writing to the same state in unpredictable order
4. [Design] The data-fetching strategy assumes a cold start, not a revisit
```

---

## Investigation

**Rule out Presentation**: No CSS transitions on this component. No animation library involved. → Ruled out.

**Check Data/State**: Read the list component. State is initialized to `[]` on every mount. Data is fetched after mount. → This explains the disappear, but not the initial appearance.

**Expand boundary**: Where does the initial data come from? Found a cache layer — on revisit, the cache populates state immediately, then the fetch overwrites it with a fresh response. Two writes, two renders, visible as a flicker.

**Mental model check**:
> "I believed the fetch was the only data source. The symptom reveals there are two: cache (fast) and fetch (slow). They write independently with no coordination."

---

## Root Cause Declaration

```
Root cause: Cache write and fetch write both update the same state independently.
            On navigation, cache fires first (immediate render), fetch completes
            shortly after (second render). The gap between them is the visible flicker.
Evidence:   Cache populates state synchronously on mount; fetch dispatches an
            async update with no deduplication or loading guard.
Fix:        Set a loading flag before fetch; suppress render until fetch settles,
            or merge cache and fetch into a single coordinated update.
```

---

## What Made This Non-Obvious

The flicker looked like a CSS or animation problem — the natural first suspicion for a visual symptom. Ruling out Presentation quickly redirected attention to state. The key insight came from expanding the boundary: reading only the list component wasn't enough. The cache layer, one level up, was the actual owner of the behavior.
