---
name: find-interaction-gap
description: 审查既有网页或 App 的用户任务链，发现缺失、断裂、误导或时序错误的 action、状态反馈、转场与恢复路径。
disable-model-invocation: true
---

# Find Interaction Gap

审查用户能否在既有网页或 App 中开始、理解、推进、控制、确认并恢复任务。把 interaction gap 定义为用户可达的状态转换缺失、断裂、误导、过晚或无法恢复；已有 UI 仍可能形成 gap，缺少某个惯用组件本身不构成 gap。

只判断用户任务的可完成性与可控性。视觉问题仅在 action、状态或反馈因此不可发现、不可辨认或不可感知时进入 finding；功能是否值得存在、视觉风格好坏和没有用户可见后果的工程异常不在范围内。

默认只读。用户明确要求修改时，先冻结 findings 与 acceptance criteria，再进入独立实施阶段并回归原任务链。

## 1. 锁定任务 contract 与证据范围

从用户指定的页面、flow、代码、diff 或运行产品开始，检查 route、组件、client state、API 映射、测试、文案与实际行为。明确：

- actor、使用情境、入口、当前对象状态与要完成的目标；
- 可观察的成功状态、合法阻塞、安全退出和不可接受后果；
- 开始、继续、提交所需的输入、资源、权限、历史状态与外部依赖；
- route、server response、cache、local state、form draft 与 remote update 各自的 authority；
- 使用频率、后果、可逆性与输入／反馈 modality 中哪些会改变交互要求；
- 会实质改变判断但尚未证实的 product、service 或 accessibility contract。

用户只说 `changes` 时，从交互变更出发，沿 route、state、API consumer 和用户 action 追到稳定 contract、明确隔离边界或无因果关系的位置。不把相邻页面自动纳入范围。

**完成标准：**actor、目标、起点、终点、前置条件、状态 authority、影响边界和证据缺口均明确；能用一句话描述“谁在什么状态下要得到什么结果”。

## 2. 建立用户可见的任务图

以用户能识别的状态为节点，以 action、system update、navigation 或 handoff 为边，还原主路径、合法替代路径、失败路径与恢复路径。不要用组件树或 API 调用图代替任务图。

在每条关键边记录：用户意图、作用对象、进入条件、semantic owner、状态 authority、可见变化、side effect、稳定结果与下一步。每条前置依赖 `A 依赖 B` 都要闭合“理解 B → 到达／完成 B → 带着原意图回到 A”。

用以下五个问题检查用户在转换中是否失去可控性：

1. 我正在操作哪个对象，action 会产生什么影响？
2. 系统接受、拒绝还是要求补充我的输入？
3. 现在正在发生什么，我还能做什么？
4. 最终实际发生了什么，结果在哪里？
5. 我如何继续、撤销、修正、重试或安全退出？

**完成标准：**每个入口都到达成功、合法阻塞或安全退出；每条关键边都能回答适用的五个问题，不适用项有明确理由。

## 3. 按 transition 类型检查响应 contract

先标出适用的 transition 类型；一条边可以同时属于多类，逐项应用对应 contract。不要给所有 action 强加同一种 loader、toast、modal 或 confirmation。

| transition | 必须闭合的响应 contract |
| --- | --- |
| **离散 action** | 触发前范围与条件可理解；输入后下一次可感知 UI 更新立即说明已接受、拒绝或缺少什么；未稳定时保持真实进展；结束时给出实际结果与下一步 |
| **连续输入／direct manipulation** | 输入与界面变化持续对应；preview、commit、cancel 与越界行为可区分；中断后不会留下来源不明的半完成状态 |
| **navigation／handoff** | 目的地和返回关系可预测；转场保留仍有效的对象、意图、输入、focus、scroll 与进度；跨系统返回能恢复原任务 |
| **长任务／后台任务** | 状态有持久 owner；用户可离开、重入、判断是否仍在运行；完成、失败或需要人工介入时能重新找到结果与 action |
| **system／remote update** | 变化的来源、时效与影响可理解；不会静默覆盖本地意图；冲突、stale 与 authority 修正后有确定状态 |

对高后果、共享或不可逆 action 再检查：确认发生在仍能改变决定的时点；范围、对象与可逆性清楚；cancel、undo、补偿或 final feedback 与真实 side effect 一致。

即时反馈的形式服从任务语义，可以是局部状态、pressed／disabled、validation、saving／pending、progress、optimistic result、即时转场或同步完成结果。反馈应靠近 semantic owner，并对用户当前使用的交互与感知 modality 可感知；不以“出现过 loader／toast”代替 contract 已闭合。

**完成标准：**每个关键 transition 的适用 contract 均有可见进入、进行和退出语义；触发到稳定结果之间没有无法解释的静默、冻结或虚假状态。

## 4. 检查跨链路 interaction invariant

对每个关键任务逐项检查；不适用时说明原因，不因 happy path 能完成而跳过。

| invariant | 必须确认 | 常见断裂信号 |
| --- | --- | --- |
| **发现** | action、前置条件、不可用原因与下一步能在需要时找到 | 隐藏／错放；disabled 无原因；empty、首次使用或 permission state 没有入口 |
| **理解** | label、对象、范围、默认值、提交时机与后果足以预测 action | 含义依赖内部术语；对象切换后 scope 偷换；高后果 action 与普通 action 无差别 |
| **输入** | validation 在可修正处解释问题，保留有效输入并防止误提交 | 错误只在顶部或提交后消失；格式突变；重复 action 产生重复 side effect |
| **反馈** | 接受／拒绝、等待、进展与结果及时、真实、可感知且归属于正确对象 | 首次反馈等待异步结果；等待状态冻结；fake progress；全局 loading 遮蔽仍需上下文；toast 无对象或过早消失 |
| **一致** | optimistic、server、cache、不同 view 与 remote update 最终收敛到同一 authority | UI 宣称成功但结果被拒绝；旧 response 覆盖新意图；列表与详情长期矛盾 |
| **连续** | navigation、refresh、登录、tab／view 切换后保留仍有效的意图与上下文 | draft、筛选、focus、scroll、上传或进度丢失；依赖完成后回不到原任务 |
| **恢复** | error、offline、session expiry、conflict、partial 与 unknown result 后能修正、重入或安全退出 | 只显示技术错误；retry 会重复 side effect；结果不确定却要求用户盲目重试 |
| **控制** | back、cancel、undo、确认与 final feedback 和后果相称 | 用户被困；无法停止长任务；不可逆动作没有清楚范围或生效确认 |
| **等价** | keyboard、screen reader、touch、窄屏、zoom 与本地化下仍能执行 action 并获得等价反馈 | focus 丢失或被困；状态只靠颜色／视觉 motion；移动端或翻译后关键 action 消失 |

**完成标准：**每项 invariant 都有“成立／不成立／不适用”结论；不成立项映射到任务图的具体节点或边及真实用户后果。

## 5. 验证时序、变化与恢复

优先观察 live behavior；用 source、测试、route 与 contract 解释机制和未显示状态。截图只证明画面内的静态状态，单个组件或缺少某段代码不能证明整条用户路径断裂。

只施加能验证候选断点的最小变化：

- 让关键 action 同步完成、短暂等待和持续等待，记录输入后的第一次可感知更新、持续状态与稳定结果；
- 在提交前、in-flight、side effect 后但 UI 确认前执行返回、refresh、重复 action、cancel 或切换对象；
- 让响应重复、乱序或过期，检查旧结果是否覆盖较新的用户意图；
- 让输入、对象、permission、session、network 或 remote state 在任务中途变化；
- 通过主导航、direct URL、deep link、通知、浏览器返回与登录 redirect 重入；
- 用任务实际支持的 keyboard、screen reader、touch、窄屏、zoom 与长文案验证 action 和反馈等价性；
- 组合两个会共同改变用户结果的条件，例如未保存输入与 session expiry、optimistic success 与 server rejection。

从断点继续追到用户可观察的稳定状态、不可逆后果或明确证据缺口。API error、exception 或 toast 出现不是终点；只有用户理解当前结果且拥有正确 next action，恢复才闭合。

按证据定级：

- **已确认：**运行行为或可复现路径直接证明可见后果；测试、代码、route 与明确 contract 已核实触发条件和机制；
- **高可信推断：**测试、实现、route 与状态转换足以推出可见后果，但尚未观察完整任务链；
- **待确认：**已有具体风险线索，但缺少会改变结论的 actor、入口、flag、runtime 或 service contract。

**完成标准：**每个候选 gap 都已追到稳定用户后果并获得相称证据，或精确说明缺少什么事实会改变判断。

## 6. 反证、合并与定级

对每个候选项检查可达性、替代路径、native behavior、route guard、上游约束、其他 modality、其他 viewport 与合法产品规则，主动寻找能闭合任务链的反证。缺少惯用 UI pattern、罕见条件存在或个人偏好不能单独成为 finding。

每个保留项形成一条 gap chain：

**actor 与目标 → 可达入口和前置状态 → 预期 invariant／response contract → 实际可见转换 → 用户最终状态与剩余 action → 影响 → 证据**。

按核心程度、可达性、后果与恢复成本定级，不按缺失组件数量或等待时长机械定级：

- **P0：**目标用户群的核心任务普遍没有可用路径或 workaround，或可达交互会造成高后果、不可逆的错误且缺少可靠确认或恢复；
- **P1：**核心任务在可达状态下被阻断、结果被误报／无法确认、产生重复 side effect，或关键 action／反馈对部分目标用户不可用；
- **P2：**次要或条件路径存在可复现摩擦、上下文丢失或可恢复的不确定性，明显增加任务成本；
- **不成立：**没有可观察任务后果、已有等价路径闭合，或证据只支持视觉／产品／工程层面的其他问题。

相同根因与最终后果合并；不要把一次响应 contract 断裂拆成 loading、success、error 多条 finding。分别保留导致不同任务结果的缺口。

**完成标准：**每个 finding 均经反证，只有一个主要根因、一个严重度和与措辞相称的证据等级；所有适用 invariant 均已覆盖。

## 输出 contract

先给出 `存在 interaction gap / 未发现有证据支持的 interaction gap / 证据不足`，并用一句话说明审查的 actor、任务与状态范围。

按 P0 → P2 输出 findings。每项用一小段说明具体位置与前置状态、被违反的 invariant 或 response contract、实际可见行为、用户还能做什么、最终影响、严重度、证据与可信度。默认保留最影响任务判断的 3–5 项；所有额外 P0／P1 仍需输出。

最后列出已复核的主路径、关键替代／恢复路径和会改变结论的未知项。用户只要求分析时，不提出修复；明确要求建议时，在全部 findings 后给出与根因对应的恢复方向和可验证 acceptance criteria，不把 loader、toast、modal 或 confirmation 当作默认答案。
