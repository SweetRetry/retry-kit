---
name: ui-prototyping
description: 用临时可交互 HTML 比较尚未确定的 UI 方案；选择取决于操作、密度、状态或 motion 时使用，定案实现或静态审查不触发。
---

# UI prototyping

## 先定义要决定什么

开始写 HTML 前，用一句话说清用户正在完成什么任务，以及这次要在哪些做法之间选择。

如果有现有产品或代码，先查真实内容、viewport、design token、现有组件和不能改的约束。这些信息能从环境中找到时，直接查，不再问用户。没有证据的产品规则作为假设，在交付时说明。

通常做 2 到 4 个候选。每个候选应该代表一种真正不同的交互模型。只换颜色、圆角或间距的近亲方案只保留一个。

## 让比较公平

所有候选使用同一个任务、内容、数据、viewport 和起始状态。比较单一决策时，其他条件保持一致。如果比较的是整体方向，可以一起改变相互依赖的布局、层级和交互。

把会影响决定的行为做出来。用户应该能点击、输入、取消、返回和重试。只有当 loading、empty、error 或 success 会改变取舍时，才需要做这些状态。

## 在临时目录中构建

用 `mktemp -d` 创建一个仓库外的目录，再把 [assets/template.html](assets/template.html) 复制为 `index.html`。用户明确要求保留时，再写入指定位置。

原型是一个可直接打开的 HTML，不需要 build step。使用 Tailwind CSS browser CDN。只在动画的时序、进入方式或中断行为会影响选择时启用 Motion，并遵守 `prefers-reduced-motion`。

数据和 side effect 都在本地模拟。不连接真实账号、密钥或可写服务。只有文件直接打开无法工作时，才提供本地 static server 命令。

## 使用模板

页面左边是固定 sidebar，右边是 component sections。sidebar 只列出组件名，每一项直接锚定对应的 `[data-prototype-component]` 节点。在生成的 prototype 中，用具体的组件名替换模板里的 `A`、`B` 和 `C`。

右侧只放候选组件和它完成交互所需的 UI content。不在画布中放方案介绍、hypothesis、trade-off、操作教程或评价文案。这些信息在交付消息中说明。

组件必需的 label、help text 与 error message 属于被测 UI，保留。模拟数据须保持待判断行为。

## 如何交付

默认返回：

- `index.html` 的可点击绝对路径；
- 需要在每个组件中完成的同一任务；
- 候选的核心差异和一个待回答的决策问题。

截图可以辅助定位，但不代替交互体验。用户反馈后，在同一临时文件中调整仍未决定的部分。用户确认方向后结束比较阶段；若原请求包含正式实现，继续完成实现和验证，否则交付原型后结束。

完成标准：每个 sidebar 入口都到达一个可完成同一核心任务的候选；原型可直接打开或附带必要的 static server 命令，且没有写入仓库或产生真实外部 side effect。
