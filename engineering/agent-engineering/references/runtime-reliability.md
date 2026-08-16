# Agent Runtime Reliability

让 agent loop 在真实状态、副作用、权限、并发和中断下保持一致。Runtime 负责模型不能可靠强制的执行语义；业务服务和 Environment 继续拥有业务真相与数据一致性。

## 导航

- [状态权威](#状态权威)
- [运行状态](#运行状态)
- [副作用与未知结果](#副作用与未知结果)
- [并发、取消与恢复](#并发取消与恢复)
- [权限、Approval 与安全](#权限approval-与安全)
- [可观测运行边界](#可观测运行边界)

## 状态权威

按字段类型而非一条全局优先级链比较 conversation、memory、tool result 和数据库，再由对应 owner 裁决：

| 状态类型 | Owner | 边界 |
| --- | --- | --- |
| 当前目标、交付范围与偏好 | 用户最新明确指令 | 不能覆盖身份、权限或业务事实 |
| 身份、tenant 与权限 | authentication / authorization service | Prompt 与客户端声明不是授权 |
| 业务对象当前状态 | 对应业务 source of truth | Conversation 和 memory 只能引用 |
| 当前阶段、attempt、job 与 handle | workflow runtime / durable run state | 需要稳定 ID 和状态转换 |
| 跨会话偏好与稳定记录 | memory store | 携带 provenance、freshness、scope 和删除路径 |

Working state 保存当前目标、进度、已验证事实、关键 ID、失败、未决项与下一动作。用新事实替换旧值，并区分业务事实、tool observation 和模型推断。

## 运行状态

根据业务定义可区分的终态和过渡态，不依靠模型自行判断：

| 状态 | 含义 | 下一动作 |
| --- | --- | --- |
| `completed` | 可观察成功标准已经验证 | 交付结果 |
| `needs_input` | 缺少会实质改变结果的信息 | 请求用户输入 |
| `waiting` | 外部任务仍在进行 | 保留 job ID，等待或轮询 |
| `retryable` | 条件允许安全重试 | 在预算内重试 |
| `indeterminate` | 外部效果未知 | 查询状态，不重放副作用 |
| `denied` | 权限或审批不允许 | 停止或请求有效授权 |
| `failed` | 当前路径无法继续 | 返回原因与已完成范围 |

`max turns`、timeout 和 retry budget 是 damage bound，不是完成条件。同一输入和外部状态未变化时，不重复确定性失败；限流、瞬时故障或明确变化的前置条件可以支持受控重试。

## 副作用与未知结果

非幂等动作发出后，timeout、连接中断或 5xx 只说明调用方没有得到确定响应。组合与失败模式匹配的机制：

- 用 command / operation ID 关联同一业务意图和查询路径。
- 用 idempotency key 对同一意图的重复请求去重。
- 用 version precondition 或 compare-and-set 防止陈旧写入。
- 用 attempt fencing 阻止旧 attempt 在新 attempt 之后提交终态。
- 用 status / result handle 查询未知结果。
- 用原子状态转换或事务避免记录与真实写入部分提交。

幂等不等于 exactly-once，也不自动解决并发覆盖、乱序完成或跨系统原子性。只有已知未执行或重复调用安全时，才自动重试写操作。

## 并发、取消与恢复

为每类动作明确：

- 哪些可以并行，哪些竞争同一资源；
- 结果按完成顺序还是业务顺序合并；
- partial failure 是回滚、保留成功项还是独立重试；
- deadline、backpressure 和取消如何传播；
- 取消后的运行中动作能否停止；
- 已取消或已被替代的晚到结果能否提交。

用户停止等待不等于外部动作已经取消。共享写入使用事务、锁、版本条件或 attempt fencing。长任务持久化目标、成功条件、权限、阶段、稳定 ID、不可重复副作用、失败与下一动作，并用 continuation test 验证恢复。

## 权限、Approval 与安全

在 Runtime 或业务服务强制 authentication、authorization、tenant isolation、输入验证、rate limit、cost、并发、secrets、审计和写入一致性。Prompt、tool annotations 和分隔符只能提供模型提示。

Approval 不是布尔值。至少绑定：

- approver 的 user / tenant / role；
- 被批准的 tool、参数、目标、金额或影响范围；
- 有效期与资源版本；
- 执行前的身份、权限、payload 和当前状态复核；
- 撤销语义；
- human takeover 后 agent 还能读写或重新申请什么。

批准不能扩展原任务授权。对来自网页、文件、retrieval、memory 和 tool result 的不可信内容，限制其能访问的 tools、数据和外部副作用；对 filesystem、network、credentials 和成本设置 blast radius。

## 可观测运行边界

Runtime 在 run 开始/结束、model、context、tool、状态转换、approval、retry、handoff 和业务验证边界发出结构化 telemetry。事件关联 `run_id`、父子 span、`attempt_id`，有副作用时同时关联 `operation_id` / `idempotency_key`；但 telemetry 不是状态权威，采集失败不能改变业务提交、重试或恢复语义。

运行时必须记录实际状态转换、错误类别和验证结果，而不是只转发模型自述或 tool success。Trace、metrics、logs、sampling、数据治理和 client projection 的 contract 见 [observability.md](observability.md)。

用正常、冲突、超时、重复请求、取消、晚到结果、审批过期、中断恢复和未知外部效果场景验证。Tool 返回 success 只证明调用完成；写操作应回读 source of truth 或验证真实下游可见性。
