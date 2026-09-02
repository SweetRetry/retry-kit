---
name: analytics-tracking
description: 埋点与数据价值诊断：从业务决策与行动分叉倒推数据价值，审查或设计高信噪比的 event taxonomy、命名规范与 tracking plan。
---

# Analytics Tracking

## 1. 核心心智模型 (Mental Model)

数据本身不是资产，**唯有能直接改变未来业务、产品或运营动作的数据才是资产；其余皆是系统与认知负债**。
- **三大铁律**：
  1. **无动作，不埋点**：若指标无论偏高、偏低或异常，团队的下一步动作都完全相同，该埋点即为垃圾噪音；
  2. **能派生，不新建**：能从现有服务端数据库事实、时间戳差值或已有事件 Properties 计算得出的数据，严禁重复建点；
  3. **核心事实信服务端**：涉及资金、资产、权限、履约与订单的核心状态跃迁，必须以**服务端权威上报为唯一定位事实**，不可信任不可靠的客户端。

## 2. 价值推导四重判据 (Value Criteria)

规划或审查任何指标/事件时，必须全部通过以下 4 项判据：

1. **业务疑问明确 (Actionable Question)**：能明确写出一句由该数据回答的具体业务问题（如“用户在结算链路的哪一步流失最多？”；写不出业务问题则不埋）。
2. **消费主体与时效 (Audience & Cadence)**：有明确的数据消费者（产品/增长/运营）与固定的分析决策周期（日/周/迭代复盘；无固定读者则无价值）。
3. **决策动作闭环 (If-Then-Else)**：数值变化能明确触发分叉行动（如“若漏斗转化率 < 40%，则启动结账简化 A/B 测试；若 > 60%，则维持现状推进下个模块”；写不出动作分叉属于纯好奇心，不埋）。
4. **不可替代性 (Non-derivability)**：无法通过服务端数据库关联查询或现有埋点属性聚合得出。

## 3. 架构设计与命名体系规范 (Taxonomy & Naming Conventions)

### Object-Action 命名范式
统一采用 **`名词_动词过去式`**（全小写下划线 snake_case），严禁纯 UI 动作命名：
- ✅ **正确范式**：`order_submitted`, `checkout_completed`, `file_exported`, `invite_sent`, `page_rendered`
- ❌ **错误反模式**：`btn_click_1`, `click_confirm`, `submit_order_btn`, `userClick`

### Event 与 Properties 严格切分铁律
- **Event Name（事件名）**：仅代表**业务状态机的一次确定性跃迁或漏斗阶段**（如 `sign_up_completed`）。
- **Properties（事件属性）**：承载该跃迁的**上下文、渠道、来源、环境与细分维度**。
- **严禁枚举式事件爆炸**：
  - ❌ 错误：分别定义 `sign_up_with_google`, `sign_up_with_github`, `sign_up_with_email`
  - ✅ 正确：定义一个 `sign_up_completed` 事件，附带属性 `{ method: 'google' | 'github' | 'email' }`

### 通用核心上下文属性 (Global Context Properties)
每个事件应按需透传标准化全局属性：
- `user_id` / `anonymous_id`（用户唯一标识）
- `timestamp`（毫秒级 UTC 时间戳）
- `session_id`（会话 ID）
- `source_page` / `source_component`（触发来源）
- `app_version` / `environment`（客户端版本与环境）

## 4. 上报端职责与权威分流 (Client vs. Server Authority)

| 上报端 | 核心职责 | 典型事件示例 |
| :--- | :--- | :--- |
| **客户端上报 (Client-side)** | 捕获用户意图、视口可见性、表单交互摩擦与中途放弃点。 | `page_viewed`, `search_query_submitted`, `form_field_blurred`, `error_banner_shown` |
| **服务端上报 (Server-side)** | 捕获核心业务状态机跃迁、资产扣减、权限变更与异步任务终态（防网络断流、防篡改、保证单点权威）。 | `payment_succeeded`, `subscription_renewed`, `order_cancelled`, `async_job_finished` |

## 5. 信号与噪声对照表 (Signal vs. Noise)

| 信号分类 | 高价值信号 (Keep & Implement) | 噪声模式 (Reject & Eliminate) |
| :--- | :--- | :--- |
| **价值到达** | 用户成功获得核心承诺的最终结果（如 `video_export_succeeded`）。 | 仅仅点击了“导出”按钮但底层未开始或未完成。 |
| **漏斗断点** | 关键流程进入、步骤推进、关键校验拦截与最终放弃。 | 纯视觉上的 Tab 悬浮 (Hover) 或无业务意义的滚动距离。 |
| **高意图探索** | 深度搜索、高级筛选应用、收藏、分享、导出等强需求动作。 | 页面空白区域的无效点击与普通展开折叠。 |
| **异常与摩擦** | 表单校验阻断原因、支付失败错误码、网络重试。 | 前端组件内部生命周期日志与临时渲染状态。 |

## 6. Tracking Plan 输出交付模板

交付埋点方案或审查意见时，按以下结构化格式输出：

### Tracking Plan 标准表格
| 事件名 (Event Name) | 触发时机 (Trigger Condition) | 上报端 | 核心属性 (Properties) | 回答的业务问题 | 驱动的决策动作 (If-Then-Else) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `checkout_started` | 用户点击“去结算”且通过前置校验时 | Client | `cart_item_count`, `total_amount`, `currency` | 多少人有意愿结账？ | 衡量购买意向基线。 |
| `payment_succeeded` | 支付网关 Webhook 回调确认扣款成功时 | Server | `order_id`, `payment_method`, `amount`, `plan_id` | 实际成单率与真实收入？ | < 5% 启动渠道支付成功率排查与路由优化。 |
| `checkout_aborted` | 用户离开结账页或关闭支付弹窗时 | Client | `step_index`, `dwell_time_ms`, `last_filled_field` | 用户卡在结算哪一步？ | 若特定字段流失 > 30%，则简化或延迟该字段采集。 |

### 审查意见输出格式
```text
- [保留 / 剔除 / 重构] [事件名 / 属性名]
  - 当前问题：[如：命名为纯 UI 动作 / 事件枚举爆炸 / 客户端假性成功 / 缺乏决策闭环]
  - 处置建议：[重命名为 Object-Action / 收敛为 Properties / 迁移至服务端上报 / 彻底删除]
  - 决策价值：[该项调整如何降低数据仓库负债并支持真实业务分析]
```

