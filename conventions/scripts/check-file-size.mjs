#!/usr/bin/env node
/**
 * Example file size gate. Tokens are the hard limit, lines only warn.
 * Thresholds suit a TS frontend; tune MAX_TOKENS, MAX_LINES and EXCLUDE per project and language.
 * Counts offline with o200k_base (`pnpm add -D gpt-tokenizer`), no model API.
 *
 *   node scripts/check-file-size.mjs [--staged]
 */
import { countTokens } from "gpt-tokenizer/encoding/o200k_base"
import { listFiles, read, report } from "./git-files.mjs"

// The only place thresholds and exclusions live.
const MAX_TOKENS = 5000
const MAX_LINES = 500
const EXCLUDE = [
  /(^|\/)(pnpm-lock\.yaml|package-lock\.json|yarn\.lock|bun\.lockb?)$/,
  /(^|\/)(dist|build|generated|__snapshots__|fixtures)\//,
  /\.(snap|json|csv|tsv|svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|pdf|zip)$/,
  /\.(gen|min)\.[a-z]+$/,
  /(^|\/)globals\.css$/,
]

const problems = []
for (const file of listFiles((f) => !EXCLUDE.some((re) => re.test(f)))) {
  const text = read(file)
  if (text.includes("\0")) continue
  const tokens = countTokens(text)
  const lines = text.split("\n").length
  if (tokens > MAX_TOKENS) {
    problems.push({ file, message: `${tokens} tokens, limit ${MAX_TOKENS}. Split the file by responsibility.` })
  } else if (lines > MAX_LINES) {
    console.warn(`${file}  warning: ${lines} lines, soft limit ${MAX_LINES}. Consider splitting by responsibility.`)
  }
}
report("check-file-size", problems)
