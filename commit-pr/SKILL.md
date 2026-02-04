---
name: commit-pr
description: Commit staged changes and create or update a pull request. Use when user asks to "commit changes", "create PR", "submit pull request", or wants to stage, commit, and push code to GitHub.
---

## Pre-flight Validation

1. Check git repo: `git rev-parse --git-dir 2>/dev/null || echo "Not a git repo"`
2. Check gh CLI: `gh --version 2>/dev/null || echo "gh not installed"`
3. If either fails, exit with error message

## Step 1: Commit Changes

1. Run `git status -sb` to check state
2. If changes exist:
   - View: `git diff --staged` and `git diff`
   - Stage: `git add -A` (or ask user for specific files)
   - Generate Conventional Commit message:
     - Format: `<type>(<scope>): <description>`
     - Types: `feat|fix|docs|style|refactor|perf|test|chore`
   - Commit with HEREDOC to preserve formatting
3. If no changes, skip to Step 2

## Step 2: Push Branch

1. Check upstream: `git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null`
2. Push: `git push -u origin $(git branch --show-current)` or `git push`

## Step 3: Create/Update PR

### 3.1 Gather Context

```bash
# Detect base branch
git remote show origin | grep 'HEAD branch' | cut -d: -f2 | xargs

# Check existing PR
gh pr view --json number,title,body 2>/dev/null

# Get commits & diff (run in parallel)
git log origin/<base>..HEAD --oneline
git diff origin/<base>...HEAD --stat
```

### 3.2 Determine Language

- Analyze `$ARGUMENTS` for Chinese characters → 中文 PR
- Otherwise → English (default)

### 3.3 PR Template

**Title**: `<type>(<scope>): <description>` (max 72 chars)

**Body** (English):

```markdown
## Summary
[2-4 sentences: what changed and why]

## Changes
- Change 1
- Change 2

## Type
- [ ] Bug fix
- [ ] Feature
- [ ] Breaking change
- [ ] Refactor

## Testing
[How to test]

## Checklist
- [ ] Follows style guide
- [ ] Self-reviewed
- [ ] Tests added/updated
```

**Body** (中文):

```markdown
## 概述
[改动内容和原因，2-4句话]

## 改动内容
- 改动点1
- 改动点2

## 变更类型
- [ ] Bug修复
- [ ] 新功能
- [ ] 破坏性变更
- [ ] 重构

## 测试方法
[如何测试]

## 检查清单
- [ ] 遵循代码规范
- [ ] 已自我审查
- [ ] 已添加/更新测试
```

### 3.4 Execute

```bash
# Create PR
gh pr create --title "feat(auth): add OAuth login" --body "$(cat <<'EOF'
## Summary
Added OAuth 2.0 authentication flow using Passport.js.

## Changes
- Implemented OAuth strategy
- Added login/callback routes
- Updated user model
EOF
)"

# Or edit existing PR
gh pr edit <number> --title "..." --body "$(cat <<'EOF' ... EOF)"
```

## Notes

- Analyze ALL commits in branch for description
- NEVER use `--force` push
- Handle pre-commit hook failures gracefully
