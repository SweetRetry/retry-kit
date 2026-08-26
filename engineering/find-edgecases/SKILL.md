---
name: find-edgecases
description: 审查指定代码、diff、系统设计或 runtime path 在非常规但可达条件下的系统失效。仅供用户显式调用。
disable-model-invocation: true
---

# Find Edgecases

发现系统在非常规但可达的条件下，何时进入未定义、矛盾、不可恢复或违反 invariant 的状态。

以**执行图**为主干：同时追踪 control flow、state、data、side effect、failure、recovery 与 lifecycle；在真实节点施加扰动，追到稳定状态，再用反证排除猜测。缺少特殊触发条件的普通 bug、只影响用户任务推进的交互缺口，以及没有具体执行点的风险词，不属于 edge case finding。

默认只读。用户明确要求建议或修改时，先冻结经反证成立的 findings，再据此给出建议或限定实现范围。

## 1. 建立执行图

从用户指定范围出发，检查真实实现、调用者与被调用者、测试、schema、配置、migration 和运行证据。用户只说 `changes` 时，从当前变更沿因果路径向外追踪，直到稳定 contract、明确隔离边界或无因果关系的位置。

先明确入口、出口、actor、核心 invariant、state authority、合法转换、持久化点、外部依赖、不可逆 side effect，以及 transaction、process、network、permission、resource 与 deployment boundary。再还原 normal、failure、recovery 与 lifecycle path，包括：

- branch、callback、error mapping、cleanup、return 与 exception；
- domain state、持久化、cache、derived view 与 terminal state；
- request、response、event、job、file、record 及其 schema/version handoff；
- transaction、external call、message publish 与 resource allocation；
- retry、timeout、cancel、compensation、replay、reconciliation、人工介入、start、stop、crash、restart、deploy 与 rollback。

在每个 handoff 标出前置状态、authority、成功与失败语义、已经发生的 side effect、retry 或 recovery 的 owner，以及如何确认稳定结果。只保留真实存在的节点，不用分布式术语包装局部逻辑。

**完成标准：**每个入口都有 normal、failure 和适用的 recovery 终点；每次 state mutation 与不可逆 side effect 都能追到最终 consumer、稳定 contract 或明确证据边界。

## 2. 扰动并追踪到稳定状态

先判断下列扰动是否会作用于执行图中的具体节点、handoff 或 invariant；只施加能改变结果的最小扰动：

- **值与表示：**missing、null、empty、临界、溢出、精度、单位、编码、时区、enum、默认值、序列化与 schema/version；
- **次数、顺序与时间：**零次、重复、多次、并发、乱序、delay、timeout、expiry、clock drift 与跨窗口 replay；
- **中断与不确定结果：**mutation 中断、commit 后 response 前、publish 后 ack 前发生 cancel、crash、restart 或 retry；
- **authority 与依赖变化：**state、cache、permission、identity、tenant ownership、config 或 clock 在执行中途变化；依赖结果变为 slow、partial、unknown、unavailable 或 contract drift；
- **规模、runtime 与演进：**容量、速率、batch、memory、disk、connection、queue、backpressure、startup、shutdown、rolling deploy、migration、旧 client/worker/message/data 与 rollback；
- **恢复再失效：**retry、cleanup、compensation、reconciliation 或人工操作失败、重复，或与正常执行并发。

在关键 handoff、lifecycle boundary 与不可逆 side effect 处，再组合两个会共同改变结果的条件，重点检查 partial success、unknown result、stale authority 与 re-entry；不枚举没有因果联系的笛卡尔积。

从扰动点继续追踪实际 branch、资源释放、已发生的 side effect、authority 当前表达、retry 如何重入、下游读取结果，以及 recovery 后能否收敛到唯一稳定状态。exception、error response 或 log 不是终点。

**完成标准：**每个候选项都能指出执行图上的分叉点，并到达稳定结果、不可逆后果或会改变判断的具体证据缺口。

## 3. 建立边界链并反证

每个候选 finding 必须形成完整边界链：

**可达触发条件 → 分叉前状态 → 执行过的 branch 与 handoff → 已发生的 side effect → 被违反的 invariant 或未定义行为 → recovery 后的稳定状态 → 系统、数据、安全或业务影响 → 证据**。

逐条检查 guard、upstream constraint、downstream tolerance、database constraint、runtime config、supervisor behavior、deployment topology、测试与实际可达性，主动寻找能推翻候选项的证据。局部函数缺少保护，不能证明系统边界没有保护。

按证据标记：

- **已确认：**代码、测试、schema、配置、log、trace、数据或复现路径直接证明，关键上下游约束已核实；
- **高可信推断：**实现、调用链与状态转换足以推出后果，但尚未运行验证；
- **待确认：**已有具体风险线索，但缺少会改变结论的 runtime、data、topology 或 contract 事实。

**完成标准：**每个保留项都有完整且经反证的边界链；信息不足时，缺口具体到哪项事实会改变哪条判断。

## 4. 覆盖收口与输出

结束前确认：

- 每个适用扰动面都有成立、不成立或不适用的结论，并映射到执行图；
- 每个核心 invariant 都经历了相关的值、逻辑、状态、时间、资源或版本扰动；
- 每个 state transition 都检查了中断、重复、并发与 recovery 后 re-entry；
- 每个 transaction、process、network handoff 与不可逆 side effect 都检查了 partial success 和 unknown result；
- 相关的 startup、shutdown、crash、restart 与 in-flight work 已闭合；
- 同一根因与最终后果只保留一次，证据等级与措辞一致。

按 correctness、安全、可用性、数据或不可逆业务影响从高到低输出。每个 finding 用一小段说明位置、触发条件、执行分叉、已发生的 side effect、被破坏的 invariant、recovery 后的最终状态、影响、证据、可信度与待确认事实。按根因和最终后果合并，不套固定表格或通用 checklist。

只要求分析时不提出修复；明确要求建议时，在全部 findings 后给出与根因对应的方向。没有成立项时，说明“未发现有证据支持的系统 edge case”，并列出审查范围与会改变结论的未知项。
