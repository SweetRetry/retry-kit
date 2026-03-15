---
name: skill-research
description: >
  为专业领域 agent skill 做前置调研和知识沉淀。用于在创建或更新 skill 前先厘清边界、
  确定需要研究的核心问题、收集并分层证据、把结论转成可复用的规则、检查项、反模式和
  `references/` 拆分建议。适用于“先研究某个专业领域再写成 skill”“补齐现有 skill
  的专家知识”“验证 skill 中的知识是否过时、过硬或证据不足”。不用于纯 compact /
  去过拟合任务，也不用于与 skill 无关的泛化研究。
---

# Skill Research

## 目标

先把“专业领域知识”研究清楚，再决定哪些内容值得写进 skill。
输出不是综述，而是能直接进入 skill 主规则、检查表、分支条件、示例约束和 `references/`
规划的材料。

## 工作流程

### 1. 先收窄边界

先用 2-5 个典型触发例子定义这次 research 服务的 skill：

```md
## Boundary

Core Responsibility: [一句话]
Target Users: [谁，在什么场景下用]
Not For: [明确排除]
Output: [skill 最终产出什么]
Adjacent Skills: [边界外交给谁]
```

边界模糊时，先做窄，不做大而全。

### 2. 列出研究问题，不要直接开搜

每个候选问题都过这三关：

1. 会改变 skill 的默认行为吗？
2. 会变成规则、检查项、反模式或条件分支吗？
3. 会不会越界到相邻 skill？

答不清就先不研究。

把保留下来的问题整理成一个最小 research plan：

```md
## Research Plan

- Question: [要回答什么]
  Why it matters: [会改变哪条规则或检查项]
  Preferred evidence: [优先找什么来源]
  Stop when: [看到什么信号就够了]
```

### 3. 逐题执行调研

按问题类型选资料：

- 技术规范、API、平台规则：优先官方文档、标准、源码、一手文档
- 行业流程、方法论、经验模式：用多类来源交叉验证
- 区域或语言强相关主题：优先本地语境和本地一手资料
- 团队私有方法论：优先内部文档或用户给定材料

不要把”英文优先””固定搜索轮数””固定来源数量”写成硬规则。

每个问题至少做这三步：

1. 第一轮：先找主结论
   先找最可能正确的一手资料或高质量资料，快速建立当前最强解释。

2. 第二轮：专门找反例和分歧
   主动搜索相反观点、失败案例、边界条件、版本差异、区域差异。

3. 第三轮：只补会改变结论的缺口
   如果前两轮已经足够支撑规则，就停止；不要为了显得扎实而继续堆例子。

每轮结束时记录：当前最强结论、它依赖的前提、不成立的场景。

### 4. 判断什么时候停止

满足下面大多数条件就可以停：

- 关键结论开始重复
- 典型场景已经覆盖
- 主要分歧已经识别
- 新资料不再改变默认规则

如果继续搜索只是在累积例子，而不是改变结论，就停止。

### 5. 把证据整理成知识卡片

每条保留结论都写成最小卡片：

```md
### [Topic]

Conclusion: [一句话]
Confidence: High / Medium / Low
Knowledge Type: Principle / Framework / Practice / Trend
Placement: Core Rules / references / Drop（绑定特定 agent 产品的内容默认 Drop）
Actionability: [规则 / 检查项 / 反模式 / 条件分支 / 示例]
Sources: [来源和日期]
Open Questions: [若有]
```

不能转成指令的内容，默认删掉或留在开放问题里。

### 6. 决定哪些写进主文件，哪些进入 `references/`

- 稳定、通用、会频繁影响行为：进 `SKILL.md`
- 时效强、变体多、案例长、争议大：进 `references/`
- 单一来源但值得保留：降级成可选建议
- 存在分歧：写成条件分支，不写成唯一正确答案
- 不能转成行为的内容（背景综述、泛泛趋势、无前提的技巧、凑专业感的 benchmark）：直接删掉

### 7. 用增量 diff 交付

更新现有 skill 时，优先输出知识差异而不是整包重写：

```md
## Knowledge Diff

- [新增] xxx - 理由
- [替换] xxx -> yyy - 理由
- [删除] xxx - 理由
- [不变] xxx - 仍成立
```

## 交付格式

```md
## Final Boundary

## Knowledge List
- 内容摘要
- 置信度
- 知识类型
- 放置位置：Core Rules / references / Drop
- 呈现形式：规则 / 检查项 / 反模式 / 条件分支 / 示例

## Anti-Patterns

## Open Questions

## References Suggestions
```
