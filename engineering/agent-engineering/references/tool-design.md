# AI Agent Tool Design 实战指南

设计让模型容易选择、正确调用、无歧义理解结果并能从失败中确定性恢复的 Tool Contract。Tool Surface 是模型与业务系统之间的防腐隔离带，以模型实际可见的 `name`、`description`、`parameters schema` 和 `result payload` 为准。

---

## 1. 核心心智模型与经验法则 (Rules of Thumb)

- **错误指令化原则（Instructions over Error Codes）**：
  - **Tool Result 本质是下一轮模型的输入 Context**。对 Agent 而言，可执行的自然语言指令价值远大于结构化错误码；
  - 严禁仅返回冰冷的 `403 Forbidden` 或 `INVALID_ARGUMENT`；服务端必须在报错中追加具体的行动指引（如：*“缺少商品 ID，请先调用 search_products 获取有效 product_id 后再次查询”*）。
- **工具边界止步于系统（Call, Don't Reimplement）**：
  - **Agent Tool 绝不能沦为业务缺失逻辑的临时胶水层**。严禁在 Tool 代码内部自行拼凑业务（如自写循环比对库存、自算运费规则、自写替代品算法）；
  - Tool 的职责是直接调用后端成熟的业务接口，返回的结果应当已经是后端系统排好序、聚合好的（Already-Ranked）；后端若缺逻辑，必须在上游补齐聚合接口，而非在 Tool 内堆砌业务私货。
- **推理无关字段彻底剪枝（Prune Reasoning-Irrelevant Fields）**：
  - 严格只返回模型参与逻辑推理必需的字段，剔除所有仅供展示或排版的大字段（典型的罪魁祸首如：商品列表中每条记录的图片 URL、装饰性 CSS 样式）；展示端如需渲染图片，由前端根据服务端下发的实体 ID 异步拼装。
- **UI 组件即工具（Components as Tools）**：
  - 严禁让模型在 Markdown 文本中输出自定义 XML/HTML 标签（如 `<card id="123">`），遵循率极差；前端可交互组件必须直接建模为工具调用。
- **视觉上下文镜像法则（Visual Context Mirroring）**：
  - **展示工具的入参结构必须完全镜像客户端屏幕渲染的物理视觉树（如行与轮播组）**。只有让参数结构与屏幕视觉物理对齐，模型在下一轮对话中面对用户的空间指代（“第二排左边那家”、“轮播里的第 3 个”）时，才能精准映射！
- **分级检索原则（Search Summary vs. Detail Get）**：
  - 搜索/列表工具只返回轻量摘要（ID、标题、核心匹配属性），详情工具只接受明确的 ID 并返回深度属性。
- **感知延迟工程（Perceived Latency Engineering via Streamed Execution）**：
  - 复杂展示工具调用的参数生成往往耗时数秒。通过流水线化（Pipelining）与参数级流式声明（Eager Streaming），消费端在模型吐出首个字段/元素时即可提前启动预处理或骨架屏渲染，大幅压降端到端感知等待时间。

---

## 2. 常见反模式与失败根因 (Anti-Patterns)

### 反模式 1：哑巴错误与代码堆砌 (The Code-Only Error)
* **错误做法**：执行失败时仅返回 `{"status": 403, "code": "PERMISSION_DENIED"}`。
* **失败根因**：
  - 模型不知道是参数填错了、网络超时了、会话状态不符、还是缺少了哪个前置 ID；
  - 模型只能采取无休止的“盲目原地重试”或胡乱编造参数，迅速耗尽重试配额并报错挂死。
* **正确做法**：提供带动作建议的指令式错误：`{"error": "FORBIDDEN", "instruction": "当前用户未绑定手机号，无法直接提交；请引导用户调用 bind_phone 或询问用户意向。"}`。

### 反模式 2：Tool 沦为业务补丁胶水层 (The Kitchen-Sink Glue Tool)
* **错误做法**：在 `check_availability` 工具内部同时串联调用商品目录、5 家门店库存服务、物流时效服务，并在 Tool 代码里自写 100 行替换推荐逻辑。
* **失败根因**：
  - Tool 承载了海量领域知识，极易与真实业务规则脱节且难以维护；
  - Tool 执行耗时随多远程调用线性叠加，极易超时崩溃。

### 反模式 3：扁平列表重排导致空间指代漂移 (Spatial Reference Drift)
* **错误做法**：查询酒店工具仅返回无序平铺数组 `[{id: "h1"}, {id: "h2"}, {id: "h3"}, {id: "h4"}]`，前端自行用 CSS 2x2 网格渲染。
* **失败根因**：
  - 用户下一轮说：*“帮我预订第二排第一个”*；
  - 模型的上下文历史里只有扁平数组，根本不知道前端具体把哪家酒店折行到了“第二排第一个”，必然发生致命张冠李戴。

### 反模式 4：大宽表全量倾倒 (Context Flooding)
* **错误做法**：`search_products` 直接将数据库整行的 40 个内部字段（包含图片完整大 URL、创建时间戳、内部算法分、供应商税号）原样序列化给模型。
* **失败根因**：
  - 检索 5 个商品就消耗 8,000 tokens；
  - 噪音字段严重干扰模型推理，引发对无关字段的胡乱推测。

---

## 3. 工业级标准实现与模板 (Production Patterns)

### 3.1 视觉上下文镜像展示工具 Schema 示例

```json
{
  "name": "present_hotel_recommendations",
  "description": "向用户屏幕展示分组酒店推荐卡片。参数的 rows 排布必须与用户屏幕渲染的行次序完全一致，以便在多轮对话中理解用户的空间指代（如'第二排左边那个'）。",
  "eager_input_streaming": true,
  "parameters": {
    "type": "object",
    "properties": {
      "summary_banner": {
        "type": "string",
        "description": "向用户简要陈述推荐理由（如：为您筛选出临近海滩且评分4.8以上的选项）"
      },
      "rows": {
        "type": "array",
        "description": "屏幕上的推荐行。每行包含 2 个并排展示的酒店卡片",
        "items": {
          "type": "object",
          "properties": {
            "row_title": { "type": "string", "description": "如：经济实惠 / 奢华海景" },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "hotel_id": { "type": "string", "description": "服务端签发的有效酒店ID" },
                  "display_name": { "type": "string" },
                  "price_per_night": { "type": "string" },
                  "highlight_tag": { "type": "string" }
                },
                "required": ["hotel_id", "display_name", "price_per_night"]
              }
            }
          },
          "required": ["items"]
        }
      }
    },
    "required": ["summary_banner", "rows"]
  }
}
```

### 3.2 工业级指令式 Actionable Error Contract 模板

工具执行失败时，必须向模型返回具有自然语言行动指南的结构化 Payload：

```json
{
  "status": "failed",
  "error_code": "RESOURCE_CONFLICT",
  "retryable": false,
  "instruction": "所选座位 [12A] 刚刚已被其他用户锁定。请先调用 get_seat_map 获取最新可用座位分布，或向用户主动推荐相邻空位 [12B] / [12C]。",
  "conflict_details": {
    "resource_type": "seat",
    "conflicting_value": "12A",
    "alternative_suggestions": ["12B", "12C"]
  }
}
```

---

## 4. 核心工程机制：感知延迟优化与流水线调度 (Perceived Latency & Pipelining)

> [!TIP]
> **压降延迟的本质：从「实际总延迟」走向「感知延迟流水线化」**
> - **为什么重要**：模型生成一个结构复杂的 Tool Arguments（如包含多卡片排版的展示工具）通常需要消耗数百个 Output Token，耗时 2~5 秒。如果等到整个 JSON 完全吐完才通知消费端，用户就会面临长达数秒的“白屏卡顿”。
> - **抽象机制**：
>   1. **参数级流式（Eager Streaming）**：在协议层支持参数 token 流式解析。当模型刚刚吐出 `summary_banner` 或第 1 行推荐时，前端消费层即可立即启动骨架屏与首卡片渲染；
>   2. **下游流水线预派发（Eager Dispatching）**：对于包含多步串联的工具，前序参数确定时即可异步预热下游依赖资源（如提前验证库存或准备网络连接），将模型的推理耗时与系统的 I/O 耗时充分重叠（Overlap）。
> - **梯度裁剪**：高动态卡片流与富 UI 展示场景必须启用流水线化以降低感知延迟；对于短平快的单参数查询或确定性 CLI 工具，则保持标准一次性反序列化，避免增加不必要的解析复杂度。

---

## 5. 落地核验清单 (Checklist)

- [ ] **错误指令化**：工具错误响应是否包含了具体的自然语言操作指引（`instruction`），而非仅抛出纯错误码？
- [ ] **系统边界纯净**：Tool 是否只调用上游已就绪的成熟服务，未在内部手工拼接多服务业务规则？
- [ ] **推理字段去噪**：返回给模型的 JSON 中是否已剔除图片 URL、长文本样式等与模型推理无关的冗余字段？
- [ ] **视觉树镜像**：前端存在多列/网格布局时，展示类 Tool 入参是否已设计为与排版镜像的嵌套结构？
- [ ] **读写分离与分级**：搜索列表工具是否只返回轻量摘要？详情工具是否独立并按 ID 读取？
- [ ] **感知延迟工程**：长输出展示工具是否通过分块/流式支持了首屏或骨架屏的提前渲染？
