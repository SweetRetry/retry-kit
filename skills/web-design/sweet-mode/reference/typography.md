# 排版与字体

只用标准字号 utility 与样式入口定义的字体族（`font-sans`、`font-mono`、`font-serif`）。需要新档位时，在样式入口补充 Token，不写 `text-[*]` 或 `font-[*]`。

## 字阶

应用界面以 `text-sm` 为基准。先靠字重与颜色拉开层级，再按下表放大字号：

| 角色 | 字号 | 字重 |
| :--- | :--- | :--- |
| 元数据、时间戳、辅助标注 | `text-xs` | `font-normal` |
| 正文、表格行、表单说明 | `text-sm`，长文阅读 `text-base` / `text-lg` | `font-normal` |
| 控件文字（Button、Tab、菜单项）、字段 Label、表头 | `text-sm`，紧凑控件 `text-xs` | `font-medium` |
| 卡片、模块与表单分组标题 | `text-sm` / `text-base` | `text-sm` 配 `font-medium`，`text-base` 配 `font-semibold` |
| 页面内分区标题 | `text-base` / `text-lg` | `font-semibold` |
| 页面主标题 | `text-xl` / `text-2xl` | `font-semibold` |
| Hero、核心 KPI | `text-2xl` 及以上 | `font-semibold` |

- 字重只用 `font-normal`、`font-medium` 与 `font-semibold`。营销与长文页面按阅读距离整体上调标题字号，字重保持不变。
- 字号下限为 `text-xs`。正文段落用 `font-normal`。列表项不套标题字号。
- 同一视区只放一个最高级标题。
- 会折行的标题加 `text-balance`，使各行长度均衡，不留孤字行。
- 内容装不下时重组布局，不靠缩小字号硬塞。

## 数字字形

- 原地变化的数值（倒计时、进度、计数徽章）加 `tabular-nums`。容器固定宽度时同时加 `min-w-*`。
- 纵向比对的数值列（金额、百分比、时间戳、统计）用 `tabular-nums text-right`，表头同步右对齐。
- 其余数字（正文叙述、静态大字展示）保持比例数字。只需要等宽数字时，不用 `font-mono`。

## 字体渲染（仅 macOS 生效）

根节点设 `antialiased`，全应用只设一处。局部区域需要系统渲染时，在该区域加 `subpixel-antialiased`。
