---
name: ux-edge-cases
description: >-
  UX edge-case 审查：针对一个已指定的用户任务，验证它在非常规但可达的入口、前置依赖、interaction mode、异步结果、中断或恢复条件下是否仍能完成。仅在用户明确要求 UX edge cases、用户 flow 边界或交互异常路径审查时使用；视觉 critique、产品价值或 ROI、普通功能实现、系统数据与 runtime 正确性不触发。
disable-model-invocation: true
---

# UX 任务链边界分析

发现合法用户目标何时变得不可开始、无法继续、无法判断结果或无法恢复。

先建立**任务图**，再扰动入口、前置条件、交互状态与中断时机，最后沿用户实际可见的路径反证。分析对象是已选定的用户任务及其可见交互；功能价值、视觉风格与内部数据正确性不在本 skill 的判断范围内。

本 skill 的交付止于只读的边界发现。用户同时要求修改时，先完成边界分析，再把实现作为后续任务。

## 1. 锁定任务与证据

从用户指定的页面、flow、代码、diff 或运行中的产品开始，检查 route、组件、client state、API 类型与响应处理、测试、文案和实际行为。明确：

- 谁在什么入口、角色和对象状态下，要完成什么目标；
- 哪个用户可观察结果才算完成，哪些结果算明确阻塞或安全退出；
- 开始任务所需的资源、资格、权限和历史状态；
- URL、server response、cache、local state、form draft 中谁是各状态的 authority；
- 哪些未知的 product 或 service contract 会实质改变客户端结论。

用户只说 `changes` 时，以当前交互变更为起点，沿 route、state、API 消费者和用户动作向外追踪，直到遇到稳定 contract 或与变更无因果关系的区域。

完成本步时，用户、目标、起点、成功状态、前置条件、状态 authority 与可用证据都应明确；缺失事实记录为信息缺口。

## 2. 建立任务图

把用户可识别的状态作为节点，把可发现的 action 或自动转换作为边。围绕目标还原：

- 支持的入口：主导航、direct URL、deep link、通知、浏览器返回和登录后 redirect；
- 任务状态：empty、loading、ready、editing、submitting、pending、partial、success、failed、blocked、cancelled、expired、deleted；
- 局部 interaction mode：互斥 mode、可进入条件、退出条件、被外部状态 invalidation 后的去向；
- 跨 surface handoff：列表到详情、创建到使用、modal 到页面、外部授权返回、重新登录后继续；
- presentation transition：展开、收起、切换 view 或临时隐藏前后，仍属同一任务的输入、focus、scroll、异步进度与错误状态；
- 退出与恢复：cancel、back、refresh、retry、resume、undo、重新进入和安全放弃。

对每条前置条件边 `A 依赖 B`，检查用户能否在尝试 A 前理解 B、从 A 的阻塞状态到达 B 的创建或获取入口、完成 B 后带着原意图返回 A，以及 B 缺失、失效、被删除或失去权限时能否恢复。隐藏 A 的入口只能减少误入，不能替代这条前置条件回路。

对每个 action 标出它服务的任务、semantic owner 和 availability contract。action 的可达性由任务与真实前置条件决定，而不是由偶然承载它的可选容器或相邻 workflow 决定；进入 action 时依据最新候选、权限与对象状态再次确认合法性。

对每组互斥 mode 标出唯一 active state、允许的转换和 invalidation event。异步 action 期间明确哪些冲突转换冻结；success、failure、cancel 和外部条件失效分别落到可继续、可重试或明确退出的状态。纯 presentation transition 保留仍然有效的任务状态，只清除已被语义转换判定失效的部分。

完成本步时，每个支持的入口都应能走到成功、明确阻塞或可恢复终点；每个前置条件都有完整回路；每个 action、mode 与 presentation transition 都有确定的 owner、合法转换和状态保留规则。

## 3. 检查任务边界面

对当前任务实际涉及的边界面逐一判断适用性：

- **Actor 与资格**：首次或回访、角色、权限、套餐、ownership 与邀请状态是否改变可达 action；
- **入口与定位**：导航、deep link、旧通知、URL、选中对象、filter、tab 与 redirect 是否保留同一目标；
- **前置依赖**：依赖对象、配置、授权或资格是否可发现、可满足，并能携带上下文返回；
- **Action ownership 与合法入口**：action 是否由正确的任务 surface 承载，其 visible/enabled 条件是否来自真实可操作对象，并在 commit 前重新校验；
- **状态 authority**：server state、cache、optimistic state、local draft 与 URL 冲突时，界面与 action 基于哪一个；
- **Mode 与 invalidation**：互斥 mode 是否能同时成立，进入、退出、切换和外部条件失效后是否落到唯一合法状态；
- **异步终态**：用户能否区分未开始、处理中、排队、部分完成、成功与失败；只有 contract 终态才结束当前 mode，失败是否仍有可恢复状态，重复 action 会被如何解释；
- **Presentation continuity**：不改变任务语义的展开、收起或 view 切换，是否保留仍有效的输入、focus、scroll、上传进度和错误；
- **连续性与恢复**：刷新、返回、多 tab、session 过期、重新登录、离线重连和跨设备是否保留目标与必要输入；
- **生命周期与协作**：资源被编辑、归档、删除、恢复，权限或 owner 中途变化时，当前任务是否仍有合法去向；
- **输入与可操作性**：validation、长内容、本地化、时区、移动端、键盘、focus 与 assistive technology 是否改变可完成性；
- **后果与信任**：付款、发布、删除、共享、授权等 action 的对象、范围、可逆性与最终结果是否可理解。

检查 API contract 在客户端的消费结果，不把“API 返回了错误”直接当作任务链已闭合；错误必须被映射为用户可理解且可行动的状态。

完成本步时，每个适用边界面都应在任务图上有明确结论，不能只检查页面是否存在或 happy path 是否能点通。

## 4. 扰动并追踪用户后果

在准确的转换点施加能改变结果的最小扰动：

- 从首次使用切换到已有历史、缺少前置资源、deep link 或过期入口；
- 在 action 前、请求中、响应后但渲染前刷新、返回、重复点击或切换 tab；
- 在 render 与 commit 之间让候选、权限或对象失效，并在异步 action 中切换互斥 mode；
- 只改变 presentation state，检查仍有效的输入、focus、scroll、上传与错误是否被误清除；
- 让 API 变慢、离线、返回 empty、partial、stale、冲突、认证失效或客户端未知状态；
- 让前置资源、当前对象、权限或 session 在流程中途变化；
- 组合两个各自可处理的条件，例如未保存输入与 session 过期、optimistic success 与服务端拒绝、旧页面与已删除对象。

从扰动点继续追踪用户看到什么、还能执行什么、最可能如何重入，以及重入是否造成重复提交、错误对象操作、数据丢失或永久死路。首次报错不是终点。

完成本步时，每个候选项都应指出从任务图哪条边分叉，并到达用户可观察的稳定后果或具体证据缺口。

## 5. 建立边界链并反证

每个 UX 边界必须形成：

**用户与上下文 → 目标与入口 → 分叉前的可见状态和 authority → 触发的转换 → 断裂的任务图边或 UI contract → 用户最终看到的状态与可执行 action → 影响 → 证据**。

按证据定级：

- **已确认**：运行行为、代码、测试、route 或明确 contract 直接证明断点；
- **高可信推断**：交互实现与状态转换足以推出后果，但尚未运行完整任务；
- **待确认**：现有证据指向具体断点，但缺失的入口、角色、feature flag 或 service contract 可能改变结论。

逐条检查其他入口、route guard、状态恢复、error mapping、测试和上游约束，尝试推翻候选项。单张截图没显示 action、单个组件没处理状态，均不足以证明整条任务链不存在保护。

完成本步时，每个保留项都有完整边界链或指向明确缺口，且已经受过反证。

## 6. 覆盖收口

结束前确认：

- 每个支持的入口都有成功、明确阻塞或恢复终点；
- 每条前置条件边都有发现、满足、返回和失效后的回路；
- 每个关键 action 都有 semantic owner、基于最新事实的合法入口，并检查了开始、进行、成功、失败、取消、重复和重入；
- 每组互斥 mode 都有唯一 active state、冲突转换规则和 invalidation 后的稳定去向；
- 每个纯 presentation transition 都只清除语义上已经失效的状态；
- route、server state、cache、optimistic state 与 local draft 的冲突均有 authority；
- refresh、back、deep link、session 变化和多 tab 已在相关任务边上参与组合；
- 每个发现来自具体用户目标与可达路径，同一根因和用户后果只保留一次。

完成本步时，所有适用边界面均有结论，所有输出项均经反证，所有信息缺口都具体到可能改变哪条判断。

## 输出

使用自然语言，从最阻断核心任务的发现讲起。每个发现用一小段说明用户是谁、从哪里进入、任务图在哪条边断裂、界面最终呈现什么、用户还能做什么、影响、证据与可信度。

用户只要求分析时，每段以现状、影响、证据和待确认 contract 收口；恢复路径缺失时，准确描述缺少哪条转换及其必须满足的结果，不替用户选择页面、文案、跳转或交互实现。只有用户显式要求建议时，才在所有发现之后另列方向性建议。

按根因和用户后果合并，不套页面 checklist 或固定表格。范围内没有成立的边界时，说明“未发现有证据支持的 UX 任务链边界”，并确保结论来自完整任务图复核。
