# 色彩、表面与层叠

只消费语义 Token。色值集中在样式入口，业务代码不写 Hex/OKLCH 与任意值。

## 1. 表面高度（E0–E3）

每个表面归入一层：

| 层 | 职责 | Token |
| :--- | :--- | :--- |
| E0 基底 | 应用背景、最远的连续画布 | `background` / `foreground` |
| E1 结构面 | 侧栏、持久功能分区 | `sidebar` / `sidebar-foreground` |
| E2 抬升面 | 卡片、从承载面分离的模块 | `card` / `card-foreground` |
| E3 浮层 | 菜单、Popover | `popover` / `popover-foreground` |

- 嵌套不等于抬升；同级表面不层层叠放。
- Dialog、AlertDialog、Sheet 用 `background` 加配套遮罩；Tooltip 用 `foreground` 作底、`background` 作字。调用点不改写成 `popover`。
- `accent` 只表达交互高亮，`input` 只用于输入控件边界，都不是通用的“再高一层”。
- 亮暗双主题（`:root` / `.dark`）。暗色下 `card`、`popover` 略亮于 `background`，同一局部链上明度与层叠不翻转；`sidebar` 与 `background` 并列，不参与此检查。浮层去掉阴影后仍能靠明度差、边框或遮罩与下层区分。
- `forced-colors` 下使用系统色，不追踪明度关系。

## 2. 颜色配比

只做强调的焦点色（`primary`、`destructive` 等品牌与状态色）不超过视区的 10%，不作大面积背景；E0 保持低彩度，`accent` 不计入。颜色本身编码信息（数据分类、状态）或本身就是内容（品牌表达、从内容提取的主题色）时按需放开，经 Token 定义并限定范围，框架保持中性，文字对比度不让步。编辑器、画布、代码区等工作区把强调色收到光标、选择与必要反馈。

## 3. 圆角

只用样式入口的圆角阶梯：

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

缺省对象与下面两条冲突时，以下面为准：

- **同心**：$R_{inner} = \max(0, R_{outer} - (\text{Padding} + \text{Border}))$。结果不在阶梯上时取不超过它的最大一档，为 0 时 `rounded-none`。
- **形态**：固定高度控件取 $R \le H/4$（圆角矩形）或 $R \ge H/2$（胶囊），不落在两者之间。

`corner-shape: squircle` 包在 `@supports` 内，以 `border-radius` 回退。

## 4. 层叠

业务代码只用以下阶梯：

| Class | 职责 |
| :--- | :--- |
| `-z-10` | 背景装饰、水印 |
| `z-0` / `z-auto` | 普通文档流 |
| `z-1`…`z-10` | 局部微层级（Focus 环、头像堆叠、Tab 激活态），父容器声明 `isolate` |
| `z-20` | 吸顶表头、吸底操作栏、拖拽把手 |
| `z-30` | 固定导航栏、固定侧栏 |
| `z-40` | 业务自建的非模态遮罩 |
| `z-50` | 全部顶层浮层，含 Dialog / Sheet 自带的遮罩 |

- Dialog、Sheet、DropdownMenu、Popover、Select、Tooltip Portal 到 `<body>`；随内容流滚动的 Accordion、Collapsible、Tabs、Sticky 表头不 Portal。
- sonner `<Toaster />` 用库内置层级、挂在应用根部；浮层互相遮挡时调整挂载顺序。
- 被遮挡时先找祖先建立的层叠上下文（`transform`、`opacity < 1`、`filter` / `backdrop-filter`、`contain`、`will-change`、`mix-blend-mode`），用 Portal 提升，不加大数值。
