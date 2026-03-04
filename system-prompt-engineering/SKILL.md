---
name: system-prompt-engineering
description: 基于四要素结构（Persona / Task / Context / Format）、五条核心实践和工程优化层（缓存设计、注意力机制设计）的 System Prompt 工程规范。帮助用户构建高质量、结构化的 System Prompt。使用场景：(1) 用户要求编写、优化或审查 System Prompt，(2) 用户提到"prompt 工程"、"系统提示词"、"角色设定"、"提示词模板"，(3) 用户需要为 AI 应用设计指令系统，(4) 用户的 prompt 存在指令偏移、幻觉、格式不稳定等问题需要诊断修复，(5) 用户关注 prompt caching、token 成本、TTFT 延迟、注意力分布等生产优化问题。
---

# Prompt 工程规范

基于四要素结构和五条核心实践，构建高质量 System Prompt。

## 核心理念

**写指令如同写代码**：结构清晰、职责单一、可测试、可迭代。

## 四要素结构速查

| 模块 | 作用 | 关键问题 |
|------|------|----------|
| **P** — Persona | 定义模型身份 | "我是谁？专业领域？沟通风格？" |
| **T** — Task | 明确执行动作 | "做什么？分几步？完成标准？" |
| **C** — Context | 提供边界约束 | "为什么做？给谁看？边界在哪？" |
| **F** — Format | 规定输出结构 | "JSON？表格？列表？骨架是什么？" |

推荐组装顺序：`Persona → Context → Task → Format`

详细的模块写作指南、反模式和优先级权重 → [references/four-elements.md](references/four-elements.md)

## 五条核心实践

| # | 实践 | 一句话要点 |
|---|------|-----------|
| 1 | XML 标签结构化 | 用 `<persona>` `<task>` `<context>` 等标签分隔指令，抵抗指令偏移 |
| 2 | 正面指令优先 | "回答保持简洁" 优于 "不要写废话"；负面指令仅用于安全红线 |
| 3 | 示例注入 Few-Shot | 将 3-5 个理想问答对放入 System Prompt，锁定输出风格 |
| 4 | 链式思考 CoT | 在系统层级植入推理步骤，比单次 "Think step by step" 更持久 |
| 5 | 默认兜底策略 | 规定模型遇到未知问题时如何优雅拒绝，防止幻觉 |

每条实践的深度解析、模板和示例 → [references/core-practices.md](references/core-practices.md)

## 工程优化层

在四要素结构基础上，高质量的 System Prompt 还需关注两个工程维度：

| 维度 | 核心问题 | 关键技术 |
|------|----------|----------|
| **缓存设计** | 如何最大化 prompt caching 命中率，降低成本和延迟？ | 稳定内容前置、动态内容隔离、缓存边界设置 |
| **注意力机制设计** | 如何利用 Transformer 注意力分布规律提升指令执行率？ | 重要指令首尾锚定、长文档路标注释、关键约束多位置重复、Token 预算管理 |
| **安全性设计** | 如何防止 Prompt Injection、Jailbreak 和 PII 泄露？ | 用户输入隔离分隔符、角色稳定性声明、拒绝话术模板、最小信息原则 |
| **工具描述设计** | 如何让模型准确选择并调用工具？ | name 动词命名、description 三段式、参数含义+约束+示例、工具分组声明 |

缓存与注意力维度详解 → [references/engineering-optimizations.md](references/engineering-optimizations.md)

安全性设计详解 → [references/security.md](references/security.md)

工具描述写法详解 → [references/tool-use.md](references/tool-use.md)

## 适用范围

本规范聚焦 **System Prompt 的初始设定**（单轮指令层）。多轮对话中的状态管理（function calling 编排、对话记忆策略等）不在本规范范围内。

## 工作流程

### 从零创建

1. **理解需求**：用户想让 AI 做什么？目标受众是谁？
   - 如果需求模糊，先提出 2-3 个澄清问题
2. **构建四要素**：按 Persona → Context → Task → Format 顺序填充
3. **应用核心实践**：
   - 用 XML 标签包裹每个模块
   - 将负面指令转为正面指令
   - 如果需要稳定输出风格，注入 Few-Shot 示例
   - 如果任务需要推理，植入 CoT 指令
   - 添加兜底策略处理边界情况
4. **工程优化**（生产场景必做）：
   - 缓存设计：稳定内容（Persona、Examples、固定文档）前置，动态内容后置
   - 注意力设计：核心任务/格式要求放首尾；必须遵守的约束重复 2 次以上；长文档加路标注释
   - 安全设计（面向外部用户时）：用分隔符隔离用户输入；Persona 声明角色稳定性；定义拒绝话术
   - 工具描述（有 function calling 时）：每个工具 description 写明触发场景；参数含义+约束+示例齐全
5. **自检**：逐条过自检清单
6. **输出**：交付完整的 System Prompt

### 审查/优化已有 Prompt

1. **诊断**：逐条过自检清单，标记每条不合格项
2. **定位优先级**：按 Task > Context > Format > Persona 排序，先修最高优先级
3. **输出 Before/After 对照**：对每处修改给出原文 → 修改后的对比，并简述修改理由

## 输出骨架

生成的 System Prompt 遵循以下结构：

```xml
<persona>
[角色身份 + 专业领域 + 沟通风格]
</persona>

<context>
- 任务背景：[为什么需要执行这个任务]
- 目标受众：[谁会消费这个输出]
- 关键约束：[领域术语、数据边界、合规要求]
</context>

<task>
[核心任务一句话描述]

执行步骤：
1. [步骤 A]
2. [步骤 B]
3. [步骤 C]

完成标准：[什么情况下算完成]
</task>

<constraints>
- [正面指令为主的行为约束]
- [安全红线用负面指令]
- [兜底策略：遇到未知情况如何处理]
</constraints>

<format>
[输出结构骨架，含字段说明和数据类型]
</format>

<examples>
[可选：3-5 个理想的输入-输出对]
</examples>
```

## 自检清单

生成 System Prompt 后逐条检查，任何一条不过关就返工。

**结构完整性**：

- Task、Context、Format 三个必选模块是否都有覆盖？（Persona 可选）
- 每个模块是否用 XML 标签包裹？
- 标签之间是否有清晰的语义边界？判定：同一句话是否可以无歧义地归入唯一标签

**指令质量**：

- 负面指令数量是否 ≤ 总指令数的 20%？（安全红线除外的"不要"都应转为正面指令）
- Task 是否用祈使句开头，首个词是否为动词？
- 超过 2 步的任务是否拆解为有序步骤？

**健壮性**：

- 是否显式定义了"不知道"和"不应该回答"两种情况的回复模板？
- Context 是否覆盖了三要素（任务背景、目标受众、关键约束）？缺任何一项需补充
- Format 是否给出了具体的输出骨架（含字段名和数据类型），而非模糊描述？

**效率**：

- 逐句检查：是否有信息可通过 Persona 或 Context 推断？可推断的即为冗余，删除
- Few-Shot 示例：任务输出格式是否简单且无歧义？是 → 省略示例；否 → 保留 3-5 个
- Prompt 总 token 数是否 < 2000？超过时标记可精简的段落

**缓存设计**（生产场景）：

- 稳定内容（Persona、固定规则、Examples）是否集中在 prompt 顶部？
- 动态内容（用户数据、时间戳、当轮 history）是否隔离到底部或 user message？
- 固定内容中是否混入了会随请求变化的动态值？

**注意力机制设计**（生产场景）：

- 最重要的任务指令和 Format 要求是否位于 prompt 首部或尾部（避免放中间）？
- 必须严格遵守的约束是否在 prompt 中重复出现了 2 次以上？
- 大量文档/RAG 内容是否有明确的开始/结束路标注释？
- 当 prompt 包含用户输入插槽时，是否有分隔符防止 prompt injection？

**安全性设计**（面向外部用户时）：

- 用户输入插槽是否有分隔符（`--- 开始 ---` 或 XML 标签）物理隔离？
- Persona 中是否声明角色身份不随用户请求改变？
- Constraints 中是否定义了统一的拒绝话术？
- 安全红线是否覆盖了角色扮演、假设情景等常见 jailbreak 模式？

**工具描述设计**（有 function calling 时）：

- 所有工具 name 是否使用 `snake_case` + 动词开头？
- 每个工具 description 是否包含触发场景（"何时用"），而非只描述功能？
- 功能相似的工具是否在 description 中声明了彼此的边界？
- 每个参数 description 是否包含含义 + 约束 + 示例值？
- 工具数超过 8 个时，是否在 System Prompt 中对工具进行了分组声明？

## 完整示例

代码审查、产品需求分析、数据报告等多领域示例，含设计解析和反面对照 → [references/examples.md](references/examples.md)

## 验证闭环（生产场景建议）

将 Prompt 迭代纳入可量化评测，避免“改了但无法证明更好”：

1. 建立最小评测集（建议 20-50 条）：
   - 正常样例：覆盖主要任务路径
   - 边界样例：信息不足、格式冲突、长输入
   - 对抗样例：prompt injection、角色劫持、越权请求
2. 定义通过标准（示例）：
   - 结构合规率 ≥ 95%（输出字段/格式命中）
   - 任务完成率 ≥ 90%（核心步骤执行完整）
   - 安全拒答准确率 ≥ 99%（越权场景必须拒绝）
3. 每次改 Prompt 都跑同一套评测集，记录 Before/After 结果。
4. 任何核心指标下降即回滚，先修复再发布。

## References 读取门禁

### 读取条件

1. 只做很小的措辞修订（不改结构）可不读取 references。
2. 从零创建 System Prompt、重构结构、审查/优化、生产场景调优时：必须读取 references。

### 最低读取量

1. 所有结构化 Prompt 任务：必读 `references/four-elements.md` + `references/core-practices.md`
2. 生产优化（缓存/注意力）任务：追加 `references/engineering-optimizations.md`
3. 面向外部用户或高风险场景：追加 `references/security.md`
4. 有 function calling/tool schema：追加 `references/tool-use.md`
5. 需要风格或行业范式样例：按需读 `references/examples.md`
