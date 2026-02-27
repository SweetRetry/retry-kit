# Tool Use 描述写法

**范围说明**：本文档聚焦于如何在 System Prompt 中编写高质量的工具定义（Tool Definition），使模型能准确识别何时调用哪个工具，以及如何正确传参。不覆盖 function calling 的运行时编排逻辑。

## 目录

- [工具定义的四个质量维度](#工具定义的四个质量维度)
- [name：命名规范](#name命名规范)
- [description：描述写法](#description描述写法)
- [parameters：参数设计](#parameters参数设计)
- [多工具场景：避免选择稀释](#多工具场景避免选择稀释)
- [工具定义自检清单](#工具定义自检清单)

---

## 工具定义的四个质量维度

模型调用工具时，依赖以下信息做决策：

| 维度 | 模型用它来做什么 | 常见问题 |
|------|-----------------|----------|
| `name` | 识别工具身份，快速分类 | 名字太泛（`process`、`handle`）或太长 |
| `description` | 判断"什么时候该用这个工具" | 只描述功能，不描述触发场景 |
| `parameters.description` | 理解每个参数的含义和约束 | 缺少类型、范围、示例值 |
| 工具间边界 | 多工具时选择正确工具 | 多个工具描述重叠，导致随机选择 |

---

## name：命名规范

### 格式

使用 `snake_case`，动词 + 名词结构，清晰表达工具动作：

| 好的命名 | 差的命名 | 问题 |
|----------|----------|------|
| `search_knowledge_base` | `search` | 太泛，不知道搜什么 |
| `send_email` | `email_tool` | `_tool` 后缀无意义 |
| `get_user_orders` | `getUserOrders` | 使用了驼峰命名 |
| `create_calendar_event` | `process_request` | 完全不表意 |
| `calculate_shipping_fee` | `calc` | 缩写降低可读性 |

### 命名原则

- 动词精确化：`get`（只读）、`search`（模糊查询）、`create`（新建）、`update`（修改）、`delete`（删除）、`send`（触发外部动作）
- 名词具体化：不用 `data`、`info`、`item`，用 `user_profile`、`order_detail`、`invoice`
- 长度上限：建议不超过 4 个单词（`get_product_inventory_by_sku` → `get_inventory`）

---

## description：描述写法

### 三段式结构

一个高质量的工具 description 包含三个部分：

```
[做什么] + [何时用] + [不适用场景（可选）]
```

示例对比：

**差的 description**：
```
"搜索数据库中的产品信息"
```
问题：只描述功能，不说触发条件，也不说边界。

**好的 description**：
```
"在产品目录数据库中按关键词或 SKU 搜索商品信息，返回名称、价格、库存量。
适用于：用户询问某个具体商品是否有货、价格是多少、规格参数等。
不适用于：搜索订单历史（用 get_order_history）或用户账号信息（用 get_user_profile）。"
```

### 触发场景描述技巧

明确列出触发这个工具的用户意图或输入特征：

```
"当用户询问天气预报、当前气温或未来几天的天气情况时调用此工具。
输入关键词：天气、气温、下雨、晴天、预报等。"
```

### 边界声明

当有多个功能相似的工具时，在 description 中明确区分边界：

```
# 工具 A
"查询已完成订单的历史记录和状态。
注意：仅用于已完成或已取消的订单，进行中的订单使用 get_active_order。"

# 工具 B
"查询当前正在处理的订单实时状态。
注意：仅用于状态为 processing/shipped 的订单，历史订单使用 get_order_history。"
```

---

## parameters：参数设计

### 每个参数必须包含

```json
{
  "name": "参数名（snake_case）",
  "type": "string | number | boolean | array | object",
  "description": "参数含义 + 约束条件 + 示例值",
  "required": true/false
}
```

### description 写法标准

参数 description 必须同时包含：**含义** + **约束** + **示例**

| 元素 | 差的写法 | 好的写法 |
|------|----------|----------|
| 含义 | `"日期"` | `"查询的目标日期"` |
| 约束 | （缺失） | `"格式：YYYY-MM-DD"` |
| 示例 | （缺失） | `"例如：2024-01-15"` |
| 完整 | `"日期"` | `"查询的目标日期，格式 YYYY-MM-DD，例如：2024-01-15"` |

### 枚举值处理

当参数只接受固定选项时，在 description 中列出所有合法值：

```json
{
  "name": "order_status",
  "type": "string",
  "description": "筛选订单状态。合法值：pending（待支付）、processing（处理中）、shipped（已发货）、completed（已完成）、cancelled（已取消）"
}
```

### 可选参数的默认行为

对于非必填参数，描述缺省时的行为：

```json
{
  "name": "page_size",
  "type": "number",
  "description": "每页返回的结果数量，范围 1-100，默认 20。省略时返回前 20 条结果。",
  "required": false
}
```

---

## 多工具场景：避免选择稀释

### 什么是选择稀释

当工具数量超过 10 个，或多个工具的 description 存在语义重叠时，模型的选择准确率会下降——这被称为"工具选择稀释"。

### 缓解策略

**策略一：工具分组声明**

在 System Prompt 的 `<context>` 中对工具进行逻辑分组，帮助模型先缩小范围再精选：

```xml
<context>
可用工具分类：
- 数据查询类：search_products, get_order, get_user_profile
- 操作执行类：create_order, update_cart, send_notification
- 外部服务类：get_weather, translate_text, convert_currency
</context>
```

**策略二：工具选择指导**

在 `<task>` 中给出工具选择的决策树：

```xml
<task>
执行用户请求时，按以下顺序判断调用哪个工具：
1. 如果用户询问商品信息 → search_products
2. 如果用户询问订单状态 → get_order
3. 如果用户要修改购物车 → update_cart
4. 以上都不符合 → 直接回答，不调用工具
</task>
```

**策略三：精简工具集**

单次对话中暴露给模型的工具数建议不超过 15 个。如果工具更多，按用户意图动态注入相关工具子集，而非一次性全部传入。

---

## 工具定义自检清单

- [ ] 所有工具名是否使用 `snake_case` + 动词开头？
- [ ] 每个工具 description 是否包含"何时用"（触发场景），而非只描述功能？
- [ ] 功能相似的工具是否在 description 中明确声明了彼此的边界？
- [ ] 每个参数 description 是否包含：含义 + 约束（类型/范围/格式）+ 示例值？
- [ ] 枚举类参数是否列出了所有合法值及其含义？
- [ ] 可选参数是否说明了缺省时的默认行为？
- [ ] 如果工具超过 8 个，是否在 System Prompt 中对工具进行了分组声明？
