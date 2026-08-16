---
name: ui-designer
description: >-
  人机协同界面设计：先产出技术栈无关的 design plan（上下文 / 设计目的 / 用户旅程 / 候选方向），经人选择方向后，结合项目技术栈与 anti-slop 收敛为可执行 design.md 契约，默认不写代码。Use when 用户要求设计方向、页面/组件方案、配色、排版、视觉语言、构图，或需要可交接的设计契约；不用于直接实现 UI 代码、只读视觉审查（ui-critic）、纯产品链路诊断（product-guide）或只判断/生成 website background 素材。
---

# UI Designer

**判断给人、生成给 AI**：人类注入约束、选择方向、审查契约；AI 并行发散候选、穷尽收敛为 design.md 契约。产出 `design plan`（候选方向）→ 经人选择 → `design.md`（标准化契约，终态交付物），默认不写代码。实现是后续独立请求，按契约承接。

## 三个产出物的边界

| 产出物 | 内容 | 技术栈相关？ | 生命周期 | 谁产生 |
| --- | --- | --- | --- | --- |
| `references/` 设计基线 | 通用设计标准：spacing / type / color / shape / motion / component / a11y 基线 + anti-slop 信号 + design.md 模板骨架 | 无关，任何项目可查 | 静态知识，随 skill 演进而非随项目变 | skill 作者预置 |
| `design plan` | 本 surface 的理解：上下文（surface / 真实内容 / authority / anti-goals）→ 设计目的（mode / 要证明什么）→ 用户旅程（怎么走 / 关键状态）→ 候选方向 | 无关，只回答"是什么、为谁、为什么、怎么走" | 一次性、可迭代；方向确认后消费掉（进入 design.md） | AI 发散 + 人注入约束 / 选择 |
| `design.md` | 可执行契约：§0 技术栈边界 → THESIS → STORY/TASK → OWN WORLD 参数映射 → 状态 + a11y → §8 agent contract | **相关**：§0 写清技术栈，§3 参数映射到栈的 token 机制 | 终态交付物；定稿后冻结，重设计才重开 | AI 收敛 + 人审查 |

**各自不含什么**：

- `references/` 不含"某个 surface 该怎么设计"（那是 design plan）、不含"某个栈怎么实现"（那是 design.md）。
- `design plan` 不含具体视觉参数值（color 值 / 字号 / spacing 数值）、不含组件实现、不含技术栈映射。
- `design.md` 不含候选方向的重新论证（只保留选中的一个）、不含通用知识（引用 reference，不复制）。

**plan → design.md 的转换**（阶段 5 的唯一工作）：

| design plan 的 | 进入 design.md 的 |
| --- | --- |
| 上下文 / authority / anti-goals | §0 边界 |
| 设计目的（mode）+ 用户旅程 | §2 STORY/TASK + §6 STATES |
| 选中的方向（THESIS / 构图） | §1 THESIS + §3 参数骨架 |
| —（此刻才读）项目技术栈 | §0 技术栈 + §3 参数映射成栈 token |
| —（全程）anti-slop 检查 | §5/§8 约束与验收点 |

关键规则：**design plan 与技术栈无关**——了解 surface 时读上下文、真实内容与 authority，不读依赖、框架、构建方式；技术栈在写 design.md 阶段才读取并映射。

## 工作流总览

| # | 阶段 | 角色 | 产出 | gate |
| --- | --- | --- | --- | --- |
| 1 | 了解上下文 | 人 + AI | 上下文 / authority / 约束清单 | 边界完整、约束明确 |
| 2 | 设计目的与用户旅程 | AI 提出 | mode + 用户旅程 | mode 可解释主任务 |
| 3 | AI 发散候选方向 | AI | **design plan**：3–5 个真正不同的候选 | 候选非近亲变体、每个可解释 |
| 4 | 方向选择 | **人** | 选定的方向 / 组合指令 | **人已选择（强制 gate）** |
| 5 | 写 design.md（plan + 技术栈 + anti-slop） | AI | 完整 8 节设计契约 | 8 节齐全、状态全覆盖 |
| 6 | 契约审查 | **人** | flag 清单 → AI 修订 | 无未解决高影响 flag |
| 7 | 终态与交接 | AI | 定稿 design.md + 未验证项 | 无代码、无 TODO |

人类触点 3 个（每个 ≤2 分钟）：**T1 约束注入**、**T2 方向选择**、**T3 契约审查**。阶段 4 → 5 是强制 gate：方向未经人选择，不得写 design.md。

## 1. 了解上下文（design plan 输入）

只回答"这个 surface 是什么、为谁、有什么不可动"，**不读技术栈**。读用户要求、目标 surface 的职责、真实内容与现有视觉 authority：design token、theme、共享组件、相邻页面、品牌资产或 live render。不要因缺少 `DESIGN.md` 就把项目当 greenfield。

判断 visual authority：

- **局部扩展**：所在 surface 已有明确系统；继承其 composition 与视觉语言，只解决新增内容、状态和连接关系。
- **既有世界的新 surface**：visual grammar 固定，允许为新任务重组 hierarchy、topology 和 interaction。
- **不完整品牌**：保留已确认资产与识别特征，只扩展当前任务真正缺失的规则。
- **重设计 / 替换视觉世界**：保留产品事实、功能、真实内容、明确品牌承诺和不变项；默认不破坏 route、SEO、analytics、legal、copy voice 与 accessibility contract，旧外观不再约束新方向。
- **Greenfield**：从受众、任务、产品机制和使用环境建立视觉世界，不从类别模板反推答案。

**约束注入（T1）**：非平凡任务默认第一步——目标、受众、保留边界或核心素材会改变结构时，一轮只问 2–3 个最高影响问题：受众现实（谁、什么环境、什么不能变）、明确不要的（anti-goals）、既有 authority 与非协商项。人的回答是所有候选方向的盒子；没有约束注入的发散会退化成类别模板。精确任务直接执行。

**完成标准：**明确 surface 是什么、视觉 authority、保留项、真实素材、可修改边界与 anti-goals。

## 2. 设计目的与用户旅程（design plan 输入）

**设计目的**：mode 描述用户在当前 surface 的成功方式，不描述产品类别：

- **Persuade**：用户理解 offer、相信 proof 并采取行动。首个阅读序列必须包含清楚的价值、证据和 primary action；允许更强的品牌表达。
- **Operate**：用户高效完成任务。scanability、状态清晰、熟悉 affordance、数据密度和低操作成本高于新奇；品牌主要体现在精确细节。
- **Read**：用户理解内容。优先结构、measure、节奏、目录和 wayfinding，视觉表达不能打断阅读。
- **Experience**：用户进入作品、媒介或空间。让内容从 first viewport 主导，navigation 与 chrome 主动后退。

一个工具的 landing page 仍是 `Persuade`，品牌站的文档仍是 `Read`。复杂 surface 可分区使用不同策略，但必须有一个主 mode。

**用户旅程**：写清用户从进入到完成主任务会经历什么——先理解什么 → 再做什么 → 到达什么状态；标注关键状态（default / loading / empty / error）。这段理解直接进入 design.md 的 §2 与 §6。

**完成标准：**primary task、第一焦点、信息密度、表达自由度由 mode 解释；用户旅程覆盖关键状态。

## 3. AI 发散生成候选方向（design plan 输出）

先写：产品独有机制、受众真实场景、文化归属、当前 surface 必须证明什么、该类别最常见的模板套路。然后生成 **3–5 个真正不同的候选方向**——不同 material family / topology / 服务的任务，AI 不自选。每个候选只写：

- **一句话 THESIS**：这个方向独有的一件事 + 拒绝的类别默认。
- **一句核心构图**：去掉 logo 与品牌名后仍能由机制、内容、受众解释。
- **一句话代价**：真实 trade-off（选了 X，代价是 Y）。

候选必须真不同，不是近亲变体；方向明确且无风险时可为 2–3 个，不为凑数展示。greenfield 或 authority 不足时，标注 `authority gap`：哪些决策因缺品牌输入用了 fallback baseline，建议人在哪些点投入判断。

推导参数用 `references/visual-grammar.md` 的基线约束发散，用反默认三测试筛掉明显 slop 组合：

1. **换皮测试**：替换 logo、品牌名和文案后，是否仍可原样服务任意同类产品？
2. **去装饰测试**：移除 gradient、glow、glass、texture 与 shadow 后，hierarchy 是否仍成立？
3. **重复测试**：相同 layout、label、container 或 animation 是否无视内容语义反复出现？

**完成标准：**候选 3–5 个、真正不同、每个可解释且带真实代价；无 mood 词；authority gap 已标注。

## 4. 方向选择（人）

把候选集交给用户：**选一个** / **组合**（"A 的结构 + B 的视觉语言"）/ **全否并给原因**（回到阶段 3 重新发散）。AI 不做最终方向选择——品味判断是人的职责，也是 anti-slop 的流程机制（AI 的平均品味正是 slop 的来源）。

**Gate：** 用户已选择方向（或给出组合指令）后进入阶段 5；方向未选定则停留收敛，不写 design.md。

## 5. 写 design.md（结合 plan + 技术栈 + anti-slop）

design.md 是三个输入的唯一结合点：

1. **design plan**：已确认的方向、设计目的、用户旅程。
2. **项目技术栈**：此刻才读取依赖、启动命令、framework、styling 与 token 方案，做**技术栈映射**——把 plan 的 spacing / type / color / motion 参数表达为该栈的可用机制（Tailwind 默认 scale、CSS 变量、design token 文件等）。技术栈只在这里进入，不改动 plan 的理解。
3. **anti-slop 约束**：按 `references/visual-grammar.md` §6 的三测试与信号，检查参数映射不滑向模板或 mood 词。

用 `references/design-contract-template.md` 的 §0–§8 作为 **coverage map**，不是逐格填空的表单。各节保持可寻址，但允许按当前设计的因果关系增加自然小节、改变段落长短或合并同类表格。所有 token 落到角色映射，9 状态全覆盖，a11y inline，写清响应式行为、motion、reduced-motion 静态帧与 §8 agent contract。不写代码；不用 mood 词。

首次撰写或双读者重写后仍无法判断信息粒度时，读取 `design.example.md`。复用它的表达方法与约束粒度，不复制示例的题材、构图、token 或参数。

初稿完整后做一次**双读者重写**，只改表达，不删约束、不改变事实、不补来源中没有的细节。清楚优先于短：保留让读者理解决策所需的上下文、证据和因果链，不把“去冗余”写成电报式摘要。技术契约保持中性、直接；在内部完成“初稿 → 审计 → 重写”，最终只交付重写后的 design.md，不附审计过程。

- **给人读**：先交代这是什么问题、依据来自哪里、为何作此判断，再给结论、代价和待验证项。高影响决策保留完整的“事实 / 约束 → 推断 → 决策 → 影响 / 验证”链；事实标来源，推断不冒充事实。合并重复基线，删掉模板占位、章节复述、铺垫、宣传语和泛化结论。
- **给 agent 读**：每条可执行规则写明对象、适用条件、要求的结果和验收方式；值解析到具名 token 或 authority。明确区分 `必须`、`可选`、`不适用` 和 `unverified`，不用“适当、优化、增强、视情况”等无法判定完成的词。
- **按信息选结构**：因果、阅读顺序和 trade-off 用足以讲清关系的段落；彼此独立的约束用列表；只有需要逐字段比较或映射时才用表格。不要为了整齐让每节使用同一形状，也不要把决策链拆成连续的“粗体标签：说明”。
- **用直句**：优先明确主语和 `是 / 有 / 使用` 等简单结构；删除空泛意义拔高、模糊归因、假性分析、预告式过渡、聊天收尾与口号式短句。术语只在能提高实现精度时保留，同一概念始终使用同一名称。

重写后逐个检查高影响决策：依据是什么？依据支持了哪一步推断？因此决定做什么、放弃什么？实现后如何验证？再问：人能否理解来龙去脉，agent 能否不依赖未记录上下文，把每条要求转成实现与检查？任一答案为否，补齐缺失的因果环节；事实或数值无法核实时保留 `unverified`，不靠补写猜测让文本显得具体。

**完成标准：**§0–§8 覆盖完整；§0 列出实际使用的依据及其可信状态；每个高影响决策能从来源追到推断、取舍和验证；每个参数映射到 authority 或栈的 token；状态无遗漏；无 mood 词；agent 可把每条约束转成可检查的实现要求；无模板残留、元话语或新增事实。

## 6. 契约审查（人）

把 design.md 交给用户审查：只 flag 高影响问题（构图扛不住真实内容、色映射错、漏状态、事实存疑），AI 修订 1–2 轮收敛。人不写稿，只判断与验证。

**完成标准：**无未解决的高影响 flag；事实性内容已验证（不可核实标 `unverified`，不编造）。

## 7. 终态与交接

- 停在 design.md，不写代码。实现是后续独立请求，按 §8 agent contract 承接。
- 报告未验证项、资产缺口与实现约束；不留 TODO、不顺手补实现。
- 只读视觉 critique 交给 `ui-critic`；产品链路与功能价值诊断交给 `product-guide`。单独的 website background 素材任务需要页面职责、前景覆盖、responsive crop、运行限制和静态回退等信息，不属于本 skill 的设计契约交付。这些 handoff 不替代本 skill 对设计契约的完整性与可执行性负责。

**完成标准：**无代码产出；未验证边界已明确说明；design.md 可被后续实现请求无歧义执行。

## 输出契约

默认在结尾只报告：选定的方向、design plan 要点、design.md 位置与要点、未验证项与实现边界。用户后续提出"实现"时，才按 design.md §8 的 agent contract 落地代码——那是独立请求，不触发本 skill 的默认职责。
