---
name: sweet-mode
description: Tailwind + shadcn/ui 项目的界面实现规范：编写或修改界面时，Token、字阶、圆角、z-index、反馈与动效按具体取值与禁令落地，交付前跑禁令扫描脚本。仅供用户显式调用。
disable-model-invocation: true
---

# Sweet Mode

把 `reference/` 中的规则当作实现规范写进代码。规则给出的类名、Token、阈值与禁令是硬约束；规则未覆盖的取值沿用项目同类界面的既有做法。

## 1. 对齐项目锚点

reference 引用的 `globals.css`、`packages/ui` 变体与 recipe 指目标项目中的对应位置，链接里的相对路径以项目实际结构为准。先找到：

- 定义颜色、圆角、字体族的样式入口（通常是 `globals.css`）。
- 组件外观的归属位置（`packages/ui` 或 `components/ui`）。按压反馈、圆角、表面等外观改在变体里，调用点只负责布局。

圆角、字号等数值阶梯以项目样式入口的实际定义为准；reference 表格中的 px 值是缺省阶梯。项目缺少某个语义 Token 时，在样式入口补 Token，业务代码仍只消费语义名。

## 2. 按改动读取规则

新建页面或重组信息时先读 `hierarchy.md`，确定主次与收纳后再选组件和样式。其余按实际触及内容读取，可命中多行：

| 涉及内容 | Reference |
| --- | --- |
| 信息取舍、主次焦点、首屏呈现、折叠与浮层载体选择 | [hierarchy.md](reference/hierarchy.md) |
| 间距、对齐、宽度、栅格与分区边界 | [layout.md](reference/layout.md) |
| 颜色 Token、表面高度、圆角嵌套、z-index 与 Portal | [surface.md](reference/surface.md) |
| 字号、字重、字体族与数字字形 | [typography.md](reference/typography.md) |
| 加载占位、卡片等高、空值、报错、长文本溢出与浮层关闭时的内容稳定 | [stability.md](reference/stability.md) |
| 错误与结果反馈、toast、等待态、过渡与动画 | [interaction.md](reference/interaction.md) |

改动只落在当前任务触及的范围。范围外发现的违规列在交付里，不顺手修改。

## 3. 验收

每份已读 reference 末尾的验收清单是完成标准，逐项给出通过、修复或不适用的结论。

先运行 [scripts/ui-guardrails.js](scripts/ui-guardrails.js) 扫描目标项目中无判断余地的禁令（过渡属性、`ease-in`、z-index 阶梯、class 内硬编码色值、任意字号与字体族），修复到改动文件不再出现在输出中，范围外的命中项列入交付：

```bash
node <skill 目录>/scripts/ui-guardrails.js <目标项目路径>
```

脚本跳过组件库（`packages/ui/`、`components/ui/`）、第三方、测试文件与 agent skill 目录（`.agents/skills/` 等）。其余清单项（含任意圆角与间距、内联 style 与 CSS 中的色值）以及组件库内的改动按清单人工核对。

再在运行界面检查清单中依赖渲染结果的项：眯眼测试、窄屏重排、加载／空值／报错三态、收起与展开两态、键盘操作与减少动态效果。无法运行界面时，交付中标明哪些清单项只做了代码层检查。

交付改动位置、各清单的结论、范围外的违规与未验证项。
