---
name: image-prompt
description: 通用 AI 图像生成 Prompt 工坊。基于黄金结构（主体 → 环境 → 风格 → 光照 → 技术参数）为任意类型图像生成高质量 prompt。覆盖全场景：人像、风景、产品摄影、美食、建筑、概念艺术、时尚、静物、微距、航拍、街拍、动物、UI 素材、抽象纹理等。支持高级控制（JSON 结构化、HEX 精确颜色、多语言文化锚定、空间构图指令）。触发场景：(1) 用户需要生成 AI 图像 prompt，(2) 用户提到"图片prompt"、"图像生成"、"AI绘图"、"生图"、"image prompt"、"text to image"，(3) 用户描述一个画面并希望转化为可用的生成提示词，(4) 用户需要产品图、人像、风景、概念设计等各类图像的 prompt。
---

# 图像 Prompt 工坊

## 黄金结构

| 层级 | 内容 | 权重 |
|------|------|------|
| **主体** | 谁/什么，材质、纹理、动作、表情 | ★★★★★ |
| **环境** | 时间、地点、背景、天气 | ★★★★ |
| **风格** | 摄影/艺术流派/电影参考 | ★★★★ |
| **光照** | 方向、硬/柔、色温 | ★★★ |
| **技术参数** | 镜头焦距、景深、画幅 | ★★ |

最重要的视觉元素排最前，模型对前部内容给予更高注意力。

## 核心原则

- **叙事优先** — 用画面动势、情绪、张力驱动，不堆砌参数
- **具体 > 笼统** — "weathered oak table with coffee ring stains" 而非 "table"
- **动态 > 静态** — 即使静止画面也写风的影响、光的流动
- **宁短勿长** — 砍掉后画面不塌的描写一律砍掉
- **信任模型** — 常见场景不必事无巨细
- **材质写视觉** — "brushed stainless steel catching light" 而非 "metal surface"
- **色彩写具体** — "crimson" / "#C7254E crimson" 而非 "red"
- **禁质量尾巴** — 不追加 "masterpiece, best quality, ultra-detailed"
- **跟随用户语言** — 用户中文则输出中文 prompt，用户英文则输出英文 prompt

## 流程

1. **理解意图** — 用途、期望风格、情绪基调；不明确时询问以下三点：
   - 用途（商用/个人/平台）→ 影响风格选择和安全内容边界
   - 工具偏好（如有）→ 影响参数格式和 negative prompt 结构
   - 情绪基调 1-3 词 → 快速锁定风格范围
2. **确定场景类型** → 参考下方「场景类型速查」
3. **选择风格** → 参考下方「风格与构图速查」
4. **构建画面** — 核心视觉锤 → 环境氛围 → 技术参数
5. **避坑自检** → 参考下方「高级控制与避坑」
6. **一气呵成**，最重要的视觉元素排最前
7. 补充 Negative Prompt 和 Meta

## 质量检查

- [ ] 画面有明确的视觉焦点
- [ ] prompt 已足够短，无冗余装饰
- [ ] 风格统一，最多 1 主导 + 1 辅助
- [ ] 手部交互保持简单，主体 ≤ 3 个
- [ ] 如有文字，用双引号、保持简短
- [ ] 构图/景别/描写指向同一画面，无矛盾

## 输出格式

```
## Prompt
[一条完整 prompt，逗号分隔，最重要的视觉元素排最前]

## Negative Prompt
[排除项，简洁有效，5-15 词条]

## Meta
- **场景类型**: [类型名]
- **风格**: [风格名]
- **画幅**: [推荐比例及原因]
- **情绪**: [3-5 个词]
- **建议**: [可选]
```

## 示例

### 产品摄影 — 手表（英文 prompt）

> 材质精确到 "brushed stainless steel" + "polished chamfered edges"；反射面创造环境互动；背景渐变到黑保持干净。

**输入**: 一块高端手表的产品图

**Prompt**: luxury mechanical wristwatch with exposed movement visible through sapphire caseback, brushed stainless steel case with polished chamfered edges, deep midnight blue sunburst dial, applied rhodium-plated hour markers, alligator leather strap in dark brown, watch resting at slight angle on polished black obsidian surface, soft studio lighting from upper left creating gentle highlights on case curves and strap texture, subtle reflection on surface beneath, clean dark gradient background fading to black, commercial product photography, 100mm macro lens, f/8, crisp detail

**Negative Prompt**: blurry, busy background, watermark, text, multiple watches, scratches

**Meta**: 产品摄影 / 商业产品摄影 / 4:5 竖版 / 精密, 奢华, 克制, 质感

---

### 电影感人像 — 雨夜街头（英文 prompt）

> 背后三分角避免正脸手部问题；霓虹反射在湿地面做冷暖对比；胶片色调锚定视觉氛围。

**输入**: 一个在雨中走在东京街头的女性

**Prompt**: cinematic photography, young woman walking alone on rain-soaked Shinjuku street at night, shot from behind at three-quarter angle, black leather jacket glistening with rain, short dark hair plastered to neck, transparent umbrella tilted slightly forward, neon signs of izakayas reflected in wet asphalt as streaks of pink and cyan, steam rising from a ramen shop on the left, shallow depth of field blurring distant pedestrians into bokeh silhouettes, anamorphic lens with horizontal flare from neon, teal and orange color grading, 35mm, f/1.8, cinematic film grain

**Negative Prompt**: low quality, deformed, cartoon, anime, bright daylight, watermark, extra limbs

**Meta**: 街拍 / 电影摄影 + 胶片 / 21:9 宽银幕 / 孤独, 霓虹, 雨夜, 忧郁

---

### 概念艺术 — 废土旅行者（中文 prompt）

> 用户使用中文描述时，输出中文 prompt；关键视觉词汇可保留英文专业术语。

**输入**: 一个废土世界的孤独旅行者站在沙漠废墟前

**弱 Prompt（反例）**: 废土旅行者，沙漠，废墟，好看的

**强 Prompt**: 概念艺术，孤独的旅行者站在坍塌的混凝土桥桥头，身着破损的军绿色风衣，背部朝向镜头，沙漠荒原延伸至地平线，地平线处有锈蚀的巨型钢架残骸，低垂的橙红色落日将天空染成 #E8602C 橙与灰紫色渐变，地面散落碎石与枯骨，前景有飞扬的沙尘，wide angle，戏剧性逆光，体积光穿过废墟缝隙，末世电影美学

**Negative Prompt**: 低质量，模糊，卡通，现代建筑，人群，绿色植被

**Meta**: 概念艺术 / 电影感 + 废土美学 / 16:9 宽幅 / 孤独, 末世, 壮阔, 悲凉

---

## 场景类型速查

每个场景只列**避坑要点**和**推荐技术参数**。

| 场景 | 避坑 | Negative | 推荐参数 |
|------|------|----------|----------|
| **人像** | 尽量 1-2 人；手部保持简单（托腮、握物）；不过度描述五官 | `extra fingers, fused fingers, deformed hands` | 85mm f/1.4 / 2:3 竖版 |
| **产品摄影** | 写材质光学特性（"frosted glass catching light"）而非泛写；避免多产品复杂排列 | `busy background, multiple products, scratches, watermark` | 100mm macro / f/8-f/11 / 1:1 或 4:5 |
| **风景** | 写"具体地貌 + 具体光照时刻"；前中后景分层；避免同时要求多种天气 | `overexposed sky, flat lighting, people, powerlines` | 16-35mm / f/11 / 16:9 或 21:9 |
| **美食** | 蒸汽写 "wispy steam rising"；写质感而非温度（"crispy golden crust"）；45° 和俯拍最安全 | `unappetizing, cold, dark, blurry texture` | 50mm / 90mm macro / f/2.8-f/4 / 4:5 竖版 |
| **建筑** | 明确建筑风格名称；室内写清视角；对称构图最安全 | `people blocking view, lens distortion, overcast flat` | 24mm tilt-shift / f/8 / 16:9 或 3:2 |
| **概念艺术** | 写设计意图而非堆细节；角色用 T-pose 或 3/4 视角；环境加 scale reference | `multiple characters, real photo, photorealistic skin` | wide angle / 16:9 宽幅 |
| **时尚** | 写服装材质和剪裁细节而非品牌名；模特动作保持简单；背景越干净成功率越高 | `deformed limbs, extra fingers, busy background, logo visible` | 85mm / f/2-f/4 / 2:3 竖版 |
| **静物** | 主体 3-5 个；明确道具空间关系（"scattered around" / "stacked"）；单一光源 | `cluttered, harsh shadows, flat lighting, cropped objects` | 90mm / f/5.6 / 1:1 或 4:5 |
| **微距** | 明确焦点落点（"sharp focus on the stamen"）；避免复杂背景 | `out of focus subject, busy background, motion blur` | 100mm macro / f/2.8 / 1:1 |
| **航拍** | 明确俯拍角度（top-down vs 45° 斜拍）；写清地貌类型；避免同时要求人脸细节 | `low altitude, haze, overexposed, noise` | 24mm / f/5.6 / top-down 或 45° / 16:9 |
| **街拍** | — | — | 35mm / 50mm / f/2 / high ISO grain / 3:2 |
| **动物** | 写动作瞬间（捕食、飞翔）和眼神质量，而非百科描述 | `blurry eyes, motion blur on face, unnatural pose` | 400mm telephoto / f/5.6 / fast shutter / 3:2 |
| **UI 素材** | 明确视角（正交/等距）；指定背景（透明/纯白）；写清图标风格 | `shadow, perspective distortion, realistic photo, text` | 正交/等距投影 / 透明背景 / 1:1 |
| **抽象** | 写"视觉动势"和"色彩关系"（"swirling indigo and gold fluid forms colliding"）；避免具象物体名称 | `recognizable objects, faces, text, rigid geometric` | 无特定镜头 / 1:1 或宽幅 |

---

## 风格与构图速查

### 摄影风格

| 风格 | 关键词 |
|------|--------|
| 纪实 | documentary photography, candid, decisive moment, grain |
| 肖像 | editorial portrait, studio lighting, dramatic |
| 电影感 | cinematic, anamorphic, film still, color grading |
| 胶片 | shot on Kodak Portra 400 / Fujifilm Pro 400H / Kodachrome / Ilford HP5 |
| 极简 | minimalist photography, negative space, clean |
| 暗调 | dark moody, chiaroscuro, low-key |
| 明亮 | light and airy, overexposed, soft pastel, high-key |
| 长曝光 | long exposure, light trails, silky water |

### 绘画与插画

| 风格 | 关键词 |
|------|--------|
| 油画 | oil painting, impasto, visible brushstrokes, canvas texture |
| 水彩 | watercolor, wet-on-wet, soft edges, paper texture |
| 数字绘画 | digital painting, artstation, semi-realistic |
| 扁平插画 | flat illustration, vector art, geometric, bold colors |
| 线描 | line art, ink drawing, cross-hatching |
| 动漫 | anime style, cel shading, manga |
| 像素 | pixel art, 8-bit, 16-bit, retro game |

### 3D 渲染

| 风格 | 关键词 |
|------|--------|
| 写实 3D | photorealistic 3D, Unreal Engine, ray tracing, PBR |
| 卡通 3D | Pixar style, clay render, stylized |
| 等距 | isometric 3D, low poly, diorama |
| 玻璃拟态 | glassmorphism, frosted glass, translucent |

### 时代与运动

| 风格 | 关键词 |
|------|--------|
| 文艺复兴 | Renaissance, chiaroscuro, sfumato |
| 巴洛克 | Baroque, dramatic, ornate, Caravaggio |
| 印象派 | Impressionist, Monet, dappled light |
| 新艺术 | Art Nouveau, organic curves, Mucha |
| 装饰艺术 | Art Deco, geometric, gold, 1920s |
| 波普 | Pop Art, Warhol, halftone |
| 赛博朋克 | Cyberpunk, neon, dystopian |
| 蒸汽朋克 | Steampunk, brass, clockwork |
| 合成波 | Synthwave, retrowave, 80s, sunset gradient |

### 电影参考

| 参考 | 视觉特征 |
|------|---------|
| Wes Anderson | 对称、粉彩、精心布景 |
| Blade Runner | 霓虹雨夜、蓝橙、体积雾 |
| Studio Ghibli | 水彩、田园、温暖光线 |
| Roger Deakins | 自然光、深度构图、极简色彩 |
| Wong Kar-wai | 饱和色彩、暧昧光影 |

用法：`in the style of [Director]` 或 `inspired by [Film] cinematography`

### 风格混合

1. 先定**主导风格**，再加**辅助风格**局部影响
2. 最多 2 种，3 种以上模型困惑
3. 连接词：`X style with Y elements` / `X inspired by Y`

### 构图法

| 构图 | 关键词 | 适用 |
|------|--------|------|
| 三分法 | rule of thirds | 通用 |
| 中心对称 | centered, symmetrical | 建筑、产品 |
| 对角线 | diagonal composition | 动态、冲突 |
| 框中框 | frame within frame | 门窗、拱门 |
| 引导线 | leading lines | 道路、走廊 |
| 负空间 | negative space | 极简、海报 |
| 前中后景 | foreground/midground/background | 风景、电影感 |

### 布光

| 布光 | 关键词 | 效果 |
|------|--------|------|
| 伦勃朗 | Rembrandt lighting | 面部三角光斑、戏剧性 |
| 蝶形光 | butterfly lighting | 突出颧骨、美妆 |
| 分裂光 | split lighting | 半明半暗、神秘 |
| 轮廓光 | rim light, edge light | 分离主体、发丝光 |
| 逆光 | backlight, contre-jour | 剪影、光晕 |
| 黄金时刻 | golden hour | 暖调、长影 |
| 蓝调时刻 | blue hour | 冷调、宁静 |
| 阴天 | overcast, diffused | 均匀、无硬影 |
| 窗光 | window light | 自然、侧向 |
| 特殊光效 | volumetric light / god rays / caustics / lens flare / bloom / bokeh | — |

---

## 高级控制与避坑

### JSON 结构化

2+ 主体需精确空间排列时可用 JSON 格式：

```json
{
  "scene": "a cozy cafe interior",
  "subjects": [
    {"type": "woman", "position": "left", "wearing": "red dress", "action": "reading"},
    {"type": "cat", "position": "right foreground", "color": "orange tabby", "action": "sleeping"}
  ],
  "lighting": "warm afternoon sunlight through window",
  "style": "cinematic photography"
}
```

**何时使用**：主体 ≥ 2 且需要精确空间定位；纯文本无法区分主体时。
**何时不用**：单主体、风格/氛围类图像——直接写自然语言更好。注意效果因工具而异。

### 文字渲染

用**双引号**包裹目标文字：`a poster with the text "HELLO" in bold serif font`

- 1-3 个英文单词最可靠，非拉丁文字经常出错
- 指定字体风格和位置，预留干净区域

### 颜色精确控制

HEX + 颜色名称配合：`a scarf in #C7254E crimson draped over a #F5F5DC beige counter`

具体色名比泛称准确：crimson / cobalt / emerald / ivory / obsidian > red / blue / green / white / black

### 空间控制

每个主体指定**屏幕位置 + 景深层次**：

```
[left foreground] chess knight in sharp focus,
[right background] opponent's hand hovering above board, slightly blurred
```

最多同时精确控制 2-3 个主体。避免复杂相对位置（如 "A 背对 B，B 看着 C"）。

### 常见翻车与修正

| 问题 | 策略 |
|------|------|
| 手指错误/融合 | 保持简单动作（托腮、握物、放口袋），negative 加 `extra fingers, fused fingers` |
| 多人面部互换 | 最多 2-3 人，用服装颜色区分，景深分离；超过 3 人用 "crowd in background" |
| 文字拼写错误 | 保持简短大写英文，指定字体，预留干净区域 |
| 对称性不准 | 写 "perfectly symmetrical"，选正面视角，用几何/建筑主体 |
| 比例失调 | 提供参考物（"cat sitting next to coffee cup on table"） |
| 风格四不像 | 明确一种主导风格，辅助风格只影响局部，最多 2 种 |

### 工具适配（用户指定工具时）

默认输出通用 prompt，不绑定平台参数。仅当用户明确指定工具时追加：

- **Midjourney**：在 Meta 里追加 `--ar`（画幅）、`--v`（版本）；排除项用 `--no`
- **Stable Diffusion / Flux**：保留完整 `Negative Prompt`，可按需补充 `CFG scale`、采样器、LoRA/checkpoint
- **DALL-E**：不输出 `Negative Prompt` 字段，改写为正向自然语言约束（如 "clean background, no text, single subject"）

### 输出被拒 / 安全过滤

- 避免写真实人名、现实政治人物
- 暴力描写用 "stylized" / "illustrated" 降低写实度
- 若用于商业用途，避免引用具体艺术家风格（版权灰色地带）

### 迭代优化

用户反馈"不太对"时，按以下顺序诊断：

1. **主体问题**？→ 补充材质/动作细节，或简化主体数量
2. **氛围问题**？→ 调整光照和风格层，而非重写全文
3. **构图问题**？→ 明确景别（close-up / wide shot）和视角
4. **风格偏移**？→ 检查是否超过 2 种风格，移除冲突关键词
