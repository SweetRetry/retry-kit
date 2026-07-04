---
name: system-prompt-engineering
description: 基于四要素结构（Persona / Task / Context / Format）、五条核心实践和工程优化层（缓存、注意力、安全、工具描述）的 System Prompt 工程规范。使用场景：(1) 编写、优化、审查 System Prompt，(2) 提到 prompt 工程、系统提示词、角色设定、提示词模板，(3) 为 AI 应用设计指令系统，(4) 诊断修复指令偏移、幻觉、格式不稳定，(5) 关注 prompt caching、token 成本、TTFT、注意力分布等生产优化。
---

# Prompt 工程规范

**写指令如同写代码**：结构清晰、职责单一、可测试、可迭代。本规范聚焦 System Prompt 初始设定（单轮指令层），多轮状态管理不在范围内。

## 四要素结构

| 模块 | 作用 | 关键问题 |
|------|------|----------|
| **P** — Persona | 定义模型身份 | 我是谁？专业领域？沟通风格？ |
| **T** — Task | 明确执行动作 | 做什么？分几步？完成标准？ |
| **C** — Context | 提供边界约束 | 为什么做？给谁看？边界在哪？ |
| **F** — Format | 规定输出结构 | JSON / 表格 / 列表？骨架是什么？ |

组装顺序：`Persona → Context → Task → Format`

详解 → [references/four-elements.md](references/four-elements.md)

## 五条核心实践

| # | 实践 | 要点 |
|---|------|-----|
| 1 | XML 标签结构化 | `<persona>` `<task>` `<context>` 分隔指令，抵抗偏移 |
| 2 | 正面指令优先 | 负面指令仅用于安全红线 |
| 3 | Few-Shot 注入 | 3-5 个理想问答对锁定风格 |
| 4 | CoT 链式思考 | 系统层级植入推理步骤 |
| 5 | 默认兜底策略 | 未知问题优雅拒绝，防幻觉 |

详解 → [references/core-practices.md](references/core-practices.md)

## 工程优化层

| 维度 | 核心问题 | 关键技术 |
|------|----------|----------|
| **缓存设计** | 最大化 prompt caching 命中率 | 稳定内容前置、动态内容隔离、缓存边界 |
| **注意力设计** | 提升指令执行率 | 首尾锚定、长文档路标、关键约束多位置重复、Token 预算 |
| **安全性设计** | 防 Prompt Injection / Jailbreak / PII | 输入隔离分隔符、角色稳定性、拒绝话术、最小信息 |
| **工具描述设计** | 让模型准确选调工具 | name 动词命名、description 三段式、参数含义+约束+示例、分组声明 |

- 缓存/注意力 → [references/engineering-optimizations.md](references/engineering-optimizations.md)
- 安全 → [references/security.md](references/security.md)
- 工具描述 → [references/tool-use.md](references/tool-use.md)

## 工作流程

### 从零创建

1. **理解需求**。目标模糊时先提 2-3 个澄清问题。
2. **构建四要素**：Persona → Context → Task → Format。
3. **应用核心实践**：XML 包裹、负→正转换、按需注入 Few-Shot / CoT、加兜底。
4. **工程优化**（生产必做）：稳定内容前置；核心指令首尾放置、关键约束重复 ≥ 2 次；面向外部用户加分隔符+拒绝话术；有 function calling 时补齐工具描述。
5. **自检**：过一遍自检清单。

### 审查/优化

1. 逐条过自检清单，标记不合格项。
2. 按 Task > Context > Format > Persona 排优先级。
3. 输出 Before/After 对照 + 修改理由。

## 输出骨架

```xml
<persona>身份 + 领域 + 风格</persona>
<context>背景 + 受众 + 关键约束</context>
<task>
一句话核心任务
执行步骤：1... 2... 3...
完成标准：...
</task>
<constraints>正面行为约束 + 安全红线 + 兜底策略</constraints>
<format>输出结构骨架（字段名 + 数据类型）</format>
<examples>可选：3-5 个输入-输出对</examples>
```

## 自检清单

**结构完整性**
- Task / Context / Format 必选模块是否齐全？（Persona 可选）
- 每个模块是否用 XML 标签包裹，边界无歧义？

**指令质量**
- 负面指令 ≤ 总指令数 20%（安全红线除外）？
- Task 首词是否为动词祈使句？
- 超过 2 步的任务是否拆解为有序步骤？

**健壮性**
- 是否显式定义了「不知道」「不应该回答」的回复模板？
- Context 是否覆盖背景 / 受众 / 关键约束三要素？
- Format 是否给出含字段名和数据类型的骨架？

**效率**
- 是否有可由 Persona / Context 推断的冗余信息可删？
- 输出格式简单无歧义时省略 Few-Shot；否则保留 3-5 个。
- 总 token 是否 < 2000？超过时标记可精简段落。

**缓存设计**（生产）
- 稳定内容（Persona / 固定规则 / Examples）是否集中在顶部？
- 动态内容（用户数据 / 时间戳 / history）是否隔离到底部或 user message？

**注意力设计**（生产）
- 最重要的任务指令和 Format 要求是否位于首/尾（避免中间）？
- 必须严格遵守的约束是否重复 ≥ 2 次？
- 大量文档 / RAG 是否有开始/结束路标？
- 用户输入插槽是否有分隔符防 injection？

**安全性设计**（对外）
- 用户输入是否用分隔符或 XML 标签物理隔离？
- Persona 是否声明角色不随请求改变？
- 是否定义了统一拒绝话术？
- 是否覆盖角色扮演 / 假设情景等 jailbreak 模式？

**工具描述**（function calling）
- 所有 name 是否 `snake_case` + 动词开头？
- description 是否包含触发场景（「何时用」）？
- 相似工具是否声明彼此边界？
- 每个参数是否含义 + 约束 + 示例齐全？
- 工具数 > 8 时是否分组声明？

## 验证闭环（生产）

1. 建立最小评测集（20-50 条）：正常 / 边界 / 对抗样例。
2. 定义通过标准：结构合规率 ≥ 95%、任务完成率 ≥ 90%、安全拒答准确率 ≥ 99%。
3. 每次改 Prompt 跑同一套评测集，记录 Before/After。
4. 核心指标下降即回滚。

## References 读取门禁

- 仅措辞微调：可不读。
- 从零创建 / 重构 / 审查 / 生产调优：必读 [four-elements.md](references/four-elements.md) + [core-practices.md](references/core-practices.md)。
- 生产优化：追加 [engineering-optimizations.md](references/engineering-optimizations.md)。
- 对外或高风险：追加 [security.md](references/security.md)。
- 有工具调用：追加 [tool-use.md](references/tool-use.md)。
