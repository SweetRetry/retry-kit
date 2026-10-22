/**
 * 只扫描“无判断余地”的 UI 禁令，规则名前缀对应 reference 文件：
 * - motion：transition-all、布局属性过渡、ease-in、motion 从 scale: 0 入场
 * - surface：z-index 任意值、越出阶梯的 z-index、arbitrary class 中的硬编码色值
 * - typography：任意字号、任意字体族
 *
 * 圆角与间距的任意值**不在此列**：规则本身有判断余地（公式推导的转角、
 * 行高托底与光学微调值域），扫描会产生误报，交由审查判断。
 * 内联 style 与 CSS 中的色值同理（图表、画布与 Token 定义合法使用色值）。
 *
 * 用法：node <skill>/scripts/ui-guardrails.js [目标项目路径]
 * 省略路径时扫描当前目录所在的 git 仓库。
 */

import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { join, resolve } from "node:path"

const SOURCE_FILE = /\.(?:[cm]?[jt]sx?|css|scss|vue|svelte|astro|html|mdx)$/
// 组件库（packages/ui、shadcn 的 components/ui）、第三方、测试夹具与 agent skill（含本脚本的副本）不属于业务代码
const EXCLUDED =
  /(?:^|\/)(?:node_modules|vendor|dist|build|\.next|coverage|components\/ui|\.[\w-]+\/skills)\/|^packages\/ui\/|\.(?:test|spec)\.[^/]+$/

// 不在 class 名或 CSS 标识符中间起止
const L = "(?<![\\w-])"
const R = "(?![\\w-])"
const LAYOUT_PROPERTY = `${L}(?:top|left|right|bottom|inset|(?:margin|padding)(?:-[a-z]+)?|(?:(?:min|max)-)?(?:width|height))${R}`
const COLOR_LITERAL = "(?:#[0-9a-fA-F]{3,8}(?![\\w])|(?<![a-z])(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\\()"

// 业务代码可用的 z-index 阶梯：-z-10 / z-0 / z-1…10 / z-20 / z-30 / z-40 / z-50
const isLadderZ = (value) =>
  value < 0 ? value === -10 : value <= 10 || (value <= 50 && value % 10 === 0)

const Z_SUGGESTION = "改用 -z-10 / z-0 / z-10 / z-20 / z-30 / z-40 / z-50；被遮挡时用 Portal 提升"

const CHECKS = [
  {
    rule: "motion/transition-all",
    pattern: `${L}transition-all${R}|\\btransition(?:-property|Property)?\\s*:\\s*["'\`]?all\\b`,
    message: "过渡全部属性会连带过渡未计划的属性",
    suggestion: "显式声明属性，如 transition-[transform,opacity]",
  },
  {
    rule: "motion/layout-transition",
    pattern: `${L}transition-\\[[^\\]\\s]*${LAYOUT_PROPERTY}[^\\]\\s]*\\]|\\btransition(?:-property)?\\s*:[^;\\n"'\`]*${LAYOUT_PROPERTY}`,
    message: "过渡布局属性会触发重排",
    suggestion: "位移改用 transform，显隐改用 opacity",
  },
  {
    rule: "motion/ease-in",
    pattern: `${L}ease-in${R}|["'\`]easeIn["'\`]`,
    message: "ease-in 起步迟缓，UI 动效显得迟钝",
    suggestion: "进场用 ease-out，原地切换用 ease-in-out",
  },
  {
    rule: "motion/scale-zero",
    pattern: "\\binitial=\\{\\{[^}]{0,200}?\\bscale:\\s*0(?![.\\d])",
    message: "从 scale: 0 入场显得凭空弹出",
    suggestion: "从 scale: 0.95 + opacity: 0 起步",
  },
  {
    rule: "surface/z-index",
    pattern: `${L}-?z-\\[[^\\]]+\\]`,
    message: "z-index 使用任意值，脱离语义阶梯",
    suggestion: Z_SUGGESTION,
  },
  {
    rule: "surface/z-index",
    pattern: `${L}(-?)z-(\\d+)${R}`,
    accept: (match) => isLadderZ(Number(match[1] + match[2])),
    message: "z-index 不在语义阶梯上",
    suggestion: Z_SUGGESTION,
  },
  {
    rule: "surface/z-index",
    pattern: "\\bz-?index\\s*:\\s*[\"'`]?(-?\\d+)",
    flags: "i",
    accept: (match) => Number(match[1]) >= -10 && Number(match[1]) <= 50,
    message: "z-index 超出业务代码上限 50",
    suggestion: Z_SUGGESTION,
  },
  {
    rule: "surface/color-literal",
    pattern: `${L}[a-z][\\w-]*-\\[[^\\]\\s]*?${COLOR_LITERAL}[^\\]\\s]*\\]`,
    message: "class 中硬编码色值，绕过语义 Token",
    suggestion: "改用 bg-card / text-muted-foreground 等语义 Token；缺 Token 时在样式入口补充",
  },
  {
    rule: "typography/font-size",
    pattern: `${L}text-\\[(?:length:[^\\]]+|-?[\\d.]+(?:px|rem|em|pt|vw|vh|vmin|vmax|%|ch|lh)?|(?:clamp|calc|min|max)\\([^\\]]*)\\]`,
    message: "任意字号脱离字阶",
    suggestion: "改用 text-xs…text-2xl 等标准字阶；需要新字号时扩展 fontSize Token",
  },
  {
    rule: "typography/font-family",
    pattern: `${L}font-\\[(?:family-name:[^\\]]+|(?!var\\()["'_]?[A-Za-z][^\\]]*)\\]`,
    message: "任意字体族绕过字体 Token",
    suggestion: "改用 font-sans / font-mono / font-serif",
  },
].map((check) => ({
  ...check,
  regex: new RegExp(check.pattern, `g${check.flags ?? ""}`),
}))

// 一次廉价扫描筛掉绝大多数文件；漏掉的字面量会让对应规则失效，新增规则时同步补充
const PREFILTER = /transition|ease|scale|z-|z-?index|text-\[|font-\[|-\[/i

function findRepositoryRoot(target) {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd: target,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
  } catch {
    console.error(`✗ ${target} 不在 git 仓库内，无法列出待扫描文件`)
    process.exit(2)
  }
}

function listSourceFiles(repositoryRoot) {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: repositoryRoot, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }
  )

  return output
    .split("\0")
    .filter((file) => SOURCE_FILE.test(file) && !EXCLUDED.test(file))
}

function readIfPresent(path) {
  try {
    return readFileSync(path, "utf8")
  } catch (error) {
    // git ls-files --cached 仍会列出已从工作区删除的文件；删除由 git status 呈现，这里只扫存在的内容。
    if (error.code === "ENOENT") return null
    throw error
  }
}

function lineStarts(content) {
  const starts = [0]
  for (let index = content.indexOf("\n"); index !== -1; index = content.indexOf("\n", index + 1)) {
    starts.push(index + 1)
  }
  return starts
}

function locate(starts, offset) {
  let low = 0
  let high = starts.length - 1
  while (low < high) {
    const middle = (low + high + 1) >> 1
    if (starts[middle] <= offset) low = middle
    else high = middle - 1
  }
  return { line: low + 1, column: offset - starts[low] + 1 }
}

function scanContent(content, file) {
  if (!PREFILTER.test(content)) return []

  const findings = []
  let starts = null

  for (const check of CHECKS) {
    for (const match of content.matchAll(check.regex)) {
      if (check.accept?.(match)) continue
      starts ??= lineStarts(content)
      findings.push({
        file,
        ...locate(starts, match.index),
        rule: check.rule,
        match: match[0].replace(/\s+/g, " "),
        message: check.message,
        suggestion: check.suggestion,
      })
    }
  }

  return findings.sort((a, b) => a.line - b.line || a.column - b.column)
}

function main() {
  const repositoryRoot = findRepositoryRoot(resolve(process.argv[2] ?? "."))
  const files = listSourceFiles(repositoryRoot)
  const allFindings = []

  for (const file of files) {
    const content = readIfPresent(join(repositoryRoot, file))
    if (content !== null) allFindings.push(...scanContent(content, file))
  }

  if (allFindings.length === 0) {
    console.log(`✓ ${files.length} files clean in ${repositoryRoot}`)
    return
  }

  console.log(`Found ${allFindings.length} UI guardrail violation(s) in ${files.length} files:\n`)

  for (const finding of allFindings) {
    console.log(`  ${finding.file}:${finding.line}:${finding.column}`)
    console.log(`    [${finding.rule}] ${finding.match} — ${finding.message}`)
    console.log(`    → ${finding.suggestion}`)
    console.log()
  }

  process.exitCode = 1
}

main()
