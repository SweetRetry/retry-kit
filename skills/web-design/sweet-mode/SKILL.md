---
name: sweet-mode
description: Tailwind + shadcn/ui 界面规范：层级、布局、表面、字体、尺寸稳定、交互反馈与动效的取值、禁令与验收，附禁令扫描与渲染检查脚本。编写或修改界面时作为硬约束落地。仅供用户显式调用。
disable-model-invocation: true
---

# Sweet Mode

`reference/` 中的类名、Token、阈值与禁令是硬约束；未覆盖的取值沿用项目同类界面的做法。

让布局解释界面：想加说明、副标题或辅助标签时，先改分组、顺序、控件或命名，结构表达不了的信息才写成文字。

## 1. 对齐项目锚点

reference 中的 `globals.css`、`packages/ui` 指目标项目里的对应位置。先找到：

- 样式入口：定义颜色、圆角、字号与字体族 Token 的文件。阶梯以它为准，reference 表格里的 px 值只是缺省；缺少语义 Token 时在这里补，业务代码只消费语义名。
- 组件库（`packages/ui` 或 `components/ui`）：圆角、表面、按压反馈等外观改在变体里，调用点只负责布局。改动用到的组件先对照下表，未达标的在变体里改，再写调用点：

| 组件 | 基线 |
| --- | --- |
| Button | `motion-safe:active:scale-95`，`duration-150 ease-out`，过渡只列颜色与 `transform` |
| Card | 无阴影；`card` 与 `background` 有明度差时无边框，同色时用低对比边框 |
| Skeleton | `bg-muted` |
| Sheet | 缓动 `cubic-bezier(0.32, 0.72, 0, 1)`，时长取 200–500ms 中偏短 |
| Popover / DropdownMenu / Tooltip | 从触发控件方向展开（`origin-(--radix-*-content-transform-origin)`） |

## 2. 读取规则

开工前读完 `reference/` 全部 7 个文件：规则跨文件交叉，一个带删除弹窗的表格同时受层级、字形、稳定与交互约束。新建页面或重组信息时先按 `hierarchy.md` 定主次与披露层次，再选组件和样式。

只改当前任务触及的范围，范围外的违规列入交付。

## 3. 验收

reference 的每个小节都是完成标准，逐节给出通过、修复或不适用。

1. 静态扫描，修复到改动文件不再出现在输出中：

   ```bash
   node <skill 目录>/scripts/ui-guardrails.js <目标项目路径>
   ```

   脚本覆盖组件库，只在阴影、Separator 与 Card 嵌套上豁免它；跳过第三方、测试与 skill 目录。任意圆角与间距、内联 style 与 CSS 中的色值人工核对。
2. 渲染检查。启动开发服务器，打开改动页面，在 375×812 与 1280×800 两个视口各做一遍：
   - 用浏览器工具的 evaluate 执行 `scripts/render-audit.js`（整个文件是一个无参函数），修复到 `violations` 为空。
   - 截整页图并查看，按 `hierarchy.md` §4 逐项判断。
   - 触发加载、空值、报错三态与收起、展开两态，用键盘走完主流程，开启减少动态效果再看一遍。

   启动受阻时先排除可修复的原因：依赖、端口、环境变量；缺后端或登录时用临时 mock 渲染改动页面，交付前移除。仍无法运行时，渲染检查记为未通过，交付失败的命令与报错。

交付改动位置、各小节结论、两个视口的 audit 输出与截图路径、范围外的违规。
