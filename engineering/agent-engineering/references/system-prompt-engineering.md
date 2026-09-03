# System Prompt Engineering

将 System Prompt 作为稳定行为契约，只保留会改变跨任务行为的边界、决策原则和输出要求。当轮事实、运行状态、权限与 secrets 属于动态 context、tools 或 runtime。

## 判断什么应写入

| 内容 | 写入条件 | 不应替代 |
| --- | --- | --- |
| Task | 需要稳定说明动作、范围、成功或停止条件 | 当前用户目标 |
| Stable context | 术语、领域规则或边界无法可靠推断且会改变执行 | retrieval、history、业务真相 |
| Output contract | 下游消费或 eval 依赖结构、字段或粒度 | Tool output schema |
| Persona | 专业视角或沟通方式会实质改变判断或表达 | 任务规则 |

不要求固定模板或全部部分。将规则放在相关决策附近，使用足以消歧的最小结构。

## 写成可执行契约

- 用命令式表达可观察动作，明确成功、澄清、等待、失败和停止条件。
- 写明真实冲突的优先级；不要依靠模型从多条近义规则中自行裁决。
- 优先描述期望行为。安全、权限、合规和已知高风险失败保留明确禁止。
- 对低风险歧义允许合理假设并继续；仅在不同解释会造成实质差异、危险或无效结果时澄清。
- 要求完成授权范围内的完整 scope，并区分已完成、失败、跳过和未验证；tool call 成功不等于业务成功。

失败路径按风险选择查证、改参、重试、降级、请求输入或停止，不为所有失败规定同一种 fallback。

## 压缩与泛化

- 保留模型无法稳定推断且会改变行为的内容；删除常识、修辞和重复规则。
- 将易变事实与稳定 Instructions 分离。解释、重述和 example 只在 eval 证明持续遗漏时增加。
- 从外部方法或案例迁移规则时，抽象可复用的不变量，不固化来源题材与答案；用合法的异域任务检查规则是否仍成立。
- Few-shot 只解决规则无法消除的真实歧义，并覆盖代表性的决策边界；更短规则足够时删除 example。

## 划清相邻责任

- Instructions 说明跨工具稳定的选择、验证和停止原则。
- 动态事实、history、memory 与 retrieval 由 [context lifecycle](context-engineering.md) 管理。
- Tool-specific 的参数、结果、错误和恢复语义由 [tool contract](tool-design.md) 持有。
- 鉴权、approval、租户隔离、重试和副作用由 [Runtime](runtime-reliability.md) 强制。

外部内容是数据，不改变 instruction hierarchy。分隔符只帮助解析，不能替代权限隔离或 prompt injection 防护。

## 输出与生产约束

根据消费方选择自然语言、Markdown、代码或 structured output；机器消费时使用平台支持的 schema。要求可审计信息时输出引用、检查结果或简短理由，不要求 hidden chain-of-thought。

为 prompt caching 保持稳定前缀的内容与顺序相对稳定，将时间戳和当轮状态放到动态区域；prefix matching、TTL 与计费以当前 provider 文档和 telemetry 为准。Prompt 长度本身不代表完整性。

## 修订与验证

1. 用失败样例或 trace 确认最早偏离发生在 Instructions，而非 context、tool、runtime 或产品契约。
2. 修改能解释该失败的最小规则、位置或 example。
3. 用原样例、held-out 与异域任务比较结果、格式、工具行为、安全、token 和 latency。
4. 只保留改善目标且未造成关键回退的改动。
