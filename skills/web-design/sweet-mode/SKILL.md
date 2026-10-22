---
name: sweet-mode
description: Tailwind + shadcn/ui 界面规范：层级、布局、表面、字体、尺寸稳定、交互反馈与动效的取值、禁令与验收，附禁令扫描脚本。编写或修改界面时作为硬约束落地。仅供用户显式调用。
disable-model-invocation: true
---

# Sweet Mode

`reference/` 中的类名、Token、阈值与禁令是硬约束；未覆盖的取值沿用项目同类界面的做法。

让布局解释界面：想加说明、副标题或辅助标签时，先改分组、顺序、控件或命名，结构表达不了的信息才写成文字。

## 1. 对齐项目锚点

reference 中的 `globals.css`、`packages/ui` 指目标项目里的对应位置。先找到：

- 样式入口：定义颜色、圆角、字号与字体族 Token 的文件。阶梯以它为准，reference 表格里的 px 值只是缺省；缺少语义 Token 时在这里补，业务代码只消费语义名。
- 组件外观归属（`packages/ui` 或 `components/ui`）：圆角、表面、按压反馈等外观改在变体里，调用点只负责布局。

## 2. 按改动读取规则

新建页面或重组信息时先读 `hierarchy.md`，定好主次与收纳再选组件和样式。其余按触及内容读取，可命中多行：

| 涉及内容 | Reference |
| --- | --- |
| 信息取舍、主次焦点、首屏呈现、折叠与浮层载体、菜单与导航等容器内的归属与排序 | [hierarchy.md](reference/hierarchy.md) |
| 间距、对齐、宽度、栅格与分区边界 | [layout.md](reference/layout.md) |
| 颜色 Token 与配比、表面高度、圆角、z-index 与 Portal | [surface.md](reference/surface.md) |
| 字号、字重、字体族、数字字形与字体渲染 | [typography.md](reference/typography.md) |
| 加载占位、卡片等高、空值、长文本溢出与退出过渡期间的内容稳定 | [stability.md](reference/stability.md) |
| 错误与结果反馈、toast、等待与取消、防重与竞态 | [interaction.md](reference/interaction.md) |
| 过渡与动画、按压缩放、时长与缓动、减少动态效果 | [motion.md](reference/motion.md) |

只改当前任务触及的范围，范围外的违规列入交付。

## 3. 验收

已读 reference 的每个小节都是完成标准，逐节给出通过、修复或不适用。

1. 运行脚本扫描无判断余地的禁令，修复到改动文件不再出现在输出中：

   ```bash
   node <skill 目录>/scripts/ui-guardrails.js <目标项目路径>
   ```

   脚本跳过组件库（`packages/ui/`、`components/ui/`）、第三方、测试与 skill 目录。组件库内的改动，以及任意圆角与间距、内联 style 与 CSS 中的色值，人工核对。
2. 在运行界面检查依赖渲染的项：`hierarchy.md` 的检验、窄屏重排、加载／空值／报错三态、收起与展开两态、键盘操作与减少动态效果。无法运行界面时，标明哪些只做了代码层检查。

交付改动位置、各小节结论、范围外的违规与未验证项。
