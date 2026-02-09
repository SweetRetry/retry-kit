---
name: anime-video-prompt-gen
description: 为漫剧短视频生成 AI 视频生成工具的专业 prompt。支持仙侠、武侠、古风、都市奇幻、都市言情、热血战斗、末日废土、悬疑推理、校园青春、科幻未来等全题材，输出中英双语 prompt，包含分镜时间轴、镜头运动、光影氛围、特效描述和角色一致性锚点。涉及具体模型参数时联动 fal-ai-model-search skill 查询真实参数，不猜测。触发场景：(1) 用户需要生成漫剧/动漫短视频的 AI 视频 prompt，(2) 用户提到"视频脚本"、"视频prompt"、"分镜"、"AI视频"、"漫剧视频"，(3) 用户想把故事/剧情转化为 AI 视频生成的提示词，(4) 用户需要多镜头连贯叙事的视频 prompt 方案。
---

# 漫剧短视频 AI Prompt 生成器

为漫剧短视频场景生成适配主流 AI 视频工具的专业 prompt，输出中英双语，支持分镜级精细控制。

## 工作流程

1. **收集信息** — 确认题材、角色、剧情、目标工具、时长
2. **查询模型参数** — 若用户指定 fal.ai 平台模型或需要具体模型参数，**必须**调用 `fal-ai-model-search` skill 搜索模型并获取真实参数（分辨率、时长限制、支持的参数等），禁止凭空猜测
3. **建立角色锚点** — 为每个角色创建固定描述，确保跨镜头一致性
4. **设计分镜** — 按叙事节奏拆分镜头，规划景别、运动、转场
5. **生成 Prompt** — 按目标工具格式输出中英双语 prompt
6. **审查优化** — 检查角色一致性、节奏连贯性、特效合理性

## 信息收集清单

开始前向用户确认：

- **题材风格**：仙侠/武侠/古风/都市奇幻/都市言情/热血战斗/末日废土/悬疑推理/校园青春/科幻未来
- **核心角色**：外貌、服装、标志性特征、道具
- **剧情概要**：关键事件、情绪弧线、高潮点
- **目标工具**：用户指定的 AI 视频生成工具或模型（若指定具体模型，须通过 `fal-ai-model-search` 查询真实参数）
- **单镜时长**：5s / 10s / 15s / 20s
- **总镜头数**：用户期望的分镜数量（默认 5-8 个）

如信息不完整，主动询问缺失项再开始生成。

## 模型参数查询（fal-ai-model-search 联动）

当涉及具体 AI 视频模型的参数（分辨率、时长、宽高比、支持的参数字段等）时，**禁止猜测**，必须通过 `fal-ai-model-search` skill 获取真实信息：

1. **用户指定了 fal.ai 平台模型** → 调用 `fal-ai-model-search` 搜索该模型，获取 llms.txt 中的 API 参数
2. **用户未指定工具但需要推荐** → 调用 `fal-ai-model-search` 搜索 "video generation" 类模型，根据实际支持能力推荐
3. **需要确认模型限制**（如最大时长、支持的分辨率） → 从模型详情页获取，而非依赖参考文档中的静态信息

查询后，将模型的实际参数约束体现在 prompt 输出中（如适配实际支持的时长、分辨率比例等）。

## 角色锚点模板

为每个角色建立固定描述，在所有镜头 prompt 中严格复用：

```
【角色锚点】
称呼：[名字/代号]
CN：[性别]，[年龄段]，[面部特征]，[发型发色]，[服装主体+细节]，[标志性配饰]，[标志性道具]
EN：[gender], [age], [facial features], [hair], [clothing + details], [signature accessory], [signature prop]
```

**示例：**
```
称呼：凌霄
CN：青年男子，二十出头，剑眉星目面容冷峻，黑色长发束高马尾，白色丝质仙袍衣领袖口金色云纹刺绣，腰佩青玉坠，右手持寒光玉剑
EN：a young man in his early 20s, sharp eyebrows and piercing eyes with a cold expression, long black hair in a high ponytail, white silk celestial robes with golden cloud embroidery on collar and cuffs, jade pendant at waist, holding a frost-glowing jade sword in right hand
```

规则：
- 每个镜头 prompt 必须包含角色锚点描述（可根据景别略作精简）
- 特写镜头聚焦面部特征和表情，全景聚焦服装和体态
- 2-3 个最显著特征在所有镜头中必须出现（如 "white robes with gold embroidery" + "high ponytail" + "jade sword"）

## 分镜设计规范

### 叙事节奏模板（默认 6 镜头）

| 序号 | 功能 | 建议景别 | 建议时长 |
|------|------|---------|---------|
| 1 | 环境建立 | 大远景/远景 | 3-5s |
| 2 | 角色登场 | 中景/全景 | 3-5s |
| 3 | 情绪铺垫 | 中近景/近景 | 3-5s |
| 4 | 冲突/转折 | 多景别混合 | 5-10s |
| 5 | 高潮 | 特写+远景交替 | 5-10s |
| 6 | 收束/悬念 | 远景/特写 | 3-5s |

可根据实际剧情调整镜头数量和节奏。

### 单镜 Prompt 结构

每个镜头 prompt 严格按以下顺序组织：

```
[镜头序号] [景别+运动]
主体：[角色锚点描述]
动作：[具体动作描述]
场景：[环境细节]
光影：[光影氛围]
特效：[视觉特效]（如有）
转场：[到下一镜的转场方式]
风格：[画面风格关键词]
```

## Prompt 输出格式

为每个镜头同时输出中英文版本：

```
━━━ 镜头 X/N ━━━
⏱ 时长：Xs
🎬 景别：[景别] | 运动：[镜头运动]
🔄 转场：[转场到下一镜]

【中文 Prompt】
[完整中文 prompt]

【English Prompt】
[完整英文 prompt]

【角色一致性检查】✅ 包含锚点特征：[列出本镜头保留的锚点特征]
━━━━━━━━━━━━━━
```

## 输出示例

**用户请求：** 仙侠题材，角色"凌霄"在悬崖边御剑飞升，3个镜头

**输出：**

```
━━━ 镜头 1/3 ━━━
⏱ 时长：5s
🎬 景别：大远景 | 运动：缓慢推进
🔄 转场：交叉溶解至镜头2

【中文 Prompt】
雄伟悬崖边缘，云海翻涌，一位身穿白色丝质仙袍、金色云纹刺绣的青年男子背对镜头站立，黑色长发高马尾随风飘扬，右手持寒光玉剑垂于身侧，远处浮空山峰若隐若现，金色夕阳穿透云层洒下神圣光线，镜头缓缓推进，仙侠风格，电影质感，体积光

【English Prompt】
Extreme wide shot, slowly pushing in. A young man in white silk celestial robes with golden cloud embroidery stands at the edge of a majestic cliff, his long black hair in a high ponytail flowing in the wind, a frost-glowing jade sword held at his side. A vast sea of clouds churns below, floating mountain peaks visible in the distance. Golden sunset pierces through clouds casting god rays. Chinese xianxia fantasy style, cinematic color grading, volumetric lighting, 4K.

【角色一致性检查】✅ 白色仙袍金色云纹 | 高马尾黑发 | 玉剑
━━━━━━━━━━━━━━

━━━ 镜头 2/3 ━━━
⏱ 时长：5s
🎬 景别：中近景→全景 | 运动：环绕后快速拉远
🔄 转场：匹配剪辑至镜头3

【中文 Prompt】
青年男子剑眉星目面容坚毅，白色仙袍金色云纹刺绣随风鼓动，黑色高马尾飞扬，双手举起寒光玉剑指向天空，全身爆发青蓝色灵气光环，脚下悬崖岩石碎裂，镜头从中近景环绕至身后快速拉远，玉剑剑尖聚集的光芒越来越亮，体积光，粒子特效

【English Prompt】
Medium close-up orbiting to full shot, then rapid pull-back. The young man with sharp eyebrows and piercing eyes, wearing white silk celestial robes with golden cloud embroidery, raises his frost-glowing jade sword skyward with both hands. Cyan spiritual energy aura erupts around his body, rocks cracking beneath his feet at the cliff edge. His high black ponytail whips in the surge of power. The sword tip gathers intensifying light. Volumetric lighting, particle effects, Chinese xianxia style, cinematic.

【角色一致性检查】✅ 白色仙袍金色云纹 | 剑眉星目 | 高马尾黑发 | 玉剑
━━━━━━━━━━━━━━

━━━ 镜头 3/3 ━━━
⏱ 时长：5s
🎬 景别：全景→大远景 | 运动：跟拍上升后固定
🔄 转场：淡出

【中文 Prompt】
白衣金纹青年脚踏寒光玉剑从悬崖边缘腾空而起，化为一道青白色流光冲入云海，黑色高马尾和白色仙袍衣袂在风中猎猎作响，镜头先跟拍上升再固定于远景，人物越来越小消失在金色云层中，残留的灵气粒子缓缓消散，夕阳余晖，仙侠风格，电影质感

【English Prompt】
Full shot following upward, then holding at extreme wide. The young man in white celestial robes with golden cloud embroidery launches from the cliff edge, standing on his glowing jade sword. He shoots upward as a streak of cyan-white light into the sea of clouds, his high black ponytail and robe sleeves streaming behind him. Camera follows the ascent then holds still as the figure shrinks into the golden cloud layer. Lingering spiritual energy particles slowly dissipate. Sunset glow, Chinese xianxia fantasy, cinematic atmosphere, god rays.

【角色一致性检查】✅ 白衣金纹 | 高马尾黑发 | 玉剑
━━━━━━━━━━━━━━
```

## 参考资料

根据需要加载以下参考文档：

- **[references/genres.md](references/genres.md)** — 全题材视觉关键词库（仙侠、武侠、古风、都市、末日、悬疑、校园、科幻），含中英文视觉关键词、典型场景、色彩基调和推荐光影。**查找特定题材的视觉灵感时加载。**
- **[references/camera-and-effects.md](references/camera-and-effects.md)** — 镜头景别、镜头运动、转场方式、光影氛围、特效类型、音乐节奏的中英对照速查表。**设计分镜或需要精确镜头/特效术语时加载。**
- **[references/ai-tools-guide.md](references/ai-tools-guide.md)** — 通用 prompt 格式模板、模型参数查询流程（`fal-ai-model-search` 联动）、角色一致性策略。**需要查阅通用格式或角色一致性方案时加载。**

## 质量检查清单

每次生成完成后自查：

- [ ] 每个镜头的角色描述是否包含锚点关键特征
- [ ] 镜头之间的叙事逻辑是否连贯
- [ ] 景别变化是否合理（避免连续多个相同景别）
- [ ] 镜头运动是否与情绪匹配
- [ ] 转场方式是否与节奏衔接
- [ ] 中英文 prompt 语义是否一致
- [ ] prompt 长度是否适配目标工具（若指定了具体模型，须按查询到的实际参数调整）
- [ ] 否定词是否已避免（不使用 "no"/"without"/"不要"）
