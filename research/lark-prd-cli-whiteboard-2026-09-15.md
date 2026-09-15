# lark-cli 写 PRD 与画板表达流程

**问题**：如何用 `lark-cli` 在飞书云文档中撰写 PRD，并用画板表达流程？需要哪些可靠命令、内容结构与证据规则？
**日期**：2026-09-15
**来源范围**：larksuite/cli 上游 skill 原文（`lark-doc`、`lark-whiteboard`、`lark-doc` 的 PRD genre contract 与 XML 语法），本机 `lark-cli 1.0.24` 的 `--help` 输出，以及在本机飞书账号上的实测（创建/追加/画板渲染/导出/删除临时文档，均已清理）。
**边界**：命令行为以本机 1.0.24 为准；上游 `main` 已到 1.0.95，部分参数名与画板路线不同。

## 事实（实测或一手文档）

### CLI 能力

- `docs +create --api-version v2 --doc-format xml --content @file` 可一次创建正文并内联 `<whiteboard type="mermaid">`；返回 `document_id`、`url`、`new_blocks[].block_token`。本机 1.0.24 实测通过，画板导出为图片确认已渲染。
- v1 `docs +create --markdown` 会返回 `[WARNING:UNSUPPORTED_HTML_TAG] unsupported HTML tag removed: whiteboard`，即画板标签被剥离、只保留文字。实测确认。
- v1 `docs +update --mode append --markdown '<whiteboard type="blank"></whiteboard>'` 可追加空白画板，返回 `data.board_tokens`。实测确认。
- `whiteboard +update --whiteboard-token <t> --input_format mermaid --source "@file" --yes` 可把 mermaid 渲染进画板；不加 `--yes` 报 `confirmation_required`（high-risk-write）。实测确认。
- `whiteboard +query --output_as image --output <path>` 导出画板缩略图用于校验；本机 1.0.24 的取值是 `image|code|raw`，没有上游文档里的 `preview|svg|source`。实测确认。
- v2 `docs +update --command append --doc-format markdown --content @file` 可追加内容。实测：追加 markdown 列表项会并入已有 `<ul>`；追加 markdown 表格行只生成字面文本段落，不会成为新表格行。
- `docs +fetch --doc <url>` 返回 markdown，画板显示为 `<whiteboard token="..."/>`。
- `drive +delete --file-token <t> --type docx --yes` 可删除临时测试文档。实测确认。

### 上游内容规则（larksuite/cli 仓库，一手）

- `lark-doc/references/genres/prd.md` 的体裁规则：内容按“用户问题/证据 → 目标/结果 → 范围/非目标 → 场景 → 行为需求/验收 → 异常/边界 → 质量约束 → 依赖/开放问题”推进；需求写 actor + trigger/precondition + observable outcome + failure/edge；验收验结果；功能清单无用户问题、范围/非目标缺失、需求暗藏实现、验收不可测、伪造研究/阈值/批准，任一出现即失败。
- `lark-doc/references/lark-doc-whiteboard.md`：图示能明显降低理解成本时才画板；一图一主题，多图可拆多个画板；插入后应导出预览审查。
- `lark-doc-xml.md`：完整文档以唯一 `<title>` 开头，`h1–h6` 层级连续；`<whiteboard>` 的 `type=blank|mermaid|plantuml|svg`；文本内 `<`/`>`/`&` 转义。
- `lark-whiteboard/scenes/flowchart.md` 声明流程图改走 DSL、不再用 Mermaid；但该文针对独立 `lark-whiteboard` 的 whiteboard-cli 路线，文档内嵌路线仍以 XML 标签为准（`lark-doc-xml.md` 明确保留 `type=mermaid`）。两者并存且随版本变化。

## 推断

- PRD 的失败模式不是“少写一节”，而是模板填空、需求不可观察、流程用文字藏关系、变更记录被就地改写；因此 skill 的价值在决策规则与质量门槛，而非再提供一份模板。
- 图表路线（内嵌 mermaid vs 独立 DSL/SVG）由 CLI 版本决定，skill 应固定在文档内嵌 mermaid 这条对本机可用的路径，把精修图形交给上游 `lark-whiteboard`。
- 变更记录用 append 追加到文档末尾即可，前提是它始终是最后一节；且必须用列表承载逐次追加，表格行无法通过 append 并入已有表格。

## 建议（已回写 skill 的结论）

- 用 v2 XML 一次创建正文与画板；明确不把画板写进 v1 markdown 创建路径。
- 需求带稳定 ID，变更记录只追加、不改写，条目含 日期/版本/需求ID/类型/内容/原因/影响面/提出人/状态。
- 业界实践按“谁在什么约束下怎么做 + 来源与时间 + 可迁移什么 + 差异”写，且不自动升级为需求。
- 画板节点名与需求术语一致；单线短流程用列表，有分支/回路/多角色/状态迁移才画板。

## 更新 2026-09-15：升到 lark-cli 1.0.95 后复核

同日在 `lark-cli update` 升到 1.0.95 后重测，以下事实替代上文 1.0.24 的对应结论：

- `docs +create` / `+update` 不再有 `--api-version`：统一为 `--content` + `--doc-format xml|markdown`；旧参数 `--markdown` 与 `--mode` 已移除（实测报错）。
- `--doc-format markdown` 不再剥离 `<whiteboard>`：markdown 正文可直接内联 `<whiteboard type="mermaid">`，实测生成画板块并导出渲染图确认。上文“v1 markdown 剥离画板”只适用于 1.0.24。
- `--api-version v2` 在 1.0.24 可用的记录保留为历史；1.0.95 下不要再写该参数。
- `docs +create/update/fetch` 的 `--content` / `@file` 只接受当前工作目录下的相对路径，绝对路径报 `unsafe file path`。
- `whiteboard +query --output_as` 取值为 `image | svg | code | raw`；`--output_as image` 实测输出 `.jpg` 或 `.png`。
- `--command append` + `--doc-format markdown` 的列表项实测并入已有 `<ul>`；追加 markdown 表格行仍只生成字面文本（与 1.0.24 一致）。
- `lark-cli update` 同时把官方 skill 装到 `~/.agents/skills/`；可用 `lark-cli skills read lark-doc` / `lark-whiteboard` 读取与 CLI 版本同步的内容，PRD 体裁契约在 `~/.agents/skills/lark-doc/references/genres/prd.md`。
- 1.0.95 起 `docs +script` 可用（草稿工作区、parse 校验），本轮未采用；仍以 `docs +create --content` 的简单路径为准。

**残余局限**：仍未验证 `<whiteboard type="svg">` / `plantuml` 与 `docs +script` 工作流；未评估租户权限与默认共享范围。

## 局限

- 只在 lark-cli 1.0.24 上验证；升级到 1.0.95+ 后 v1/v2 参数名、`+script` 创作工作流与画板路线可能变化，使用前应以 `lark-cli docs --help` 复核。
- 未验证 `<whiteboard type="svg">` 与 `plantuml` 在 v2 XML 创建路径的表现。
- 未评估租户权限与文档默认共享范围；skill 不对权限行为作承诺。
