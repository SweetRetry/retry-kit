---
name: image-prompt
description: 通用 AI 图像生成 Prompt 工坊。基于黄金结构（Subject → Setting → Style → Lighting → Technical）为任意类型图像生成高质量 prompt。覆盖全场景：人像、风景、产品摄影、美食、建筑、概念艺术、时尚、静物、微距、航拍、街拍、动物、UI 素材、抽象纹理等。支持高级控制（JSON 结构化、HEX 精确颜色、多语言文化锚定、空间构图指令）。适用于 Midjourney、DALL-E、Stable Diffusion、Flux 等主流 AI 图像生成工具。触发场景：(1) 用户需要生成 AI 图像 prompt，(2) 用户提到"图片prompt"、"图像生成"、"AI绘图"、"生图"、"image prompt"、"text to image"，(3) 用户描述一个画面并希望转化为可用的生成提示词，(4) 用户需要产品图、人像、风景、概念设计等各类图像的 prompt，(5) 用户提到 Midjourney、DALL-E、Stable Diffusion、Flux 等工具并需要 prompt。
---

# 图像 Prompt 工坊

## 黄金结构

| 层级 | 内容 | 权重 |
|------|------|------|
| **Subject** | 主体：谁/什么，材质、纹理、动作、表情 | ★★★★★ |
| **Setting** | 环境：时间、地点、背景、天气 | ★★★★ |
| **Style** | 风格：摄影/艺术流派/电影参考 | ★★★★ |
| **Lighting** | 光照：方向、硬/柔、色温 | ★★★ |
| **Technical** | 镜头焦距、景深、画幅 | ★★ |

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
- **跟随用户语言** — 用户中文则中文 prompt，英文则英文

## 流程

1. **理解意图** — 用途、期望风格、情绪基调（不明确则主动询问）
2. **确定场景类型** → [scene-types.md](references/scene-types.md)
3. **选择风格** → [styles-and-composition.md](references/styles-and-composition.md)
4. **构建画面** — 核心视觉锤 → 环境氛围 → 技术参数
5. **避坑自检** → [advanced-techniques.md](references/advanced-techniques.md)
6. **一气呵成**，最重要的视觉元素排最前
7. 补充 Negative Prompt 和 Meta

## 质量检查

- [ ] 画面有明确的视觉焦点
- [ ] prompt 已足够短，无冗余装饰
- [ ] 风格统一，最多 1 主导 + 1 辅助
- [ ] 手部交互保持简单，主体 ≤ 3 个
- [ ] 如有文字，用双引号、保持简短
- [ ] 构图/景别/精写指向同一画面，无矛盾

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
- **建议**: [可选，生成建议或工具适配]
```

## 示例

### 产品摄影 — 手表

> 材质精确到 "brushed stainless steel" + "polished chamfered edges"；反射面创造环境互动；背景渐变到黑保持干净。

**输入**: 一块高端手表的产品图

**Prompt**: luxury mechanical wristwatch with exposed movement visible through sapphire caseback, brushed stainless steel case with polished chamfered edges, deep midnight blue sunburst dial, applied rhodium-plated hour markers, alligator leather strap in dark brown, watch resting at slight angle on polished black obsidian surface, soft studio lighting from upper left creating gentle highlights on case curves and strap texture, subtle reflection on surface beneath, clean dark gradient background fading to black, commercial product photography, 100mm macro lens, f/8, crisp detail

**Negative Prompt**: blurry, low quality, busy background, watermark, text, multiple watches, scratches

**Meta**: 产品摄影 / 商业产品摄影 / 4:5 竖版 / 精密, 奢华, 克制, 质感

---

### 电影感人像 — 雨夜街头

> 背后三分角避免正脸手部问题；霓虹反射在湿地面做冷暖对比；胶片型号锚定色调。

**输入**: 一个在雨中走在东京街头的女性

**Prompt**: cinematic photography, young woman walking alone on rain-soaked Shinjuku street at night, shot from behind at three-quarter angle, black leather jacket glistening with rain, short dark hair plastered to neck, transparent umbrella tilted slightly forward, neon signs of izakayas reflected in wet asphalt as streaks of pink and cyan, steam rising from a ramen shop on the left, shallow depth of field blurring distant pedestrians into bokeh silhouettes, anamorphic lens with horizontal flare from neon, teal and orange color grading, 35mm, f/1.8, Kodak Vision3 500T film grain

**Negative Prompt**: low quality, deformed, cartoon, anime, bright daylight, watermark, extra limbs

**Meta**: 街拍 / 电影摄影 + 胶片 / 21:9 宽银幕 / 孤独, 霓虹, 雨夜, 忧郁

## 参考资料（按需加载）

| 文档 | 何时加载 |
|------|---------|
| [scene-types.md](references/scene-types.md) | 特定场景类型的避坑要点和推荐参数 |
| [styles-and-composition.md](references/styles-and-composition.md) | 风格关键词速查、构图法、布光方案 |
| [advanced-techniques.md](references/advanced-techniques.md) | JSON 结构化、颜色控制、文字渲染、常见翻车修正、工具适配 |
