---
name: ui-critic
description: >-
  取证式界面视觉 critique：审查现有网页、App、Figma 设计稿或截图，按目标给出明确 verdict，并定位 AI slop、typography、信息密度、留白、spacing、层级、色彩、内容真实性及视觉语言问题。Use when 用户要求对现有界面做视觉 audit，询问设计好不好或是否有 AI 味，或需要有优先级的视觉 findings。
---

# UI Critic

对现有界面做取证式 critique：先判断它是否达到目标，再解释视觉根因。默认只读；用户明确要求实施后再改设计或代码。

## 1. 锁定目标、surface mode 与 authority

为每个对象记录核心用户、任务、页面类型、viewport、theme、状态、品牌约束，以及预期的 design variance、motion intensity 和 visual density。选择一个主 mode；混合页面可再加一个次 mode：

- `Persuade / 说服`：优先检查 action、可信 proof、身份与转化叙事。
- `Operate / 操作`：优先检查任务效率、scanability、状态、约束与高频使用。
- `Read / 阅读`：优先检查理解、材料结构、measure、节奏与 wayfinding。
- `Experience / 体验`：优先检查作者性、探索顺序、沉浸与有意义的 transition。

按以下 authority stack 判断选择是否成立：用户明确约束与 brand spec → 已提交的 design system → shared tokens / components → 相邻页面的稳定惯例 → 当前页面的有意例外 → 通用 heuristic。上层 authority 仍需接受任务、可读性与 accessibility 的验证。

把新设计方向与界面实现交给 `ui-designer`，产品 journey 与功能链路交给 `product-guide`。Action 的可见性、层级和 affordance 属于视觉审查；功能、链接目的地和端到端能力只进入 scope handoff。

**完成标准：**每个对象都有一句可判断的目标、主 mode 和当前可用的最高 authority；缺失信息已标为未知，非视觉问题已有 handoff。

## 2. 做无锚定首读

先看 render，不读取 detector、lint 或下方审查清单。记录第一焦点、阅读顺序、整体情绪和一句 Design Read：它试图用什么视觉语言服务哪个目标，最大约束是什么。再判断它是否明显属于这个产品，还是替换 logo 与文案后仍可用于任意同类产品。

**完成标准：**每个对象都有一条未受机械规则锚定的首读记录；多对象分别记录，不用一个总评代替。

## 3. 建立证据账本

- 以 live render 的代表性 viewport、真实内容和关键状态为最高优先级；条件允许时抽查窄、中、宽 viewport 与一个 non-happy path。
- screenshot / Figma 只证明画面内的静态表现；hover、focus、motion、响应式和 DOM 行为保持 `unverified`。
- 跨 viewport 不可见的元素先写“当前画面未显示”；用 source / DOM 区分裁切、折叠、横向滚动和条件隐藏后，再陈述机制。
- source code 用于确认 token、computed value、DOM 顺序和视觉系统根因；最终外观仍以 render 为准。
- 一致性 finding 至少比较两个同语义实例；全局 finding 需要跨区域或跨页面证据。

无锚定首读完成后，在工具与目标允许时运行 scope 内的 contrast、overflow、computed style、DOM、token 或 detector 检查。记录规则、数量、位置与跳过原因；机械结果进入 candidate ledger，不直接成为 finding。

证据强度与结果分类正交：

- 证据强度：`confirmed / inferred / unverified`。
- 结果分类：`confirmed defect / advisory signal / false positive / unavailable`。

`advisory signal` 是可复核线索，但尚无明确用户影响或可能是合法例外；它不能单独改变 verdict。Clean scan 只说明已覆盖规则未触发，不证明设计质量通过。

**完成标准：**每个候选判断都有证据强度与结果分类，措辞没有超出证据；所有可用机械检查都已运行或注明跳过原因。

## 4. 全轴审查

### 产品特异性、AI slop 与内容真实性

- 做换皮测试、去装饰测试和重复测试。AI slop 只在多个无情境理由的默认套路形成组合，并削弱任务层级、可信度或产品身份时成立。
- 超大居中 Hero、gradient headline、漂浮 pill、三等分 icon card、nested card / bento、glow / glass、统一 eyebrow、fake metric、generic avatar、fake product preview、重复 reveal 等只是候选信号；字体、icon library、card、pill、serif 或 gradient 的名称不能单独定罪。
- 检查 headline、proof、CTA、labels、states、captions、testimonial 和 product preview 是否具体到当前产品并共同支撑 hierarchy。对 generic / placeholder copy、假精确数字、无来源 claim、无关 stock、伪署名和 mock UI 标出真实性风险；无法核实业务真伪时写 `unverified claim` 并 handoff，不编造替代事实。
- 把 AI slop 与基础质量缺陷分开：模板感、低对比、overflow、tight leading 和 system drift 可以同时存在，也可以各自成立。

### 层级、构图、信息密度与 spacing

- 眯眼后识别第一焦点、第二焦点、主要分组和 primary path；检查位置、尺度、weight、tone、space、alignment 与视觉重心是否共同表达 mode 的优先级。
- 根据使用频率、决策复杂度、熟练度和屏幕情境判断 density。Persuade 需要及时出现 action 与 proof；Operate 需要关键数据和状态可扫；Read 需要稳定结构；Experience 允许探索，但不能丢失方向。
- 用 proximity 先表达关系，再决定是否需要 card、divider 或 surface。组内应紧于组间；heading 上方通常松于下方；tight 与 generous interval 应形成节奏，而不是全页等距或随机 one-off。
- 检查 spacing scale、容器宽度、edge breathing、数学对齐与 optical alignment。先修结构关系，再做 1–2px optical correction。

### Typography

- 按 authority 与 mode 判断字体是否适配，而不是按字体名单判断。Persuade / Experience 可以让 display type 承担 voice；Operate / Read 更重稳定、scanability 和 measure。
- 检查 display、heading、body、label、metadata、data / code 的 role 是否清楚，family、size、weight、line-height、tracking 与 tone 是否形成少量稳定组合。
- 用真实语言与内容压力检查正文 measure、行高、CJK/Latin 混排、数字、长标题、localization、font fallback、缺失 weight 与 200% zoom。实际 font / weight 的加载需要 source 或 browser 证据。

### 视觉系统、asset 与 motion

- 比较同语义实例：accent / neutral / status color、warm / cool temperature、radius、border、shadow、surface、elevation 和 theme 是否有可说明的 role；一致意味着同 role 同规则，例外有语义，不意味着所有元素相同。
- 为 icon / imagery 指定 role：`content/proof / wayfinding/action / atmosphere/world / decoration`。检查 icon family、stroke、metaphor、optical alignment，以及 imagery 的真实性、裁切、色调、技法和背景处理。前两类使用 placeholder、错误 metaphor 或 fake preview 会损害 task / trust；后两类只有在压过内容或脱离 visual world 时才是问题。
- 对每个 material motion 指定 job：`focus / feedback / state / continuity / authored character`。检查它是否可中断、重复后仍成立，并覆盖 keyboard、mobile 与 reduced-motion；无 job、遮蔽状态或 perpetual motion 抢焦点才形成 finding。静态图里的 motion 保持 `unverified`。
- 检查 button、input、card、table、empty / loading / error / disabled / selected / focus 等组件与状态是否共享系统，同时保持语义可辨。

### 响应式、内容与状态压力

- 判断结构是 reflow / reorder / collapse，还是只缩小字号、间距或静默隐藏核心内容；同时检查 visual order、DOM / focus order 与操作优先级。
- 用长文案、真实图片比例、empty、loading、error、permission、动态数据、touch、sticky、safe area、keyboard 和 zoom 压测布局。
- 检查真实 surface 上的 foreground/background、placeholder、disabled、focus、error、ghost control 与图片叠字。对比度数值需要 computed color 或可靠取样；肉眼判断标为 `inferred`。

**完成标准：**每个适用轴都已检查，缺少证据的轴进入未知项；输出只保留改变 verdict 或修复顺序的结论，不复述清单。

## 5. 反证、定根因与 repair class

尝试用 brief、authority、合法例外、真实内容和其他 viewport / state 推翻每个候选 finding。保留问题时同时记录：

- 最小 owner：局部组件、页面结构、design token、内容 / asset、跨页面规则。
- repair class：`system gap / one-off bypass / conceptual mismatch / local defect / intentional extension`。
- preservation constraint：当前已经成立、修复时必须保留的 brand voice、IA、content block、signature interaction、accessibility win 或视觉关系。
- 最小 repair level：局部修正、组件修正、补 system authority、页面重构或 identity / content handoff。

`intentional extension` 默认是待确认的 advisory；页面级重新构图、identity replacement 和事实性内容重写需要单独授权。方向性建议描述要恢复的关系，不偷渡一套新风格。

**完成标准：**每个保留问题都经反证，只有一个主要 owner 与 repair class，并明确要保留什么以及是否需要额外授权。

## 6. 收敛 finding 与 verdict

- `P0`：关键内容或 action 因视觉表达而不可读、不可见、不可辨认，或存在明确 visual accessibility / overflow 失败。
- `P1`：损害核心任务、主层级、可信 proof、产品身份，或构成反复出现的系统性失效。
- `P2`：有影响的局部 rhythm、type、surface、asset 或 component craft 问题，但不改变核心任务完成度。
- `P3`：细节 polish；只有用户需要完整清单时才输出。

相同根因合并，默认保留 3–5 条最影响决策的 P0–P2 findings；所有额外 P0 / P1 仍需保留。随后为每个对象选择一个相对于第 1 步目标的 verdict：

- `通过`：当前证据下，没有影响目标的 P0 / P1。
- `有条件通过`：没有 P0；P1 局限于局部或特定 viewport，核心任务与身份仍清楚，修复不需要重选页面级构图或视觉语法。
- `不通过`：存在 P0，或页面级 / 系统性 P1 已让核心任务、信任或身份失真、可换皮，需要重建主要构图、内容证据或视觉语法。
- `证据不足`：缺失的 render、状态、authority 或目标会实质改变判断。

**完成标准：**每个对象都有一个 verdict 和决定该 verdict 的首要根因；严重度来自 mode 下的用户影响，而非出现次数、机械命中或个人偏好。

## 输出 contract

先直接回答用户的问题。单对象以 verdict 开头；多对象先用一行一对象的表格给出 `对象 / verdict / 首要依据`，再展开 findings。

每条 finding 必须包含：具体位置、可见证据、用户 / 品牌影响、证据强度、结果分类、owner、repair class、方向性修复与 preservation constraint。最后列出 1–3 个应保留的结构性优点、跨实例的 system pattern、会改变结论的未知项，以及独立于视觉优先级的 scope handoff。

使用 categorical verdict，不使用总分；功能缺失只在其可见性、层级、affordance 或状态表达有问题时形成视觉 finding。

**完成标准：**只读开头的 verdict 或表格，用户也能明确知道每个对象是否达标、最大阻碍是什么，以及结论受什么证据限制。
