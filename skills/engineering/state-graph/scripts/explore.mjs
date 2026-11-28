#!/usr/bin/env node
/**
 * 穷举模型的全部可达快照，输出 Graphviz 状态图与 JSON 报告。
 *
 * 用法：node <skill>/scripts/explore.mjs <模型文件.mjs> [--out <目录>] [--max <快照上限>] [--font <字体>]
 * 省略 --out 时写到模型文件所在目录。本机有 dot 命令时同时输出 PNG。
 * stdout 是 JSON 报告；存在违规、卡死或超出上限时退出码为 1。
 *
 * 模型文件导出（格式见 references/model-template.mjs）：
 *   init         初始快照，普通对象
 *   actions(s)   [[动作名, 下一个快照], ...]，每项是一个参与者的一个原子步骤
 *   check(s)     违反规矩时返回一句白话，否则返回 null
 *   describe(s)  快照的白话标签，换行用 \n
 *   done(s)      可选，合法终点返回 true，其余没有后继的快照记为卡死
 */

import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { basename, dirname, extname, join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

const FULL_GRAPH_LIMIT = 40

function parseArgs(argv) {
  const args = { out: null, max: 5000, font: "PingFang SC", model: null }
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i]
    if (flag === "--out") args.out = argv[++i]
    else if (flag === "--max") args.max = Number(argv[++i])
    else if (flag === "--font") args.font = argv[++i]
    else args.model = flag
  }
  if (!args.model) {
    console.error("用法：node explore.mjs <模型文件.mjs> [--out <目录>] [--max <快照上限>] [--font <字体>]")
    process.exit(2)
  }
  return args
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`
  }
  return JSON.stringify(value)
}

function explore(model, max) {
  const nodes = new Map()
  const edges = []
  const queue = []
  const add = (state, depth, parent, via) => {
    const key = canonical(state)
    if (!nodes.has(key)) {
      nodes.set(key, { id: `s${nodes.size}`, key, state, depth, parent, via, violation: model.check(state) })
      queue.push(key)
    }
    return key
  }
  add(model.init, 0, null, null)
  let truncated = false
  while (queue.length) {
    const node = nodes.get(queue.shift())
    if (node.violation) continue
    const next = model.actions(node.state)
    node.deadlock = next.length === 0 && !(model.done?.(node.state) ?? false)
    for (const [label, state] of next) {
      if (nodes.size >= max && !nodes.has(canonical(state))) {
        truncated = true
        continue
      }
      edges.push({ from: node.key, to: add(state, node.depth + 1, node.key, label), label })
    }
  }
  return { nodes, edges, truncated }
}

function pathTo(nodes, key) {
  const path = []
  for (let node = nodes.get(key); node; node = nodes.get(node.parent)) path.unshift(node)
  return path
}

const quote = (text) => JSON.stringify(String(text))

function nodeLabel(node, describe) {
  if (node.violation) return `${describe(node.state)}\n✗ ${node.violation}`
  if (node.deadlock) return `${describe(node.state)}\n⚠ 卡死，谁也动不了`
  return describe(node.state)
}

function toDot({ nodes, edges }, describe, highlight, font, traceOnly) {
  const onPath = new Set(highlight.map((n) => n.key))
  const pathEdges = new Set(highlight.slice(1).map((n) => `${n.parent}->${n.key}`))
  const shown = traceOnly ? new Set(onPath) : new Set(nodes.keys())
  const lines = [
    "digraph G {",
    `  graph [fontname=${quote(font)}, rankdir=TB, nodesep=0.5, ranksep=0.6, pad=0.3];`,
    `  node [fontname=${quote(font)}, shape=box, style="rounded,filled", fillcolor="#F5F5F4", color="#A8A29E", fontsize=13, margin="0.2,0.12"];`,
    `  edge [fontname=${quote(font)}, fontsize=11, color="#78716C", fontcolor="#57534E"];`,
  ]
  for (const node of nodes.values()) {
    if (!shown.has(node.key)) continue
    const attrs = [`label=${quote(nodeLabel(node, describe))}`]
    if (node.violation) attrs.push('fillcolor="#FEE2E2"', 'color="#DC2626"', 'fontcolor="#991B1B"', "penwidth=2")
    else if (node.deadlock) attrs.push('fillcolor="#FEF3C7"', 'color="#D97706"', "penwidth=2")
    else if (node.depth === 0) attrs.push('fillcolor="#E7E5E4"', "penwidth=2")
    lines.push(`  ${node.id} [${attrs.join(", ")}];`)
  }
  for (const edge of edges) {
    if (!shown.has(edge.from) || !shown.has(edge.to)) continue
    const from = nodes.get(edge.from)
    const to = nodes.get(edge.to)
    if (traceOnly && !pathEdges.has(`${edge.from}->${edge.to}`)) continue
    const attrs = [`label=${quote(edge.label)}`]
    if (pathEdges.has(`${edge.from}->${edge.to}`)) attrs.push('color="#DC2626"', 'fontcolor="#DC2626"', "penwidth=2")
    else if (to.depth <= from.depth) attrs.push("style=dashed")
    lines.push(`  ${from.id} -> ${to.id} [${attrs.join(", ")}];`)
  }
  lines.push("}")
  return lines.join("\n")
}

const args = parseArgs(process.argv.slice(2))
const modelPath = resolve(args.model)
const model = await import(pathToFileURL(modelPath).href)
const graph = explore(model, args.max)
const all = [...graph.nodes.values()]
const violations = all.filter((n) => n.violation)
const deadlocks = all.filter((n) => n.deadlock)
const firstBad = violations[0] ?? deadlocks[0]
const highlight = firstBad ? pathTo(graph.nodes, firstBad.key) : []
const traceOnly = all.length > FULL_GRAPH_LIMIT && highlight.length > 0

const outDir = resolve(args.out ?? dirname(modelPath))
mkdirSync(outDir, { recursive: true })
const name = basename(modelPath, extname(modelPath))
const dotPath = join(outDir, `${name}.dot`)
writeFileSync(dotPath, toDot(graph, model.describe, highlight, args.font, traceOnly))
let pngPath = join(outDir, `${name}.png`)
try {
  execFileSync("dot", ["-Tpng", "-Gdpi=130", dotPath, "-o", pngPath], { stdio: "ignore" })
} catch {
  pngPath = null
}

const report = {
  snapshots: all.length,
  transitions: graph.edges.length,
  truncated: graph.truncated,
  drawn: all.length > FULL_GRAPH_LIMIT ? (traceOnly ? "trace-only" : "full-but-large") : "full",
  violations: violations.length,
  deadlocks: deadlocks.length,
  firstFailure: firstBad
    ? {
        kind: firstBad.violation ? "violation" : "deadlock",
        rule: firstBad.violation ?? "没有任何动作可做，也不是合法终点",
        steps: highlight.map((n) => ({ action: n.via ?? "起点", snapshot: model.describe(n.state) })),
      }
    : null,
  dot: dotPath,
  png: pngPath,
}
console.log(JSON.stringify(report, null, 2))
process.exit(violations.length || deadlocks.length || graph.truncated ? 1 : 0)
