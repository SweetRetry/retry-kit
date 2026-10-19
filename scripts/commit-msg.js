/**
 * commit-msg 门禁：提交信息必须是英文，且符合 Conventional Commits。
 *
 * 规则只有两条，都能零判断余地地判定：
 *   1. 形态沿用 Conventional Commits：`type(scope)!: subject`，type 取自白名单。
 *   2. 正文与主题只写英文。仓库文档写中文，但提交历史服务 grep、git log 与
 *      自动化工具（release notes、changelog 生成），统一英文。
 *
 * 用法（由 lefthook.yml 的 commit-msg 任务调用）：
 *   node scripts/commit-msg.js .git/COMMIT_EDITMSG
 *   git log -1 --format=%B | node scripts/commit-msg.js   # 手工校验一条信息
 *
 * 豁免：merge 提交、`fixup!` / `squash!` / `amend!` 前缀、`git revert` 生成的
 * `Revert "..."`。需要临时绕过用 `git commit --no-verify` 或 `LEFTHOOK=0`。
 */

import { readFileSync } from "node:fs"

const TYPES = ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]

const HEADER_PATTERN = /^(?<type>[a-z]+)(?:\((?<scope>[a-z0-9][a-z0-9._-]*)\))?(?<breaking>!)?: (?<subject>.+)$/

const MAX_HEADER = 100
const MAX_SUBJECT = 72

/** 中日韩文字与全角标点：出现即视为非英文。 */
const NON_ENGLISH = /[\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/

const SKIP_PATTERNS = [/^Merge /, /^(fixup|squash|amend)! /, /^Revert "/]

function fail(message) {
  process.stderr.write(`commit-msg: ${message}\n`)
  process.exit(1)
}

const file = process.argv[2]

// 文件参数由 git hook 传入；无参数时读 stdin，便于手工校验。
const raw = file ? readFileSync(file, "utf8") : readFileSync(0, "utf8")
const message = raw
  .split("\n")
  .filter((line) => !line.startsWith("#"))
  .join("\n")
  .trim()

// 空信息（例如 git commit 被中止）交给 git 自己处理。
if (message === "") {
  process.exit(0)
}

const lines = message.split("\n")
const header = lines[0]

if (SKIP_PATTERNS.some((pattern) => pattern.test(header))) {
  process.exit(0)
}

if (NON_ENGLISH.test(message)) {
  fail(
    [
      "commit message must be written in English.",
      `  offending header: ${header}`,
      "  rewrite non-English text; bullets and prose in the body count too.",
    ].join("\n"),
  )
}

const match = HEADER_PATTERN.exec(header)

if (!match) {
  fail(
    [
      `header does not match "type(scope): subject".`,
      `  got: ${header}`,
      `  types: ${TYPES.join(", ")}`,
      '  example: fix(server): return 503 when the pool is unavailable',
    ].join("\n"),
  )
}

const { type, scope, subject } = match.groups

if (!TYPES.includes(type)) {
  fail(`unknown type "${type}". allowed types: ${TYPES.join(", ")}`)
}

if (subject.length > MAX_SUBJECT) {
  fail(`subject is ${subject.length} chars, limit is ${MAX_SUBJECT}. move detail into the body.`)
}

if (header.length > MAX_HEADER) {
  fail(`header is ${header.length} chars, limit is ${MAX_HEADER}. move detail into the body.`)
}

if (subject.endsWith(".")) {
  fail("subject must not end with a period.")
}

if (/^[A-Z]/.test(subject)) {
  fail("subject must start lowercase (keep the identifier after it as written).")
}

if (scope !== undefined && scope.length > 20) {
  fail(`scope "${scope}" is ${scope.length} chars, limit is 20.`)
}

const body = lines.slice(1).join("\n").trim()

if (body !== "" && lines[1].trim() !== "") {
  fail("leave one blank line between the header and the body.")
}
