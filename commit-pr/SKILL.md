---
name: commit-pr
description: Commit staged changes and create or update a pull request. Use when user asks to "commit changes", "create PR", "submit pull request", or wants to stage, commit, and push code to GitHub.
---

Workflow: Pre-flight → Commit → Push → PR

## Pre-flight

Run in parallel: `git rev-parse --git-dir`, `gh --version`. Abort if either fails.

## Commit

1. `git status -sb` — if clean working tree and no staged changes, skip to Push
2. Run in parallel: `git diff --staged`, `git diff`, `git log --oneline -5`
3. Stage relevant files (prefer named files over `git add -A`; ask user if scope is ambiguous)
4. Conventional Commit format: `<type>(<scope>): <description>`
   - Types: `feat|fix|docs|style|refactor|perf|test|chore`
   - Scope = affected module/area, omit if trivial
5. Commit via HEREDOC (preserves multiline body)
6. Pre-commit hook failure → fix issue, re-stage, **new commit** (never `--amend`)

## Push

1. Detect upstream: `git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null`
2. No upstream → `git push -u origin $(git branch --show-current)`
3. Has upstream → `git push`
4. NEVER `--force` push

## Create / Update PR

### Determine base branch

1. Check if `$ARGUMENTS` explicitly specifies a base branch → use it
2. Otherwise detect default: `gh repo view --json defaultBranchRef -q '.defaultBranchRef.name'`
3. **Always ask user to confirm** the base branch before creating the PR (e.g. "PR will target `main`, confirm?")

### Gather context (run in parallel)

```bash
gh pr view --json number,title,body 2>/dev/null   # existing PR?
git log origin/$BASE..HEAD --oneline               # all branch commits
git diff origin/$BASE...HEAD --stat                 # change summary
```

### Language

Detect from the **user's most recent message** (not code or file content):
- Contains CJK characters (`\p{Han}`) → commit message + PR body in 中文
- Otherwise → English

Commit message title (`<type>(<scope>):` prefix) always in English; only the description and PR body follow the detected language.

### Write PR

**Title**: `<type>(<scope>): <description>` (≤72 chars), matching the commit convention.

**Body structure** (adapt section names to language):

```
## Summary          / 概述
[What changed and why — 2-4 sentences covering ALL branch commits]

## Changes          / 改动内容
- Bullet per logical change

## Testing          / 测试方法
[How to verify]
```

Keep it concise. Omit boilerplate checklists — reviewers use repo-level templates.

### Execute

- New PR: `gh pr create --title "..." --body "$(cat <<'EOF' ... EOF)"`
- Existing PR: `gh pr edit <number> --title "..." --body "$(cat <<'EOF' ... EOF)"`

### Edge cases

- **Detached HEAD**: Ask user to create/checkout a branch first
- **No remote**: Run `git remote add origin <url>` or ask user
- **PR already up-to-date**: Push only, inform user existing PR was updated via push
