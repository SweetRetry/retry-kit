# 飞书副本

飞书文档是 PRD 的副本，供人评审与评论；权威源仍是 Markdown 文件。已有 PRD 只存在于飞书时，它就是权威源，跳过“生成副本稿”，直接按“再次同步”的定位与定点更新方式修订。

适配 lark-cli 1.0.95。创建、追加、画板导出已实测；Markdown 模式下的 `<whiteboard path>`、`overwrite`、`+history-list`、评论命令只按 `--help` 与内置文档核对过参数，未做远端写入验证，首次使用时回读确认。CLI 版本变化时用对应命令的 `--help` 复核参数和写入模式。

## 身份

文档与画板写操作显式加 `--as user`。命令报未认证或 scope 错误时运行 `lark-cli auth status`，不要预先探测。

## 生成副本稿

从权威源生成 `prd-lark.md`，权威源本身不改：

- 去掉权威源的一级标题，改用 `--title` 传入；
- 开头加一行：权威源位置与版本，并说明评审用评论，改动由维护人合入权威源后重新同步；
- 每个 Mermaid 代码块存成当前目录下的 `flow-<n>.mmd`，原位置换成 `<whiteboard type="mermaid" path="@./flow-<n>.mmd"></whiteboard>`。Markdown 模式下这类 XML 标签同样解析；用 `path` 导入免去 Mermaid 箭头的转义，同一文件之后也供 `whiteboard +update` 替换整图。

## 首次发布

```bash
lark-cli docs +create --doc-format markdown --as user \
  --title "PRD：一句话主题" --content "@./prd-lark.md"
```

- `@file` 只接受当前工作目录下的相对路径，绝对路径会报 `unsafe file path`。
- 返回 `data.document.url`；`data.document.new_blocks` 列出新增画板块及其 `block_token`。
- 把 URL 写回权威源头部的副本链接。

## 校验与回查

```bash
# 画板渲染结果，产出 ./wb-check.jpg 或 .png
lark-cli whiteboard +query --as user --whiteboard-token <token> \
  --output_as image --output ./wb-check --overwrite

# 回查正文，画板显示为 <whiteboard token="..."/>
lark-cli docs +fetch --doc <url>
```

导出后检查节点文字、分支标签与连线是否符合预期。`--output_as code` 可导出画板的 Mermaid 源码，用于和权威源比对。

## 再次同步

1. **收回反馈**：先把副本上的变化合入权威源。

   ```bash
   lark-cli drive +list-comments --url <url> --as user   # 默认只列未解决评论
   lark-cli docs +history-list --doc <url> --as user     # 上次同步后是否有他人版本
   lark-cli docs +fetch --doc <url> --doc-format markdown # 正文加评论附带信息
   ```

2. **定点更新**：权威源改完、变更记录追加后，按受影响 ID 定位副本中的块再替换，保留原画板 token 与无关内容。结构变更后重新 fetch 获取 block ID。

   ```bash
   lark-cli docs +fetch --doc <url> --scope keyword \
     --keyword 'R-1' --detail with-ids

   lark-cli docs +update --doc <url> --command block_replace \
     --block-id <block-id> --doc-format xml --as user --content "@./replacement.xml"
   ```

   单个 block 用 `block_replace`，简单行内替换用 `str_replace`；跨节修改按实际受影响块分别定位。

3. **整篇覆盖**：`--command overwrite` 按 CLI 说明会丢弃无关富内容；只在副本没有他人改动、也没有未解决评论时使用。
4. **画板**：本次新建、内容全来自权威源的画板，可在原 token 上替换整图后再导出检查。

   ```bash
   lark-cli whiteboard +update --as user --whiteboard-token <token> \
     --input_format mermaid --source "@./flow.mmd" --overwrite
   ```

   `--overwrite` 删除画板全部现有内容，省略则增量追加。含他人内容的画板先读 CLI 内置画板文档的编辑工作流，确认修改范围。

5. **回复评论**：合入的评论用 `drive +add-reply` 说明对应的权威源版本；是否标记解决交给提出人。

## 追加变更记录

```bash
lark-cli docs +update --doc <url> --command append \
  --doc-format markdown --as user --content "@./changelog.md"
```

`changelog.md` 每条一行，字段与权威源的变更记录相同。`append` 只作用于文档末尾，实测追加的列表项会并入已有列表；记录不在末尾时，用 `block_insert_after` 插在该节最后一条之后。已有记录为表格时按 CLI 内置更新文档定位并修改表格，append 的 Markdown 表格行只会生成字面文本。追加后回读核对 ID、变更内容和状态。

## CLI 内置文档

`lark-cli skills read <名称> [相对路径]` 读取随 CLI 版本同步的内置文档，磁盘上没有副本：修订读 `lark-doc references/lark-doc-update.md`，Markdown 写法读 `lark-doc references/lark-doc-md.md`，画板读 `lark-whiteboard`。
