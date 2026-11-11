/**
 * 渲染检查 runner：对每个 URL 在 375×812 与 1280×800 两个视口执行 render-audit.js，
 * 各截一张整页图，把结果以 JSON 输出到 stdout。有违规时退出码为 1。
 *
 * 用法：node <skill>/scripts/render-check.js [--out <目录>] <url> [<url>...]
 * 在目标项目目录下运行：playwright 从当前目录解析。省略 --out 时截图写入系统临时目录。
 *
 * 交互才能到达的状态（展开、报错、键盘焦点）不在此列，
 * 用浏览器工具到达后以 evaluate 执行 render-audit.js。
 */

import { mkdirSync, mkdtempSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
]
const HERE = dirname(fileURLToPath(import.meta.url))

function loadChromium() {
  for (const base of [join(process.cwd(), "package.json"), import.meta.url]) {
    const require = createRequire(base)
    for (const name of ["playwright", "@playwright/test", "playwright-core"]) {
      try {
        return require(name).chromium
      } catch (error) {
        if (error.code !== "MODULE_NOT_FOUND") throw error
      }
    }
  }
  console.error(
    "✗ 当前目录解析不到 playwright。在目标项目执行 npm i -D playwright && npx playwright install chromium 后重试；" +
      "无法安装时改用浏览器工具的 evaluate 执行 render-audit.js"
  )
  process.exit(2)
}

function parseArguments(argv) {
  const urls = []
  let out = null
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--out") out = argv[(index += 1)]
    else urls.push(argv[index])
  }
  if (urls.length === 0) {
    console.error("用法：node render-check.js [--out <目录>] <url> [<url>...]")
    process.exit(2)
  }
  return { urls, out: out ? resolve(out) : mkdtempSync(join(tmpdir(), "sweet-mode-render-")) }
}

const slug = (url) => url.replace(/^https?:\/\//, "").replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "page"

async function main() {
  const { urls, out } = parseArguments(process.argv.slice(2))
  const chromium = loadChromium()
  const audit = `(${readFileSync(join(HERE, "render-audit.js"), "utf8")})()`
  mkdirSync(out, { recursive: true })

  const browser = await chromium.launch()
  const results = []
  try {
    for (const url of urls) {
      for (const viewport of VIEWPORTS) {
        const context = await browser.newContext({ viewport })
        const page = await context.newPage()
        const result = { url, viewport: `${viewport.width}×${viewport.height}` }
        try {
          const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 })
          result.status = response?.status() ?? null
          await page.evaluate(() => document.fonts.ready)
          Object.assign(result, await page.evaluate(audit))
          result.screenshot = join(out, `${slug(url)}-${viewport.width}.png`)
          await page.screenshot({ path: result.screenshot, fullPage: true })
        } catch (error) {
          result.error = error.message.split("\n")[0]
        }
        results.push(result)
        await context.close()
      }
    }
  } finally {
    await browser.close()
  }

  console.log(JSON.stringify(results, null, 2))
  if (results.some((result) => result.error || result.status >= 400 || result.violations?.length)) process.exitCode = 1
}

main()
