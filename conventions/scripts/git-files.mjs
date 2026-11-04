/**
 * Shared file access for the check scripts.
 * Default: every tracked file in the working tree. `--staged`: the staged blobs, for pre-commit.
 */
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 28 })

export const staged = process.argv.includes("--staged")

export const listFiles = (match) =>
  (staged ? git("diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z") : git("ls-files", "-z"))
    .split("\0")
    .filter((file) => file && match(file) && (staged || existsSync(file)))

export const read = (file) => (staged ? git("show", `:${file}`) : readFileSync(file, "utf8"))

export const lineOf = (text, index) => text.slice(0, index).split("\n").length

/** Print `file:line  message` per problem and exit 1 when any exist. */
export const report = (check, problems) => {
  for (const { file, line, message } of problems) console.error(`${file}${line ? `:${line}` : ""}  ${message}`)
  if (problems.length) {
    console.error(`${check}: ${problems.length} problem(s)`)
    process.exit(1)
  }
}
