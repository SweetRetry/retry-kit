#!/usr/bin/env node
/**
 * Test gate for the bans in conventions/testing.md that need no judgment:
 * ordinary UI tests, visual regression, fixed sleeps and retries.
 *
 *   node scripts/check-tests.mjs [--staged]
 */
import { lineOf, listFiles, read, report } from "./git-files.mjs"

const TEST = /\.(test|spec)\.[cm]?[jt]sx?$/
const CONFIG = /(^|\/)(vitest|vite|playwright)\.config\.[cm]?[jt]s$/
const JSX = /\.[cm]?[jt]sx$/

const RULES = [
  { re: /from\s+["']@testing-library\//g, message: "Component tests are banned. Extract UI logic into a render-free function and unit test it." },
  { re: /\.(toHaveScreenshot|toMatchScreenshot|toMatchImageSnapshot)\(/g, message: "Visual regression is banned." },
  { re: /\.(toMatchSnapshot|toMatchInlineSnapshot)\(/g, only: JSX, message: "DOM snapshots are banned." },
  { re: /\.waitForTimeout\(/g, message: "Fixed sleep. Wait for an explicit event or state." },
  { re: /new Promise\(\s*\(?\s*\w*\s*\)?\s*=>\s*setTimeout\(/g, message: "Fixed sleep. Wait for an explicit event or state." },
  { re: /\bretr(?:y|ies)\s*:(?!\s*0\b)/g, message: "Retries mask flaky tests. Fix the cause or quarantine with reason, owner and deadline." },
]

const problems = []
for (const file of listFiles((f) => TEST.test(f) || CONFIG.test(f))) {
  const text = read(file)
  for (const { re, only, message } of RULES) {
    if (only && !only.test(file)) continue
    for (const m of text.matchAll(re)) problems.push({ file, line: lineOf(text, m.index), message })
  }
}
report("check-tests", problems)
