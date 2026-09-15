# lark-cli 操作与画板写法

适配 lark-cli 1.0.95；创建、追加与导出已有实测，修订及画板覆盖命令仅校验参数，未做远端写入验证。CLI 版本变化时用对应命令的 `--help` 复核参数和写入模式。

## 身份

文档与画板写操作显式加 `--as user`。命令报未认证或 scope 错误时运行 `lark-cli auth status`，不要预先探测。

## 一次创建 PRD（推荐）

```bash
lark-cli docs +create --doc-format xml --as user --content "@./prd.xml"
```

- XML 是默认格式，支持标题、表格、画板等富块；改用 `--doc-format markdown` 时，`<whiteboard>` 等 XML 标签同样会被解析生效。
- `@file` 只接受当前工作目录下的相对路径，绝对路径会报 `unsafe file path`。
- 返回 `data.document.document_id` 与 `data.document.url`；`data.document.new_blocks` 列出新增画板块及其 `block_token`，供后续 `whiteboard +query` / `+update` 使用。

XML 骨架（按第 2 步的 section 决策展开，不要原样保留全部小节）：

```xml
<title>PRD：一句话主题</title>
<h1>背景与问题</h1>
<p>...</p>
<h1>用户旅程</h1>
<p>谁在什么处境下产生这个需求，现在怎么凑合，卡在哪。</p>
<h1>目标与成功指标</h1>
<p>...</p>
<h1>主流程</h1>
<whiteboard type="mermaid">
flowchart LR
  A[提交] --> B{校验}
  B -->|通过| C[落库]
  B -->|否| D[提示修正]
</whiteboard>
<h1>变更记录</h1>
<ul>
  <li><b>[日期] / [版本] / [全部实际需求 ID] / 新增</b>：[首版需求摘要]。原因：[依据]。影响面：[实际影响或待确认]。提出人：[依据或待确认]。状态：[依据或待确认]。</li>
</ul>
```

写法约束：

- 完整文档以唯一 `<title>` 开头；正文标题用 `<h1>`–`<h6>`，层级连续不跳级。
- `<whiteboard type="mermaid">` 内联 mermaid 代码，也可 `path="@./flow.mmd"`；`type="blank"` 建空白板。
- 标签内文本的 `<`、`>`、`&` 分别写 `&lt;`、`&gt;`、`&amp;`；换行用 `<br/>`。

## 校验与回查

```bash
# 画板渲染结果，产出 ./wb-check.jpg 或 .png
lark-cli whiteboard +query --as user --whiteboard-token <token> \
  --output_as image --output ./wb-check --overwrite

# 回查文档正文，画板显示为 <whiteboard token="..."/>
lark-cli docs +fetch --doc <url>
```

导出后检查节点文字、分支标签与连线是否符合预期。本次新建且内容全部来自本次生成的画板，渲染失败或文字溢出时，可修正 Mermaid 后在原 token 上替换整图，再导出检查：

```bash
lark-cli whiteboard +update --as user --whiteboard-token <token> \
  --input_format mermaid --source "@./flow.mmd" --overwrite
```

`--overwrite` 会删除画板全部现有内容；省略则增量追加，不能用来替换整图。已有画板或含他人内容时，先按上游 `lark-doc/references/lark-doc-whiteboard.md` 与 `lark-whiteboard` 的编辑工作流读取现状、确认修改范围，不能直接套用整图覆盖命令。

`--output_as` 支持 `image | svg | code | raw`；`code` 可导出画板的 mermaid 源码。

## 修订已有 PRD

先读取上游 `lark-doc` 及其 `references/lark-doc-update.md`，按章节或关键词获取当前正文和 block ID：

```bash
lark-cli docs +fetch --doc <url> --scope keyword \
  --keyword 'R-1' --detail with-ids

lark-cli docs +update --doc <url> --command block_replace \
  --block-id <block-id> --doc-format xml --as user --content "@./replacement.xml"
```

单个 block 用 `block_replace`，简单行内替换用 `str_replace`；跨节修改按实际受影响块分别定位。结构变更后重新 fetch 获取 block ID，保留原资源 token 和无关内容。正文、验收及相关画板验证一致后，再追加对应记录。

## 追加变更记录

变更是往变更记录 section 追加条目，用列表承载：

```bash
lark-cli docs +update --doc <url> --command append \
  --doc-format markdown --as user --content "@./changelog.md"
```

`changelog.md` 每条一行：

```markdown
- **[日期] / [版本] / [需求 ID] / 修改**：[旧要求] → [新要求]。原因：[事实依据]。影响面：[实际变化或待确认]。提出人：[依据或待确认]。状态：[依据或待确认]。
```

新建文档将变更记录放在末尾，用列表承载。`append` 只作用于文档末尾；修订已有文档时，若记录不在末尾，用 `block_insert_after` 在该节最后一条记录后插入，不移动其他章节。实测 append 的列表项会并入已有 `<ul>`；已有记录为表格时，按上游更新工作流定位并修改表格，不能用 append 的 markdown 表格行，后者只生成字面文本。追加后回读核对需求 ID、变更内容和状态。

## 图型选择（Mermaid）

| 关系 | 图型 |
| --- | --- |
| 分支、判断、回路、审批流 | `flowchart LR` |
| 多角色 / 多系统交接 | `flowchart` + `subgraph` |
| 状态迁移与生命周期 | `stateDiagram-v2` |
| 时序依赖、先后交互 | `sequenceDiagram` |
| 时间线 / 里程碑 | `gantt` |

- 一图一主题，节点名与需求术语一致；
- 分支边写条件标签（`-->|通过|`），不留裸线；
- 主路径与失败路径都进图，失败路径不省略。

## 上游官方 skill

官方 `lark-doc` 与 `lark-whiteboard` 随 CLI 安装，可直接读取，不必凭记忆猜：

```bash
lark-cli skills read lark-doc
lark-cli skills read lark-whiteboard
```

本地副本在 `~/.agents/skills/lark-doc` 与 `~/.agents/skills/lark-whiteboard`；PRD 体裁契约在 `~/.agents/skills/lark-doc/references/genres/prd.md`。自定义 SVG、视觉精修、编辑已有画板、复杂排版交给这两个上游 skill，本 skill 只负责 PRD 的决策与质量门槛。
