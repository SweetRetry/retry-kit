# 排版与字体

只用标准字号 utility 与样式入口定义的字体族（`font-sans` / `font-mono` / `font-serif`）；需要新档位时在样式入口补 Token，不写 `text-[*]`、`font-[*]`。

## 字阶

应用界面以 `text-sm` 为基准，层级先靠字重与颜色拉开，字号只在页面级标题处放大：

| 角色 | 字号 | 字重 |
| :--- | :--- | :--- |
| 元数据、时间戳、辅助标注 | `text-xs` | `font-normal` |
| 正文、表格行、表单说明 | `text-sm`；长文阅读 `text-base` / `text-lg` | `font-normal` |
| 控件文字（Button、Tab、菜单项）、字段 Label、表头 | `text-sm`，紧凑控件 `text-xs` | `font-medium` |
| 卡片、模块与表单分组标题 | `text-sm` / `text-base` | `text-sm` 配 `font-medium`，`text-base` 配 `font-semibold` |
| 页面内分区标题 | `text-base` / `text-lg` | `font-semibold` |
| 页面主标题 | `text-xl` / `text-2xl` | `font-semibold` |
| Hero、核心 KPI | `text-2xl` 及以上 | `font-semibold` |

- 字重只用 `font-normal` / `font-medium` / `font-semibold`。营销与长文页面按阅读距离整体上调标题字号，字重不变。
- 下限 `text-xs`；正文段落用 `font-normal`；列表项不套标题字号。
- 同一视区只有一个最高级标题。
- 内容装不下时重组布局，不缩字号。

## 数字字形

- 原地变化的数值（倒计时、进度、计数徽章）用 `tabular-nums`，容器固定时加 `min-w-*`。
- 纵向比对的数值列（金额、百分比、时间戳、统计）用 `tabular-nums text-right`，表头同步右对齐。
- 其余数字（正文叙述、静态大字展示）保持比例数字。只需等宽数字时不用 `font-mono`。

## 字体渲染（仅 macOS 生效）

根节点 `antialiased`，只设一处；个别区域需要系统渲染时局部 `subpixel-antialiased`。
