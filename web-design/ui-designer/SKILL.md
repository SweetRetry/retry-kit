---
name: ui-designer
description: >-
  人机协同界面设计：把产品目标、真实内容、品牌约束与现有前端栈，经「约束注入 → AI 发散候选 → 人选择方向 → AI 收敛为 design.md 契约 → 人审查 → 终态交接」产出可交接的设计契约，默认不写代码。Use when 用户要求设计方向、页面/组件方案、配色、排版、视觉语言、构图，或需要可交接的设计契约；不用于直接实现 UI 代码、只读视觉审查（ui-critic）、纯产品链路诊断（product-guide）或只判断/生成 website background 素材（generate-web-backgrounds）。
---

# UI Designer — 人机协同设计契约

**判断给人、生成给 AI**：人类注入约束、选择方向、审查契约；AI 并行发散候选、穷尽收敛为 design.md 契约。产出 `design plan`（候选方向）→ 经人选择 → `design.md`（标准化契约，终态交付物），默认不写代码。实现是后续独立请求，按契约承接。

## 工作流总览

| # | 阶段 | 角色 | 产出 | gate |
|---|---|---|---|---|
| 1 | 读取现场、锁边界与约束注入 | 人 + AI | 边界结论 + 人类约束清单 | 边界完整、约束明确 |
| 2 | 选择 surface mode | AI 提出 | mode + 策略 | mode 可解释主任务 |
| 3 | AI 发散生成候选方向 | AI | **design plan**：3–5 个真正不同的候选 | 候选非近亲变体、每个可解释 |
| 4 | 方向选择 | **人** | 选定的方向 / 组合指令 | **人已选择（强制 gate）** |
| 5 | 收敛详化：写 design.md | AI | 完整 8 节设计契约 | 8 节齐全、状态全覆盖 |
| 6 | 契约审查 | **人** | flag 清单 → AI 修订 | 无未解决高影响 flag |
| 7 | 终态与交接 | AI | 定稿 design.md + 未验证项 | 无代码、无 TODO |

人类触点 3 个（每个 ≤2 分钟）：**T1 约束注入**、**T2 方向选择**、**T3 契约审查**。阶段 4 → 5 是强制 gate：方向未经人选择，不得写 design.md。

## 1. 读取现场、锁定边界与约束注入

先读用户要求、仓库指令、目标 route / component、依赖、启动命令和真实内容，再检查至少一个现有视觉 authority：design token、theme、共享组件、相邻页面、品牌资产或 live render。不要因缺少 `DESIGN.md` 就把项目当 greenfield。

判断 visual authority：

- **局部扩展**：所在 surface 已有明确系统；继承其 composition 与视觉语言，只解决新增内容、状态和连接关系。
- **既有世界的新 surface**：visual grammar 固定，允许为新任务重组 hierarchy、topology 和 interaction。
- **不完整品牌**：保留已确认资产与识别特征，只扩展当前任务真正缺失的规则。
- **重设计 / 替换视觉世界**：保留产品事实、功能、真实内容、明确品牌承诺和不变项；默认不破坏 route、SEO、analytics、legal、copy voice 与 accessibility contract，旧外观不再约束新方向。
- **Greenfield**：从受众、任务、产品机制和使用环境建立视觉世界，不从类别模板反推答案。

**约束注入（T1）**：非平凡任务默认第一步——目标、受众、保留边界或核心素材会改变结构时，一轮只问 2–3 个最高影响问题：受众现实（谁、什么环境、什么不能变）、明确不要的（anti-goals）、既有 authority 与非协商项。人的回答是所有候选方向的盒子；没有约束注入的发散会退化成类别模板。精确任务直接执行；不要询问 CSS 值、预设风格菜单或用户没有判断基础的技术选型。

**完成标准：**明确用户要完成的事、视觉 authority、保留项、真实素材、可修改边界与 anti-goals。

## 2. 选择 surface mode

mode 描述用户在当前 surface 的成功方式，不描述产品类别：

- **Persuade**：用户理解 offer、相信 proof 并采取行动。首个阅读序列必须包含清楚的价值、证据和 primary action；允许更强的品牌表达。
- **Operate**：用户高效完成任务。scanability、状态清晰、熟悉 affordance、数据密度和低操作成本高于新奇；品牌主要体现在精确细节。
- **Read**：用户理解内容。优先结构、measure、节奏、目录和 wayfinding，视觉表达不能打断阅读。
- **Experience**：用户进入作品、媒介或空间。让内容从 first viewport 主导，navigation 与 chrome 主动后退。

一个工具的 landing page 仍是 `Persuade`，品牌站的文档仍是 `Read`。复杂 surface 可分区使用不同策略，但必须有一个主 mode。

**完成标准：**primary task、第一焦点、信息密度和表达自由度都能由 mode 解释。

## 3. AI 发散生成候选方向（design plan）

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

## 5. 收敛详化：写 design.md

按 `references/design-contract-template.md` 的 8 节模板产出标准化设计契约。这是 AI 的比较优势——**穷尽**：所有 token 落到角色制表格、9 个状态全覆盖、a11y inline、响应式断点行为、motion + reduced-motion 静态帧、§8 agent contract。不写代码；不用"高级、现代、克制、科技感"等 mood 词代替机制解释。

**完成标准：**8 节齐全；每个参数可映射到 authority 或 fallback baseline；状态无遗漏；a11y 与响应式边界内联在对应节；实现边界在 §8 写清。

## 6. 契约审查（人）

把 design.md 交给用户审查：只 flag 高影响问题（构图扛不住真实内容、色映射错、漏状态、事实存疑），AI 修订 1–2 轮收敛。人不写稿，只判断与验证。

**完成标准：**无未解决的高影响 flag；事实性内容已验证（不可核实标 `unverified`，不编造）。

## 7. 终态与交接

- 停在 design.md，不写代码。实现是后续独立请求，按 §8 agent contract 承接。
- 报告未验证项、资产缺口与实现约束；不留 TODO、不顺手补实现。
- 只读视觉 critique 交给 `ui-critic`；产品链路与功能价值诊断交给 `product-guide`；website background 素材交给 `generate-web-backgrounds`。这些 handoff 不替代本 skill 对设计契约的完整性与可执行性负责。

**完成标准：**无代码产出；未验证边界已明确说明；design.md 可被后续实现请求无歧义执行。

## 输出契约

默认在结尾只报告：选定的方向、design plan 要点、design.md 位置与要点、未验证项与实现边界。用户后续提出"实现"时，才按 design.md §8 的 agent contract 落地代码——那是独立请求，不触发本 skill 的默认职责。
