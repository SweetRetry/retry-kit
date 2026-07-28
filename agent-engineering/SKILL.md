---
name: agent-engineering
description: >
  设计、审查和改进 AI Agent，涵盖 System Prompt、context engineering、
  retrieval / memory / compaction、MCP 或 function tools、agent loop、orchestration、
  guardrails 与 eval。Use when 构建 agent、诊断 instruction 或 context 问题、
  设计 tool contract、控制 token / latency，或评估 single-agent / multi-agent 架构。
---

# Agent Engineering

围绕任务结果设计 agent。将 Instructions、Context、Tools、Runtime 和 Evals 视为协作边界，不用其中一层补偿另一层的缺陷。同一规则只放在能执行或验证它的最小责任层；仅在 eval 证明持续遗漏时增加跨层提醒。

## 读取 references

- 处理 Instructions 或 System Prompt 时，读取 [system-prompt-engineering.md](references/system-prompt-engineering.md)。
- 处理 retrieval、history、memory、compaction、handoff 或 prompt caching 时，读取 [context-engineering.md](references/context-engineering.md)。
- 处理 MCP、function calling 或 tool schema 时，读取 [tool-design.md](references/tool-design.md)。
- 设计完整 agent 时读取三份；局部任务只读取相关 reference。

## 建立任务契约

先明确会影响设计的约束：

- 用户需要的结果与可观察成功标准
- 输入、状态、外部依赖和副作用
- 可读、可写、需审批和禁止触碰的边界
- 完成、澄清、等待、失败和停止条件
- 质量、延迟、成本与风险预算

信息不足时，只澄清会改变方案的部分。

## 选择执行形态

| 形态 | 适用信号 |
| --- | --- |
| 确定性代码 | 规则与输出可可靠编码 |
| Workflow | 路径已知，模型只处理局部判断 |
| Agent loop | 下一步依赖中间结果，需要动态选路或选工具 |
| Multi-agent | 独立 context、权限隔离、并行探索或专业分工能覆盖协调成本 |

选择满足任务的最小形态。根据任务结构决定是否拆 agent，不预设固定数量。

并行执行相互独立的调用或工作轨道，依赖前序结果的步骤保持串行。仅在独立 context、并行收益或权限隔离足以覆盖协调、重复探索和汇报成本时使用 multi-agent；委派后不要在主 agent 重做同一工作。

## 划分责任

| 层 | 主要责任 |
| --- | --- |
| Instructions | 稳定行为、领域规则、工具使用原则、输出契约 |
| Context | 当前决策需要的事实、证据、历史与工作状态 |
| Tools | 获取信息或执行动作的模型可见 contract |
| Runtime | loop、状态、权限、审批、重试、预算与持久化 |
| Evals | 判断结果与执行路径是否可靠，并定位最早偏离 |

将鉴权、数据一致性和不可逆副作用留给 runtime 强制；将易变事实留给动态 context 或 tools。

## 设计运行循环

可使用 `observe → decide → act → verify → update → stop` 作为检查框架，并根据任务调整：

- 在 action 后验证业务效果，而非只检查 tool call 是否返回。
- 在授权范围内完成用户预期的完整 scope；先推进不受影响的部分，仅在不同假设会导致实质不同、危险或无效的结果时澄清。
- 更新 working state 和 model-visible context，移除已失效信息。
- 为可重试、需审批、需用户输入和终止失败提供可区分状态。
- 长任务保留稳定 ID、关键状态和恢复入口。
- 按风险设置 turn、时间、成本、并发与重试边界。

## 用 trace 定位问题

保存足以重建关键决策的 trace，并从最早偏离处修改：

| 症状 | 优先检查 |
| --- | --- |
| 调用工具前已理解错任务 | 任务契约、Instructions、输入边界 |
| 选错工具或参数不稳定 | tool surface、description、schema |
| 缺证据、使用旧事实 | retrieval、memory、freshness、context update |
| 正确结果未被使用 | result 结构、排序、context 预算 |
| 重复调用或无法停止 | loop state、success / retry / stop condition |
| 长任务逐渐偏航 | working state、compaction、handoff、durable memory |
| 越权或产生危险副作用 | runtime 权限、审批、幂等与服务端校验 |

用真实任务覆盖正常、缺失、冲突、边界、对抗、多轮和恢复场景。结合任务成功、错误成功声明、tool 使用、context 命中、token、latency、cost 与安全指标评估改动。

## 输出

只交付用户请求的层及其必要接口。先说明结果，再说明必要的架构、取舍与验证；明确区分已完成、失败、跳过和未验证项。具体格式随任务和消费方调整。

## 资料新鲜度

资料核验日期：**2026-07-20**。实现 provider-specific model、cache、compaction、tool schema 或安全能力前，重新查看对应 reference 中的官方 living docs。
