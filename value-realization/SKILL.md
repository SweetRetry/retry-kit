---
name: value-realization
description: "Analyze whether end users will discover clear value in product ideas. Use when discussing product concepts, evaluating features, analyzing user adoption, or when users express uncertainty about product direction. 适用于：讨论产品概念、评估功能、分析用户采用问题，或当用户对产品方向不确定时（例如：'evaluate this product idea', 'will users adopt this', '这个想法好吗？', '用户会想要这个吗？', '为什么用户不留下来？'）。"
---

# Value Realization

Analytical framework for evaluating whether end users can **know** what value they'll achieve through a product — even if that value takes time.

**Core insight**: End users adopt products when they can articulate what they'll achieve. If they can't explain why they're using it, they won't use it — no matter how good the product is.

**Key terminology**:
- **User**: The person using this skill (product creator, PM, designer, entrepreneur)
- **End user**: The person who will use the product being discussed
- **Value**: Outcomes end users achieve (identity, financial gain, capability, time savings, etc.)
- **Features**: The product's technical capabilities — features are NOT value

**Output language**: Follow user's language. Framework terms (Value Clarity, Value Timeline, Value Perception, Value Discovery, Go/Refine/Pivot/Rethink) always remain in English regardless of output language.

---

## I. 诊断 SOP

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

## II. 分析框架

### 分析深度

分析深度与用户提供的信息量成正比。信息充分时展开完整推理链和案例对比；信息有限时给出简要判断并标注假设。诊断指示的重点维度优先展开。

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

**Case contrast**: Dropbox "access files from any device" (outcome, 🟢) vs Google Wave "unified communication" (abstract, 🔴 — shut down 14 months after launch). See `references/real-cases.md`.

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

**Scoring notes**: Context determines judgment — same situation may warrant different indicators in different markets. When indicators conflict with analysis, analysis takes precedence. A product may show characteristics of multiple statuses; indicator represents comprehensive judgment.

---

## III. 判定与行动建议

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
- 当 🟡 和 🔴 数量相同（如 2🟡2🔴）时，以诊断 SOP 中触发原因对应的重点维度为决定因素：重点维度含 🔴 → Pivot；重点维度仅 🟡 → Refine。

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

## IV. 输出格式

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

## V. 分析反模式

使用此 skill 分析时应避免的错误：

| # | 反模式 | 症状 | 修复 |
|---|--------|------|------|
| 1 | **Consumer Lens Bias** — 用 B2C 案例套 B2B 产品 | 引用 Instagram 的身份转变分析开发者工具 | 先评估案例适用性，不匹配时搜索同领域案例 |
| 2 | **Feature-Value Confusion** — 把功能列表当成价值分析 | 分析变成功能清单而非用户成果描述 | 每个"价值"都必须以"用户获得了..."开头 |
| 3 | **Gamification Reflex** — 遇到留存问题就建议加积分/勋章 | 不分青红皂白推荐游戏化机制 | 先判断产品性质，纯工具类不需要游戏化 |
| 4 | **Indicator Shopping** — 先定结论再找证据 | 分析推理为结论服务而非为发现服务 | 先完成分析，再给 indicator |
| 5 | **Skipping Analysis** — 跳过分析直接提问 | 每个维度只有问题没有分析 | 必须先完成系统分析，再提问 |

---

## VI. 研究硬约束

- 引用产品案例必须基于可验证信息，标注数据来源
- `references/real-cases.md` 中的案例是模式示例而非通用规则 — 使用前必须评估产品类型、市场、用户行为的匹配度
- 案例不匹配时，用 WebSearch 搜索同领域可比产品，不要硬套
- 探索性思考（头脑风暴价值类型）和证据性分析（声称具体模式）必须区分

---

## VII. 参考索引

| 文件 | 内容 | 何时加载 |
|------|------|----------|
| [real-cases.md](references/real-cases.md) | 11 个产品案例（Dropbox, Instagram, Duolingo, WeChat, Google Wave, Quibi, GitHub, Notion, MyFitnessPal, Netflix, Slack）含定量数据 | 需要案例对比或数据支撑时 |
