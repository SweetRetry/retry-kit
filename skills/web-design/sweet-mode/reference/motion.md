# 动效

## 1. 目的

每个动效归入一项目的，归不进的删除：

| 目的 | 含义 |
| :--- | :--- |
| 反馈 | 确认收到操作（按压缩放、长按填充） |
| 空间连续 | 交代内容从哪来、到哪去（toast 同边进出，面板从触发点长出） |
| 状态指示 | 让状态变化可读（按钮形变、手风琴展开） |
| 避免突兀 | 内容出现、消失或瞬移时补上过渡 |
| 解释 | 演示功能如何工作，仅限营销与引导页 |
| 愉悦 | 仅限极少触发或首次体验 |

## 2. 时长与缓动

越高频越接近无感；承载空间关系的过渡给眼睛留出跟随时间。退场不长于进场。

| 场景 | 时长 | 缓动与约束 |
| :--- | :--- | :--- |
| 按压与即时确认 | 100–160ms | `ease-out` |
| Tooltip / 小型 Popover | 125–200ms | `ease-out` 或 `cubic-bezier(0.23, 1, 0.32, 1)`；在相邻触发点间移动时即时切换 |
| Dropdown / Select | 150–250ms | `ease-out` |
| Dialog / Sheet | 200–500ms，取偏短 | 抽屉 `cubic-bezier(0.32, 0.72, 0, 1)`；动画中可随时关闭 |
| 原地形态切换 | 200–300ms | `ease-in-out` |
| 内容空间过渡（缩略图展开为全屏） | 250–400ms | `ease-out`；从来源位置展开并回到来源位置；不用于高频操作 |

进场 `ease-out`，原地切换 `ease-in-out`；`ease-in` 起步慢、显得迟钝，不用于 UI。

## 3. 形态

- 缩放入场从 `scale(0.95)` + `opacity: 0` 起步，不从 `scale(0)`。
- 按压用 `active:scale-95` 配 150ms `ease-out`，只作用于指针按压。
- Popover 与下拉从触发控件方向展开；居中 Dialog 以视口中心为锚点。
- Spring 不做弹跳晃荡；`duration + bounce` 与 `stiffness + damping + mass` 二选一。
- 布局变化用 `layout` / `layoutId`，不逐帧更新 React 状态。

## 4. 性能与可访问性

- 只过渡 `transform`、`opacity` 与颜色类属性（`color`、`background-color`、`border-color`），显式声明（如 `transition-[transform,opacity]`），不用 `transition-all`。折叠展开的高度用组件库的 keyframes（Radix `--radix-*-content-height`）。
- 可打断：连续操作从当前状态衔接最新目标；业务逻辑不等动画结束。
- `prefers-reduced-motion` 下移除位移与缩放，只留轻微透明度或颜色过渡。
- 悬停动效只在 `(hover: hover) and (pointer: fine)` 下生效。
