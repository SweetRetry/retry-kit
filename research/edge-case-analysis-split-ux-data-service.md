# Edge-case analysis 拆分研究：UX 交互链路与数据／服务链路

> 日期：2026-08-10  
> 问题：将现有 `engineering/edge-case-analysis` 拆成两个可独立触发的领域 skill 时，面向客户端 UX／用户交互链路断裂的审查与面向数据、前后端协议、服务端链路的审查，各自应覆盖哪些稳定分析维度、证据门槛与职责边界？  
> 来源范围：仓库现有 skill；W3C/WAI、IETF RFC Editor、OpenAPI Initiative、JSON Schema、AsyncAPI Initiative、PostgreSQL、OWASP、Google API Improvement Proposals 与 Nielsen Norman Group 的官方规范、官方文档或原作者材料。未采用聚合文章和第三方教程。  
> 方法：先比较仓库现有职责，再从一手来源提取稳定 contract，最后把来源事实抽象为拆分建议。研究结论本身不改变 skill 行为。

## 1. 仓库现状

### 事实

现有 `engineering/edge-case-analysis/SKILL.md` 用一条边界链同时覆盖值与表示、局部逻辑、领域状态、持久化、接口、并发、分布式依赖、身份隔离、资源运行、部署演进、业务人工层，并一直追踪到用户、数据或业务影响。它实质上混合了两个不同的审查终点：

1. 用户能否从入口走到可理解、可恢复的结果；
2. 请求、event 与 record 能否跨边界保持 contract 和 invariant。

现有 `product/product-guide/SKILL.md` 的 Branch A 已明确覆盖“用户链路、interaction flow、异常状态或体验断点”，并已包含入口、定位、行动、反馈、结果、恢复、连续性、生命周期、角色、商业状态与跨渠道 handoff。这与拟拆出的 UX skill 在触发语义、分析对象、步骤和证据链上高度重叠。

### 推断

拆分轴不应是“frontend code / backend code”，而应是两种不同的 **leading invariant**：

- **UX skill：task continuity**——用户在给定 actor、入口和状态下，能否理解前置条件、完成目标、确认结果，并在失败或中断后继续。
- **数据／服务 skill：contract integrity**——数据在 request、response、event、storage 与依赖 handoff 中，是否始终满足 schema、状态、权限、一致性和兼容性约束。

这两个 leading invariant 能使同一功能按不同证据独立触发，而不会把所有问题再次汇总成一个泛化 checklist。

## 2. 一手来源事实

### 2.1 UX 与用户交互链路

1. Nielsen 的十项 usability heuristics 是通用启发式而非具体合规条款；其中直接支撑链路审查的维度包括系统状态可见、现实世界映射、用户控制与退出、产品内外一致、错误预防、recognition over recall、错误诊断与恢复、上下文帮助。原作者还说明这些 heuristics 源于对 249 个 usability problems 的 factor analysis。来源：[Nielsen Norman Group — 10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/)
2. WCAG 2.2 要求可顺序导航的组件以保持意义和可操作性的顺序获得 focus；这使 keyboard focus、modal/drawer 后的 focus 恢复、跨区域操作顺序成为真实的任务可完成性条件，而非纯视觉问题。来源：[W3C WAI — Understanding SC 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
3. 动态状态信息应能被 assistive technology 感知而无需夺取 focus；W3C 列举的状态包括 action 结果、等待状态、进度和错误。这支持审查 loading、pending、成功、空结果、后台完成等客户端状态是否对所有用户可见。来源：[W3C WAI — Understanding SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
4. 自动检测到输入错误时，应指出发生错误的 item，并用文本描述错误；W3C 明确指出失败后只重新显示表单而不给提示并不足够。来源：[W3C WAI — Understanding SC 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification)
5. 对会产生法律承诺、金融交易或修改／删除用户可控数据的提交，WCAG 给出的满足路径包括可逆、检查并允许修正，或提交前 review/confirm/correct。这支持把不可逆动作的对象、范围、后果确认与 undo/recovery 纳入 UX 链路。来源：[W3C WAI — Understanding SC 3.3.4 Error Prevention](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)
6. 同一 process 内已输入或已提供的信息，原则上应自动填充或可供选择，安全、必要性或信息失效属于例外。它直接支持检查跨步骤、跨模块 handoff 是否迫使用户重复搬运已有上下文。来源：[W3C WAI — Understanding SC 3.3.7 Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)

这些来源共同说明：UX edge case 的分析单位应是“用户目标与连续任务”，而不是单页组件清单；accessibility 是完成路径的一部分，也不是末尾附加项。

### 2.2 数据、协议与服务链路

1. OpenAPI 把 HTTP API 定义为可由人和机器理解的 language-agnostic interface contract；Operation Object 覆盖参数、request body、responses、callbacks、deprecated 与 security，且规范期望文档至少覆盖成功响应和已知错误。来源：[OpenAPI Specification 3.1.1](https://spec.openapis.org/oas/v3.1.1.html)
2. JSON Schema 2020-12 用 assertion keywords 约束 instance 的结构和值；`type`、`enum`、数值与长度边界、`required`、`dependentRequired` 等能分别表达类型、取值、范围、存在性和字段间依赖。规范同时提醒：JSON 数值允许任意精度，而具体语言未必能处理，这使 wire representation 与运行时表示差异成为明确的边界面。来源：[JSON Schema Validation Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-validation)
3. HTTP Semantics 定义 safe 与 idempotent method；PUT、DELETE 和 safe methods 在规范语义上 idempotent。规范同时指出，客户端不应自动 retry non-idempotent request，除非知道其实际语义是 idempotent 或能确认原请求未生效。这使“超时／断连后结果未知 + retry”成为协议链路的核心组合，而非普通 error handling。来源：[RFC 9110 — HTTP Semantics, §9.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2)
4. RFC 9110 的 conditional requests 与 `412 Precondition Failed` 可防止基于旧状态提交 mutation；`409 Conflict` 表示请求与目标资源当前状态冲突，并期望响应携带足够信息帮助识别冲突。来源：[RFC 9110 — Conditional Requests](https://www.rfc-editor.org/rfc/rfc9110.html#section-13)、[RFC 9110 — 409 Conflict](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.5.10)
5. `429 Too Many Requests` 可携带 `Retry-After` 指示客户端等待时间，且规范并不替应用定义按谁、按什么范围计数。因而限流 key、scope、返回语义和 retry policy 都必须由真实 contract 核实。来源：[RFC 6585 — Additional HTTP Status Codes, §4](https://www.rfc-editor.org/rfc/rfc6585.html#section-4)
6. Problem Details 标准化了 HTTP API 错误的 machine-readable 表达，允许 API 提供拒绝原因和可供客户端采取行动的扩展信息；错误的 status、type 与业务字段映射因此属于 contract，而不只是日志文案。来源：[RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
7. AsyncAPI 3.0 将 message-driven API 描述为 application、sender/receiver、channel、message、operation 与 protocol binding 的组合；规范特别指出，不能仅从 sender 定义反推 receiver，因为实际 channel 和基础设施可能不同。这支持逐个核实 producer、broker/channel、consumer 与 message schema，不能用单边定义假定整个 event chain 成立。来源：[AsyncAPI Specification 3.0.0](https://www.asyncapi.com/docs/reference/specification/v3.0.0)
8. PostgreSQL 官方文档把 transaction 定义为多个步骤的 all-or-nothing 操作，中间状态不对并发 transaction 可见；isolation 文档进一步列出 dirty read、nonrepeatable read、phantom read 与 serialization anomaly。来源：[PostgreSQL — Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)、[PostgreSQL — Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
9. PostgreSQL 的 `CHECK`、`NOT NULL`、`UNIQUE`、primary key 与 foreign key 分别承担值约束、存在性、唯一性、identity 与 referential integrity；文档也说明 delete/update policy 会在 `RESTRICT`、`CASCADE`、`SET NULL` 等选择间产生不同结果。来源：[PostgreSQL — Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
10. OWASP API Security Top 10 2023 将 object-level authorization、authentication、property-level authorization、resource consumption、function-level authorization、sensitive business flow、SSRF、misconfiguration、inventory management 与 unsafe third-party API consumption 列为独立风险面。来源：[OWASP API Security Top 10 — 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
11. Google AIP-180 区分 source、wire 与 semantic compatibility，并指出新增 required request field、移除／重命名既有 component、改变 field type、默认值、序列化 presence 或可观察语义都可能破坏旧客户端。来源：[Google AIP-180 — Backwards compatibility](https://google.aip.dev/180)

这些来源共同说明：服务端 edge case 不能只做输入 fuzzing；它必须沿 contract、authority、commit、delivery、retry、authorization 和 version propagation 追踪最终稳定状态。

## 3. 建议的两个独立 skill

以下均为基于上述事实与仓库结构的**建议**，不是规范原文。

### 3.1 UX / interaction edge-case analysis

#### 分析对象与终点

以一个明确 actor 的 task 为分析单位：

**入口与当前上下文 → 识别前置条件 → 找到并执行动作 → 感知进行状态 → 理解结果 → 继续、退出或恢复**

审查终点是用户能否得到可观察、可理解的结果；后端机制只在解释客户端行为时作为证据，不沿内部数据链继续扩展。

#### 稳定分析维度

1. **Actor 与资格**：首次／回访、角色、权限、套餐、资源 ownership、邀请状态是否改变可达动作。
2. **入口与 prerequisite**：navigation、direct URL、deep link、notification、登录后 redirect；依赖另一模块先创建／配置／授权的对象时，前置条件是否可发现、可满足，并能带着上下文返回。
3. **定位与对象语义**：用户是否知道当前对象、当前状态、动作作用范围与下一步；同一概念跨模块是否改名或出现冲突表示。
4. **动作可达性与决策**：入口是否真实可操作；default、限制、权限、费用与不可逆后果是否在 commit 前可理解。
5. **交互状态机**：idle、editing、validating、loading、queued、pending、partial、success、empty、failed、cancelled、expired、disabled 是否都有明确表现。
6. **模块与渠道 handoff**：跨页面、modal、tab、App、email、第三方授权／支付返回时，actor、目标 object、输入与 intended next action 是否保留。
7. **中断与连续性**：back、refresh、离开再返、session 过期、重新登录、多 tab、跨设备、offline/online 后，任务是否 resume，是否重复提交或丢失输入。
8. **反馈与结果可辨识性**：用户能否区分未开始、执行中、成功、失败和部分成功；动态状态是否也能被 assistive technology 感知。
9. **错误预防与恢复**：validation、confirmation、undo、retry、cancel、保存草稿与退出路径；恢复动作本身是否把用户送回正确上下文。
10. **输入与呈现条件**：zero/one/many、长内容、本地化、时区、viewport、keyboard、screen reader、touch target 等是否改变任务可完成性。
11. **生命周期变化**：对象被编辑、删除、归档、过期或他人修改后，旧入口和旧任务是否成为死路、幽灵入口或误导结果。

#### 不纳入的内容

- 只影响代码内部、没有用户可观察后果的 schema、transaction、cache 或部署风险；
- 纯视觉品味、品牌风格和 spacing 评价；
- feature 是否值得做、ROI 或维护成本判断；
- 修复方案、redesign、测试计划与代码修改，除非用户另行要求。

### 3.2 Data / contract / service edge-case analysis

#### 分析对象与终点

以一个 command、query、request、event 或 batch 的 propagation path 为分析单位：

**producer input → serialization / protocol contract → service state transition → persistence / side effect → downstream consumer → retry / recovery 后稳定状态**

审查终点是数据、权限、状态与副作用是否满足 invariant；客户端表现只作为影响结果，不评价入口是否易找或文案是否易懂。

#### 稳定分析维度

1. **值与 wire representation**：missing、null、empty、boundary、overflow、precision、encoding、timezone、enum unknown value、default、序列化 presence。
2. **API contract**：method semantics、path/query/header/body、media type、schema、status、error body、pagination、batch、callback；consumer 与 provider 的假设是否一致。
3. **Domain state 与 authority**：合法 transition、terminal state、duplicate command、deleted/archived state、谁可写入事实、冲突时谁有解释权。
4. **Persistence invariant**：`NOT NULL`、unique、referential integrity、delete/update policy、历史脏数据、migration 前后约束是否一致。
5. **Atomicity 与 partial commit**：多步写入、外部 side effect、transaction boundary、outbox/inbox 或 compensation；在哪一步失败会留下何种可见状态。
6. **并发与 freshness**：lost update、stale read、isolation anomaly、lock/optimistic concurrency、cache/replica divergence、同一实体的多 actor 交错。
7. **Timeout、retry 与结果未知**：请求可能已生效但 response 丢失；idempotency 的 scope、key、retention 与 duplicate semantics；retry/compensation 自身再次失败。
8. **Async delivery**：producer、channel、message schema、consumer、ack、redelivery、duplicate、ordering、poison message、dead letter、replay 与 backfill。
9. **Identity 与 isolation**：authentication expiry、object/property/function authorization、tenant/resource ownership、delegation、permission mid-flight change。
10. **资源与流控**：payload/batch/queue/capacity limit、rate-limit identity 与 scope、`Retry-After`、backpressure、fan-out amplification、付费外部资源消耗。
11. **外部依赖与 trust boundary**：慢响应、partial response、contract drift、恶意／异常第三方数据、dependency success 但 local commit 失败，或相反。
12. **版本与部署演进**：旧 client、旧 message、旧 row 与新 server 共存；source/wire/semantic compatibility、schema/default/enum 演进、rolling deploy、rollback、flag/config drift。
13. **恢复与 operability**：crash/restart 后 authority、checkpoint 和 in-flight work；log/metric/trace 是否足以区分未开始、部分完成、已提交但未响应和重复执行。

#### 不纳入的内容

- navigation、discoverability、copy、focus、interaction affordance 等纯用户链路问题；
- 没有违反 contract/invariant，也没有安全、数据、可用性或业务后果的内部实现偏好；
- architecture target、修复方案、测试设计和实现修改，除非用户另行要求。

## 4. 两个 skill 的证据门槛

### 4.1 共享边界链

两个 skill 都应要求：

**可到达触发条件 → 分叉前事实状态 → 跨过的 handoff → 被违反的 task contract 或 system invariant → 最终稳定状态／死路 → 影响 → 证据**

缺少特殊触发条件、只描述一般 bad practice，或无法说明结果如何变化的项目，不构成 finding。

### 4.2 UX 证据

- **已确认**：真实运行／可复现 journey、页面与交互状态、route guard、client state transition、自动化测试或明确 PRD/UX contract 直接证明断点，关键入口与替代路径已核实。
- **高可信推断**：完整 client implementation 与状态组合足以推出用户会进入死路、误判结果或丢失上下文，但尚未运行全 journey。
- **待确认**：材料指向具体断点，但尚未检查的入口、角色、responsive variant、feature flag 或服务返回可能改变结论。
- **反证要求**：单张 screenshot 没有按钮，不足以证明整个产品没有入口；一个页面没有恢复动作，不足以证明其他全局或自动恢复机制不存在。

优先证据：运行行为／录屏或复现 > flow 与状态测试 > 完整 UI/route/state code > PRD 与设计 contract > 单张 screenshot。

### 4.3 数据／服务证据

- **已确认**：schema、implementation、migration、config、测试、log/trace 或复现证明触发可达，且关键 producer、consumer、transaction/side-effect boundary 与 retry path 已核实。
- **高可信推断**：静态调用链、contract 与状态转换闭合，足以推出 invariant violation，但未做 runtime 验证。
- **待确认**：风险依赖运行配置、数据分布、broker/database guarantee、第三方 contract 或部署拓扑，且该事实确会改变结论。
- **反证要求**：一个 handler 中未见 validation 或 idempotency guard，不足以证明 gateway、schema validator、database constraint 或下游 consumer 没有保护；必须继续追到稳定 contract 或明确证据边界。

优先证据：复现与生产 trace/log/data > executable contract/schema/migration/database constraint > integration/contract test > 完整 implementation path > 注释或非权威文档。

## 5. 跨域归属规则

| 情况 | UX skill 的关注点 | 数据／服务 skill 的关注点 |
|---|---|---|
| 模块 B 必须依赖模块 A 先创建对象 | 用户是否知道 prerequisite、能否跳转创建并携上下文返回、对象状态变化后是否有下一步 | foreign key/domain invariant 是否强制存在、并发删除／创建、stale reference 与错误 contract |
| session/permission 中途变化 | 未保存输入、redirect 与 re-auth 后能否 resume，用户是否理解被阻断原因 | token/authentication、object/function authorization、tenant isolation 与 mid-flight commit |
| submit 超时后重复点击 | 是否显示 pending/unknown、是否误导用户继续点击、刷新后能否确认结果 | 第一次是否已 commit、POST 是否可安全 retry、idempotency scope 与 duplicate side effect |
| 部分成功 | 用户看到的对象、金额和下一步是否清楚，能否恢复或退出 | transaction/compensation、external side effect、data reconciliation 与 replay |
| 旧客户端遇到新 enum/default | 客户端是否出现空白、错误 action 或无法完成任务 | source/wire/semantic compatibility 与 schema/version contract |
| 删除或归档 | 旧 deep link、notification、back stack 是否成为死路 | referential integrity、cascade/restrict policy、event/order 与 cache invalidation |

归属原则：以被违反的 primary invariant 决定 finding 属于哪个 skill。若同一事件同时产生“任务断裂”和“数据破坏”，可以在各自独立调用中从不同终点报告；单次输出内不要用两个标题重复同一根因。

## 6. 对现有 skill 结构的建议

### 建议 A（更符合 single source of truth）

1. 将 `product-guide` 的 Branch A 迁移或重命名为独立 UX / interaction edge-case skill；`product-guide` 只保留产品价值、简化与 ROI branch。
2. 将现有 `engineering/edge-case-analysis` 收窄为 data / contract / service edge-case skill，保留其值、状态、持久化、接口、并发、依赖、隔离、资源和演进分析能力。
3. 删除原始泛化入口，避免同一“edge case”请求同时匹配三个 skill。

### 建议 B（改动更小，但长期更难维护）

保留 `product-guide`，另建 UX skill 时必须把两者触发和终点切开：UX skill 只做具体 client implementation 的 interaction failure；`product-guide` 只做更高层 product lifecycle / value。由于现有 Branch A 已深入页面、route、状态和恢复，这种边界需要大幅删改，不是只改 description 就能成立。

因此建议 A 更干净：它避免 duplicate authority，也符合 skill 按独立 leading word 拆分的原则。

## 7. 验证拆分是否成立

拆分后的原始反馈任务可用以下两个最小 case 验证：

1. **UX case**：“报表模块必须先在设置模块创建数据源，但空状态没有入口；用户从报表页进入后无法完成目标。”UX skill 应报告 prerequisite handoff 的 task continuity 断裂；服务 skill 不应仅因这个 UI 缺口触发。
2. **服务 case**：“创建接口超时后 client retry，第一次已写库并调用外部计费，第二次再次扣费；API 没有可核实的 idempotency contract。”服务 skill 应追踪 unknown outcome、duplicate side effect 与最终数据；UX skill 只有在界面状态也导致用户误操作时才有独立 finding。

反向检查：

- 纯按钮 spacing 或视觉风格不应触发任一 skill；
- 单函数的普通确定性 bug 没有 edge condition 时，不应被包装成 edge case；
- 没有具体用户 task 的 backend retry 风险只进入服务 skill；
- 没有 system invariant 破坏的跨页面迷路只进入 UX skill；
- 每个 skill 单独运行时都能建立完整证据链，不依赖另一个 skill 的输出。

## 8. 局限

1. WCAG 是 web accessibility 标准，不是完整的通用 UX methodology；本文用 Nielsen heuristics 补充通用交互判断，并明确其属于 heuristic 而非合规条款。
2. PostgreSQL 文档用于说明 transaction、isolation 与约束维度；具体项目若使用其他数据库，必须以该数据库和实际 isolation/config 为 authority，不能直接套用 PostgreSQL 行为。
3. OpenAPI、JSON Schema 与 AsyncAPI 描述 contract，但 contract 文件存在不代表实现遵守；审查仍需核对实现、测试与 runtime evidence。
4. OWASP Top 10 是风险意识与分类来源，不是穷尽式安全验证标准；高风险系统仍需要独立 threat modeling 与 security review。
5. 本研究只回答 skill 的稳定职责、维度和证据门槛，未决定最终目录名、frontmatter 文案或旧 skill 的迁移策略，也未修改任何 skill。
