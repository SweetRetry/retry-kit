# Seedance 2.5 提示词指南：一手来源研究记录

研究日期：2026-07-31

原始来源：[【实践手册】Doubao-Seedance-2.5：企业级业务场景实践指南](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO)

## 研究问题

本文只整理原始文档 `5.2｜提示词指南` 的可复用信息，回答：

1. 无参考素材时，文本指令由哪些信息组成；
2. 使用图片、视频和音频参考时，如何声明素材职责；
3. 如何区分音乐、音效、台词和字幕，以及如何约束语言；
4. 哪些表述是文档明确给出的模型用法，哪些只是据此形成的推断或采用建议。

## 来源范围与方法

唯一外部来源是 ByteDance 飞书文档中的
[`5.2｜提示词指南`](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#LNpDdOt1jocCkdxPuOdc60i9nOc)，
具体覆盖三个子节：

- [`文本指令的基础公式`](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#WTDgdctPbodrpOxoa08ciM2WnPl)；
- [`有参考时，明确素材职责`](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#YmJ1dRfoYouoFJxZ5sOcx9QYnBh)；
- [`声音与文字的特殊字符`](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#Hsc3dbVKdobUK0xsWVdc17QEnGh)。

读取时使用文档的公开只读页面。由于 Lark 正文采用虚拟化渲染，先读取语义树和目录，再沿正文实际
滚动容器逐段提取，并以截图核对区块顺序；以 `5.2` 为起点、`5.3｜方舟体验中心试用` 为终点。
本文不纳入文档其他章节中的应用案例 Prompt，也不把页面中的模型能力、价格、开放日期或 API 信息
扩展为提示词规则。

## 一手来源事实

### 1. 文本指令先说明内容，其余维度按需加入

**事实：** 文档给出的组合顺序是“主体 + 动作或事件”，再按需要补充场景与环境、视觉风格、
运镜或切镜、声音。只有主体和发生的事构成内容基础，其余部分明确标为可选。
[来源](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#WTDgdctPbodrpOxoa08ciM2WnPl)

各维度在文档中的职责是：

- 主体与事件：交代谁或什么正在做什么；动作先概括主要过程，只细化关键动作，避免重复；
- 场景与环境：交代地点、时间、天气、空间关系和背景状态；
- 视觉风格：交代光线、色彩、材质、画面质感或整体氛围；
- 运镜或切镜：交代景别、机位、镜头运动、对焦对象和镜头衔接；
- 声音：交代对白、音色、环境声、音效和音乐。

**事实：** 文档示范的基础模板采用四层表达：内容与事件、视觉呈现、镜头表达、声音。没有需要的
层可以省略。生成参数不写入提示词，应由生成页面或接口设置。
[来源](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#WTDgdctPbodrpOxoa08ciM2WnPl)

### 2. 参考素材必须绑定到明确职责

**事实：** 上传参考素材后，需要逐份说明它提供什么，不能只依赖图片内的文字标注，也不能让模型
自行判断多份素材分别对应哪个人物、道具或场景。文档按素材类型给出的职责包括：

- 图片：主体的外貌、服装、结构、材质，也可定义场景结构与光线；
- 视频：动作、运镜、节奏和顺序；
- 音频：角色或声音类型的音色、台词、环境声或音乐。

[来源](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#YmJ1dRfoYouoFJxZ5sOcx9QYnBh)

**事实：** 当素材中的人物、背景、构图、身份、服装或场景可能被错误带入成片时，文档要求补充
“不采用什么”。示例把角色外观、工作室结构与动作节奏分配给不同参考，同时排除各素材中不属于
该职责的背景、人物或场景。
[来源](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#YmJ1dRfoYouoFJxZ5sOcx9QYnBh)

**事实：** 多张图片若表示同一个人物或商品的不同视角，应逐张声明视角，并明确这些图片共同定义
同一个对象。文档的台灯示例还明确限制成片中只出现一个该对象。
[来源](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#YmJ1dRfoYouoFJxZ5sOcx9QYnBh)

**事实：** 当参考视频已经准确包含动作、运镜和顺序时，提示词只需说明继承范围，不必再次逐动作
复述；文档指出重复描述可能与素材冲突。白模视频主要提供运动与空间骨架，仍需补全希望生成的主体、
场景、动作和风格。
[来源](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#YmJ1dRfoYouoFJxZ5sOcx9QYnBh)

### 3. 声音与屏幕文字有模型特定的标记方式

**事实：** 提示词可以直接使用自然语言；需要进一步区分类型时，文档规定：

| 内容 | 标记 | 含义 |
| --- | --- | --- |
| 音乐 | `()` | 括号内描述背景音乐 |
| 音效 | `<>` | 尖括号内描述音效 |
| 台词 | `{}` | 花括号内写台词内容 |
| 字幕 | `【】` | 方头括号内写屏幕字幕 |

[来源](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#Hsc3dbVKdobUK0xsWVdc17QEnGh)

**事实：** 需要控制声音或字幕时，可以直接说明保留或不采用哪些声音类别。画面仍优先使用正向描述；
文档把明确限制集中在素材职责、编辑范围和容易被误带入的内容。
[来源](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#Hsc3dbVKdobUK0xsWVdc17QEnGh)

**事实：** 非中文台词应在台词前声明语言；需要控制地区语言习惯时，文档建议继续声明地区变体或
口音、表达方式和说话人，再用 `{}` 写出台词。其顺序可概括为：
`台词语言 → 地区变体或口音 → 表达方式 → 说话人 → 台词内容`。
[来源](https://bytedance.larkoffice.com/docx/XiOMdHDjOoolp6xrYabcMMM6nrO#Hsc3dbVKdobUK0xsWVdc17QEnGh)

## 推断

以下不是原文逐句结论，而是对上述事实的结构化归纳：

1. 这套方法的核心不是堆叠风格关键词，而是先定义视频事件，再按任务需要增加成像、镜头和声音控制。
2. 有参考素材时，主要控制问题从“描述得更多”转为“绑定得更清楚”：每份素材只承担声明过的职责，
   并排除高概率误继承内容。
3. 文本与参考素材描述同一动作时存在冲突风险。参考已经精确表达的信息应被引用，不应被冗余改写。
4. 内容指令、素材绑定与生成参数属于三层不同控制面；文档明确把生成参数留给页面或接口。
5. `()`、`<>`、`{}`、`【】` 及语言声明是 Seedance 2.5 的用法合同，不能据此推断其他视频模型
   使用相同语法。

## 采用建议

研究本身不改变仓库中的任何 skill。若后续要把结论写入某个生成 skill，建议：

1. 把“主体 / 事件优先，其他维度按需加入”作为信息选择顺序，不把五个维度变成固定必填表单；
2. 把多模态参考写成显式的 `素材 → 职责 → 排除项` 映射，并为多视角素材声明同一对象身份；
3. 对已由参考视频完整表达的动作与运镜采用继承说明，避免逐动作重复；
4. 将 Seedance 特殊字符与语言公式保留为模型特定规则，不提升为跨模型通用合同；
5. 保持事实、推断和建议分层；是否采用这些原则，仍需回到对应 `SKILL.md` 的真实决策点单独评估。

## 局限

1. 本文只有一份 ByteDance 飞书实践手册作为来源，没有用独立实验验证各写法对生成稳定性的影响。
2. 页面显示文档最新修改时间为 07 月 31 日；在线文档可继续更新，本文只代表 2026-07-31 的读取结果。
3. 文档页面当时可公开只读，但显示“登录/注册”；本次没有访问评论、编辑历史或登录后可见的附加内容。
4. Lark 正文采用虚拟化渲染，因此本文使用逐段滚动提取并截图核对，而不是一次性导出。已覆盖 `5.2`
   的三个目录子节，未发现权限缺失；嵌入视频的画面与音频不属于本次范围。
5. 原始示例以陶艺师、台灯和多语言台词说明规则。为避免大段复制，本文保留规则与映射关系，没有
   逐字收录完整示例。
