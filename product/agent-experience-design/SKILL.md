---
name: agent-experience-design
description: >-
  Agent 产品体验设计：围绕用户如何委托、理解、控制并消费 Agent，设计 Artifact / business outcome、Thread、
  activity / status、approval、interrupt / recovery 与 progressive disclosure。Use when 用户要求设计或优化 agent client、
  copilot UI、agent workspace、任务状态与进度、结果资产、tool 展示或 human-in-the-loop 体验；不用于 Agent 的
  prompt、tool、runtime、observability 或 eval 工程，不用于纯视觉风格，也不判断功能是否值得存在。
---

# Agent Experience Design

把 Agent 能力收敛为用户可理解、可控制、可恢复、可持续消费的产品体验。默认交付产品对象、任务状态与 interaction contract，不写实现代码，不决定视觉风格。

## 建立体验任务契约

先明确会改变设计的约束：

- 目标用户、使用场景、期望 outcome 与成功标准；
- 任务的频率、时长、不确定性、风险与可逆性；
- 用户从哪里开始，何时离开或返回，需要做哪些判断；
- 当前产品能可靠提供的状态、动作、结果与恢复能力；
- 适用的 client surface、权限和信息敏感度。

信息不足时，只澄清会改变对象模型、状态流、用户控制或信息层级的部分。先设计一条从委托到消费或恢复都可完成的主路径，再覆盖高风险与高频分支。

## 建模用户任务

围绕 `delegate → observe → control → consume → continue / recover` 检查完整体验。根据任务取舍步骤，不强制用户查看计划、内部推理或每次 tool call。

| 对象 | 用户价值 | 所需产品语义 |
| --- | --- | --- |
| Artifact | 持续预览、编辑、导出或复用交付物 | 稳定身份、版本、状态和操作 |
| Business outcome | 确认外部动作真实发生 | 目标、实际影响与验证结果 |
| Thread | 表达意图、澄清、决定与继续协作 | 对话连续性和结果叙述 |
| Run / status | 理解当前阶段、等待原因和下一步 | 少量稳定状态及更新时间 |
| Activity | 获得执行中的确定性 | 合并后的有意义进度与动作 |
| Tool detail | 排错、审计或专业下钻 | 受治理的 input、output 与时序 |
| Approval | 在副作用发生前判断并授权 | 准确的 action、目标、影响和有效期 |

区分这些对象，不用 Thread 充当执行日志，不用 tool result 充当 Artifact，不用 activity 或模型自述充当业务状态。

## 定义结果消费

先确定 primary Artifact 或 business outcome，再定义 supporting artifacts。并非每个回答都需要 Artifact；只有结果需要跨消息持续消费、版本化或操作时才创建。

对 Artifact 按需定义：

- 稳定 ID、类型、owner / tenant、版本与创建或更新关系；
- 内容或受控 handle、状态、来源、freshness 与验证结果；
- preview、edit、compare、export、share 或 reuse 操作；
- partial、stale、conflict、failed 与 superseded 的语义；
- 与产生或修改它的 Run、Thread 和外部业务对象的关联。

一次 Run 可以更新既有 Artifact，也可以产生多个 Artifact；按用户任务确定主次，不按 tool call 数量拆分。完成状态必须指向已验证的 Artifact 或 business outcome。

## 组织注意力层级

按用户消费价值组织默认界面：

1. **Artifact / business outcome**：第一视觉焦点，优先支持预览、继续编辑、导出和复用。
2. **Thread 与 high-level status**：第二视觉焦点，承载意图、决定、进度、控制与恢复入口。
3. **Tool input / output**：第三层，默认收纳，仅用于排错、审计或专业下钻。

当任务尚未产生结果时，以 Thread 和 status 承载等待与控制；结果可消费后，将焦点转移到 Artifact 或 outcome，并保留 Thread 中的决定与来源关系。用稳定阶段解释进度，不让高频 activity、逐 token 文本或内部阶段抢占用户注意力。

## Progressive Disclosure

默认展示用户影响，合并搜索、读取、批处理等低风险 activity。仅在以下条件提升 tool detail：

- **异常排查**：先展示错误影响和恢复动作，再允许展开经过 redaction 的原始输出。
- **执行前 approval**：主动展示权威来源提供的 action、目标、关键参数、影响范围、可逆性与有效期，并提供批准、拒绝或修改入口。
- **主动下钻**：允许专业用户查看调用与原始结果；敏感数据仍按权限和最小披露控制。

区分“将要执行”与“已经发生”。Approval 呈现待执行 contract；activity 呈现实际状态变化；执行后呈现真实 outcome 与验证结果。

## 设计状态与控制

根据产品实际支持能力，投影少量稳定、可区分的 client state，例如 queued、working、waiting for user、waiting for approval、recoverable failure、completed 与 cancelled。为每个状态定义原因、影响、下一动作和可用控制。

- 分别定义 cancel、stop waiting、pause 与撤销外部副作用的语义。
- 失败时保留已完成范围、未完成范围、恢复入口与 Artifact 当前版本。
- 长任务保留稳定 ID、更新时间与恢复入口；activity 迟到或缺失不能改变业务状态。
- 仅在需要判断或授权时请求用户注意；后台阶段变化使用轻量状态或通知。
- 当所需状态或控制没有可靠来源时，将其列为产品依赖，不用 UI 文案猜测或补偿。

## 输出体验契约

按请求范围交付：

1. 用户、任务与 primary outcome；
2. 主路径、关键分支与状态转换；
3. Artifact、Thread、Run、activity、tool detail 和 approval 的对象边界；
4. 信息层级、progressive disclosure 与用户控制；
5. client 所需的状态、标识、action preview、验证结果和恢复接口；
6. 可检查的 acceptance criteria 与尚未满足的产品依赖。

完成标准是：用户无需查看 tool detail 即可找到主要结果、理解当前状态并采取下一步；高风险 action 在执行前可判断，失败后可恢复；每项 client 状态和结果都有可靠来源。
