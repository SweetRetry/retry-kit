---
name: product-value-validation
description: "Analyze whether end users will discover clear value in product ideas. Use when discussing product concepts, evaluating features, analyzing user adoption, or when users express uncertainty about product direction. 适用于：讨论产品概念、评估功能、分析用户采用问题，或当用户对产品方向不确定时（例如：'evaluate this product idea', 'will users adopt this', '这个想法好吗？', '用户会想要这个吗？', '为什么用户不留下来？'）。"
---

# Product Value Validation

Analytical framework for evaluating whether end users can **know** what value they'll achieve through a product — even if that value takes time.

**Core insight**: End users adopt products when they can articulate what they'll achieve. If they can't explain why they're using it, they won't use it — no matter how good the product is.

**Key terminology**:
- **User**: The person using this skill (product creator, PM, designer, entrepreneur)
- **End user**: The person who will use the product being discussed
- **Value**: Outcomes end users achieve (identity, financial gain, capability, time savings, etc.)
- **Features**: The product's technical capabilities — features are NOT value

**Output language**: Follow user's language. Framework terms (Value Clarity, Value Timeline, Value Perception, Value Discovery, Go/Refine/Pivot/Rethink) always remain in English regardless of output language.

---

## I. Product Type Gate

**在执行诊断 SOP 之前，先判断产品原型。** 原型决定 litmus test 的表述方式和可参考案例范围。

| 原型 | 典型产品 | "End user" 定义 | Litmus test 调整 |
|------|----------|-----------------|------------------|
| **A — 消费者产品** | 社交、内容、工具 App | 产品的直接使用者 | 标准 litmus（见各维度） |
| **B — 开发者工具 / API / SDK** | API、CLI、SDK、框架 | 集成方开发者（同时是用户和 end user） | 将"5个目标用户"改为"5个集成方开发者"；问题改为"用了这个 API/SDK，你的应用能做到什么原来做不到的事？" |
| **C — 企业 / 内部平台** | B2B SaaS、内网工具 | 具体使用角色（运营、销售、工程师）| 将"截图给朋友"改为"给决策者展示数据大盘或工单完成率"；timeline 可接受更长周期（3-6 个月） |

**如果原型为 B 或 C**，anti-pattern #1 (Consumer Lens Bias) 自动生效 — Instagram / Netflix 等消费者案例不适用，须在 Section VIII 研究硬约束中用 WebSearch 查找同领域案例。

---

## II. 适用范围边界

**本 skill 适用于假设阶段的产品分析。** 在执行诊断 SOP 之前，先判断是否满足适用条件。

| 情境 | 适用？ | 处理方式 |
|------|--------|----------|
| 产品概念 / 新功能验证 | ✅ 完全适用 | 正常执行四维分析 |
| 已上线但缺乏数据（< 100 真实用户） | ✅ 适用 | 正常执行，标注"假设待数据验证" |
| 已有留存/转化数据但无数据解读 | ⚠️ 部分适用 | 先引导用户解读数据再做框架分析；数据结论优先于假设 |
| 有完整 cohort / A/B 数据，需要洞察 | ❌ 不适用 | 明确告知：**本 skill 是假设验证框架，不是数据分析工具**。建议转为数据驱动分析：定位留存断崖点（第几天流失）→ 分析断崖前用户行为 → 找到 value gap |
| 产品已验证，需要增长策略 | ❌ 不适用 | 价值已被验证，问题在分发和转化，本 skill 不覆盖增长渠道分析 |

---

## III. 诊断 SOP

**以下 4 问用于锚定分析方向。** 从用户输入中推断能推断的，仅追问无法推断的关键项（最多 2 问）。推断项必须在分析中标注依据。

### 问题 1：产品核心承诺

> 你的产品帮助用户实现什么？用一句话说清楚。

如果用户说不清楚 → 这本身就是最大的 Value Clarity 问题，直接标记。

### 问题 2：目标用户画像

> 谁是你的核心用户？他们在什么场景下使用？

- **B2C 大众** — 需要即时理解价值，耐心极低
- **B2B 专业用户** — 可接受学习成本，但决策链长
- **开发者** — 重文档和上手体验，社区口碑驱动
- **创作者** — 重身份认同和作品展示

### 问题 3：竞争环境

> 用户现在怎么解决这个问题？有没有替代品？

- **无替代品** — 价值发现是核心挑战（用户不知道自己需要这个）
- **有免费替代品** — 必须有明确差异化价值（Quibi vs YouTube 的教训）
- **有付费替代品** — 需要更清晰的价值表达或更低的门槛

### 问题 4：分析触发原因

> 什么让你想做这个分析？

- **新产品验证** → 侧重 Value Clarity + Discovery
- **用户不留存** → 侧重 Value Timeline + Perception
- **转化率低** → 侧重 Value Clarity + Perception
- **不确定方向** → 完整四维分析

### 诊断决策表

| 触发原因 | 重点维度 | 典型行动 |
|----------|----------|----------|
| 新产品验证 | Clarity + Discovery | 验证用户能否一句话说清价值 |
| 用户不留存 | Timeline + Perception | 检查价值兑现节奏和可见性 |
| 转化率低 | Clarity + Perception | 检查价值传达方式 |
| 不确定方向 | 全维度均衡 | 识别最大风险点 |

---

## IV. 分析框架

### 分析深度与信号冲突规则

**深度切换阈值**：用户输入包含产品名称 + 目标用户 + 至少一个使用场景 → 展开完整推理链和案例对比；否则 → 给出简要判断并在每个维度末尾标注 `[假设: ...]`。诊断指示的重点维度优先展开。

**维度内信号冲突规则**：若同一维度内存在 ≥2 个相互矛盾的信号（例如价值及时但无中间反馈），统一赋予 🟡，并在分析块中明确写出冲突：`[信号冲突: A 指向 🟢，B 指向 🔴，综合判定 🟡]`。不得在指派 indicator 之后再修改，禁止用 indicator 倒推分析。

每个维度的分析包含：(1) 🔴🟡🟢 状态判定，(2) 分析推理，(3) 案例对比（重点维度），(4) 尖锐问题。

### 1. Value Clarity

**Examine**: Can end users articulate what they'll achieve — outcomes, not features?

**Analysis method**: Ask "What would an end user say when asked 'Why are you using this?'" If the answer is feature-focused ("because it has X"), the value proposition needs work.

| 🟢 Clear | 🟡 Partial | 🔴 Unclear |
|---|---|---|
| End users describe outcomes ("I can access my files from any device") | Describe category/purpose but not personal outcomes | Describe features/technical capabilities |
| Can state in one sentence what they'll achieve | Can explain what product does, not what they'll achieve | Cannot state expected outcomes |
| | **Signal**: "It's a project management tool" (category, not personal outcome) | |

**Litmus test**: 想象 5 个目标用户被问 "这个产品帮你实现什么？"——回答含个人成果词（"我能..."）→ 🟢；含品类词但无个人成果（"它是一个...工具"）→ 🟡；含功能词或说不清（"它有...功能" / "不确定"）→ 🔴。

**Case contrast**: Dropbox "access files from any device" (outcome, 🟢) vs Google Wave "unified communication" (abstract, 🔴 — shut down 14 months after launch). See [references/real-cases.md](references/real-cases.md).

### 2. Value Timeline

**Examine**: Is value immediate or delayed? If delayed, do end users know it's coming?

**Analysis method**: Identify the primary value timeline. Assess whether it matches end users' expectations. Both short-term and long-term are valid — neither is inherently superior.

- **Short-term**: Dropbox (< 5 min), Zoom (< 30 sec) — immediate value IS the product
- **Long-term**: Duolingo (6-12 months), fitness apps (3-6 months) — end users commit to the journey
- **Hybrid**: Long-term goal + short-term touchpoints (XP, streaks, milestones)

| 🟢 Aligned | 🟡 Gap | 🔴 Conflict |
|---|---|---|
| Value timing matches end user expectations | Gap between expected and actual realization time | End users don't know when or how value arrives |
| Long-term: end users understand and commit | End users may disengage before value realized | No engagement mechanism during wait |
| | **Signal**: Product promises "weeks to see results" but provides no interim milestones | |

**Litmus test**: 用户注册后第一次使用，能否在产品承诺的时间框架内看到进展信号？短期产品：5 分钟内获得完整价值 → 🟢；长期产品：首次使用即可看到进度指示（进度条、里程碑）→ 🟢；有延迟但无任何中间反馈 → 🟡；用户完全不知道价值何时到来 → 🔴。

### 3. Value Perception

**Examine**: Can end users see/feel what they achieved? Can they show others?

**Analysis method**: Identify what end users can point to and say "I achieved this." "Perceivable" differs by type: UI feedback (consumer), dashboards (enterprise), build outputs (developer tools).

| 🟢 Tangible | 🟡 Partial | 🔴 Invisible |
|---|---|---|
| Concrete evidence: file appears, photo with likes, contribution graph | Some aspects visible, others abstract | "Your data is synced", "security improved" — nothing to point to |
| Can show others what they've achieved | Need to interpret or infer value | Cannot demonstrate progress |
| | **Signal**: Dashboard shows metrics but end users can't explain what the numbers mean for them | |

**Litmus test**: 用户能否截图/录屏向朋友展示 "看，我用这个做到了___"？能指向具体产出物 → 🟢；能看到数字/图表但需要解释才懂 → 🟡；只有系统通知或无任何可见证据 → 🔴。

### 4. Value Discovery

**Examine**: Do end users already know they want this, or must they discover it through use?

**Analysis method**: Determine the discovery path. If end users need to discover value, identify the fastest route to the "aha" moment.

| 🟢 Natural | 🟡 Guided | 🔴 Blocked |
|---|---|---|
| Already know they want this, or reach "aha" within minutes | Need guidance/tutorials to recognize value | Require significant time/learning; likely churn first |
| Value apparent without explanation | Path not immediately obvious | No clear discovery mechanism |
| | **Signal**: Onboarding tutorial exists but end users skip it and still don't understand the value | |

**Litmus test**: 新用户不看任何教程，能否在 3 分钟内触达 "aha moment"？自然触达 → 🟢；需要引导但引导有效 → 🟡；需要大量学习投入或引导后仍不理解 → 🔴。

**Case contrast**: Instagram — end users came for "share photos", discovered "become a photographer" (identity). Discovery through filters + likes + followers, not marketing.

**Scoring notes**: Context determines judgment — same situation may warrant different indicators in different markets. Apply the signal conflict rule above before assigning any indicator.

---

## V. 判定与行动建议

分析完四个维度后，给出综合判定。

### 判定矩阵

| 综合状况 | 判定 | 行动方向 |
|----------|------|----------|
| 多数 🟢，无 🔴 | **Go** — 价值路径清晰 | 保持当前方向，关注执行细节 |
| 有 🟡，无 🔴 | **Refine** — 方向正确但需打磨 | 针对 🟡 维度给出具体改进方案 |
| 有 1 个 🔴 | **Pivot** — 存在关键阻断 | 🔴 维度必须先解决，否则其他维度的努力都会被浪费 |
| 多数 🔴 | **Rethink** — 价值假设需要重新验证 | 回到用户研究，重新验证核心假设 |

**维度权重规则**:
- **Value Clarity 🔴 = 自动 Pivot**，不论其他维度状态。用户说不清价值是根本性问题，其他维度的优化无法弥补。
- 其余三维度等权，按多数 indicator 判定。
- 当 🟡 和 🔴 数量相同（如 2🟡2🔴）时，按以下优先级决策：
  1. 查诊断决策表中触发原因对应的重点维度：重点维度含 🔴 → **Pivot**；重点维度仅 🟡 → **Refine**。
  2. 若触发原因为"不确定方向"（全维度均衡，无重点维度），或重点维度恰好不在平局的维度中 → 默认 **Pivot**（保守原则：存在 🔴 即视为关键阻断）。

### 行动建议分类

每个非 🟢 维度必须附带具体的行动建议，分类如下：

| 类型 | 适用场景 | 示例 |
|------|----------|------|
| **重新定位** | Value Clarity 🔴 — 用户说不清价值 | 将 "cloud storage" 改为 "access files from any device" |
| **设计可见性** | Value Perception 🔴/🟡 — 价值不可见 | 添加进度仪表盘、成就系统、before/after 对比 |
| **调整节奏** | Value Timeline 🟡 — 价值兑现太慢 | 在长期目标前插入短期里程碑 |
| **缩短发现路径** | Value Discovery 🟡/🔴 — "aha" 时刻来得太晚 | 简化 onboarding，让用户 2 分钟内体验核心价值 |
| **差异化** | 竞争环境下价值不突出 | 明确 "为什么不用 [替代品]" 的答案 |
| **验证** | 任何 🔴 维度 — 需确认问题真实性 | 5 秒测试：让 5 个目标用户看产品描述，问"这是做什么的"；3/5 答不上来则确认 Clarity 🔴 |

---

## VI. 输出格式

### Analysis

```
## Value Realization Analysis: [Product Name]

**诊断摘要**: [核心承诺] · [用户画像] · [竞争环境] · [触发原因]

### 1. Value Clarity 🟢/🟡/🔴
[Status → Reasoning → Analysis → Case reference → Sharp questions]
**Action**: [具体行动建议，如无问题则 "N/A"]

### 2. Value Timeline 🟢/🟡/🔴
[Same structure]
**Action**: [...]

### 3. Value Perception 🟢/🟡/🔴
[Same structure]
**Action**: [...]

### 4. Value Discovery 🟢/🟡/🔴
[Same structure]
**Action**: [...]

### 综合判定
**判定**: [Go / Refine / Pivot / Rethink]
**优先行动**: [按优先级排列的 1-3 个行动建议]
**决策指引**: [帮助用户做下一步决策的建议]
```

### Worked Example (calibration anchor)

The following condensed analysis shows the expected depth and format for a product with sufficient context. Use this as a reference for output quality — do not copy phrasing.

---

**Product**: MyFitnessPal · **原型**: A (消费者产品) · **触发原因**: 用户不留存 · **竞争环境**: 有免费替代品（Apple Health、手动记录）

**诊断摘要**: 帮助用户追踪卡路里以实现减重目标 · B2C 大众 · 有免费替代品 · 留存问题

**Value Clarity 🟢** — 用户能一句话说清："我用它记录吃了什么，控制体重。" 目标（减重）和手段（卡路里追踪）均清晰，无需解释品类。**Action**: N/A

**Value Timeline 🟡** — 减重效果需 4-12 周，远长于用户每日追踪的即时反馈。产品提供每日卡路里数字和进度条，但未提供"按当前节奏，N 天后可达目标体重"的预测里程碑，导致长期承诺感不足。[信号冲突：有短期数字反馈 → 🟢，但无中期预测里程碑 → 🔴，综合判定 🟡] **Action**: 调整节奏 — 在 Dashboard 增加"按当前趋势，预计 X 周达到目标"的动态预测，将抽象长期目标转为可感知的进度信号。

**Value Perception 🟢** — 每日卡路里数字、营养图表、周趋势线均可截图，用户可指向具体数字说"我今天控制在 1800 卡以内"。**Action**: N/A

**Value Discovery 🟢** — 用户进入产品时已知道自己想减重，追踪是被理解的手段，无需发现价值，直接上手。**Action**: N/A

**综合判定**: **Refine** — Clarity / Perception / Discovery 均 🟢，Timeline 🟡。**优先行动**: 添加动态预测里程碑（Timeline），减少用户在"看不到终点"时的流失。

---

### Comparison

When user compares options, asks "should I do X", or needs to choose between directions:

```
## Value Comparison: [Option A] vs [Option B]

**诊断摘要**: [共享的用户画像 · 竞争环境]

| Dimension | Option A | Option B |
|---|---|---|
| Value Clarity | 🟢/🟡/🔴 [one sentence] | 🟢/🟡/🔴 [one sentence] |
| Value Timeline | 🟢/🟡/🔴 [one sentence] | 🟢/🟡/🔴 [one sentence] |
| Value Perception | 🟢/🟡/🔴 [one sentence] | 🟢/🟡/🔴 [one sentence] |
| Value Discovery | 🟢/🟡/🔴 [one sentence] | 🟢/🟡/🔴 [one sentence] |

**推荐**: [Option X] — [one sentence reasoning]
**关键差异**: [the one dimension that most differentiates the options]
```

---

## VII. 分析反模式

使用此 skill 分析时应避免的错误：

| # | 反模式 | 症状 | 修复 |
|---|--------|------|------|
| 1 | **Consumer Lens Bias** — 用 B2C 案例套 B2B 产品 | 引用 Instagram 的身份转变分析开发者工具 | 先评估案例适用性，不匹配时搜索同领域案例 |
| 2 | **Feature-Value Confusion** — 把功能列表当成价值分析 | 分析变成功能清单而非用户成果描述 | 每个"价值"都必须以"用户获得了..."开头 |
| 3 | **Gamification Reflex** — 遇到留存问题就建议加积分/勋章 | 不分青红皂白推荐游戏化机制 | 先判断产品性质，纯工具类不需要游戏化 |
| 4 | **Indicator Shopping** — 先定结论再找证据 | 分析推理为结论服务而非为发现服务 | 先完成分析，再给 indicator |
| 5 | **Skipping Analysis** — 跳过分析直接提问 | 每个维度只有问题没有分析 | 必须先完成系统分析，再提问 |

---

## VIII. 研究硬约束

- 引用产品案例必须基于可验证信息，标注数据来源
- [references/real-cases.md](references/real-cases.md) 中的案例是模式示例而非通用规则 — 使用前必须评估产品类型、市场、用户行为的匹配度
- **案例数据时效性**：[real-cases.md](references/real-cases.md) 中的指标数据截止于 2023 年前后。引用具体数字时，在括号内标注数据年份，例如"GitHub 100M+ 开发者 (2023)"。若分析依赖用户规模或市场地位等时效性强的数据，用 WebSearch 验证最新状态。
- 案例不匹配时，用 WebSearch 搜索同领域可比产品，不要硬套
- 探索性思考（头脑风暴价值类型）和证据性分析（声称具体模式）必须区分

---

## IX. 参考索引

| 文件 | 内容 | 何时加载 |
|------|------|----------|
| [real-cases.md](references/real-cases.md) | 15 个产品案例（含 B2B：Stripe, Figma, Salesforce, Linear；消费者：Dropbox, Instagram, Duolingo, WeChat, GitHub, Notion, MyFitnessPal, Netflix, Slack；失败案例：Google Wave, Quibi）含定量数据（截止 2023） | 需要案例对比或数据支撑时 |
| Section VI Worked Example | MyFitnessPal 完整分析样本，展示输出深度和信号冲突写法 | 校准输出格式和分析详细程度时 |

## X. References 读取门禁

### 读取条件

1. 只做框架性分析、不引用具体案例或数字：可不读取 [real-cases.md](references/real-cases.md)。
2. 任何涉及案例对比、行业 benchmark、用户规模或时效性数据的结论：必须读取 [real-cases.md](references/real-cases.md)，并在必要时做 WebSearch 更新验证。

### 最低读取量

1. 至少提取 1 个同赛道正例 + 1 个可对照反例（或失败案例）
2. 明确标注数据年份；若年份超过 18 个月且会影响结论，必须标注“待验证”或补充 WebSearch
