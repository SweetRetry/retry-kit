#!/usr/bin/env node
/**
 * 代码漂移盘点：扫描前端源码，按漂移分层列出同类物的全部变体、次数与位置。
 * 输出是候选，不是结论：每组变体仍要按语义判据判定。
 *
 *   node code-census.mjs <项目路径> [--samples N]
 *
 * 跳过依赖、构建产物、测试与 stories；i18n 只读 locales / i18n / messages / lang 目录下的 JSON。
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, extname, basename } from "node:path"

const root = process.argv[2]
if (!root) {
  console.error("用法：node code-census.mjs <项目路径> [--samples N]")
  process.exit(1)
}
const sampleIndex = process.argv.indexOf("--samples")
const SAMPLES = sampleIndex > 0 ? Number(process.argv[sampleIndex + 1]) : 3

const SKIP_DIRS = new Set(["node_modules", "dist", "build", "out", ".next", ".nuxt", ".svelte-kit", ".turbo", ".git", "coverage", "vendor", "storybook-static", ".vercel", "target", "src-tauri"])
const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".vue", ".svelte", ".astro"])
const STYLE_EXT = new Set([".css", ".scss", ".sass", ".less"])
const SKIP_FILE = /\.(test|spec|stories|d)\.[a-z]+$|\.min\./
const I18N_DIR = /(^|\/)(locales?|i18n|messages|lang|translations)(\/|$)/

const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name.startsWith(".")) continue
    const path = join(dir, name)
    const stat = statSync(path)
    if (stat.isDirectory()) walk(path)
    else if (!SKIP_FILE.test(name) && stat.size < 500_000) files.push(path)
  }
}
walk(root)

const sources = files
  .map((path) => {
    const ext = extname(path)
    const rel = relative(root, path)
    const kind = CODE_EXT.has(ext) ? "code" : STYLE_EXT.has(ext) ? "style" : ext === ".json" && I18N_DIR.test(rel) ? "i18n" : null
    return kind && { rel, kind, text: readFileSync(path, "utf8") }
  })
  .filter(Boolean)

// tally[组][变体] = { count, samples }
const sections = new Map()
const tally = (section, group, variant, where) => {
  if (!sections.has(section)) sections.set(section, new Map())
  const groups = sections.get(section)
  if (!groups.has(group)) groups.set(group, new Map())
  const variants = groups.get(group)
  const entry = variants.get(variant) ?? { count: 0, samples: [] }
  entry.count += 1
  if (entry.samples.length < SAMPLES && !entry.samples.includes(where)) entry.samples.push(where)
  variants.set(variant, entry)
}

const lineAt = (text, index) => text.slice(0, index).split("\n").length
const scan = (source, regex, onMatch) => {
  for (const match of source.text.matchAll(regex)) onMatch(match, `${source.rel}:${lineAt(source.text, match.index)}`)
}

// 取值 -----------------------------------------------------------------
const TW_SCALES = {
  字号: /(?<![\w-])text-(xs|sm|base|lg|[2-9]?xl)(?![\w-])/g,
  圆角: /(?<![\w-])rounded(-(?:none|sm|md|lg|xl|2xl|3xl|full))?(?![\w-])/g,
  阴影: /(?<![\w-])shadow(-(?:sm|md|lg|xl|2xl|inner|none|xs))?(?![\w-])/g,
  时长: /(?<![\w-])duration-(\d+)(?![\w-])/g,
  层级: /(?<![\w-])z-(\d+)(?![\w-])/g,
}
// 只统计应由 Token 承担的工具类；布局尺寸（w、h、grid-cols）与变体选择器（data-[…]:）不算
const ARBITRARY = /(?<![\w-])(text|bg|border|ring|outline|fill|stroke|from|via|to|shadow|rounded(?:-[a-z]+)?|p[xytrbl]?|m[xytrbl]?|gap(?:-[xy])?|space-[xy]|leading|tracking|font|z|duration|delay|ease|opacity)-\[([^\]\s]+)\](?!:)/g
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-zA-Z])/g
const COLOR_FN = /\b(?:rgba?|hsla?|oklch)\([^)]*\d[^)]*\)/g

for (const source of sources) {
  if (source.kind === "i18n") continue
  for (const [group, regex] of Object.entries(TW_SCALES)) {
    scan(source, regex, (match, where) => tally("取值：Tailwind 阶梯分布", group, match[0], where))
  }
  scan(source, ARBITRARY, (match, where) => tally("取值：绕过 Token 的任意值", match[1], match[0], where))
  // 定义 Token 的样式入口里出现色值是正常的，只统计其余位置
  const isUiFile = source.kind === "style" || /\.(tsx|jsx|vue|svelte|astro)$/.test(source.rel)
  const isTokenFile = source.kind === "style" && /--[\w-]+\s*:/.test(source.text) && /:root|@theme/.test(source.text)
  if (isUiFile && !isTokenFile) {
    scan(source, HEX, (match, where) => tally("取值：硬编码色值", "hex", match[0].toLowerCase(), where))
    scan(source, COLOR_FN, (match, where) => tally("取值：硬编码色值", "函数", match[0].replace(/\s+/g, " "), where))
  }
  if (source.kind === "code") {
    scan(source, /style=\{\{/g, (_, where) => tally("取值：绕过 Token 的任意值", "内联 style", "style={{…}}", where))
  }
}

// 组件 -----------------------------------------------------------------
const PRIMITIVES = "Button|IconButton|Modal|Dialog|Drawer|Sheet|Dropdown|Menu|Select|Combobox|Toast|Notification|Table|DataTable|Tabs|Tooltip|Popover|Input|TextField|Textarea|Checkbox|Switch|Toggle|Avatar|Badge|Tag|Chip|Card|Empty|EmptyState|Spinner|Loader|Loading|Skeleton|Pagination|Breadcrumb|DatePicker|Calendar|Alert|Banner|Confirm|ConfirmDialog|PageHeader|Header"
const DEFINITION = new RegExp(`(?:function|const|class)\\s+([A-Z]\\w*?(${PRIMITIVES}))\\b\\s*(?:[=(<:]|extends)`, "g")
const NATIVE = /<(button|input|select|textarea|dialog|table)\b/g
const LIBRARIES = {
  图标: ["lucide-react", "@phosphor-icons/react", "react-icons", "@heroicons/react", "@tabler/icons-react", "@radix-ui/react-icons", "@iconify/react", "@ant-design/icons", "@mui/icons-material"],
  toast: ["sonner", "react-hot-toast", "react-toastify", "notistack", "@radix-ui/react-toast"],
  日期: ["date-fns", "dayjs", "moment", "luxon"],
  组件库: ["@radix-ui/", "@headlessui/react", "@mui/material", "antd", "@chakra-ui/react", "@mantine/core", "@ark-ui/", "react-aria-components", "@base-ui-components/"],
  表单: ["react-hook-form", "formik", "@tanstack/react-form", "react-final-form"],
  动画: ["framer-motion", "motion/react", "@react-spring/web", "react-spring", "@formkit/auto-animate", "gsap"],
}
const IMPORT = /(?:from\s+|import\s*\(\s*|require\s*\(\s*)["']([^"']+)["']/g
const OVERRIDE = /<(Button|Input|Badge|Card)\b[^>]*?className=["'`{][^>]*?(?<![\w-])(h-\d|rounded|px-\d|py-\d|bg-|text-(?:xs|sm|base|lg)|font-)/g

// 业务组件（AddProviderDialog）是原语的正常使用；前缀为空、泛化词或版本号（BaseButton、V7Dialog），
// 或同名组件定义在多个文件里，才是同一原语的平行实现
const GENERIC_PREFIX = /^(?:|Base|Custom|Simple|My|App|Common|Shared|Styled|Core|Ui|UI|Global|Default|Generic|Basic|Plain|Legacy|Old|New|Modern|\w*V\d+)$/
const definitions = []
for (const source of sources) {
  if (source.kind !== "code") continue
  scan(source, DEFINITION, (match, where) => definitions.push({ name: match[1], primitive: match[2], where }))
  const isPrimitiveFile = /(^|\/)(ui|primitives|components\/ui)\//.test(source.rel)
  if (!isPrimitiveFile) {
    scan(source, NATIVE, (match, where) => tally("组件：绕过组件库的原生元素", match[1], `<${match[1]}>`, where))
    scan(source, OVERRIDE, (match, where) => tally("组件：调用点覆盖变体外观", match[1], match[2].replace(/\d$/, "*"), where))
  }
  scan(source, IMPORT, (match, where) => {
    const spec = match[1]
    for (const [group, libs] of Object.entries(LIBRARIES)) {
      const lib = libs.find((name) => (name.endsWith("/") ? spec.startsWith(name) : spec === name || spec.startsWith(`${name}/`)))
      if (lib) tally("组件：同一职责的多个库", group, lib, where)
    }
  })
}

const definitionFiles = new Map()
for (const { name, where } of definitions) {
  const file = where.replace(/:\d+$/, "")
  definitionFiles.set(name, new Set([...(definitionFiles.get(name) ?? []), file]))
}
for (const { name, primitive, where } of definitions) {
  const prefix = name.slice(0, name.length - primitive.length)
  if (GENERIC_PREFIX.test(prefix) || definitionFiles.get(name).size > 1) tally("组件：同一原语的平行实现", primitive, name, where)
}

// 模式 -----------------------------------------------------------------
const PATTERNS = {
  确认: { "window.confirm": /\b(?:window\.)?confirm\(/g, AlertDialog: /<AlertDialog\b/g, "Modal.confirm": /Modal\.confirm\(/g, "useConfirm 类 hook": /\buseConfirm\w*\(/g },
  "原生弹窗": { "alert()": /(?<![\w.])alert\(/g, "prompt()": /(?<![\w.])prompt\(/g },
  加载: { "旋转图标（animate-spin）": /animate-spin/g, Skeleton: /<Skeleton\b/g, "文字 Loading": />\s*(?:Loading|加载中|正在加载)[.…]*\s*</g },
  报错: { "toast.error": /toast\.error\(/g, "message.error / notification": /\b(?:message|notification)\.error\(/g, '就地 role="alert"': /role=["']alert["']/g, FormMessage: /<FormMessage\b/g, "console 吞掉": /catch\s*\([^)]*\)\s*\{\s*console\.\w+\([^)]*\);?\s*\}/g },
  成功反馈: { "toast.success": /toast\.success\(/g, "toast()": /(?<![\w.])toast\(/g, "message.success": /\bmessage\.success\(/g },
  日期格式化: { toLocaleDateString: /\.toLocale(?:Date|Time)?String\(/g, "Intl.DateTimeFormat": /Intl\.DateTimeFormat/g, "date-fns format": /\bformat(?:Distance\w*|Relative)?\(\s*(?:new Date|\w*[dD]ate)/g, "dayjs().format": /dayjs\([^)]*\)\.(?:format|fromNow)\(/g, "moment().format": /moment\([^)]*\)\.(?:format|fromNow)\(/g },
  数字格式化: { "toFixed()": /\.toFixed\(/g, "Intl.NumberFormat": /Intl\.NumberFormat/g, "toLocaleString()": /\.toLocaleString\(\)/g },
}
for (const source of sources) {
  if (source.kind !== "code") continue
  for (const [group, variants] of Object.entries(PATTERNS)) {
    for (const [variant, regex] of Object.entries(variants)) {
      scan(source, regex, (_, where) => tally("模式：同类问题的不同做法", group, variant, where))
    }
  }
}

// 语言 -----------------------------------------------------------------
const SYNONYMS = {
  删除: ["Delete", "Remove", "Erase", "Trash", "删除", "移除", "清除"],
  编辑: ["Edit", "Modify", "Change", "编辑", "修改", "更改"],
  新建: ["Create", "New", "Add", "新建", "创建", "添加", "新增"],
  保存: ["Save", "Submit", "Apply", "Confirm", "OK", "保存", "提交", "应用", "确认", "确定"],
  取消: ["Cancel", "Close", "Dismiss", "Discard", "取消", "关闭", "放弃"],
  设置: ["Settings", "Preferences", "Options", "Configuration", "设置", "偏好", "选项", "配置"],
  搜索: ["Search", "Find", "搜索", "查找", "检索"],
  登录: ["Sign in", "Log in", "Login", "登录", "登入"],
  退出: ["Sign out", "Log out", "Logout", "退出登录", "登出", "注销"],
  空状态: ["No data", "No results", "Nothing here", "Empty", "暂无", "无数据", "没有数据"],
}
const COPY_SOURCES = [
  />\s*([^<>{}\n]*[\p{L}][^<>{}\n]*?)\s*</gu,
  /\b(?:title|label|placeholder|aria-label|description|tooltip|content|text)=["']([^"']+)["']/g,
  /\b(?:title|description|label)\s*:\s*["']([^"']+)["']/g,
]
const I18N_VALUE = /:\s*"([^"]+)"/g
const startsWithWord = (text, word) => {
  if (/^[一-鿿]/.test(word)) return text.startsWith(word)
  return new RegExp(`^${word}(?![a-z])`, "i").test(text)
}

for (const source of sources) {
  if (source.kind === "style") continue
  // 不同语言文件各自比较：zh 的「添加」与 zh-TW 的「新增」不是漂移
  const locale = source.kind === "i18n" ? basename(source.rel).replace(/\.json$/, "") : "源码"
  const regexes = source.kind === "i18n" ? [I18N_VALUE] : COPY_SOURCES
  for (const regex of regexes) {
    scan(source, regex, (match, where) => {
      const text = match[1].trim()
      if (!text || text.length > 60 || /[=;(){}]|=>|&&/.test(text)) return
      for (const [group, words] of Object.entries(SYNONYMS)) {
        const word = words.find((candidate) => startsWithWord(text, candidate))
        if (word) tally("语言：同一概念的多个叫法", `${group}（${locale}）`, word, where)
      }
    })
  }
}

// 输出 -----------------------------------------------------------------
const print = (title, groups, { onlyDrift }) => {
  const rows = [...groups.entries()]
    .map(([group, variants]) => [group, [...variants.entries()].sort((a, b) => b[1].count - a[1].count)])
    .filter(([, variants]) => !onlyDrift || variants.length > 1)
    .sort((a, b) => b[1].length - a[1].length)
  if (!rows.length) return
  console.log(`\n## ${title}\n`)
  for (const [group, variants] of rows) {
    console.log(`- **${group}**：${variants.length} 种`)
    for (const [variant, { count, samples }] of variants) console.log(`  - \`${variant}\` ×${count}：${samples.join("，")}`)
  }
}

console.log(`# 代码漂移盘点：${basename(root)}\n\n扫描 ${sources.length} 个文件。每组列出的变体是候选，按语义判据判定后才是漂移。`)
for (const [title, groups] of sections) {
  // 任意值、硬编码色值与原生元素即使只有一种也是偏离；其余只在出现多种变体时列出
  const always = /任意值|硬编码|原生元素|覆盖变体|平行实现/.test(title)
  print(title, groups, { onlyDrift: !always })
}
