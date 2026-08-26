# Find Information Gap 的 UE/UX 重设计研究

> 日期：2026-08-26<br>
> 状态：研究存档；不直接改变任何 skill 行为。

## 问题

当用户面对一个当前可见的信息状态时，信息结构如何支持其：

1. 识别正在看的对象及其状态；
2. 理解对象之间的归属、并列、条件或因果关系；
3. 判断一条信息、一个分组或一个入口是否与当前目的相关，以及是否值得继续深入；
4. 用可观察证据识别由内容缺失、分类、命名、顺序、层级、导航或渐进披露造成的信息理解缺口，而非按既有 UI pattern 下结论？
5. 在 UX / 信息呈现中，什么构成典型的信息噪声；又如何把噪声与必要复杂度、审美偏好及单纯字数多区分，并决定补全、删除、合并、压缩或延后？

本文把 `information gap` 当作待定义的审查术语，不把它误认为已有标准或单一可访问性成功准则。

## 来源范围与方法

- 一手研究：Pirolli、Card 及合作者发表的 information foraging / information scent 原始论文；用于解释用户为何依据近端线索决定是否继续寻找信息。
- 一手人因研究：Sweller 与合作者关于 cognitive load、element interactivity 与 split attention 的原始实验论文；用于区分材料本有的复杂度和由呈现方式制造的额外负担。研究原本面向学习材料，本文只借用其边界，不把教育实验直接当作通用产品规则。
- 规范与权威机构：W3C WAI/WCAG 2.2 的正式规范及理解文件；用于界定信息、关系、标签、链接目的与重复导航的可验证底线。
- 官方设计系统与服务手册：USWDS、GOV.UK；用于获得带使用条件、研究要求和已知限制的实施指导，而非收集组件样式。
- 未把二手 UX 文章、组件聚合站或“最佳实践”清单作为事实依据。受版权和访问限制，论文事实以 DOI 页面、作者/机构发布的摘要或原始技术报告可核验部分为准。

## 事实

### 1. 识别对象与理解关系依赖可感知的结构，而非纯视觉排版

- WCAG 2.2 成功准则 1.3.1 要求经由呈现传达的信息、结构和关系可被程序化确定或以文本提供。W3C 明确列举了标题、列表、相关表单字段分组、表格的行列及表头关系等例子；这些关系是理解内容所需信息，不能只留给视觉线索。[W3C：Understanding SC 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- 同一说明还建议通过不同模态串行访问内容来检查结构和关系是否真正得到提供。这给审查带来一个可操作的反证：去掉位置、颜色、卡片外观后，若对象、分组和关系已不可说明，则呈现可能只是在掩盖 information gap。[W3C：Understanding SC 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- W3C 的认知与学习障碍说明把清晰结构、稳定标签、可预测的链接目标、层级菜单和搜索列为帮助用户聚焦和找到所需信息的依赖；其列出的障碍包括复杂或不一致的导航和页面布局。这说明结构问题不只是审美问题，也会改变信息能否被定位和理解。[W3C：Cognitive and learning](https://www.w3.org/WAI/people-use-web/abilities-barriers/cognitive/)

### 2. 名称与入口应让用户在深入前判断主题、目的和价值

- WCAG 2.2 成功准则 2.4.6 要求标题和标签描述主题或目的。W3C 的意图说明是：描述性标题帮助用户找到所需信息，并理解内容各部分的关系；描述性标签帮助识别具体组件。[W3C：Understanding SC 2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html)
- WCAG 2.2 成功准则 2.4.4 要求用户能从链接文本本身，或其可程序化确定的上下文，判断链接目的。W3C 将这一点直接关联到用户是否能决定要不要跟随链接，并指出同一目的地应使用一致的文字、不同目的地应使用不同文字。[W3C：Understanding SC 2.4.4 Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
- GOV.UK 对 Tabs 的官方指导指出：标签会隐藏内容，因此标签必须清楚说明所链接的内容；若很难给出清晰标签，可能是内容切分本身不清楚。它还要求先测试不使用 tabs 的内容方案，并只在首个区块通常最相关、各区块能清晰分开且用户无需同时查看它们时使用 tabs。[GOV.UK Design System：Tabs](https://design-system.service.gov.uk/components/tabs/)

### 3. 顺序和导航是帮助定向与预测的结构，不是固定的版式习惯

- WCAG 2.2 成功准则 3.2.3 要求同一组页面上重复出现的导航机制保持相对顺序，除非由用户发起变化。W3C 的解释是，这让用户借助空间记忆和视觉线索预测位置并更快定位内容；该要求并不禁止插入子导航或次级结构。[W3C：Understanding SC 3.2.3 Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html)
- USWDS 的 Header 指导要求导航按用户最常访问的任务和信息组织，而非机构组织；重要链接按优先级排列，并明确要求信息架构与导航的决定以用户研究为依据、持续验证更新是否满足用户需求。[USWDS：Header](https://designsystem.digital.gov/components/header/)
- GOV.UK 的逐步导航只适用于确有起点、终点和有帮助的完成顺序的旅程；任务和步骤应按用户需要的顺序列出，链接前只放用户点击前必需的上下文或条件。[GOV.UK Design System：Step by step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation/)
- USWDS 将 breadcrumb 的职责限定为表达层级位置和向上导航，并明确不应用它表达线性的多步过程。这是关系类型先于组件选择的官方例子。[USWDS：Breadcrumb](https://designsystem.digital.gov/components/breadcrumb/)

### 4. 渐进披露应保留决策线索，而不是把首次解释藏起来

- GOV.UK 的 Tabs 指导说明，tabs 会隐藏内容，使用前应确认用户不用同时看多个区块、首个区块对多数用户最相关；对于需要顺序阅读或跨区比较的内容，官方建议不用 tabs。该指导还要求每个 tab 内容以与标签对应的标题开头。[GOV.UK Design System：Tabs](https://design-system.service.gov.uk/components/tabs/)
- GOV.UK 的逐步导航规定：折叠步骤的简介不会出现在侧栏，因此不得把关键内容只写在那里；链接前的补充文本只应承载点击前不可缺少的上下文或条件。[GOV.UK Design System：Step by step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation/)
- GOV.UK 的 Details 指导将折叠限定为只有部分用户需要的细节，并禁止用它隐藏多数用户会需要的信息；可见摘要链接应简短且具有描述性，且其研究记录有用户会因误以为离开当前页面而不展开详情的证据。[GOV.UK Design System：Details](https://design-system.service.gov.uk/components/details/)
- USWDS 将渐进披露用于降低复杂表单的认知负担，但同时要求在收集信息时说明用途、逐步披露从易到难的问题，并将问题拆成小而有意义的主题块。这是“减少同时呈现量”与“保留完成当前判断所需解释”必须同时成立的官方例子。[USWDS：Progress easily](https://designsystem.digital.gov/patterns/complete-a-complex-form/progress-easily/)
- GOV.UK 对服务起点的要求是提供刚好足以让用户理解服务做什么、是否满足其需要的信息，以及多数用户开始前会需要的成本、时长等信息；如果缺少理解上下文会导致错误操作，则应把起点放在包含该上下文的多页指南中。[GOV.UK Design System：Start using a service](https://design-system.service.gov.uk/patterns/start-using-a-service/)

### 5. “是否值得深入”可由 information scent 解释，并可用行为证据检验

- Pirolli 与 Card 的原始理论把信息觅食描述为：人在可能时会调整策略或环境结构，以提高获得有价值信息的速率；理论包含由近端线索估计潜在信息源价值的 information scent 模型。[Pirolli & Card, *Information Foraging*, 1999, DOI](https://doi.org/10.1037/0033-295X.106.4.643)
- Chi、Pirolli、Chen 与 Pitkow 的 CHI 2001 原始论文将 information scent 用于建模用户的信息需求和 Web 上的导航行动；该模型把用户对页面价值与取得成本的判断纳入对路径选择的解释。[Chi et al., *Using Information Scent to Model User Information Needs and Actions on the Web*, 2001, DOI](https://doi.org/10.1145/365024.365325)
- Card 等人在 CHI 2001 的原始论文以浏览器操作记录、访问页面缓存和有声思维记录构建可复现的 Web 使用协议分析；作者用 8 份实验室协议展示 information scent 对所选路径有强影响，并强调仅有点击流无法呈现两次点击之间的即时认知。[Card et al., *Information Scent as a Driver of Web Behavior Graphs*, 2001, DOI](https://dl.acm.org/doi/10.1145/365024.365331)
- Pirolli、Card 与 Van Der Wege 在两项实验中研究任务相关的显示线索（如树节点标签）如何影响视觉搜索和导航决策；论文将这些近端线索定义为 information scent，并比较了强弱 scent 条件下的表现。[Pirolli, Card & Van Der Wege, *The Effects of Information Scent on Visual Search in the Hyperbolic Tree Browser*, 2003, DOI](https://dl.acm.org/doi/10.1145/606658.606660)

### 6. 审查结论需要用户行为和任务证据，不能从组件名称推出

- GOV.UK Service Manual 要求持续研究用户需求，并列出可审查的既有证据（analytics、搜索日志、客服数据、既有研究）、访谈和观察真实或潜在用户。它同时规定：并非来自用户的意见或建议应视为待验证假设。[GOV.UK Service Manual：Learning about users and their needs](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs)
- GOV.UK 将 card sorting 用于理解用户如何看待词语和相关概念，把 question sorting 用于理解用户如何分组和排序其所提供的信息；这些方法直接产出分类、命名和顺序的用户证据，而非组件偏好。[GOV.UK Service Manual：Researching in small group workshops](https://www.gov.uk/service-manual/user-research/research-small-group-workshops)
- USWDS 要求先和用户研究再决定站点信息架构和导航结构，并持续研究以验证更新是否满足用户需求。[USWDS：Header](https://designsystem.digital.gov/components/header/)

### 7. 信息噪声是与任务无关或妨碍理解的额外负担，不等于信息量大

- W3C COGA 的“避免过多内容”模式把 busy page、过多文字、图像或其他内容与 cognitive overload、焦虑和失焦关联；但同一模式明确目标是提供用户完成任务所需的足够提示和说明，而不是一味减少信息。其建议移除不必要内容、限制与页面主要目的无关的附加链接，并保留重要信息和指令。[W3C：Avoid Too Much Content](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o5p03-manageable-quantity/)
- W3C 的“帮助用户聚焦”目标要求避免会分散或打断用户的元素，并考虑移除用户不需要的内容；同时要求在任务开始时告知用户需要准备的信息。由此可见，必要的任务准备信息即使增加内容量，也不应以“减少噪声”为由删除。[W3C：Help Users Focus](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o5-user-focus/)
- W3C 对简洁文本的指导是按主题分成短块、把目的放在块首、以短而描述性的标题支持扫描；但它没有把任何固定字数当作充分判断，并明确建议长句是否更清晰应由可用性测试判断。[W3C：Keep Text Succinct](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p05-succinct-text/)
- GOV.UK 内容设计要求从用户需求出发决定内容的量、格式和位置，并把删除重复或冲突信息列为正当操作；因此重复、相互矛盾或没有当前用户需要支撑的内容，是有证据支持的噪声候选，而非仅因页面长而删除。[GOV.UK：Understand content design](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/understand-content-design/)
- GOV.UK 的 taxonomy 原则将过多同级主题视为可能令人不堪重负、把单一子主题视为不必要的颗粒度，并允许合并、上移、改名或拆分；它也要求类别独立可理解、可消歧并尽量反映用户语言。该文的 2–12 子主题范围服务于 GOV.UK taxonomy，不能外推成通用页面配额。[GOV.UK：Taxonomy principles](https://www.gov.uk/government/publications/govuk-topic-taxonomy-principles/govuk-taxonomy-principles)
- USWDS 指出每个链接都是一次潜在交互，因此过多链接可能压倒用户；但同一指导同时要求链接使用有意义文字和语境。USWDS 还限定 accordion 仅适合用户只需查看少量局部内容的情形：若用户要看多数内容，结构良好的正文更合适，因为 accordion 本身增加选择和交互成本。[USWDS：Link](https://designsystem.digital.gov/components/link/)；[USWDS：Accordion](https://designsystem.digital.gov/components/accordion/)
- Sweller 的原始论文将可由 instructional design 改变的人工难度与材料本身的 intrinsic cognitive load 区分；后者以元素之间必须同时理解的交互程度为特征。该区分说明：多个相互依赖的资格条件、价格构成或风险边界可能是必要复杂度；它们需要更好的结构，而不必然应该被删去。[Sweller, *Cognitive load theory, learning difficulty, and instructional design*, 1994, DOI](https://doi.org/10.1016/0959-4752(94)90003-5)
- Chandler 与 Sweller 的两项实验发现，当学习者必须在分散且互相指涉的文本、图示之间来回整合才能理解时，会产生额外的 cognitive load；把必然要结合的信息在空间上整合后，实验组处理时间更少且测试表现更好。对信息呈现而言，这支持把同一判断所需的对象、条件和解释就近关联，而非让用户跨卡片、tab 或页面拼合。[Chandler & Sweller, *The Split-Attention Effect as a Factor in the Design of Instruction*, 1992, DOI](https://doi.org/10.1111/j.2044-8279.1992.tb01017.x)
- W3C 的适配指导允许用户隐藏非必要或少用功能、取得更少或更简单的文本，并在需要时再找到额外功能。它支持为不同用户提供简化路径，但不支持将默认界面的关键内容任意撤走。[W3C：Support Simplification](https://www.w3.org/TR/coga-usable/#support-simplification)

## 推断

以下是跨来源得出的工作性推断，不是任何单一来源的原话或合规要求。

1. `information gap` 可定义为：在用户作出下一次点击、展开或跳转前，当前状态没有提供足以识别对象、理解必要关系或判断相关性的线索。它不是“字段数量不足”的同义词。
2. 默认层的最低责任是建立对象、目的/状态和相关性；详情层的责任是增加依据、条件、历史、例外或可操作细节。若用户必须展开后才知道“这是什么、与我何关、会去哪里”，则收纳位置本身是候选根因。
3. 分组、名称、顺序、层级和导航是同一展示模型的不同表达。应先确认用户需要回答的问题和事实关系，再决定采用列表、表格、tabs、树或 breadcrumb；组件适用条件不能替代这一判断。
4. 一个问题应记录为“用户无法回答的具体问题 + 可观察后果 + 当前结构证据”，而不是“某组件不符合某 pattern”。例如，误入入口、跳过正确分组、反复返回、把不同对象当成同一对象、在错误详情中寻找依据，都是可观察后果；“tab 太多”本身不是根因。
5. 证据强度从低到高可分为：静态内容审查发现必要线索缺失；结构/语义检查证实关系仅靠视觉暗示；真实内容下的任务观察、思维出声、搜索/导航日志或客服反馈证实用户的错误理解和路径。只凭设计者偏好或组件惯例不能确认 gap。
6. `information noise` 可定义为：在特定用户、情境和当前任务下，不能帮助识别对象、理解关系、作出正确决定、准备下一步或履行安全／法规义务，却竞争注意力、工作记忆或信息权威的内容、选择、关系或呈现方式。它是工作性术语，不是 W3C 或 cognitive load theory 的正式分类。
7. 噪声的判定不依赖字数、元素数量或视觉风格。内容再长，只要它回答当前任务的必要问题、解释不可省略的相互依赖条件，或防止高代价错误，就可能是必要复杂度；内容再短，只要重复、含糊、与目标无关、让用户在分散位置拼合关系，或打断注意力，就可能是噪声。
8. 信息噪声与 information gap 可以同时存在：缺少关键的目的、条件或关系是 gap；为了弥补它而补上的无关字段、重复说明或过早细节可能再形成 noise。正确目标是“足够、可定位、可理解”，不是最大或最小信息量。

## 对 `find-information-gap` 的建议

### 1. 把审查对象固定为“当前状态可回答的问题”

在输出前要求说明目标用户、信息载体和其此刻需要回答的问题，并逐一检查：

- 我看到的是什么对象或结果？
- 它与谁/什么相关，关系类型是什么？
- 哪些状态、条件、范围或时间会改变我的判断？
- 此入口、分组或详情会带我获得什么；是否值得现在深入？

这些问题分别吸收了 WCAG 对结构关系、标题/链接目的以及 information scent 的事实基础。它们应是审查门槛，而非固定页面模板。

### 2. 将 gap 的根因按展示模型而非 UI 控件归类

建议以以下可并列、可合并的根因分类输出，优先报告最高层且证据充分的一项：

| 根因 | 静态可观察信号 | 应验证的用户后果 |
| --- | --- | --- |
| 内容/对象缺失 | 默认状态没有对象、结果、范围或关键状态 | 用户不能说清正在看什么或该条是否适用 |
| 关系缺失或错置 | 归属、条件、因果、并列、时间等只靠位置/颜色推断，或被技术记录边界切开 | 用户误认关联、遗漏影响范围或无法比较 |
| 分类或命名不符合用户模型 | 顶层分组和入口名称不能预测内容，或同名入口目的不同 | 用户进入错误路径、反复搜索或需要试点 |
| 顺序或层级错配 | 次要元数据先于对象含义；用户首要问题被埋在详情 | 用户先处理不相关信息，或无法判断是否需要深入 |
| 导航定向不足 | 当前位置、上级关系、目的地或重复导航的预期不清楚 | 用户不能预测去处、找回路径或定位内容 |
| 无效收纳 | 折叠、tab、预览或详情入口没有保留身份、目的和相关性线索 | 用户必须打开多个区块才能确定是否相关 |

表中 “应验证的用户后果” 以研究设计为目标，不应在没有相应证据时断言已经发生。

### 3. 明确“组件不构成证据”的质量门槛

- 不以“使用 tab / accordion / breadcrumb / card”判定好坏；先检查其表达的是并列、层级、线性顺序还是细节收纳，再核验该关系是否真实存在。
- 检查隐藏内容前，先要求入口自身能说明主题、目的和关键条件；对照 W3C 链接目的与 GOV.UK 对隐藏内容标签的要求。
- 以真实长度、重复名称、空值、权限差异、跨对象关系和移动窄宽度检查展示模型；不要用占位数据证明结构正确。
- 能取得用户研究时，优先用任务观察、思维出声、搜索日志、客服问题、card sorting 或排序活动验证；不能取得时，只输出“静态证据支持的候选 gap”及待验证假设。

### 4. 保留与任务推进问题的边界

只有在不进行下一次 action、navigation 或系统更新时，用户已无法识别、理解或判断相关性，才归入 information gap。若当前内容已经足以作判断，问题只在提交后的反馈、时序、状态转换或恢复中出现，则应另行按任务推进问题处理。

### 5. 将信息噪声作为独立的、证据驱动的审查结果

#### 判定问题

对每个默认可见的内容块、标签、入口、图像、提醒和重复事实，按当前用户与任务依次问：

1. 它让用户能回答哪一个现在必须回答的问题，或避免哪一种可说明的错误？
2. 它是否提供开始或继续任务所需的条件、成本、时间、证据、风险或资源？
3. 相同事实是否已有一个更容易找到且更可信的权威位置；若有，它在这里是否承担了不同的即时问题？
4. 用户是否必须跨越分散位置、不同名称或视觉装饰，才能把本应一起理解的关系拼起来？
5. 不看它，用户是否会做出不同或更不安全的决定；若不会，是否有观察、日志、访谈或内容审计证明有人需要它？

前两问为“保留或补全”的信号，后三问为“合并、重组、压缩、延后或删除”的信号。没有用户、业务、安全或法规证据时，不把设计者喜欢／不喜欢、字数或组件数量作为结论。

#### 典型噪声类型与反例

| 噪声候选 | 可观察信号 | 不应误判为噪声的边界 |
| --- | --- | --- |
| 无关或抢占注意力的辅助内容 | 与当前对象、决定或任务准备无关，却比主内容更显著，或以动效、打断、装饰性图像竞争注意力 | 用于解释风险、资格、成本、下一步资源的内容，即使不美观或增加长度，仍可能必要 |
| 重复或冲突的事实 | 同一状态、规则或结论出现在多处而无权威位置，或不同版本导出不同判断 | 为不同情境回答不同问题的简短重复，例如详情中再次标识当前对象、提交前的关键风险确认 |
| 过早的深层细节 | 证据、内部字段、罕见例外或高级功能先于对象、目的、结果或相关性出现 | 某项细节会立即改变资格、费用、风险或是否继续时，应默认可见或在入口明确提示 |
| 分裂的信息关系 | 用户必须在相距很远的标签、说明、表格或页面间来回，才能连接同一对象的条件、含义和结果 | 需要并列比较、审计或保留上下文的复杂资料可以分区，但应有明确关系、摘要和可回溯入口 |
| 空泛或非语义的表达 | 标签、图标、标题或状态不改变用户理解，只要求记忆内部术语或猜测目的 | 领域术语若为用户熟悉、法规定义或精确区分所必需，不应仅因专业而替换；应补充解释或建立可预测上下文 |
| 陈旧、低价值或失去归属的内容 | 已不再满足用户需要、与现行内容重复，或只反映内部组织结构 | 有记录、审计、法律或历史价值的资料可以保留为明确标记的存档，不应伪装成当前建议 |

#### 处理映射

| 发现 | 首选处理 | 质量门槛 |
| --- | --- | --- |
| 当前决定无法成立，因为必要对象、关系、条件或影响范围缺失 | 补全 | 增加的是可改变理解或决定的最小语义单元，而非字段堆叠；默认层仍可扫描 |
| 同一事实在多处重复或冲突 | 合并 | 确立一个权威位置；其他位置只保留为回答不同即时问题的简短引用或状态标识 |
| 内容必要，但被长段落、内部过程、冗余修饰或不相关细节淹没 | 压缩 | 摘要保留对象、结论、范围、状态和会改变决定的条件；不要压掉例外、风险或证据入口 |
| 内容只对部分用户、罕见条件或下一阶段有用，且不会改变是否开始／继续的判断 | 延后 | 默认入口说明主题、目的、适用条件和深入价值；不能把关键解释只放进折叠、hover 或下一页 |
| 没有已知用户需要、决策作用、安全／法规作用或记录价值，且不提供不同的即时问题 | 删除 | 先用内容审计、任务观察、搜索／客服数据或领域确认验证；不因“短”或“好看”而保留 |
| 必须同时理解的关系被分散在多个位置 | 就近整合 | 对象、条件、结果和依据在一个可见关系链中可定位；保留必要的比较或历史结构 |

#### 与“复杂度、审美、字数”的边界

- **必要复杂度**：如果事实之间的相互依赖本身会影响正确、合规、安全或高代价决策，复杂度属于内容约束。先补全关系、建立分组、分段、排序、提供摘要和逐层展开；不要通过删除条件、例外或证据伪造简单。
- **审美偏好**：留白、色彩、密度或动效可以影响注意力，但“我觉得乱／不好看”只是一条假设。只有它实际遮蔽、干扰、打断、混淆层级，或使用户更难完成具体任务时，才构成可报告的信息噪声。
- **单纯字数多**：长内容是风险信号而非结论。判断依据是每块内容的用户问题、信息增量和呈现关系；在保留必要含义的前提下，用标题、摘要、列表、语义压缩或渐进披露降低扫描成本。W3C 也要求在长句可能更清晰时以可用性测试裁决，而不是机械拆短。

## 局限

- WCAG 提供的是可访问性底线与可测试语义要求，不是完整的信息架构或产品体验验收标准；符合 WCAG 不能证明内容已按用户心智模型组织。
- information foraging 研究解释近端线索和路径选择，但原始实验的界面与 Web 环境较早，且不直接规定现代产品应使用何种组件；结论应通过目标用户、任务和内容复测。
- cognitive load 与 split-attention 的原始研究主要在学习材料和实验任务中进行；本文将其作为“内在复杂度 vs. 呈现额外负担”与“关系应就近整合”的分析工具，不能据此推导页面元素数量或字数的通用阈值。
- W3C COGA 的部分内容属于 WCAG 补充指导／Working Group Note，而非 WCAG 可验证成功准则；其中的选择数量和文本篇幅提示应按目标用户、语境和研究调整。
- GOV.UK taxonomy 的 2–12 子主题范围是其主题分类法的运营原则，不是所有导航、表单或仪表盘可套用的项目数规则。
- GOV.UK 与 USWDS 的场景主要是公共服务，适用条件和研究纪律可迁移，具体组件与流程不应被当作通用 UI 处方。
- 本研究没有针对当前产品的用户访谈、日志或内容样本，因此只能提出审查框架和证据要求，不能判断任何具体界面已存在 information gap。
