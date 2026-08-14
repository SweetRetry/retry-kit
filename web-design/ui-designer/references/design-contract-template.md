# design.md coverage map

`ui-designer` 阶段 5 用本文件检查 design.md 是否完整。§0–§8 必须可寻址，标题可以补充本项目的具体判断。不要复制一套固定段落、表格或列表；按设计本身的因果关系组织内容。完整范例见 `../design.example.md`，只参考其决策粒度与可追溯性。

## 写作门槛

design.md 同时服务审查设计的人和执行设计的 agent。人需要理解发生了什么、依据是什么、为何这样取舍；agent 需要找到明确对象、条件、参数、状态和验收方式。清楚优先于短，不压缩决定结论成立的上下文。

对每个会改变构图、交互、token、响应式或状态处理的高影响决策，保留这条因果链：

1. 哪项用户输入、代码、真实内容、live render、视觉 authority 或可靠外部来源提供了事实与约束。
2. 这些依据支持什么推断，不能支持什么。
3. 因此选择什么，同时放弃什么。
4. 这个决定对用户和实现有什么影响，完成后如何验证。

事实标明来源；推断不写成事实。证据不足时写 `unverified` 和验证动作，不靠猜测补齐。高影响决策用连贯段落讲清因果，重复字段的映射才用表格，独立约束才用列表。

每个视觉值解析到命名 token 或 authority 引用。缺少 authority 时标出 fallback 来源与替换条件。状态与 a11y 写在对应行为附近。最终文档不保留模板说明、`TBD` microcopy、mood 词或实现代码。

## §0 项目边界与依据

先让读者知道本轮究竟在设计什么：surface 的职责、目标用户、核心任务、使用环境、技术栈、可修改范围和明确不动的边界。写清视觉 authority、产品术语、真实内容、route、SEO、analytics、legal 与 accessibility contract 中哪些必须继承。

列出真正影响契约的依据及可信状态。来源少且关系简单时用段落；来源具有重复字段时用“依据 / 已知内容 / 如何影响决策 / 状态”表格。不要为显得完整罗列没有进入判断的文件。

这一节结束时，读者应能区分：已确认事实、从材料观察到的事实、设计推断、fallback 和 `unverified`。同时明确哪些问题属于产品、数据、服务或内容层，本契约无权替它们作决定。

## §1 THESIS

从 §0 的事实与约束开始论证，不先写 slogan。说明现有状态为何妨碍主任务，哪一步推断把问题转成空间或交互方向，以及选择该方向后放弃了什么。若需要保留其他入口或能力来承担被放弃的价值，在这里写清。

论证完成后，用一句话钉住这个 surface 独有的结构性决定。去掉 logo、品牌名和装饰后，这句话仍应由产品机制、内容或受众解释。把类别默认、明确排除的 AI default、多个视觉来源的分工和 authority gap 放在它们实际影响的论证附近，不固定写成四个同形 bullet。

## §2 STORY / TASK

先说明主 mode 是 `Persuade`、`Operate`、`Read` 或 `Experience` 中的哪一个，以及为什么。再叙述用户从进入到完成主任务的真实推进顺序：先注意什么，用哪些信息判断，执行什么动作，系统如何反馈，之后到达什么状态。

字段顺序、第一焦点和 progressive disclosure 都应来自任务与内容，而不是 schema 顺序或常见页面布局。写出会打断主路径的失败、恢复、权限和连续性问题；不要用“先理解 / 再操作 / 最终行动”三句占位代替完整旅程。

## §3 OWN WORLD

先解释视觉世界从什么机制、内容、文化或 authority 推导出来，以及它怎样帮助当前任务。视觉语言不能只靠材料名、mood 词或装饰组合成立。

随后把当前项目真正需要的视觉参数映射到技术栈：

- color 按语义角色定义，说明每个角色解决什么信息问题，如何处理 semantic state、contrast、dark mode 与多 accent。
- type 说明角色、family、size、weight、line-height、measure、加载范围和真实长文本行为。
- spacing、shape、surface、icon、imagery 与 motif 说明角色关系、来源和使用边界。
- motion 说明唯一 authored moment、触发条件、用户意义、duration/easing token、性能边界和 reduced-motion 静态帧。

需要逐字段映射时使用表格，并包含角色、token、值、使用规则和来源。表格前后仍要解释为何这样分工；数值本身不构成设计依据。

## §4 FIRST VIEWPORT

说明用户不滚动时必须完成哪一步理解或行动，以及这个要求来自哪项任务证据。写清第一焦点、主内容、primary action 与辅助信息之间的空间关系。

viewport、可见行数、内容长度或密度目标必须有来源或标 `unverified`。数字若只来自样本，要说明样本边界和真实内容回放失败时的调整顺序，不能为了守住数字牺牲字号、信息或点击区域。

## §5 TOPOLOGY

解释主要区域如何组成一条任务路径，哪些内容属于同一工作集，哪些需要 progressive disclosure。navigation、主滚动容器、sticky、overlay 和详情归属都要说明原因。

响应式边界从内容、最小可用控件、阅读顺序和设备环境推导，不直接照搬 framework 默认 breakpoint。逐个断点写清 reflow、collapse、hide、sticky、safe area、mobile order、focus return 与被隐藏信息的替代入口，并注明验证所需的真实内容范围。

## §6 STATES

先定义状态属于页面、区域、数据对象还是具体操作，避免全局 loading、toast 或空态掩盖真实对象。default、loading、empty、error、disabled、success、focus、hover、active 必须各有规则或明确标记 `不适用`。

对异步操作写清保留哪些输入与位置、错误贴在哪里、能否重试、成功后对象何时移动。覆盖 long text overflow、RTL、keyboard focus order、offline、permission denied、重复提交和动态数据；接口能力没有证据时标 `unverified`，不要让 UI 假装保证服务端语义。

a11y 与对应行为放在同一节：关键 foreground/background 对及目标 ratio、touch/pointer target、keyboard interaction、focus management、screen reader label/announcement 和 reduced-motion。每项都应能转成实现检查。

## §7 SIGNATURE

说明唯一 signature moment 如何让 THESIS 或产品机制变得可见。交代为何选择这种表现而不是更常见的替代方案，它牺牲了什么，以及在低视力、keyboard、screen reader、reduced-motion 和性能条件下如何保持意义。

若 signature 只增加装饰而不帮助任务或识别机制，删掉这一节的特效，不为满足模板制造 moment。

## §8 实现约束与交接

说明 design.md 的终态、实现权限、必须复核的依据、所需 assets、事实缺口和 `unverified`。真实代码或内容推翻依据时，要求实现 agent 报告冲突并回到对应决策，不能静默修改契约或伪造能力。

Agent contract 必须给出：

- 读取代码、内容、authority 和本契约的顺序。
- token、structure、state、a11y、motion 的实施依赖关系。
- 每个高影响行为的可触发验证路径和目标 viewport。
- 明确禁止的越界修改，以及发现跨层问题时的报告方式。

## 定稿检查

全部满足才交付：

1. §0–§8 覆盖完整，但各节没有被强行写成同样的长度与形状。
2. 每个高影响决策能回答“依据是什么、为何支持这个判断、代价是什么、如何验证”。
3. 去掉 logo 和品牌名后，构图仍由机制、内容或受众解释。
4. 九种状态有规则或标记 `不适用`，a11y 位于对应行为附近。
5. 每个 color、type、spacing 与 motion 参数可追到 authority、技术栈 token 或 fallback。
6. 下游 agent 不依赖未记录上下文即可实现和验收。
7. 全文没有模板残留、mood 词、无来源事实或不可判定的“适当优化”。
