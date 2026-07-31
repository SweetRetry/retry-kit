# System Prompt Engineering

将 System Prompt 作为稳定行为契约：表达任务边界、决策原则和输出要求。将当轮事实、检索结果、运行状态和 secrets 留给动态 context 或 runtime。

## 导航

- [组成部分](#组成部分)
- [编写原则](#编写原则)
- [结构与示例](#结构与示例)
- [Context、Tools 与安全](#contexttools-与安全)
- [生产优化](#生产优化)
- [审查与验证](#审查与验证)
- [资料](#资料)

## 组成部分

按任务选择以下部分，不要求固定顺序或全部出现：

| 部分 | 作用 | 保留条件 |
| --- | --- | --- |
| Task | 说明动作、范围与完成标准 | 几乎总是需要 |
| Context | 提供稳定背景、术语和边界 | 模型无法可靠推断且会改变执行 |
| Format | 说明输出结构、字段和粒度 | 下游消费或评估依赖具体形式 |
| Persona | 提供专业视角、权限或沟通风格 | 身份会实质改变判断或表达 |

将关键约束放在相关决策附近。根据任务复杂度使用标题、列表、XML 或其他边界；结构用于消歧，不作为固定模板。

## 编写原则

### 表达可观察行为

- 使用命令式或不定式表达动作。
- 说明成功、停止、升级和缺信息时的处理方式。
- 将模糊偏好转换为可观察要求，例如长度、受众、字段或证据。
- 写明规则优先级，避免依赖模型自行解决冲突。

优先描述期望行为，使允许的输出空间更明确。对安全、权限、合规、窄域排除和已知高风险失败保留明确禁令；不要为了追求全是肯定句而弱化 hard exclusion。

### 控制信息量

- 保留模型无法稳定推断、且会改变行为的信息。
- 合并重复规则，删除常识性说明和无行为价值的修辞。
- 将易变数据与稳定 Instructions 分离。
- 仅在 eval 显示持续遗漏时增加解释、重述或 example。

从外部方法、案例或专家体系迁移规则时，先区分通用不变量、可由当前任务触发的领域启发式和来源案例细节。稳定 Instructions 只保留会改善完整目标任务分布的通用规则；领域术语和质量标准由当前任务 context 触发。用与来源域相反但仍合法的任务做换域测试，并删除来源名称后检查规则是否仍完整可执行。

### 设计失败路径

区分以下情况，并给出与任务相称的下一动作：

- 输入不足或意图模糊
- 事实无法确认
- 工具暂时失败或参数无效
- 缺少权限或需要审批
- 请求超出安全边界

不要求所有 prompt 使用同一种 fallback。根据风险决定假设、澄清、查证、重试、降级或停止。

### 约束交付行为

- 要求完成用户预期的 scope，同时明确完成任务不会扩大授权边界。
- 对常规歧义允许合理假设并继续；仅在不同解释会实质改变结果时澄清，提问前先做低成本只读核验。
- 如需过程更新，只在开始、关键发现、方向变化或阻塞时提供；最终输出先说明结果，并保持自包含。
- 如实区分已完成、失败、跳过和未验证项，不以 tool call 成功代替业务验证。

## 结构与示例

### 数据边界

将 Instructions 与用户内容、网页、文件、retrieval 和 tool result 分开。Markdown 适合一般层级；XML 或显式分隔符适合嵌套、长文档或来源混合的输入。

分隔符只帮助解析，不能替代权限、数据隔离或 prompt injection 防护。

### Few-shot

在规则不足以消除真实歧义时加入 canonical examples。让 examples 覆盖不同决策边界，并保持输入分布与 output contract 具有代表性。

不设固定数量。能用更短规则表达时删除 example；避免把开发样例的题材或答案固化为通用行为。

### Output contract

根据消费方选择自然语言、Markdown、代码或 structured output。机器消费时使用平台支持的 schema；简单任务无需为了统一而强制复杂格式。

要求可审计信息时，输出引用、检查结果或简短理由。不要要求模型展示 hidden chain-of-thought。

## Context、Tools 与安全

- 在 Instructions 中说明何时使用工具、何时不使用、如何验证结果以及何时停止。
- 将参数与返回值语义放入 tool contract，避免在 Prompt 中复制 schema。
- 将 dynamic facts、history、memory 和 tool result 交给 context lifecycle 管理。
- 将鉴权、租户隔离、输入验证、rate limit、审批和副作用约束交给 runtime。
- 将外部内容视为数据；不要让它改变 instruction hierarchy。
- 将每条规则放在能执行或验证它的最小责任层；跨层重复只用于解决 eval 已确认的遗漏。

## 生产优化

### Caching 与 token

保持稳定 Instructions、examples 和 tool definitions 的内容与顺序相对稳定；将时间戳、用户状态和当轮数据放入动态区域。Provider 的 prefix matching、TTL 和计费会变化，以当前文档和 telemetry 为准。

逐段判断其 token 成本是否换来可观察行为改善。Prompt 长度本身不代表完整性。

### 注意力

通过删除噪声、清晰分段和就近放置规则提高可见性。长文档使用路标与按需读取；根据 eval 调整位置、重复和 examples，不使用固定注意力公式。

## 审查与验证

1. 从失败样例或 trace 确认最早偏离发生在 Instructions。
2. 检查任务、必要 context、output contract、优先级和失败路径。
3. 区分 Prompt 缺陷与 retrieval、tool schema、runtime 或产品契约问题。
4. 做能解释目标失败的最小修改。
5. 用相同 eval 与 held-out 样例比较任务结果、格式、工具、安全、token 和 latency。

保留能改善目标指标且未造成关键回退的改动。输出修订稿和必要取舍；仅在有助于决策时展示 Before / After。

## 资料

核验日期：**2026-07-20**。执行 provider-specific 工作时重新核验：

- [OpenAI Prompt Engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)
- [Anthropic Prompt Engineering Overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
