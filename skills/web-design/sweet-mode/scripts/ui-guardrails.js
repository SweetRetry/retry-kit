/**
 * 只扫描“无判断余地”的 UI 禁令，规则名前缀对应 reference 文件：
 * - hierarchy：用 · / • 把多个字段拼成一行、Card 嵌套 Card
 * - layout：横向 <Separator /> 分区
 * - motion：transition-all、布局属性过渡、ease-in、motion 从 scale: 0 入场
 * - surface：z-index 任意值与越出阶梯、硬编码色值、Tailwind 原生色板、调用点阴影、
 *   彩色渐变与渐变文字、大半径模糊光晕、静态文字的透明度
 * - typography：任意字号、任意字体族、阶梯外字重
 *
 * 组件库（packages/ui、shadcn 的 components/ui）同样扫描；阴影、Separator 与 Card 嵌套
 * 只约束调用点，组件库豁免。
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
// 第三方、构建产物、测试夹具与 agent skill（含本脚本的副本）不属于项目界面代码
const EXCLUDED =
  /(?:^|\/)(?:node_modules|vendor|dist|build|\.next|coverage|\.[\w-]+\/skills)\/|\.(?:test|spec)\.[^/]+$/
const LIBRARY = /(?:^|\/)components\/ui\/|^packages\/ui\//

// 不在 class 名或 CSS 标识符中间起止
const L = "(?<![\\w-])"
const R = "(?![\\w-])"
const LAYOUT_PROPERTY = `${L}(?:top|left|right|bottom|inset|(?:margin|padding)(?:-[a-z]+)?|(?:(?:min|max)-)?(?:width|height))${R}`
const COLOR_LITERAL = "(?:#[0-9a-fA-F]{3,8}(?![\\w])|(?<![a-z])(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\\()"
const COLOR_UTILITY =
  "(?:bg|text|border(?:-[xytrblse])?|ring(?:-offset)?|outline|divide|fill|stroke|from|via|to|placeholder|caret|accent|decoration|shadow|inset-shadow|inset-ring|drop-shadow)"
// 语义强调色与前景色作为渐变色标即为装饰渐变
const GRADIENT_ACCENT_STOP =
  "(?:primary|secondary|accent|destructive|foreground|ring|border|input|success|warning|info|brand|chart-\\d+|[a-z]+-foreground)"
const PALETTE =
  "(?:(?:slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|[1-9]00|950)|white|black)"

// 业务代码可用的 z-index 阶梯：-z-10 / z-0 / z-1…10 / z-20 / z-30 / z-40 / z-50
const isLadderZ = (value) =>
  value < 0 ? value === -10 : value <= 10 || (value <= 50 && value % 10 === 0)

const Z_SUGGESTION = "改用 -z-10 / z-0 / z-10 / z-20 / z-30 / z-40 / z-50；被遮挡时用 Portal 提升"

const CHECKS = [
  {
    rule: "hierarchy/separator-dot",
    pattern: "[·•]|&(?:middot|bull|#183|#8226|#xb7|#x2022);|\\\\u(?:00b7|2022)",
    flags: "i",
    message: "用圆点把多个字段拼成一行",
    suggestion: "每个字段先判断去留，留下的放进分组、对齐的列或行尾、图标或 Badge",
  },
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
    rule: "surface/palette-color",
    pattern: `${L}${COLOR_UTILITY}-${PALETTE}(?:\\/[\\w.]+)?${R}`,
    // 遮罩、媒体播放底色与压在媒体上的渐变色标不随主题变化
    accept: (match) => /^(?:bg|from|via|to)-black(?:\/\d+)?$|^(?:from|via|to)-white(?:\/\d+)?$/.test(match[0]),
    message: "Tailwind 原生色板绕过语义 Token，亮暗主题下不跟随",
    suggestion: "改用 bg-muted / text-muted-foreground / border-border 等语义 Token；缺 Token 时在样式入口补充",
  },
  {
    rule: "surface/shadow",
    // 跳过 CSS 选择器（.shadow-lg { box-shadow: none }）
    pattern: `(?<![\\w.-])(?:drop-|inset-)?shadow-(?!none${R})(?:\\[[^\\]\\s]*\\]|[\\w./-]+)`,
    appOnly: true,
    message: "调用点加阴影或光晕",
    suggestion: "分离表面靠明度差；浮层阴影只在组件库变体里定义",
  },
  {
    rule: "surface/decoration",
    // 原生彩色色标由 palette-color 报告；中性色标（transparent、black、white、表面 Token）是遮罩与淡出
    pattern: `${L}(?:bg-clip-text|(?:from|via|to)-${GRADIENT_ACCENT_STOP}(?:\\/[\\w.]+)?|blur-(?:xl|2xl|3xl|\\[[^\\]\\s]*\\]))${R}`,
    message: "渐变文字、彩色渐变或模糊光晕属于装饰",
    suggestion: "渐变色标只用 transparent、black / white 透明度或表面 Token；模糊只用 backdrop-blur-*",
  },
  {
    rule: "surface/text-opacity",
    pattern: `${L}((?:[\\w-]+(?:-\\[[^\\]\\s]*\\])?:)*)text-([a-z][a-z-]*)\\/(?:\\d+|\\[[^\\]\\s]+\\])`,
    // 交互态与占位符可以降低对比度；text-sm/6 是字号加行高；原生色板由 palette-color 报告
    accept: (match) =>
      /(?:^|:)(?:hover|focus[\w-]*|active|disabled|placeholder|aria-[^:]*|data-[^:]*|group-[^:]*|peer-[^:]*):/.test(match[1]) ||
      /^(?:xs|sm|base|lg|[2-9]?xl)$/.test(match[2]) ||
      new RegExp(`^${PALETTE}$`).test(match[2]) ||
      /^(?:white|black)$/.test(match[2]),
    message: "用透明度降低静态文字对比度",
    suggestion: "次要文字改用 text-muted-foreground",
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
  {
    rule: "typography/font-weight",
    pattern: `${L}font-(?:thin|extralight|light|bold|extrabold|black|\\[\\d+\\])${R}`,
    message: "字重越出阶梯",
    suggestion: "只用 font-normal / font-medium / font-semibold",
  },
  {
    rule: "layout/separator",
    pattern: `<Separator(?![\\w.])(?![^>]*\\borientation\\s*=\\s*\\{?\\s*["'\`]vertical)[^>]*>`,
    appOnly: true,
    message: "用横向 Separator 分区",
    suggestion: "分区改用留白与对齐轴；菜单用组件库的 *MenuSeparator，工具栏控件组之间用 orientation=\"vertical\"",
  },
  {
    rule: "hierarchy/nested-card",
    find: findNestedCards,
    appOnly: true,
    message: "卡片套卡片",
    suggestion: "内层改用留白、分组或 bg-muted 填充区块，只保留外层 Card",
  },
].map((check) => {
  if (check.find) return check
  const regex = new RegExp(check.pattern, `g${check.flags ?? ""}`)
  return { ...check, find: (content) => content.matchAll(regex) }
})

// 只匹配 <Card>，不含 CardHeader 等子组件；自闭合的 <Card /> 不开启嵌套
function findNestedCards(content) {
  const nested = []
  let depth = 0
  for (const match of content.matchAll(/(?<![\w$.])<(\/?)Card(?=[\s>/])([^>]*)>/g)) {
    if (match[1]) depth = Math.max(0, depth - 1)
    else if (!match[2].endsWith("/")) {
      if (depth > 0) nested.push(match)
      depth += 1
    }
  }
  return nested
}

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
  const findings = []
  const isLibrary = LIBRARY.test(file)
  let starts = null

  for (const check of CHECKS) {
    if (check.appOnly && isLibrary) continue
    for (const match of check.find(content)) {
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
