---
name: system-edge-cases
description: >-
  系统 edge-case 审查：针对一个已指定的代码、diff、系统设计或 runtime path，验证局部逻辑、状态、数据、协议、依赖、并发、资源与 lifecycle 在非常规但可达条件下是否保持正确。仅在用户明确要求系统或工程 edge cases、边界条件、failure / recovery path 或 runtime 异常路径审查时使用；普通 bug 诊断、架构设计、功能实现或修复、UX 任务链断点不触发。
disable-model-invocation: true
---

# 系统执行链边界分析

发现系统在非常规但可到达的条件下，何时进入未定义、彼此矛盾、不可恢复或违反 invariant 的状态。

先建立**执行图**，把 control flow、state、data、side effect 与 recovery 作为同等重要的节点和边；再逐层扰动并追踪到稳定状态，最后用反证排除猜测。数据谱系与协议 contract 是系统边界面之一，不是所有分析必须经过的主干。

本 skill 的交付止于只读的系统边界发现。用户可观察影响用于说明系统后果，不在此判断入口、文案或交互任务是否完整。用户同时要求修改时，先完成边界分析，再把实现作为后续任务。

## 1. 锁定范围、invariant 与证据

从用户指定的代码、方案、流程、API、运行问题或 diff 开始，检查真实实现、调用者与被调用者、测试、schema、配置、migration 和运行证据。明确：

- 入口、出口、actor、process、worker 与直接或间接 consumer；
- 必须始终成立的 domain、正确性、安全、隔离、可用性或业务 invariant；
- state authority、合法转换、持久化点、外部依赖与不可逆 side effect；
- transaction、process、network、permission、resource 与 deployment boundary；
- 当前范围新引入、触发或放大的边界，以及无因果关系的区域。

用户只说 `changes` 时，以当前变更为起点，沿 control flow、state、data 与 side effect 的传播路径向外追踪，直到遇到稳定 contract、明确隔离边界或无因果关系的区域。

完成本步时，入口、出口、核心 invariant、authority、依赖、副作用、边界与证据范围都应明确；不存在跨服务或数据传播时，分析仍可由局部 control flow 或 runtime lifecycle 成立。

## 2. 建立执行图

还原 normal、failure、recovery 与 lifecycle path。把以下内容放进同一张执行图：

- function、branch、callback、error mapping、cleanup 与 return/exception path；
- domain state、合法转换、terminal state、持久化、cache 与 derived view；
- request、response、event、job、file、record 及其 schema/version handoff；
- transaction、external call、message publish、resource allocation 等 side effect；
- retry、timeout、cancel、compensation、replay、reconciliation 与人工介入；
- process start/stop/crash/restart、scheduled work、deployment 与 rollback。

在每个 handoff 标出输入和输出、前置状态、authority、成功/失败语义、side effect 是否已发生、谁负责 retry 或 recovery，以及下一步如何确认稳定结果。只画真实存在的节点，不用分布式术语包装局部函数。

完成本步时，每个入口都有 normal、failure 和适用的 recovery 终点；每个 state mutation 与不可逆副作用都能追到最终 consumer、稳定 contract 或明确证据边界。

## 3. 检查系统边界面

对执行图实际涉及的边界面逐一判断适用性：

- **值与表示**：missing、null、empty、极值、精度、单位、编码、时区、enum、默认值和序列化；
- **局部 control flow**：分支组合、early return、异常语义、cleanup、重复进入、callback 顺序和错误吞没；
- **domain state 与 lifecycle**：非法转换、partial state、terminal re-entry、删除、归档、恢复和历史脏状态；
- **持久化与派生状态**：约束、transaction、部分写入、read-after-write、cache、index、replica 与 backfill；
- **协议与依赖**：调用方和提供方假设、schema/version、错误映射、pagination、batch、幂等与第三方 contract drift；
- **并发与时间**：race、lost update、duplicate、乱序、delay、timeout、clock、expiry、lock 与调度交错；
- **异步与分布式**：commit/ack gap、delivery semantics、结果不确定、retry amplification、dead letter、compensation 和 reconciliation；
- **身份与隔离**：authentication expiry、permission mid-flight change、resource ownership、tenant boundary、delegation 与 replay identity；
- **资源与 runtime**：limit、backpressure、memory/disk/socket/thread exhaustion、startup、shutdown、crash、restart 与 in-flight work；
- **部署与演进**：rolling deploy、旧 client/worker/message/data、schema/config/flag drift、migration、rollback 与 mixed-version semantics；
- **业务与人工恢复**：quota、计费、结算、退款、审批、人工 replay、对账和不可逆业务后果。

完成本步时，每个适用边界面都应映射到执行图上的具体节点、handoff 或 invariant；没有实际触发条件的通用风险词不进入候选项。

## 4. 施加扰动并追踪传播

在准确的执行点施加能改变结果的最小扰动：

- 值从正常范围跨到 missing、临界、溢出或表示不一致；
- 一次 call/request/event 变成零次、重复、多次、并发、乱序或跨窗口 replay；
- 操作在开始前、mutation 中、commit 后 response 前、publish 后 ack 前被 cancel、timeout、crash 或 retry；
- state、cache、permission、config、dependency 或 clock 在一次执行中途变化；
- 依赖从明确结果变成 slow、partial、unknown、unavailable 或 contract drift；
- 正常规模扩大到容量、速率、batch、memory、disk、connection 或 queue boundary；
- process restart、rolling deploy、migration、旧版本、旧数据与 rollback 状态共同运行；
- recovery、cleanup、compensation 或人工操作自身再次失败或被重复执行。

从扰动点继续追踪：哪些 branch 执行，哪些资源释放，哪些副作用已经发生，state authority 现在表达什么，retry 会如何重入，下游读到什么，最终能否回到唯一稳定状态。首次 exception、error response 或 log 不是终点。

完成本步时，每个候选项都应指出从执行图哪里分叉，并到达稳定结果、不可逆后果或具体证据缺口。

## 5. 深挖跨边界组合

系统级 edge case 常由两个单独可处理的条件组合产生。对每个 handoff、lifecycle boundary 与不可逆副作用检查：

- 上游认为成功，下游失败、timeout、拒绝或只完成一部分；
- side effect 已发生但 state/response 未确认，调用方随后 retry、cancel 或切换 identity；
- concurrency 或 resource pressure 发生在 shutdown、migration、permission change 或 recovery 期间；
- cache、derived state 或旧版本落后时发生第二次 mutation；
- recovery、compensation、cleanup 或人工 replay 自身失败、重复或与正常执行并发；
- 两个 actor、tenant、worker、process 或版本同时操作同一逻辑实体；
- 每个局部保护各自成立，组合后仍留下顺序缺口、状态缝隙或无人负责的终态。

沿正向执行追到稳定状态或不可逆后果，再反向检查 retry、restart 与 recovery 是否会再次触发同一链条。

完成本步时，每个关键 boundary 都检查了 partial success、unknown result 与 re-entry；每个候选项同时覆盖初次失效和后续恢复。

## 6. 建立边界链并反证

每个系统边界必须形成：

**可到达触发条件 → 分叉前状态 → 执行过的 branch 与 handoff → 已发生的 side effect → 被违反的 invariant 或未定义行为 → recovery 后的稳定状态 → 系统、数据、安全或业务影响 → 证据**。

按证据定级：

- **已确认**：代码、测试、schema、配置、log、trace、数据或复现路径直接证明边界，关键上下游约束已核实；
- **高可信推断**：实现、调用链和状态转换足以推出后果，但尚未运行验证；
- **待确认**：现有证据指向具体风险，但缺少会改变结论的 runtime、data、topology 或 contract 事实。

逐条检查 guard、upstream constraint、downstream tolerance、database constraint、runtime config、supervisor behavior、deployment topology、测试和实际可达性，尝试推翻候选项。单个函数没有保护，不足以证明 system boundary 没有保护；缺少特殊触发条件的普通 happy-path bug 不包装成 edge case。

完成本步时，每个保留项都有完整边界链或由现有证据指向的明确缺口，且已经受过反证。

## 7. 覆盖收口

结束前确认：

- 每个适用边界面都已检查，没有把系统分析缩成 data flow 或 API checklist；
- 每个核心 invariant 都经历了相关的值、逻辑、状态、时间、资源或版本扰动；
- 每个 state transition 都检查了中断、重复、并发和 recovery 后 re-entry；
- 每个 process/transaction/network handoff 与不可逆 side effect 都检查了 partial success 和 unknown result；
- startup、shutdown、crash、restart 与 in-flight work 已在相关执行图中闭合；
- permission、resource pressure、deployment 和人工操作在会改变结果的位置参与了组合；
- 同一根因与最终后果只保留一次，可信度与证据一致。

完成本步时，所有适用边界面均有结论，所有输出项均经反证，所有信息缺口都具体到可能改变哪条判断。

## 输出

使用自然语言，从 correctness、安全、可用性、数据或不可逆业务影响最大的发现讲起。每个发现用一小段说明触发条件、执行如何分叉、哪些副作用已发生、哪个 invariant 被打破、recovery 后的最终状态、影响、证据与可信度。

用户只要求分析时，每段以现状、影响、证据和待确认事实收口；只有用户显式要求建议时，才在所有发现之后另列方向性建议。按根因和最终后果合并，不套固定表格或通用 checklist。范围内没有成立的边界时，说明“未发现有证据支持的系统边界情况”，并确保结论来自完整执行图复核。
