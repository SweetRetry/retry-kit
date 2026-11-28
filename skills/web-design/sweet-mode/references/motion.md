# 动效与微交互工艺

动效是微交互的触感与视觉过渡层，不是交互本身。过渡归零后，行为与语义必须依然成立（规则见 `interaction.md`）。

## 1. 准入与预算

动效只服务两类认知收益，其余删除：

- **空间连续**：交代元素从哪来、到哪去以及层级切换，不用于高频重复切换。
- **状态桥接**：用极短物理过渡表达状态变化，不拖慢操作响应。

解释演示与里程碑动效只用于营销页或极低频达成，不进入日常操作路径。

- **触点预算**：每个视图只选 **1–2 个高频核心触点**（主开关、核心提交或状态按钮、关键数字或进度、核心导航指示器）做定制微交互工艺。其余控件保持克制的默认过渡，避免全屏一起动。

## 2. 微交互工艺

对选中的核心触点，不用泛化的淡入淡出敷衍，按四条原则设计触感：

- **原地变形优于卸载重绘（Morph over Swap）**：同一控件在两态间切换时，保持视觉主体连贯形变。例如菜单线条转叉、复制切勾号、搜索图标展为输入框、Tab 共享 `layoutId` 滑块、按钮原地承接加载与完成态。
- **物理隐喻贴合语义**：动作来自对象的物理意义而非炫技。例如开关推拉微形变、铃铛静音轻晃、勾选沿路径描边配删除线、变化数值只滚变化位并配 `tabular-nums`。
- **触点节奏（压 → 切 → 落）**：按压瞬给极轻阻尼反馈，主状态果断到位，落点取临界阻尼（`bounce: 0`）或极微收束，不反复晃荡。
- **按复杂度选原语**：按压与轻位移用纯 CSS `transform` 与 `opacity`。图标形变、路径描边与环形进度用 SVG 路径与 `stroke-dashoffset`。共享指示器、展开形变与拖拽回弹用 Motion `layout`、`layoutId` 与 spring。

## 3. 时长与缓动

操作越高频，过渡越接近无感。承载空间关系的过渡给眼睛留出跟随时间。退场时长不长于进场。

| 场景 | 时长 | 缓动与约束 |
| :--- | :--- | :--- |
| 按压与即时确认 | 100–160ms | `ease-out` |
| Tooltip / 小型 Popover | 125–200ms | `ease-out` 或 `cubic-bezier(0.23, 1, 0.32, 1)` |
| Dropdown / Select | 150–250ms | `ease-out` |
| Dialog / Sheet | 200–500ms，取偏短 | 抽屉用 `cubic-bezier(0.32, 0.72, 0, 1)` |
| 原地形态切换 | 200–300ms | `ease-in-out` |
| 内容空间过渡（缩略图展开为全屏） | 250–400ms | `ease-out`，从来源位置展开并回到来源位置，不用于高频操作 |

进场用 `ease-out`，原地切换用 `ease-in-out`。`ease-in` 起步慢且显得迟钝，不用于界面。

## 4. 形态

- 缩放入场从 `scale(0.95)` 加 `opacity: 0` 起步，不从 `scale(0)` 起步。
- 按压用 `motion-safe:active:scale-95`（或组件库统一的轻位移按压态），只作用于指针按压。
- Popover 与下拉菜单从触发控件方向展开（`origin-(--transform-origin)` 或 `origin-(--radix-*-content-transform-origin)`）。居中弹窗以视口中心为锚点。
- Spring 不做弹跳晃荡。`duration + bounce` 与 `stiffness + damping + mass` 二选一。
- 布局变化用 `layout` 或 `layoutId`，不逐帧更新 React 状态。

## 5. 性能与可访问性

- 只过渡 `transform`、`opacity` 与颜色类属性（`color`、`background-color`、`border-color`），显式声明（如 `transition-[transform,opacity]`），不用 `transition-all`。折叠展开的高度用组件库 keyframes（如 `--accordion-panel-height` 或 `--radix-*-content-height`）。
- 过渡不阻塞输入，打断时从当前帧衔接新目标（退出期内容冻结见 `resilience.md` §5）。
- `prefers-reduced-motion` 下移除位移与缩放，只留轻微透明度或颜色过渡。
- 悬停动效只在 `(hover: hover) and (pointer: fine)` 下生效。
