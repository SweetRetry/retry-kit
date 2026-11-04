#!/usr/bin/env node
/**
 * Zod v4 gate. Rejects v3 APIs that can be identified from source text alone.
 * `message` vs `error` and `.default()` vs `.prefault()` need types, so they stay in review.
 *
 *   node scripts/check-zod.mjs [--staged]
 */
import { lineOf, listFiles, read, report } from "./git-files.mjs"

const SOURCE = /\.(ts|tsx|mts|cts|js|jsx|mjs)$/
const SELF = /(^|\/)check-zod\.mjs$/
const ISO = new Set(["datetime", "date", "time", "duration"])
const FORMATS = "email|url|uuid|guid|cuid2?|ulid|nanoid|ipv4|ipv6|ip|cidrv4|cidrv6|cidr|base64url|base64|emoji|e164|jwt|datetime|date|time|duration"
const CHAIN = new RegExp(`z\\.string\\(\\)(?:\\s*\\.\\w+\\([^()]*\\))*\\s*\\.(${FORMATS})\\(`, "g")

/** Arguments of the call whose `(` is at `open`, split on top-level commas. */
const callArgs = (text, open) => {
  const args = []
  let depth = 0
  let start = open + 1
  for (let i = open; i < text.length; i++) {
    const c = text[i]
    if ("([{".includes(c)) depth++
    else if (")]}".includes(c) && --depth === 0) {
      args.push(text.slice(start, i))
      break
    } else if (c === "," && depth === 1) {
      args.push(text.slice(start, i))
      start = i + 1
    }
  }
  return args.map((a) => a.trim()).filter(Boolean)
}

const problems = []
for (const file of listFiles((f) => SOURCE.test(f) && !SELF.test(f))) {
  const text = read(file)
  if (!text.includes("z.")) continue
  const add = (index, message) => problems.push({ file, line: lineOf(text, index), message })

  for (const m of text.matchAll(CHAIN)) {
    const format = ISO.has(m[1]) ? `z.iso.${m[1]}()` : `z.${m[1]}()`
    add(m.index, `z.string().${m[1]}() is v3. Use ${format}.`)
  }
  for (const m of text.matchAll(/(?<!\bz)\.deepPartial\(/g)) add(m.index, ".deepPartial() is v3. Use z.deepPartial(schema).")
  for (const m of text.matchAll(/\bz\.record\(/g)) {
    if (callArgs(text, m.index + m[0].length - 1).length < 2)
      add(m.index, "z.record() needs key and value schemas. Use z.partialRecord() when keys are not exhaustive.")
  }
}
report("check-zod", problems)
