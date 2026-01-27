---
name: pragmatic-architecture
description: This skill should be used when the user asks to "review architecture", "simplify code structure", "reduce over-engineering", "evaluate abstractions", or mentions premature abstraction, interface proliferation, factory patterns, YAGNI, or enterprise-grade complexity.
allowed-tools: Read, Grep, Glob
---

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
| enterprise-larp | Glob `**/*Theme*` > 5 files | 11 files for dark mode | 1 useState |

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

```bash
# Horizontal: abstraction patterns
Grep("Factory|Strategy|Provider|Builder|Orchestrator", path="<dir>", output_mode="content", -n=true, head_limit=20)
Grep("interface I[A-Z]|abstract class|extends Base", path="<dir>", output_mode="content", -n=true, head_limit=20)

# Vertical: call depth indicators
Grep("private.*\(|this\._[a-z]", path="<dir>", output_mode="content", -n=true, head_limit=20)
Grep("processData|handleEvent|doWork|execute\(\)", path="<dir>", output_mode="content", -n=true, head_limit=20)

# Traceability: error/log patterns
Grep("throw new Error|console\.(error|log)", path="<dir>", output_mode="content", -n=true, head_limit=20)
```

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

Stop if you hear:

- "We might need this someday"
- "This is more professional"
- "I learned this pattern"
- "This won't scale" (no evidence)
- "Let's make it configurable"
