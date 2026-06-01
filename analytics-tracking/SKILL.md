---
name: analytics-tracking
description: 通用埋点设计、审查与实现指导技能，覆盖 tracking plan、event taxonomy、事件命名、properties、触发时机、价值判断、存量审查与验证。Use when 用户要求设计/审查/迁移/清理埋点、analytics tracking、event tracking、tracking plan、event taxonomy、数据采集规范、转化漏斗、功能使用分析，或代码中出现面向分析用途的 track/capture/identify/page/group 调用。仅用于错误日志、性能监控、APM、Sentry/Datadog 类 error reporting 的 track/capture 不触发。
---

# Analytics Tracking

用于把“想看数据”转成可维护、可验证、能支持决策的埋点方案。

## 前置判断

先确认目标，不要从“按钮能点所以要埋”开始。

必须能回答：

1. **业务问题**：这个埋点未来要回答什么问题？
2. **决策动作**：数据异常或变化后，团队会做什么？
3. **分析对象**：是用户、账号、组织、内容、订单、项目，还是一次 session？这一项决定所有事件的 actor_id/object_id 字段命名和 identity merge/group 规则，定错之后改造成本极高，先于事件设计敲定
4. **数据去向**：GA4、Segment、Amplitude、PostHog、自建数仓，或多个目的地？

缺少前两项时，先追问；没有决策动作的埋点默认不加。

## 什么功能需要埋点

优先埋会改变业务判断的行为：

1. **核心价值路径**：注册、创建、发布、支付、邀请、导出、完成关键任务
2. **漏斗节点**：进入、开始、提交、成功、失败、放弃
3. **状态转移**：草稿变发布、试用变付费、任务从 pending 到 succeeded/failed
4. **高意图行为**：搜索、筛选、保存、分享、下载、复制、联系销售
5. **收入与增长**：订阅、升级、取消、优惠码、推荐来源、campaign 归因
6. **留存与激活**：首次完成、重复使用、关键功能采用、邀请协作
7. **失败与摩擦**：表单错误、权限拒绝、支付失败、接口失败、空状态 CTA
8. **实验与个性化**：实验曝光、variant、推荐位曝光与点击

默认不埋（满足任一条即剔除，反例见 REFERENCE）：

1. 不能驱动决策的低价值 UI 噪声
2. 可由已有事件 properties 推导出来的重复事件
3. 事件名包含动态值（应放 properties）
4. 没有明确业务问题、只为"以后可能有用"

## 事件设计规则

每个事件必须写入 tracking plan，最少包含：

| 字段 | 要求 |
| --- | --- |
| event | 稳定事件名，不包含动态值 |
| description | 用户做了什么，不写实现细节 |
| trigger | 精确触发时机：点击时、请求成功后、状态落库后 |
| actor_id | 行为主体，匿名/登录态要明确 |
| object | 被操作对象及 ID，如 project_id、post_id |
| properties | 少而稳定，只放分析维度 |
| success/failure | 成功和失败是否分事件或用 result 区分 |
| owner | 谁负责解释和维护这个事件 |

命名原则：

1. 选定一种风格全局一致（`Object Actioned` 或 `snake_case` 二选一）
2. event 名表达"发生的事实"，不要包含 UI 位置或动态值
3. 变化的部分一律放 properties，且使用稳定枚举与值域
4. 同一含义只允许一个字段名，避免 `projectId`/`project_id`/`id` 混用

具体风格示例与坏事件名见 REFERENCE。

## 审查存量埋点

面对已存在的事件集合（清理、迁移到新 destination、重做 taxonomy）时，工作流和"从零设计"不同，先判断再动手：

1. **是否还有人用**：查 dashboard、saved query、experiment、告警、数仓下游表的引用。零引用且 90 天无新分析需求的事件默认进废弃候选
2. **是否还能回答原始问题**：找事件 owner 或最初的 tracking plan 对照。问题已经不重要，或事件 schema 已经回答不了它，进废弃候选
3. **是否与新模型冲突**：命名风格、actor/object 语义、properties 枚举值是否和正在引入的新事件一致。冲突时优先改新事件名而不是覆盖旧事件，避免历史数据被语义污染
4. **迁移而非重写**：destination 切换时保留事件名和 properties，只换 SDK；taxonomy 重做时新旧并行一段时间，靠数仓侧 mapping 表对齐，不要直接改写历史

输出区分三档：保留、改造（含字段补全/重命名/拆分）、废弃。每个废弃事件要标注下游影响和切换日期。

## 实现与验证流程

1. **先写 tracking plan**：明确事件、properties、触发时机、业务问题
2. **再接入代码**：优先通过统一 `track()` wrapper，避免业务代码直接绑死供应商 SDK
3. **识别身份边界**：匿名态、登录态、跨设备、账号/组织维度要有明确 identify/group 规则
4. **控制触发时机**：状态改变类事件优先在成功确认后触发；曝光类事件要去重
5. **做隐私检查**：不采集密码、token、完整手机号、邮箱原文、支付卡号、敏感健康/身份信息
6. **验证数据链路**：本地 debug、网络请求、analytics debug view、数仓落表至少选一种证据
7. **防重复**：刷新、重试、Strict Mode、乐观更新、服务端重放都要检查是否重复上报

## 审查输出格式

审查或设计埋点时，按这个结构输出：

1. **目标问题**：这些埋点要回答什么
2. **应埋事件**：事件名、触发时机、关键 properties
3. **不建议埋**：哪些候选埋点是噪声或重复
4. **实现位置**：建议放在哪层代码，是否需要 wrapper/hook/middleware
5. **风险与验证**：重复上报、PII、身份错配、漏斗断点、验证方法

详细模板、反模式和属性设计见 [REFERENCE.md](REFERENCE.md)。
