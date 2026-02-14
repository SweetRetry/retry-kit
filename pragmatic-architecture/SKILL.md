---
name: pragmatic-architecture
description: Audit code architecture for over-engineering and unnecessary abstractions. Use when user asks to "review architecture", "simplify code structure", "reduce over-engineering", "evaluate abstractions", or mentions premature abstraction, interface proliferation, factory patterns, YAGNI, or enterprise-grade complexity.
---

## SCOPE FIRST

Before auditing, confirm with the user:

1. **Audit target** — Entire project, a specific module, or a set of files?
2. **Pain signal** — What triggered this? (feels too complex, new devs lost, slow to change, etc.)
3. **Codebase language** — Adjust grep patterns accordingly (TS/JS, Java, Go, Python, etc.)

If not specified, default to auditing only the directories the user mentions. Never full-scan a monorepo without explicit scope.

## OUTPUT FORMAT

```
[SEV] file:line flag-id → fix
```

If clean: `FILE: <path> ✓ SIMPLE`

## CORE PRINCIPLES

```
Novices       → Copy-paste everything
Intermediates → Abstract everything
Experts       → Know when to do neither
```

**Two enemies of maintainability:**

1. **Horizontal bloat** - Too many files/classes for simple features
2. **Vertical depth** - Too many jumps to find core logic

## DETECTION CHECKS (Run in Parallel)

### Horizontal Bloat (Over-abstraction)

| ID | Grep Pattern | Smell | Fix |
|----|--------------|-------|-----|
| single-impl | `interface I[A-Z]` + count `implements` = 1 | Interface with 1 impl | Delete interface |
| future-proof | `Factory\|Strategy\|Provider\|Builder` | Pattern with 1 product | Use class directly |
| generic-repo | `extends Base\|extends Abstract\|<T>` | Base class with overrides | Inline to each class |
| enterprise-larp | Glob `**/*Theme*` then count matches | Too many files for trivial feature | Consolidate to minimum |

### Vertical Depth (Hide-and-seek Code)

| ID | Grep Pattern | Smell | Fix |
|----|--------------|-------|-----|
| deep-call | Private methods > 3 levels deep | `this._a()` → `_b()` → `_c()` → `_d()` | Inline or flatten |
| scattered-flow | Steps A,B,C in separate functions | `stepA(); stepB(); stepC();` | Keep linear in one fn |
| hidden-state | Heavy use of `this.` in methods | State buried in class members | Pass as explicit params |
| vague-name | `processData\|handleStuff\|doWork` | Generic function names | `calculateMonthlyTotal` |

### Traceability Issues

| ID | Grep Pattern | Smell | Fix |
|----|--------------|-------|-----|
| unsearchable-error | Duplicate error strings | Same "Failed" in 5 places | Unique error codes |
| missing-context | `throw new Error("failed")` | No diagnostic context | Include why + inputs |
| what-not-why | `// increment i` style comments | Explains what, not why | Document business reason |

## QUICK CHECKS

Run these tool calls in parallel against the audit target directory:

**Horizontal bloat** — scan for abstraction patterns:
- Grep `Factory|Strategy|Provider|Builder|Orchestrator` → check each hit: does the pattern have > 1 product/strategy?
- Grep `interface I[A-Z]|abstract class|extends Base` → check each hit: more than 1 implementation?

**Vertical depth** — scan for call depth indicators:
- Grep `private.*\(|this\._[a-z]` → trace call chains, flag > 3 levels
- Grep `processData|handleEvent|doWork|execute\(\)` → flag generic names

**Traceability** — scan for error/log patterns:
- Grep `throw new Error|console\.(error|log)` → check: is the message unique and searchable?

## REVIEW CHECKLIST

When reviewing, check:

- [ ] **Jump test**: Need > 3 jumps to find core logic? → Inline
- [ ] **Search test**: Can grep error message → exact line? → Make unique
- [ ] **Context test**: Error includes why + inputs? → Add context
- [ ] **File ratio**: > 5 files for simple feature? → Consolidate

## DECISION RULES

**Split function ONLY when:**

- Logic reused 3+ times (Rule of Three)
- Split significantly reduces cognitive load
- NOT just because "it's too long"

**Keep linear flow:**

```
// BAD: scattered
stepA(); stepB(); stepC();

// GOOD: visible
// Step A: validate input
if (!valid) return err;
// Step B: transform
const result = transform(data);
// Step C: persist
await save(result);
```

**Naming for grep:**

```
// BAD: generic
catch(e) { throw new Error("Operation failed") }

// GOOD: searchable
catch(e) { throw new Error("PAYMENT_CALC_001: Monthly total failed", { customerId, month }) }
```

## RED FLAGS

When you hear these, pause and ask the user for concrete evidence before proceeding:

| Signal | Response |
|--------|----------|
| "We might need this someday" | Ask: what specific upcoming requirement needs this? No requirement → don't build it |
| "This is more professional" | Ask: professional for whom? If no external consumer, simplicity wins |
| "I learned this pattern" | Ask: does the problem here match the pattern's intent? Pattern without problem = bloat |
| "This won't scale" | Ask: what's the current load? What's the projected load? No numbers → no premature optimization |
| "Let's make it configurable" | Ask: how many configurations will actually exist? If ≤ 2, use an if-statement |
