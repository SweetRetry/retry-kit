# Visual Grammar 基线

`ui-designer` 阶段 3 推导参数时的约束参考。所有参数必须能映射到项目 authority 或本文件的 fallback baseline；例外需有可复述的 surface / content 理由。本文件是推导约束，不是逐条 checklist。

## 1. Design system 与实现栈

- 已有官方或项目 design system 时，把其 token、component 和 interaction contract 当 authority；不要导入第二套系统。
- `editorial`、`glass`、`bento`、`brutalism` 等是 aesthetic，不是假装存在官方 package 的理由。
- 沿用当前 framework、styling 与状态管理。导入依赖前核对 manifest；不为视觉效果擅自迁移技术栈。
- 复用语义匹配的 component，不因"已有 Card"就把所有内容塞进 Card；缺少真实能力时新增最小 primitive。

## 2. Hierarchy 与 composition

- 每个 viewport 只设一个第一焦点；primary content 与 primary action 不互相争夺。
- 用位置、尺度、weight、tone、space 中至少两个维度区分关键层级。
- 先建立 reading order、semantic grouping 与 alignment，再加 container、border、shadow 或 decoration。
- 重复结构只表达同等语义；内容优先级变化时 composition 也应变化。

## 3. Layout、spacing 与 density

- 同组紧、组间松；heading 上方通常比下方更松。相同语义使用相同 spacing token，组内间距至少比组间小一个层级，同时允许 1–2px optical correction。
- 缺少 spacing token 时，以 4px 为基础单位，优先从 `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px` 中选择，把 `2 / 6px` 限定为紧凑组件内部或 optical correction。
- 紧密 inline 使用 `4–8px`、label 与 control 或 control 内部使用 `8–12px`、组件内容组使用 `16–24px`、section 使用 `32–64px` 作为起点；根据 mode、内容和 viewport 调整关系，不机械复制数值。
- Tailwind branch 读取 theme：数字 spacing utility 是 `--spacing` 的倍数，不是 CSS pixel。默认 4px 基准下 `gap-4 / gap-6 / gap-8` 是 `16 / 24 / 32px`；仅在 token 无法表达真实布局压力时使用 arbitrary value。
- 留白必须承担 grouping、focus、sequence 或 recovery；没有作用的空洞不是品质。
- density 由使用频率、决策复杂度、熟练度和环境决定。工作台不为"呼吸感"浪费视野，营销页也不把全部 proof 挤进 Hero。
- 页面可以保持系统一致，但 section 不应无视内容地重复同一 skeleton；variation 服务阅读节奏，不以变化本身为目标。

## 4. Typography

- 只定义必要的 display、heading、body、label、metadata、data / code 角色；角色少而清楚优于字体多。
- 字体由品牌、语言、内容和使用场景决定。system font、Inter 或 serif 都不是原罪，未经判断的默认才是。
- 缺少 typography token 时，Tailwind branch 未覆盖 theme 的默认值为：`text-xs` `12/16px`、`text-sm` `14/20px`、`text-base` `16/24px`。把 font-size、line-height、weight、tracking 和 contrast 作为一个 text role 一起决定，不只指定字号 class。
- `text-xs` 默认承载 caption、metadata、辅助 table 信息和非关键 label；用 `text-sm` 或更强 text role 承载决策关键的状态、错误与操作说明。低于 12px 的有意义文字必须有明确密度理由。
- `text-sm` 可作为紧凑 `Operate` UI 的正文与 control label，或其他 mode 的 secondary copy；`Read` 的连续正文缺少 authority 时从 `text-base` 起。
- 文案放不下时先处理容器、折行、层级与内容长度，不先缩小字号。
- 普通文字 contrast 至少 `4.5:1`，符合 WCAG large text 定义的文字至少 `3:1`；200% text resize 后保持内容和功能完整。
- 用真实 CJK / Latin 混排、长标题、数字、fallback、缺失 weight、窄容器与 zoom 检查 measure、line-height、tracking 和折行。
- 第二字体必须有独立角色；强调优先使用同一 family 的 weight / italic，而不是随机混搭。

## 5. Color、shape、depth 与 icon

- 先定义 background、surface、foreground、muted、accent 与 semantic state 的角色，再选具体值。
- 每个 surface 先指定一个 dominant accent。其他高饱和色必须稳定映射到 semantic state、category、data series 或从属 imagery；同层级标题、序号、Card 和 action 不为"丰富"而各用一种强调色。需要多个 accent 时，写清映射，并确认它们不会共同争夺第一焦点或 primary action。
- Gradient 默认不用。只有替换为单色会损失既有品牌身份、真实空间 / 层次关系，或项目 chart / progress contract 明确定义的信息编码时才保留；用于信息编码时同时提供非颜色线索，并让 gradient 或复杂背景上的 text、icon、control boundary 与 focus indicator 按覆盖区域中最不利的相邻颜色满足 contrast。不要把 gradient 机械复制到 heading、数字、bar、border、button 和 Card 作为通用强调。
- accent 只指向真正重要的 action 或 state；gray temperature、radius、border、shadow、icon family 和 elevation 必须有可复述规则。
- border、shadow 与 surface 不重复表达同一层级；能靠 proximity 解决时不额外装箱。
- colored surface 上的次要文字从该 surface 的前景色或色相派生，不套用普通 gray。
- dark mode 重新建立 surface hierarchy 和状态对比，不做机械反色；是否需要双主题由 brief 决定。

## 6. 抵抗 AI default（调查信号）

以下是调查信号，不是跨情境禁令。明确 brief、品牌语义或任务机制可以让任何单项成立；只有无理由组合或重复才需要重写。

- 居中大 Hero + 漂浮 eyebrow + 双 CTA + 三等分 icon cards + 末尾居中 CTA 的整套 scaffold。
- AI-purple / dark mesh + gradient text + glow + 全页 glass；或 cream + display serif + 暖色 accent 被机械用于所有"高级消费"场景。
- 每段同构、每物皆 Card、Card 套 Card、每按钮皆 Pill、每标题都有小标签或编号。
- Monospace 只用来装"技术感"，grid / grain / glass / shadow 与产品材料无关。
- 假 screenshot、假精确数据、装饰性 status dot、version stamp、weather / locale strip 或无事实依据的 social proof。
- 所有 section 使用同一 animation，或用 perpetual motion 抢夺主任务。

执行三个反默认测试：

1. **换皮测试**：替换 logo、品牌名和文案后，是否仍可原样服务任意同类产品？
2. **去装饰测试**：移除 gradient、glow、glass、texture 与 shadow 后，hierarchy 是否仍成立？
3. **重复测试**：相同 layout、label、container 或 animation 是否无视内容语义反复出现？

反 slop 的目标是恢复产品特异性与层级，不是把一个流行模板换成另一个。

## 7. Components 与 interaction

- Card 只在边界、选择或 elevation 有语义时使用；避免 card 套 card。
- Pill 只属于 tag、status、filter 或紧凑 control；普通标题、图标底板和装饰文案不自动 pill 化。
- 使用平台熟悉 affordance；不要为了"独特"隐藏 action、state 或 navigation。
- pointer target 至少 `24 × 24 CSS px` 或满足相邻间距例外；mobile 高频或关键 action 以 `44 × 44 CSS px` 为更安全目标。
- Control 必须有 hover、focus、active、disabled 和 pending 反馈；form 使用真实 label、inline validation、problem + recovery 文案。
- Modal 只用于需要中断、确认或受保护焦点的任务；简单编辑优先 inline、drawer 或 progressive disclosure。

## 8. Imagery、content 与 proof

- Imagery 必须承担 proof、context、emotion 或 identity；选择真实比例与裁切规则，保持同一视觉世界。
- 核心视觉需要图像时，依次评估用户资产、可追溯真实素材、生成素材；图像生成不是所有页面的强制步骤。
- 不用 div、假 terminal 或无依据 SVG 冒充产品截图；不伪造客户 logo、testimonial、价格、benchmark、库存或能力。
- 可用 synthetic data 完成概念，但在用户可能误认事实的地方明确标注；真实商业 claim 必须来自用户或可信来源。
- 使用具体、可执行的文案。Control 命名动作，错误说明问题和恢复；不用 Lorem ipsum、通用人名或无目标链接填满画面。

## 9. Motion

- Motion 只服务 continuity、causality、orientation、feedback、state transition 或叙事。
- 选择一个 authored moment，其他 motion 保持从属；不要给每个 section 复制同一 fade / slide reveal。
- 优先 transform / opacity 等可控路径，避免用高频 React state 驱动 pointer / scroll continuous value。
- 提供 `prefers-reduced-motion` 路径，确认动画停止后界面仍完整可理解。
