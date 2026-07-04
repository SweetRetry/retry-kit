# Analytics Tracking Reference

只补充价值判断的例子和反模式，不涉及实现。

## 价值推导示例

用"业务问题 → 决策动作 → 需要什么数据"倒推，而不是"有什么行为 → 埋一下"。

| 业务问题 | 决策动作 | 值得埋的事件 |
| --- | --- | --- |
| 新用户是否完成首次核心动作？ | 完成率低于阈值就重做 onboarding | 首次 `Project Created` / `First Export Completed`，带 `time_to_value` |
| 付费漏斗在哪一步流失？ | 流失最高的一步优先改造 | `Checkout Started` / `Payment Submitted` / `Payment Failed` / `Purchase Completed`，全链路必须齐 |
| 哪种来源用户留存最好？ | 加大高留存来源的投放 | 任一核心事件带 `source` / `utm_*`；不需要单独 `Source Attributed` 事件 |
| 搜索是不是没结果？ | 结果为 0 的高频 query 补内容或改算法 | `Search Performed` 带 `result_count`；不需要 `Empty State Shown` |
| 实验有没有真的影响转化？ | variant 之间差异显著则全量 | `Experiment Viewed` + 已有的转化事件；不需要为实验单独埋一套 |

反过来看：如果一个候选事件填不进"决策动作"这一列，就是噪声。

## 无价值事件的典型形态

| 事件名 | 为什么无价值 | 处理 |
| --- | --- | --- |
| `Blue Button Clicked` | UI 描述，业务含义为零，改版即废 | 删除，或合并进对应业务事件 |
| `Modal Closed` / `Tooltip Hovered` / `Section Scrolled` | 无对应决策动作 | 删除 |
| `Project Created From Header` | UI 位置进入事件名，聚合困难 | 合并为 `Project Created`，位置放 `source` property |
| `Clicked Plan Pro` | 动态值进入事件名，plan 变多就爆炸 | 合并为 `Plan Selected`，plan 放 property |
| `User Active` | 可由任意核心事件按天去重推导 | 删除，改为在 BI 侧聚合 |
| `Maybe Useful Event` | 没有业务问题、没有读者、没有 owner | 默认不埋 |
| `Payment Succeeded`（仅前端） | 关键事实但来源不可信 | 关键状态改由服务端事件为准，前端事件降级或删除 |

## 常见反模式

1. **全点击埋点**：把所有 click 都上报。数据量大、无法聚合、没人解释得清，最后整体作废。
2. **事件名动态化**：`Clicked Plan Free/Pro/Team` 各是一个事件。漏斗写不了、看板要不断维护。
3. **properties 当日志**：塞完整 URL、完整错误堆栈、用户输入原文。既不能聚合、又增加隐私和成本风险。
4. **只埋成功不埋失败**：转化率下降时无法定位是"没人来"还是"来了走不通"。
5. **关键状态只埋前端**：支付、订阅、发布被刷新/重试/拦截影响，数值和财务/后端对不上，等于没埋。
6. **"先埋着以后可能有用"**：没有业务问题、没有 owner、没有读者的事件，实践中几乎不会被回头分析，只增加维护成本。
7. **同名事件不同语义**：不同时期同一个事件名含义变了但没做版本切分，历史数据被污染，趋势图失真。
8. **看数据但没有动作**：只有仪表盘、没有决策规则。数据只是"心理安慰"，不改变任何行为。
