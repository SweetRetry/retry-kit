---
name: video-prompt
description: 为任意类型视频生成 AI 视频工具的专业 prompt。支持动漫、真人实拍、产品广告、Vlog、纪录片、MV 等全类型视频，支持图片输入（视觉参考或首帧起始），输出紧凑流式格式，包含分镜时间轴、镜头运动、光影氛围、特效描述和主体一致性锚点。触发场景：(1) 用户需要生成 AI 视频 prompt（任何视频类型），(2) 用户提到"视频脚本"、"视频prompt"、"分镜"、"AI视频"、"漫剧视频"、"产品视频"、"宣传片"，(3) 用户想把故事/剧情/产品/场景转化为 AI 视频生成的提示词，(4) 用户需要多镜头连贯叙事的视频 prompt 方案，(5) 用户提供图片并希望生成视频。
---

# AI 视频 Prompt 生成器

为任意类型视频生成专业 AI 视频 prompt，采用紧凑流式格式，便于直接复制使用。

## 工作流程

1. **收集信息** — 确认视频类型、视觉风格、主体、剧情/展示内容、时长、镜头数
2. **建立主体锚点** — 为核心主体（角色/产品/场景）创建固定描述，确保跨镜头一致性
3. **处理图片输入**（如有）— 确认用途并融入工作流
4. **设计分镜** — 按叙事节奏拆分镜头，规划景别、运动、转场
5. **生成 Prompt** — 按紧凑流式格式输出
6. **审查优化** — 检查主体一致性、节奏连贯性、特效合理性

## 信息收集清单

开始前向用户确认：

- **视频类型**：电影叙事 / 动漫短片 / 产品广告 / 纪录片风光 / Vlog / MV / 教程演示 / 其他
- **视觉风格**：参见 [visual-styles.md](references/visual-styles.md) 中的 10 种分类，或用户自定义
- **核心主体**：角色（外貌、服装、标志特征）/ 产品（材质、颜色、形态）/ 场景（地理、天气、氛围）
- **内容概要**：关键事件 / 展示流程 / 情绪弧线 / 高潮点
- **总时长**：用户期望的视频时长（秒）
- **镜头数量**：用户期望的分镜数量
- **图片输入**（如有）：确认用途（见下方"图片输入处理"节）

如信息不完整，主动询问缺失项再开始生成。

**软建议（非硬约束）：**

- 节奏参考：每 10 秒约 2-3 个镜头
- 单个镜头建议 2-5 秒，避免过短（<1s）或过长（>8s）

## 输出语言

所有输出（主体锚点、分镜 prompt）统一使用单一语言：

- **默认**：跟随用户的自然语言（用户用中文对话则输出中文，用英文对话则输出英文）
- **指定**：如果用户明确要求特定语言（如"输出英文 prompt"、"用中文写"），按用户指定输出

## 图片输入处理

当用户提供图片时，**必须先确认用途**再继续：

> 你提供了一张图片，请确认它的用途：
>
> - **(A) 视觉参考** — 我从中提取风格、色调、构图等特征，融入 prompt 描述
> - **(B) 首帧起始** — 以这张图作为视频第一帧，prompt 描述后续运动和变化

**模式 A — 视觉参考：**

1. 分析图片的色调、光影、构图、材质、氛围
2. 将提取的视觉特征写入 Style 行和主体锚点
3. 正常生成完整多镜头 prompt

**模式 B — 首帧输入（Image-to-Video）：**

1. 分析图片内容，建立主体锚点
2. Shot 01 的 prompt 描述"从当前画面开始"的运动和变化，不重复描述静态内容
3. 后续镜头正常生成

## 主体锚点模板

为核心主体建立固定描述，在所有镜头 prompt 中严格复用。

### 角色锚点

```
称呼：[名字/代号]
描述：[性别]，[年龄段]，[面部特征]，[发型发色]，[服装主体+细节]，[标志性配饰]，[标志性道具]
```

**示例：**

```
称呼：凌霄
描述：青年男子，二十出头，剑眉星目面容冷峻，黑色长发束高马尾，白色丝质仙袍金色云纹刺绣，腰佩青玉坠，右手持寒光玉剑
```

### 产品锚点

```
产品：[名称/类别]
描述：[材质/表面处理]，[核心外观特征]，[尺寸/比例印象]，[品牌标识元素]
```

**示例：**

```
产品：AirPods Pro 风格耳机
描述：磨砂白聚碳酸酯外壳，短柄入耳式设计，椭圆充电盒正面一条 LED 指示灯带，盒盖中央压印极简 logo
```

### 场景锚点

```
场景：[名称/描述]
描述：[地理环境]，[天气/时间/季节]，[核心自然元素]，[氛围关键词]
```

**示例：**

```
场景：高山晨湖
描述：海拔 3000 米高山湖泊，薄雾黎明，雪山倒映静水，岩石岸线稀疏松林，宁静原始
```

**规则：**

- 每个镜头必须包含主体锚点关键特征（可根据景别精简）
- 特写聚焦核心细节，全景聚焦整体轮廓与环境关系
- 2-3 个最显著特征在所有镜头中必须出现
- **字符限制**：单个 prompt 不超过 1000 字符

## 分镜设计规范

### 节奏参考

根据用户指定的总时长和镜头数灵活分配。以下为通用节奏参考：

| 功能 | 建议景别 | 建议时长占比 |
|------|---------|------------|
| 建立/开场 | 大远景/远景/产品全貌 | 15-20% |
| 展开/互动 | 中景/全景/产品特写 | 25-35% |
| 铺垫/转折 | 中近景/近景/细节微距 | 20-30% |
| 高潮/核心 | 特写+多景别/核心卖点 | 20-30% |
| 收束/定格 | 远景/特写/Logo 定帧 | 10-15% |

**注意：** 镜头数少于 5 时可合并功能，多于 5 时可拆分展开和高潮段。

### 紧凑流式格式

**标准输出格式：**

```markdown
Style: [全局视觉风格]
Mood: [整体情绪基调]

Shot 01 (开始s-结束s): [景别+运动] 主体描述 -> 动作触发特效. 补充细节.
Shot 02 (开始s-结束s): [景别+运动] 主体动作 + 同时特效. 转场提示.
Shot 03 (开始s-结束s): [景别+运动] 主体动作. 收尾特效.
```

**格式说明：**

| 元素 | 含义 | 示例 |
|------|------|------|
| `Style:` | 全局风格定义（只出现一次） | `Style: Cinematic live-action, anamorphic, teal-orange grade` |
| `Mood:` | 情绪基调（帮助 AI 理解氛围） | `Mood: epic, triumphant` |
| `Shot XX` | 镜头序号 | `Shot 01`, `Shot 02` |
| `(Xs-Ys)` | 时间轴 | `(0-3s)`, `(3-7s)` |
| `[景别+运动]` | 画面范围+镜头运动 | `[Close-up tracking]`, `[Wide shot panning]` |
| `->` | 动作触发/结果 | `raises sword -> cyan aura erupts` |
| `+` | 同时发生 | `sparks flying + shockwave ring` |

## 输出示例

### 示例 1：电影叙事（真人实拍）

```markdown
Style: Cinematic live-action, 35mm anamorphic, shallow depth of field, teal-orange color grade
Mood: tense, determined, building to triumph

Shot 01 (0-4s): [Extreme wide slow push in] A woman in her 30s, dark trench coat, cropped silver hair -> stands alone on rain-soaked rooftop at night. City lights blurred in background. Wind whipping coat. Thunder rumbles.
Shot 02 (4-8s): [Close-up rack focus] Her steel-grey eyes narrowing -> pulls out worn photograph from pocket. Rain drops hitting photo surface. Backlit rim light on jawline. Subtle breath mist.
Shot 03 (8-12s): [Medium tracking orbit] She turns, strides toward rooftop door -> pushes through with force + coat billowing behind. Camera follows then holds as door slams. Fade to black.
```

### 示例 2：动漫短片（仙侠飞升）

```markdown
Style: Chinese xianxia fantasy, cinematic anime, ethereal lighting, volumetric god rays, particle effects
Mood: transcendent, awe-inspiring

Shot 01 (0-3s): [Extreme wide slow push in] White-robed youth with golden embroidery, high ponytail, holding jade sword -> stands at cliff edge facing away. Sea of clouds churning below, floating peaks in distance. Golden sunset piercing through clouds.
Shot 02 (3-7s): [Medium close orbit then rapid pull back] Youth raises jade sword skyward -> cyan spiritual aura erupts, rocks cracking beneath feet. Sword tip gathers intensifying light. Particle burst.
Shot 03 (7-10s): [Full shot following upward then hold] Youth launches on glowing sword -> streak of cyan-white light into clouds. Hair and robes streaming. Figure shrinks into golden cloud layer. Fade out with dissipating particles.
```

### 示例 3：产品广告（耳机展示）

```markdown
Style: Product hero shot, dark gradient studio backdrop, sleek reflections, premium feel
Mood: sleek, modern, desirable

Shot 01 (0-3s): [Close-up static then slow push in] Matte black wireless earbuds with rose-gold accent ring resting on dark reflective surface. Soft edge lighting revealing material texture. Subtle light sweep across surface.
Shot 02 (3-6s): [Medium turntable rotation] Charging case slowly rotating 180° -> lid opens smoothly revealing earbuds seated inside. LED indicator strip glows blue. Clean white light from above.
Shot 03 (6-9s): [Extreme close-up macro] Camera pushes into earbud tip -> reveals micro-perforated mesh detail + rose-gold ring catching light. Shallow depth of field. Background dissolves to pure black.
Shot 04 (9-12s): [Wide pull back] Both earbuds floating mid-air with soft glow -> brand logo fades in below. Minimal, centered composition. Fade out.
```

### 示例 4：纪录片风光（高山湖泊）

```markdown
Style: Documentary nature, 4K aerial, rich natural colors, serene atmosphere
Mood: peaceful, vast, meditative

Shot 01 (0-5s): [Extreme wide drone descending] Alpine lake at dawn, snow-capped peaks reflected in mirror-still water. Thin mist layer hovering above surface. First golden light touching mountain ridge.
Shot 02 (5-10s): [Medium tracking at water level] Camera glides above lake surface -> mist parting gently. Pine trees along shoreline emerging from fog. Bird silhouette crossing frame. Ambient water ripples.
Shot 03 (10-15s): [Wide slow crane up] Rising from lakeside rocks -> revealing full panorama of lake, mountains, and sky. Clouds tinged pink and gold. Time-lapse cloud movement. Fade to white.
```

## 参考资料

根据需要加载以下参考文档：

- **[references/visual-styles.md](references/visual-styles.md)** — 10 种通用视觉风格分类（电影实拍、动漫、国风、产品摄影、扁平插画、纪录片、赛博朋克、复古、极简、超现实），含中英文视觉关键词、典型主题、色彩基调和推荐光影。
- **[references/camera-and-effects.md](references/camera-and-effects.md)** — 镜头景别、镜头运动、转场方式、光影氛围、特效类型的中英对照速查表。
- **[references/ai-tools-guide.md](references/ai-tools-guide.md)** — AI 视频工具通用 Prompt 原则、主体一致性策略与描述模板。

## 质量检查清单

每次生成完成后自查：

- [ ] 每个镜头包含主体锚点关键特征
- [ ] 镜头之间叙事逻辑连贯
- [ ] 景别变化合理（避免连续相同景别）
- [ ] 镜头运动与情绪匹配
- [ ] 时间轴总和等于总时长
- [ ] 单个 prompt ≤ 1000 字符
- [ ] 否定词已避免（不使用 "no"/"without"/"不要"）
- [ ] 图片输入已按用户确认的模式正确处理（如适用）
