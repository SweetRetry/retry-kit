---
name: anime-video-prompt-gen
description: 为漫剧短视频生成 AI 视频生成工具的专业 prompt。支持仙侠、武侠、古风、都市奇幻、都市言情、热血战斗、末日废土、悬疑推理、校园青春、科幻未来等全题材，输出紧凑流式格式，包含分镜时间轴、镜头运动、光影氛围、特效描述和角色一致性锚点。触发场景：(1) 用户需要生成漫剧/动漫短视频的 AI 视频 prompt，(2) 用户提到"视频脚本"、"视频prompt"、"分镜"、"AI视频"、"漫剧视频"，(3) 用户想把故事/剧情转化为 AI 视频生成的提示词，(4) 用户需要多镜头连贯叙事的视频 prompt 方案。
---

# 漫剧短视频 AI Prompt 生成器

为漫剧短视频场景生成专业 AI 视频 prompt，采用紧凑流式格式，便于直接复制使用。

## 工作流程

1. **收集信息** — 确认题材、角色、剧情、时长
2. **建立角色锚点** — 为每个角色创建固定描述，确保跨镜头一致性
3. **设计分镜** — 按叙事节奏拆分镜头，规划景别、运动、转场
4. **生成 Prompt** — 按紧凑流式格式输出
5. **审查优化** — 检查角色一致性、节奏连贯性、特效合理性

## 信息收集清单

开始前向用户确认：

- **题材风格**：仙侠/武侠/古风/都市奇幻/都市言情/热血战斗/末日废土/悬疑推理/校园青春/科幻未来
- **核心角色**：外貌、服装、标志性特征、道具
- **剧情概要**：关键事件、情绪弧线、高潮点
- **总时长**：10s / 15s / 20s / 30s
- **总镜头数**：用户期望的分镜数量（默认 3-5 个，最多 5 个）

如信息不完整，主动询问缺失项再开始生成。

**约束条件：**
- **总时长**：单个视频脚本不超过 15 秒
- **分镜数量**：不超过 5 个镜头

## 角色锚点模板

为每个角色建立固定描述，在所有镜头 prompt 中严格复用：

```
称呼：[名字/代号]
CN：[性别]，[年龄段]，[面部特征]，[发型发色]，[服装主体+细节]，[标志性配饰]，[标志性道具]
EN：[gender], [age], [facial features], [hair], [clothing + details], [signature accessory], [signature prop]
```

**示例：**
```
称呼：凌霄
CN：青年男子，二十出头，剑眉星目面容冷峻，黑色长发束高马尾，白色丝质仙袍金色云纹刺绣，腰佩青玉坠，右手持寒光玉剑
EN：a young man in his early 20s, sharp eyebrows and piercing eyes with cold expression, long black hair in high ponytail, white silk celestial robes with golden cloud embroidery, jade pendant at waist, holding frost-glowing jade sword
```

**规则：**
- 每个镜头必须包含角色锚点描述（可根据景别精简）
- 特写聚焦面部特征和表情，全景聚焦服装和体态
- 2-3 个最显著特征在所有镜头中必须出现
- **字符限制**：单个 prompt 不超过 1000 字符

## 分镜设计规范

### 叙事节奏模板（最多 5 镜，总时长 ≤ 15s）

| 序号 | 功能 | 建议景别 | 建议时长 |
|------|------|---------|---------|
| 1 | 环境/角色建立 | 大远景/远景 | 2-3s |
| 2 | 角色登场/互动 | 中景/全景 | 2-4s |
| 3 | 情绪铺垫/转折 | 中近景/近景 | 2-4s |
| 4 | 高潮 | 特写+多景别 | 3-5s |
| 5 | 收束/定格 | 远景/特写 | 2-3s |

**总时长约束：≤ 15 秒**
**分镜数量约束：≤ 5 个**

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
| `Style:` | 全局风格定义（只出现一次） | `Style: School youth romance, soft pastel, cherry blossoms` |
| `Mood:` | 情绪基调（帮助AI理解氛围） | `Mood: heart-fluttering, innocent` |
| `Shot XX` | 镜头序号 | `Shot 01`, `Shot 02` |
| `(Xs-Ys)` | 时间轴 | `(0-3s)`, `(3-7s)` |
| `[景别+运动]` | 画面范围+镜头运动 | `[Close-up tracking]`, `[Wide shot panning]` |
| `->` | 动作触发/结果 | `raises sword -> cyan aura erupts` |
| `+` | 同时发生 | `sparks flying + shockwave ring` |

**常用景别：**
- `Extreme wide` 大远景 / `Wide` 远景 / `Medium` 中景 / `Close-up` 特写

**常用运动：**
- `static` 固定 / `tracking` 跟拍 / `push in` 推进 / `pull back` 拉远

## 输出示例

### 示例 1：仙侠飞升

```markdown
Style: Chinese xianxia fantasy, cinematic anime, ethereal lighting, volumetric god rays, particle effects

Shot 01 (0-3s): [Extreme wide slow push in] White-robed youth with golden embroidery, high ponytail, holding jade sword -> stands at cliff edge facing away. Sea of clouds churning below, floating peaks in distance. Golden sunset piercing through clouds.
Shot 02 (3-7s): [Medium close orbit then rapid pull back] Youth raises jade sword skyward -> cyan spiritual aura erupts, rocks cracking beneath feet. Sword tip gathers intensifying light. Particle burst.
Shot 03 (7-10s): [Full shot following upward then hold] Youth launches on glowing sword -> streak of cyan-white light into clouds. Hair and robes streaming. Figure shrinks into golden cloud layer. Fade out with dissipating particles.
```

### 示例 2：校园恋爱

```markdown
Style: School youth romance, fresh anime style, soft pastel tones, cherry blossom petals, warm afternoon light, dreamy bokeh

Shot 01 (0-3s): [Medium tracking] Chestnut wavy hair girl in summer uniform, pearl hair clip -> walking down hallway looking down at books. Cherry blossoms drifting past window frame. Sunlight streaming through.
Shot 02 (3-7s): [Close-up rack focus to two-shot] Black-haired boy and girl eyes meeting at corner -> pupils widen, time slows. Suspended petals between them. Backlit rim light on cheeks. Heartbeat glow effect.
Shot 03 (7-10s): [Extreme close-up eyes to medium zoom out] Mutual reflection in eyes -> shy smiles, blushing cheeks. Standing face to face in cherry blossom rain. Pink-golden sunset glow. Petal vortex surrounding. Fade out with heart-shaped bokeh.
```

### 示例 3：热血战斗

```markdown
Style: Martial arts anime, Manhwa style, high contrast ink strokes, dynamic speed lines, impact frames

Shot 01 (0-3s): [Close-up tracking] Swordsman with flowing white hair, tattered robes -> intense eyes narrowing in rain. Water droplets frozen mid-air. Lightning flash illuminates face.
Shot 02 (3-7s): [Wide Dutch angle] Two figures clash swords mid-air -> sparks flying + shockwave ring. Motion blur trails. "CLANG" SFX visual impact frame. Rain scattering radially.
Shot 03 (7-10s): [Extreme wide crane up] Victor lands on wet rooftop, sword dripping -> opponent falling into mist below. Camera shakes on impact. Static pose with cloak billowing. Fade to black.
```

### 示例 4：末日废土

```markdown
Style: Post-apocalyptic, dust storm atmosphere, desaturated tones, gritty texture, overcast diffused light

Shot 01 (0-3s): [Extreme wide static] Lone figure in tattered cloak traverses ruined highway -> dust swirling around boots. Collapsed skyscrapers in background. Overcast sky with god rays breaking through clouds.
Shot 02 (3-6s): [Medium tracking] Close-up of gas mask breathing, condensation on visor -> pulls out makeshift weapon. Eyes narrow behind scratched lenses. Tension building.
Shot 03 (6-10s): [Wide rapid zoom] Mutant creature leaps from shadows -> protagonist fires weapon + muzzle flash illuminating dust particles. Creature recoils. Static pose with weapon smoking. Fade out.
```

## 参考资料

根据需要加载以下参考文档：

- **[references/genres.md](references/genres.md)** — 全题材视觉关键词库（仙侠、武侠、古风、都市、末日、悬疑、校园、科幻），含中英文视觉关键词、典型场景、色彩基调和推荐光影。
- **[references/camera-and-effects.md](references/camera-and-effects.md)** — 镜头景别、镜头运动、转场方式、光影氛围、特效类型的中英对照速查表。

## 质量检查清单

每次生成完成后自查：

- [ ] 每个镜头包含角色锚点关键特征
- [ ] 镜头之间叙事逻辑连贯
- [ ] 景别变化合理（避免连续相同景别）
- [ ] 镜头运动与情绪匹配
- [ ] 时间轴总和等于总时长
- [ ] 单个 prompt ≤ 1000 字符
- [ ] 否定词已避免（不使用 "no"/"without"/"不要"）
