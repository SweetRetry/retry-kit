# UI Designer 颜色与 Gradient 约束调研

日期：2026-07-29

## 问题

`ui-designer` 是否应限制颜色使用，特别是避免无目的 gradient、多个高饱和色互相竞争而显得脏乱；约束应采用硬数量上限，还是 role-based / dominant-accent 规则？

## 结论

应该加入约束，但不建议设置“整页最多 N 种颜色”之类的通用硬上限。更稳健的规则是：

1. 先服从项目已有 design system、theme 与 color token；没有 authority 时，再定义 `background / surface / foreground / muted / accent / semantic state` 等角色。
2. 每个 surface 默认只有一个 dominant accent。其他高饱和色必须稳定映射到 semantic state、category、data series 或从属 imagery，不能只为“丰富”而出现。
3. Gradient 默认不使用；只有当它承担可复述且单色无法保留的任务时才保留，例如既有品牌材料、对象的 distinctive feature，或真实的 layering / depth 表达。用于 data visualization 时，必须由项目的 chart system 明确定义其窄用途。
4. 无论颜色数量多少，语义不能只靠颜色传达；gradient 或复杂背景上的文字、icon、focus indicator 必须按覆盖区域中最不利的相邻颜色检查 contrast。

这里的“一个 dominant accent”是适合生成型 skill 的默认决策门槛，不是官方标准中的数字配额。它把多个官方系统反复出现的“neutral 主导、accent 稀疏、primary action 单一、额外颜色有用途”转成可执行规则，同时为 status、chart、category、品牌和真实 imagery 保留必要例外。

## Primary-source evidence

### 1. 官方系统约束的是 color role 和使用意图，不是原始色值数量

- [IBM Carbon Color](https://carbondesignsystem.com/elements/color/overview/) 明确以 neutral gray 作为默认 theme 的主导色、以 core blue 作为 primary action color，其他颜色应“sparingly and purposefully”使用；同时规定 token 是 role-based，theme 只替换 role 对应的 value。
- [Atlassian Color](https://atlassian.design/foundations/color-new/) 将颜色 token 按 property、role、emphasis、interaction state 组织；`brand / information / success / warning / danger / discovery / accent` 各有明确用途。[Atlassian Accents](https://atlassian.design/foundations/color-new/accents/) 还给出判断：如果更换 accent 会改变体验或含义，就不应把它当作无语义 accent。
- [GOV.UK Colour](https://design-system.service.gov.uk/styles/colour/) 要求按具体 context 使用 functional colour，如 text、link、focus、error、success、brand、surface；不建议复制 hex 值代替角色。
- [Microsoft Fluent 2 Color](https://fluent2.microsoft.design/color) 将 neutral、shared、brand palette 分工：neutral 支撑 surface、text 与 hierarchy，shared color 只应稀疏地 accent 重要区域，semantic color 不应用作装饰，brand color 过量或铺在大面积 surface 上会稀释 hierarchy、增加导航难度。

这些系统都允许 palette 中存在许多颜色，但通过角色、范围和 emphasis 管控实际界面。由此推导：通用硬数量上限会把“palette 可用色数量”和“同一视觉层级里同时竞争的 accent 数量”混为一谈。

### 2. “多色显脏”更接近 hierarchy 与角色冲突，不只是色相计数

- [Apple HIG Color](https://developer.apple.com/design/human-interface-guidelines/color) 建议谨慎且一致地使用颜色；在其 Liquid Glass guidance 中，颜色应保留给 status indicator 或 primary action，不应给多个 control background 同时加色，并指出过多颜色可能造成 overwhelming、降低 control label 可读性。Apple 在 tvOS guidance 中也建议选择与 app logo 协调的 limited palette。
- [Carbon Color](https://carbondesignsystem.com/elements/color/overview/) 和 [Fluent 2 Color](https://fluent2.microsoft.design/color) 都以 neutral 建立底层 hierarchy，再让额外颜色稀疏、目的明确地出现。

因此，“脏乱”的可执行诊断应是：同层级是否存在多个无映射的高饱和 accent；它们是否共同争夺第一焦点或 primary action；相同颜色是否在不同位置表达不同含义。单看整页有几种 hex 值无法回答这些问题，因为 theme、state、data visualization 和 imagery 都可能合理增加颜色。

### 3. Gradient 应通过 job test，而不是一律禁止或默认装饰

- [GOV.UK Images](https://design-system.service.gov.uk/styles/images/) 对 illustration 的规则是优先 flat blocks of colour，避免 shadow 或 gradient；只有展示物体的 distinctive feature，或表达 layering / depth 时例外。这支持“先说清 gradient 的工作，否则使用单色”的门槛。
- [Carbon data-visualization color palettes](https://v10.carbondesignsystem.com/data-visualization/color-palettes/) 是 IBM Carbon 的官方 legacy guidance。它把 gradient 限定为单一类别中突出 range extremes 的特殊手段，明确 discourages multiple gradients，并要求有序数据优先使用 sequential palette。该来源是 v10 页面，因此只作为 gradient 决策的补充依据，不应覆盖项目当前 design system。
- [Apple HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials) 要求按 semantic meaning 和 use case 选择 material / effect，而不是因为它呈现出的颜色；这同样支持效果必须有功能或结构理由。

由此推导，gradient 的允许条件应是“替换为单色会损失什么”。若答案只是“更有设计感”“更高级”或“更丰富”，则没有通过 job test。若 gradient 用于 data visualization，还必须先服从该项目 chart system 的 scale 与 accessibility contract，不能凭视觉偏好自创编码。

### 4. Gradient 会扩大 accessibility 验证面

- [WCAG 2.2 Understanding 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) 要求颜色不能成为表达信息、action、response 或区分元素的唯一视觉方式；需要增加 text、shape 等非颜色线索。
- [WCAG Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18.html) 说明当背景或文字的 luminance 变化时，必须保证文字相邻背景处仍达到相应 contrast；跨越明暗 gradient 的同一种文字颜色可能无法在全部位置合格。
- [WCAG Technique G207](https://www.w3.org/WAI/WCAG22/Techniques/general/G207) 针对 gradient 背景上的必要 icon，要求先检查与 icon 相邻区域中 contrast 最差的背景；若部分区域不足 3:1，还要确认移除这些不可见部分后 icon 仍可识别。

因此，gradient text、gradient button、gradient border 或把文字放在 gradient surface 上，不只是审美选择，也会引入逐位置 contrast 风险。最小规则应要求按最不利位置验证，而不是只测两个端点或取平均色。

## 对 `ui-designer` 的推荐规则形态

建议采用以下 decision rule，不采用全局硬色数：

> 先定义 background、surface、foreground、muted、accent 与 semantic state 的角色，再选具体值；已有 design system 时只用其 token 和语义。
>
> 每个 surface 默认一个 dominant accent。其他高饱和色只有在稳定映射到 semantic state、category、data series、品牌资产或从属 imagery 时才能加入；需要多个 accent 时写清映射，并确认它们不会共同争夺第一焦点或 primary action。
>
> Gradient 必须承担可复述的 job。替换为单色后信息、层级、品牌身份或真实空间关系都不受损时，使用单色；不要把 gradient 机械复制到 heading、数字、bar、border、button 和 card 作为通用强调。
>
> 颜色不单独传义；gradient 或复杂背景上的 text、icon、control boundary 与 focus indicator 按覆盖区域中的最不利相邻颜色检查 contrast。

如果仍希望加入数值，建议只把数字用作 audit trigger，例如“同一 surface 出现第二个无语义高饱和 accent 时必须解释映射”，而不是“页面最多三种颜色”。前者约束竞争关系，后者会误伤 status、chart、category 与真实内容。

## 与当前文件的关系

当前工作树中的 `ui-designer/SKILL.md` 已包含“先定义 color role”“每个 surface 一个 dominant accent”“额外高饱和色必须映射”“gradient 必须有可复述 job”这组规则。方向与上述 primary-source evidence 一致。

调研时，“方向 / 进度编码”被直接列为 gradient 的允许示例。用户确认收紧后，规则已改为：Gradient 默认不用；chart / progress 必须由项目既有 contract 明确定义，并提供非颜色线索、满足最不利位置 contrast，避免 agent 把任意 progress bar 自动做成 gradient。
