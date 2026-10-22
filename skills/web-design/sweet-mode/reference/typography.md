# 排版与字体

只用标准字号 utility 与样式入口定义的字体族（`font-sans` / `font-mono` / `font-serif`）；需要新档位时在样式入口补 Token，不写 `text-[*]`、`font-[*]`。

## 字阶

文字篇幅与视觉重量按 6:3:1 分配：

| 配比 | 字号 | 字重 | 角色 |
| :--- | :--- | :--- | :--- |
| 60% 阅读 | `text-xs`–`text-base`（长文正文可 `text-lg`） | `font-normal` | 正文、表格行、表单说明、辅助标注 |
| 30% 结构 | `text-lg` / `text-xl` | `font-medium` / `font-semibold` | 模块与卡片标题、表单分组 Label |
| 10% 焦点 | `text-2xl` 及以上 | `font-semibold` | 页面主标题、Hero、核心 KPI |

- 下限 `text-xs`；正文不大面积加粗；列表项不套标题字号。
- 同一视区只有一个最高级标题。
- 内容装不下时重组布局，不缩字号。

## 数字字形

- 原地变化的数值（倒计时、进度、计数徽章）用 `tabular-nums`，容器固定时加 `min-w-*`。
- 纵向比对的数值列（金额、百分比、时间戳、统计）用 `tabular-nums text-right`，表头同步右对齐。
- 其余数字（正文叙述、静态大字展示）保持比例数字。只需等宽数字时不用 `font-mono`。

## 字体渲染（仅 macOS 生效）

- 根节点 `antialiased`，只设一处；个别区域需要系统渲染时局部 `subpixel-antialiased`。
- 关闭系统加粗后细字重在深色底上偏细，深色表面的正文与标签取 `font-normal` 及以上。
