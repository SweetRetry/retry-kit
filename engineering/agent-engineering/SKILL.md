---
name: agent-engineering
description: >
  AI Agent Harness 架构与系统工程：设计、审查或优化 Agent 的执行循环、沙盒抽象、
  工具契约、上下文管理、死循环熔断、子代理委托拓扑与验证门禁。仅当任务主体是 AI Agent 自身架构、行为定义或排障时触发。
---

# Agent Engineering (AI Agent Harness 架构工程指南)

大模型是非确定性的概率推断引擎，**系统可靠性的真正基石是 Harness（运行时挽具/宿主外壳）**。一切关于执行安全、步数预算、沙盒隔离、死循环熔断、上下文保活与诚信验证的硬性指标，必须 100% 由 Harness 代码层兜底，严禁依赖模型自律。

**核心第一性原理：同一规则只放在能执行或验证它的最小责任层，严禁跨层代偿**（不靠 Prompt 掩盖沙盒漏洞，不靠盲目重试弥补工具契约歧义）。

---

## 六大核心 References 索引 (Progressive Disclosure)

根据任务涉及的架构环节，查阅对应领域的真实 Case、决策原则与契约原型：

- **循环控制、沙盒抽象与状态机**：查阅句柄假死探针、工具死循环指纹熔断（Circuit Breaker）、排他性活跃统计与生命周期事件，读取 [harness-loop-and-runtime.md](references/harness-loop-and-runtime.md)。
- **工具契约与接口设计**：查阅用途与路由边界、指令化错误协议（Actionable Error）与精准块替换，读取 [tool-contracts-and-design.md](references/tool-contracts-and-design.md)。
- **上下文治理与双轨记忆**：查阅工具输出有界截断（预防优于清理）、动态消息剪枝（`pruneMessages`）、双轨记忆防剪枝失忆与 Prompt Caching 布局，读取 [context-and-memory-management.md](references/context-and-memory-management.md)。
- **提示词工程与人机协同**：查阅 Turn 0 运行态元数据注入、行动优于解释（Act Don't Explain）、既有授权、阻塞澄清与宿主提问方式，读取 [system-prompt-and-hitl.md](references/system-prompt-and-hitl.md)。
- **子代理拓扑与委托**：查阅工作流优先原则（Simplicity First）、委托收益、最小权限与结果交接，读取 [subagent-delegation-patterns.md](references/subagent-delegation-patterns.md)。
- **验证门禁与诚信交付**：查阅按风险选择验证、失败归因与任务状态，读取 [verification-and-scoped-claims.md](references/verification-and-scoped-claims.md)。

---

## 任务范围与完成条件

按问题选择相关架构层，不要求设计、审查和排障都走完整流水线。以下原则用于判断被研究的 Agent 系统，不自动成为执行本次任务的工作流。

- **审查**：交付有证据的问题、影响与修改建议；不以实现或生产运行作为完成条件。
- **排障**：交付原因、验证结论和未解决的阻塞；只有已授权修复时才改动。
- **实现**：完成已授权功能及验收检查。阶段完成不等于整体任务完成；一个分支阻塞时继续独立工作。

## 架构决策

- 路径固定且需要可靠重放的操作优先采用确定性工作流；需要根据中间结果探索时采用 Agent Loop。按实际需求组合，不以修改范围完全开放作为准入条件。
- 仅委托可独立交付、权限和写入边界清楚，且预期收益超过协调成本的子任务；不按文件数量或步数强制分拆。保留宿主模型选择与权限策略。
- 工具通过执行环境接口访问资源，权限与审批由执行层强制实施。描述只保留用途、路由边界与非显然约束，不以重复否定或固定段数代替安全检查。
- 输出预算应保留错误证据和分页入口；压缩前保留已确认约束、必要事实及未完成工作。无增量重试触发诊断，正常轮询与环境变化后的复查不视为死循环。
- 先查事实和既有授权；只有无法合理推断、会改变目标或重大取舍且阻塞下一步的问题才询问。等待期间继续独立工作，沉默不构成批准。
- 验证以项目要求和改动风险为准；相关检查通过后，仅在新变化、失败或未解决风险需要时扩大范围。报告只声明已验证的范围；既有失败须有基线等直接证据，证据不足则保留归因未确定。
