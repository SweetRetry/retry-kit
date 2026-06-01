# Analytics Tracking Reference

## 埋点价值判断

埋点不是记录一切，而是降低产品判断的不确定性。一个埋点值得做，通常至少满足一个条件：

1. 能判断用户是否到达产品承诺的核心价值
2. 能定位转化漏斗的流失节点
3. 能解释增长、收入、留存、激活、失败中的一个关键问题
4. 能支持实验、个性化、推荐、风控或运营动作
5. 能在问题发生时辅助排查，而不是只在事后展示数字

如果事件不能连接到“看到数据后要做什么”，它通常只是日志噪声。

## 事件粒度

### 合适粒度

把事件设计成稳定的用户行为事实：

| 好事件 | 原因 |
| --- | --- |
| `Project Created` | 描述真实业务状态变化 |
| `Checkout Started` | 漏斗节点清晰 |
| `Invite Sent` | 高意图增长行为 |
| `Search Performed` | 可分析需求和结果质量 |
| `Export Completed` | 表示用户拿到了价值结果 |

### 粒度过细 / 默认不埋

| 坏事件 | 问题 | 处理 |
| --- | --- | --- |
| `Blue Button Clicked` | UI 变化后失效，业务含义弱 | 删除，或合并到对应业务事件 |
| `Modal Closed` | 多数情况下不能驱动决策 | 删除 |
| `Project Created From Header` | UI 位置进入事件名 | 改为 `Project Created` + `source: "header"` |
| `Clicked Plan Pro` | 动态值进入事件名，事件数会爆炸 | 改为 `Plan Selected` + `plan: "pro"` |
| `Tooltip Hovered` / `Section Scrolled` | UI 噪声，无决策动作 | 删除 |
| `User Active` | 含义可由其他事件聚合推导 | 删除 |
| `Maybe Useful Event` | 没有业务问题、没有 owner | 默认不埋 |

## 命名风格示例

二选一，全局一致：

| 风格 | 事件名 | properties key |
| --- | --- | --- |
| Object Actioned | `Project Created`, `Plan Selected`, `Invite Sent` | `snake_case` |
| snake_case | `project_created`, `plan_selected`, `invite_sent` | `snake_case` |

混用反例：`projectCreated` / `Project_Created` / `ClickedPlanPro` 同时出现，分析端难以聚合且容易写错。

## 常见事件族

| 事件族 | 典型事件 | 常用 properties |
| --- | --- | --- |
| 页面/入口 | `Page Viewed`, `Landing Viewed` | `page_type`, `referrer`, `utm_*` |
| 注册登录 | `Signup Started`, `Signup Completed`, `Login Failed` | `method`, `reason` |
| 激活 | `Onboarding Completed`, `First Project Created` | `step`, `time_to_value` |
| 核心对象 | `Project Created`, `Post Published`, `Package Installed` | `*_id`, `source`, `template_id` |
| 搜索筛选 | `Search Performed`, `Filter Applied` | `query_length`, `filter_type`, `result_count` |
| 协作传播 | `Invite Sent`, `Share Link Copied` | `channel`, `role`, `object_type` |
| 交易收入 | `Checkout Started`, `Purchase Completed`, `Subscription Cancelled` | `plan`, `amount`, `currency` |
| 错误摩擦 | `Form Validation Failed`, `Payment Failed` | `field`, `error_code`, `recoverable` |
| 实验推荐 | `Experiment Viewed`, `Recommendation Clicked` | `experiment_id`, `variant`, `slot` |

## Properties 设计

### 必须稳定

properties 是分析维度，不是日志 payload。优先选择低基数、稳定、可聚合字段：

1. `source`: `home`, `pricing`, `onboarding`, `email`
2. `method`: `email`, `google`, `github`
3. `plan`: `free`, `pro`, `team`
4. `result`: `success`, `failure`
5. `error_code`: 机器可读错误码
6. `object_type`: `project`, `post`, `package`

### 谨慎使用

1. 用户自由输入：搜索词可考虑采集脱敏/长度/类别，默认不采集原文
2. 高基数字段：URL、标题、完整文件名、完整错误堆栈
3. PII：邮箱、手机号、姓名、IP、精确地理位置、身份证件、支付信息
4. 技术细节：组件名、CSS selector、内部函数名，除非用于工程诊断

## 触发时机

| 场景 | 推荐触发时机 |
| --- | --- |
| 点击只表示意图 | 点击时触发，如 `Checkout Started` |
| 状态必须成功改变 | API 成功或数据库确认后触发，如 `Project Created` |
| 表单提交失败 | 校验失败时触发失败事件，带 `error_code` |
| 页面曝光 | 路由稳定后触发，避免 hydration 和重定向重复 |
| 列表 item 曝光 | 进入 viewport 后触发，并按 item/session 去重 |
| 实验曝光 | 用户真正看到 variant 时触发，不是分配 variant 时 |

## Client vs Server

| 位置 | 适合 | 风险 |
| --- | --- | --- |
| Client | 点击、曝光、前端表单校验、页面浏览 | ad blocker、重复触发、身份未绑定 |
| Server | 支付成功、状态落库、权限变更、后台任务完成 | 缺少 UI 来源、异步归因复杂 |
| 双端 | 高价值关键链路，需要互相校验 | 必须有 idempotency key 防重复 |

原则：事实以最终可信来源为准。支付、权限、发布、订阅等事件优先 server-side；点击、曝光、输入摩擦优先 client-side。

## Tracking Plan 模板

```md
## Event: Project Created

- Question: 用户是否成功完成首次核心价值动作？
- Trigger: project create API 成功返回后
- Actor: user_id
- Object: project_id
- Properties:
  - source: "onboarding" | "dashboard" | "template_gallery"
  - template_id: string | null
  - is_first_project: boolean
- Destinations: Amplitude, warehouse
- Owner: Product
- Verification:
  - 本地触发一次创建
  - debug view 可见事件
  - warehouse 次日能按 source 聚合
```

## 存量审查决策表

| 信号 | 含义 | 默认动作 |
| --- | --- | --- |
| 90 天无 dashboard / query / 告警引用 | 没人在看 | 进废弃候选，通知 owner 后下线 |
| 引用存在但 owner 已离职/无人认领 | 维护责任真空 | 重新指派 owner，或随业务下线 |
| 事件名含 UI 词、动态值 | 旧 taxonomy 残留 | 引入新事件名，旧事件保留只读直到下游切换 |
| properties 中混入 PII / 长文本 / token | 历史合规风险 | 立即停止上报对应字段，数仓侧脱敏或重写 |
| 同名事件在不同时期含义不同 | 数据已被污染 | 用 `version` property 切分，或拆为新事件名 |
| 仅前端埋的支付/订阅类事件 | 关键事实不可信 | 补 server-side 事件，前端事件降级为意图信号 |
| 新旧 destination 并存 | 迁移期 | 保留事件名和 schema，只换 SDK；用数仓 mapping 对齐 |

废弃流程最少包含：标记废弃日期 → 通知下游 dashboard/查询负责人 → 保留只读期 → 停止上报 → 数仓归档。直接删代码会导致历史看板静默断点。

## 常见反模式

1. **全点击埋点**：把所有 click 都上报，最后没人能解释
2. **事件名动态化**：导致事件数量爆炸，漏斗无法稳定
3. **properties 当日志**：上传大量不可聚合字段，增加成本和隐私风险
4. **只埋成功不埋失败**：只能看到完成的人，看不到为什么没完成
5. **只埋前端不看可信事实**：支付/发布等关键状态被刷新、重试、拦截影响
6. **没有 owner**：事件坏了没人负责，含义变了没人更新
7. **不做版本治理**：旧事件和新事件同名但语义不同，历史数据失真
8. **先写代码后补文档**：实现细节反过来污染事件模型

## 审查清单

交付前检查：

1. 每个事件都有业务问题和决策动作
2. event 名不包含动态值，且全局命名风格一致
3. properties 没有 PII、长文本、token、密码、完整支付信息
4. 成功/失败/取消的关系清晰
5. 触发时机不会因重试、刷新、Strict Mode、hydration 重复
6. 匿名用户和登录用户的身份合并规则明确
7. 高价值事件有 server-side 或幂等校验
8. 有至少一种可执行验证方式
