# 色彩、表面与层叠

业务代码只消费语义 Token。色值集中定义在样式入口，不在业务代码里写 Hex、OKLCH、任意值或 Tailwind 原生色板（如 `slate-500`、`emerald-500/10`、`white`）。

例外只有三处：遮罩、媒体播放底色与媒体上的渐变遮罩，可使用 `black`、`white` 及其透明度。媒体上不随主题变化的文字颜色，在样式入口定义专用 Token。

## 1. 表面层级 Elevation（E0–E3）

将每个表面归入下表四层之一：

| 层 | 职责 | Token |
| :--- | :--- | :--- |
| E0 基底 | 应用背景与最远的连续画布 | `background` / `foreground` |
| E1 结构面 | 侧栏与持久功能分区 | `sidebar` / `sidebar-foreground` |
| E2 抬升面 | 卡片与从承载面分离的模块 | `card` / `card-foreground` |
| E3 浮层 | 菜单与 Popover | `popover` / `popover-foreground` |

遵守以下表面规则：

- 嵌套不等于抬升。同级表面不层层叠放。
- 表面只用 Token 色平涂，不用渐变文字、彩色渐变、光晕、纹理或玻璃卡片。渐变只做两件事：压在图片与视频上托住文字和按钮的遮罩，以及滚动边缘的淡出。渐变色标只取 `transparent`、`black` / `white` 透明度或表面 Token。模糊只用 `backdrop-blur-*` 透出下方滚动内容。
- 表面分离靠明度差。阴影只在组件库的浮层变体里定义，调用点只用 `shadow-none`。
- 弹窗（Dialog、AlertDialog）与抽屉（Sheet）用 `background` 配遮罩。Tooltip 用 `foreground` 作底、`background` 作字。调用点不改写成 `popover`。
- `accent` 只用于交互高亮，`input` 只用于输入控件边界，两者都不是通用的抬升表面。
- 保持亮暗双主题（`:root` 与 `.dark`）。暗色下 `card` 与 `popover` 略亮于 `background`，同一局部链上的明度与层叠关系不翻转（`sidebar` 与 `background` 并列，不参与此检查）。浮层去掉阴影后，仍须靠明度差、边框或遮罩与下层区分。
- `forced-colors` 模式下使用系统色，不追踪明度关系。

## 2. 颜色配比

只作强调的焦点色（`primary`、`destructive` 等品牌与状态色）不超过视区的 10%，不作大面积背景。E0 保持低彩度，`accent` 不计入强调面积。

颜色本身编码信息（数据分类、状态）或本身就是内容（品牌表达、从内容提取的主题色）时，可按需放开。放开的颜色必须经 Token 定义并限定范围，界面框架保持中性，文字对比度不让步。编辑器、画布与代码区把强调色收束到光标、选区与必要反馈。

- **次要文字**：用 `text-muted-foreground`，成段正文用前景色。不用 `text-foreground/60` 或 `opacity-*` 降低静态文字对比度。刷新时整体变暗的旧数据不在此列。
- **状态**：表格与列表中的状态用 6px 语义色圆点配文字，或用低透明度软底（`bg-destructive/10 text-destructive`）。不用实心高饱和 Badge。实心 `primary` 只留给视区唯一的主按钮。
- **涨跌**：行情与监控核心面之外，统计数字不加红绿涨跌色。需要表达增减时，直接写出 `+` 或 `−` 符号。

## 3. 圆角

只用样式入口定义的圆角阶梯：

| Class | 缺省值 | 缺省对象 |
| :--- | :--- | :--- |
| `rounded-xs` | 2px | 拖拽把手、极小角标、关闭按钮 |
| `rounded-sm` | 6px | 菜单项、紧凑控件内的子元素 |
| `rounded-md` | 8px | Button、Input、Select、Popover、Tooltip |
| `rounded-lg` | 10px | Dialog、AlertDialog |
| `rounded-xl` | 14px | Card、主面板 |
| `rounded-2xl` | 18px | 重点卡片、嵌套视口 |
| `rounded-3xl` / `4xl` | 22px / 26px | 顶层面板、全屏窗口、设备外框 |
| `rounded-full` | — | Avatar、Badge、Pill 按钮 |

缺省对象与以下两条规则冲突时，以以下两条为准：

- **同心圆角（concentric corners）**：按 $R_{inner} = \max(0, R_{outer} - (\text{Padding} + \text{Border}))$ 计算。结果不在阶梯上时，取不超过它的最大一档。结果为 0 时用 `rounded-none`。
- **控件形态**：固定高度控件取 $R \le H/4$（圆角矩形）或 $R \ge H/2$（胶囊），不落在两者之间。

使用 `corner-shape: squircle` 时，包裹在 `@supports` 内，并以 `border-radius` 回退。

## 4. 层叠

业务代码只用以下 `z-index` 阶梯：

| Class | 职责 |
| :--- | :--- |
| `-z-10` | 水印、压在内容下的媒体 |
| `z-0` / `z-auto` | 普通文档流 |
| `z-1`…`z-10` | 局部微层级（焦点环、头像堆叠、Tab 激活态），父容器声明 `isolate` |
| `z-20` | 吸顶表头、吸底操作栏、拖拽把手 |
| `z-30` | 固定导航栏、固定侧栏 |
| `z-40` | 业务自建的非模态遮罩 |
| `z-50` | 全部顶层浮层，含弹窗与抽屉自带遮罩 |

- 浮层（Dialog、Sheet、DropdownMenu、Popover、Select、Tooltip）通过 Portal 挂到 `<body>`。随内容流滚动的 Accordion、Collapsible、Tabs 与吸顶表头不 Portal。
- sonner `<Toaster />` 使用库内置层级并挂在应用根部。浮层互相遮挡时调整挂载顺序。
- 发生遮挡时，先排查祖先建立的层叠上下文（`transform`、`opacity < 1`、`filter`、`backdrop-filter`、`contain`、`will-change`、`mix-blend-mode`），用 Portal 提升，不靠加大 `z-index` 数值硬盖。
