# Retry

具体取值都在 `theme.css`（项目全局样式表），本文不重复。

## 概览

- **气质**：克制（无渐变、光斑、网格、装饰性毛玻璃与阴影）、精准（对齐、数字与措辞准确，不注水）、有温度（第一人称，留呼吸感，不端企业腔）。
- **定位与排除**：面向看重思考而非包装的同行与协作者；细节各有其职，初看隐形、再看有回报。禁用终端/黑客风、新粗野主义、套路 SaaS 模版（蓝紫渐变等）、炫技展示品与未改动的 shadcn 默认样式。
- **冲突优先级**：事实与约束 › 宿主项目框架 › 任务清晰度 › Retry 外观 › 精细打磨。
- **底线**（任何界面不得覆盖）：气质与排除项、以下五条辨识点、声线、冲突优先级、文末禁用项、组件封闭词表，以及无障碍下限（正文与辅助文字对比度 ≥ 4.5:1、可见焦点环、状态不只靠颜色、开启减少动效时关闭动效）。其余均为默认值，界面文件说明理由后可覆盖。

**辨识点**（区别于未经改动的深色 shadcn，五条同时成立才是 Retry）：

1. 分组靠明度阶梯与留白拉开，无边框、无阴影。
2. 祖母绿每个视图只出现一次，且必有语义。
3. 状态用圆点加文字表达，绝不用徽章。
4. 操作贴在对象上，通用图标不配文字。
5. 输入控件采用填充态，而非描边态。

## 语气

英文优先，其他语言按母语重写而非直译；英文一律句首大写，不用 emoji 与感叹号，绝不在页面解说设计本身。站点、文章与幻灯片用第一人称（"I design and build…"），产品界面以对象作主语（"Your projects"、"Note published"）。短句、结论先行，短促排比（"Fewer things. Better."）仅用于站点与幻灯片大标题。声线不变，语调随利害变化：起步、空态、首次成功可带一句温度（"Nothing here yet. Start with a note."）；报错、权限、计费、删除只讲事实与下一步，不道歉也不打气（"Couldn't save. Check your connection and try again."）。

## 色彩

- **明度即深度**：`background`、`card`、`popover` 是容器，`secondary`、`muted`、`accent` 是高一阶的填充；容器可叠在填充上，填充绝不叠在填充上。新增中性色保持色相 286，只调明度 L。
- **文字**：正文 `text-foreground`，辅助 `text-muted-foreground`，`text-subtle-foreground` 仅用于 `background`/`surface-1`/`sidebar` 上的占位符、时间戳与表头；绝不用透明度做文字层级（重载时的旧数据等瞬态除外）。
- **强调色与语义**：祖母绿（`primary`）面积低于 5%，只给每视图唯一主按钮、链接、选中控件、焦点与成功态，不作装饰，向好的数字仍用 `text-muted-foreground`。状态色（`success`/`warning`/`destructive`）必配文字，提示条用 `*-soft`。涨跌色默认关闭，仅当方向为核心信息时在界面文件声明启用并配 `+`/`−`。`accent` 是中性悬停色；图表主序列用 `chart-1`，其余用 `chart-5`。

## 排版

使用带 `opsz` 轴的 Inter，字重只用 400、500、600；主题已接管大字号字距行高，标题不手写 `tracking-*`、`leading-*`。沿用 Tailwind 常规字阶（首屏主标题 `text-5xl`/`text-6xl` 每页至多一次，文章正文 `text-lg`，界面 `text-sm`，元数据 `text-xs`）。`font-mono` 只用于代码与数据，对齐数字加 `tabular-nums`，标题加 `text-balance`。

## 布局

默认左对齐，沿用 Tailwind 常规间距与控件高度；文章限宽 `max-w-2xl`，侧边栏 `w-54`，分组靠留白与明度差而非边框。窄屏下先将侧边栏收进 Sheet，再让出次要列，字号与阅读宽度保持不变。

## 表面与圆角

线条只出现在表格行间与浮层外缘，同时最多两层浮层；毛玻璃只用于下方有滚动内容穿过的界面壳层（`bg-background/85 backdrop-blur`）。圆角只改全局 `--radius` 而非单改类名：控件与浮层用 `rounded-md`（内项 `rounded-sm`），Dialog 用 `rounded-lg`，卡片用 `rounded-xl`，强调容器与幻灯片用 `rounded-2xl`；嵌套圆角按 `外圆角 − 内边距` 向下取档，`rounded-full` 只用于开关、头像与状态圆点。

## 组件

基于 Base UI 的 shadcn/ui（`shadcn init --base base`，不引入 Radix），`<html>` 挂 `class="dark"`；只用主题工具类，禁止任意值（新增取值先写入 `theme.css`）。添加组件后在其文件内一次性按以下规则覆写，之后直接使用：

- **Card**：无边框，仅 `bg-card`。
- **Input / Textarea / Select**：填充 `bg-muted` 配 `border-input`，焦点为 `border-ring` 加 `ring-soft`。内嵌提交按钮、标签行或单位时整体作一个 input group，内部控件裸态，`ghost` 按钮悬停至 `surface-3`。
- **Button**：每视图一个 `default`，其余用 `secondary`、`ghost`、`destructive`（`bg-destructive-soft text-destructive`）、`link`，禁用 `outline`；纯图标按钮用方形 `icon` 尺寸对齐相邻控件高度。
- **Badge**：不用于元数据（元数据用 `text-xs text-muted-foreground`）；状态用 6px 圆点加文字。
- **Tabs**：列表 `bg-muted`，激活项 `bg-surface-3`，无下划线、不用祖母绿。
- **浮层**：Popover / Dropdown / Toast 用 `bg-popover border rounded-md`；Dialog / Sheet 用 `bg-background border`；Tooltip 用 `bg-foreground text-background`。
- **Table**：全宽、`border-t` 行分隔，无外框与斑马纹；数字及表头 `text-right tabular-nums`。
- **Sidebar 与开关**：Sidebar 靠明度区分无分隔线，激活 `bg-sidebar-accent`；Switch / Checkbox / Radio 关闭 `bg-surface-2`/`surface-3`，开启 `bg-primary`。
- **交互状态**：悬停升一阶明度；禁用 `bg-surface-1 text-subtle-foreground` 且不降透明度；空态由一句说明加唯一填充操作构成；错误用 `text-destructive` 写在出错对象旁。

## 图标

使用默认描边的 Lucide（`lucide-react`），尺寸随所在控件（`icon` 按钮或 `data-icon`）；只承担操作或表意（如放不下文字时的类型与状态），绝不作装饰，不用插画、吉祥物与空态配图。

- **图标与文字**：通用操作（发送、关闭、播放/暂停、增删单项、复制、搜索、更多、切换、展开）一律用纯图标按钮，配 `aria-label` 与带快捷键的 Tooltip；易误读的操作、作用于大对象的不可逆操作（账号、项目、整批数据）及视图核心决策的 `default` 按钮必须配文字。
- **就近放置**：独立发送的输入框将提交内置右下角（input group），表单提交跟在表单下方，行操作在行尾，媒体控制在媒体上，绝不在远离对象处另起一行文字按钮。

## 动效

悬停、按压与变色用 CSS 过渡且只指明属性（如 `transition-colors`），位移用 `duration-200`。出入场与位置变化用 Motion（`motion/react`），顶层统一包裹一次 `<MotionConfig reducedMotion="user" transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}>`，组件不单写 `transition`；弹簧一律 `bounce: 0`，不做装饰性入场。细节只保留有职责、初看隐形、在交互触点且开启减少动效时消失的微交互（已采用：数字只滚动变化位、链接下划线左入右出）。

## 界面

站点（低密度，左对齐核心主张与一个主按钮）、文章（低密度，`max-w-2xl` 专注阅读）、幻灯片（低密度，每页一个主张、祖母绿至多一处短语）、工具（中密度，侧边栏配 `text-sm` 与 `h-10` 行高）。需要覆写默认值的界面在本文件旁建 `<surface>.md`，写明继承、覆盖项与理由。

## 推荐与禁止

- 居中 Hero 配三张特性卡片 → 左对齐的真实主张或作品本身。
- 卡片套卡片 → 留白、明度差与字号。
- 标题配装饰图标、为对称凑图标 → 图标只用于操作或表意。
- 等宽字体标题、粗边框、全大写 → 等宽字体留在代码里。

克制不是空白：视觉张力来自字阶对比、留白、精准对齐，以及唯一那处祖母绿。
