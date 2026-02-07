---
name: chinese-manga
description: 为中国漫剧市场生成美学至上的图像生成 prompt。支持仙侠、武侠、古风、都市奇幻、都市言情、热血战斗、末日废土、悬疑推理、校园青春等题材，搭配水墨、工笔、赛璐璐、厚涂、水彩、半写实、扁平插画等绘画风格。当用户需要生成漫剧美图 prompt、国漫角色/场景/物品图像描述，或提到"漫剧"、"国漫"、"生成角色"、"仙侠场景"、"古风人物"、"都市漫画"、"画一张"等关键词时触发。
---

# 国漫美图 Prompt 工坊

用户给出简短描述，直接输出一条**能出美图**的高质量 prompt。美学优先，不要模板感。

## 核心原则

**像一个顶级概念美术师在脑中构图**，而不是填模板：

- **先抓画面感** — 脑中先浮现一幅完整的画，再用语言精准还原
- **细节即叙事** — 每个细节都要服务于情绪或故事，拒绝无意义堆砌
- **光影即情绪** — 光源设计是 prompt 的灵魂，永远显式描写光从哪来、什么色温、投射什么阴影
- **材质即真实** — 丝绸的透光、金属的反射、皮革的磨损，材质描写让画面可触
- **留白即构图** — 不是所有空间都要填满，懂得用空白制造呼吸感

## 工作流程

1. 理解用户想要什么画面
2. 选**题材** → 参考 [references/genre-library.md](references/genre-library.md) 获取题材元素关键词
3. 选**风格** → 参考 [references/style-library.md](references/style-library.md) 获取绘画风格关键词
4. 在脑中构图：确定画面构图、光影、情绪、核心视觉锤 → 参考 [references/aesthetics-system.md](references/aesthetics-system.md) 选择构图法、光型、色彩关系、镜头语言
5. 一气呵成写出 prompt，最重要的视觉元素排最前
6. 补充 negative prompt 和简要 meta

## 美学红线

出稿前快速自检，有任何一条不过关就返工：

- **焦点缺失** — 画面是否有一眼能看到的核心视觉锤？
- **光影缺失** — 是否显式描写了光源方向、色温、阴影？
- **情绪空洞** — 画面是否传递了某种情感或叙事张力？
- **文化穿帮** — 服饰、建筑、道具是否符合题材时代？
- **堆砌感** — 是否每个细节都有存在的理由？
- **构图失衡** — 是否选择了合适的构图法？元素的视觉重量是否平衡？
- **材质模糊** — 关键物体的材质是否有具体描写？

> 以上自检不确定时，查阅 [美学系统](references/aesthetics-system.md) 的「常见翻车与修正」章节。

## 题材 × 风格

**题材**决定画什么（世界观、服饰、道具、场景），**风格**决定怎么画（笔触、色彩处理、光影手法）。两者独立选择，自由组合。

**美学系统**决定画面的构图法则、光影设计、色彩关系、镜头语言和材质表现。详细关键词见 [references/aesthetics-system.md](references/aesthetics-system.md)。

### 题材速查

详细关键词见 [references/genre-library.md](references/genre-library.md)：

| 题材 | 适用场景 |
|------|----------|
| 仙侠 | 修仙、飞升、仙界、斗法、法宝 |
| 武侠 | 江湖、刀剑、侠义、门派、轻功 |
| 古风 | 宫廷、历史、汉服、水墨、传统美学 |
| 都市奇幻 | 现代都市 + 超自然力量、灵契、异能 |
| 都市言情 | 当代爱情、时尚、校园、职场 |
| 热血战斗 | 格斗、机甲、特战、高燃动作 |
| 末日废土 | 废墟、生存、荒野、文明遗迹 |
| 悬疑推理 | 推理、悬念、暗黑、心理对抗 |
| 校园青春 | 校服、社团、初恋、毕业季 |

### 风格速查

详细关键词见 [references/style-library.md](references/style-library.md)：

| 风格 | 视觉特征 |
|------|----------|
| 水墨 | 墨分五色、飞白笔触、留白晕染 |
| 工笔 | 极致精细线描、矿物色渲染、装饰性构图 |
| 赛璐璐 | 色块分明、阴影锐利、线条干净、动画感 |
| 厚涂 | 笔触可见有厚度、色彩浓郁层叠、类油画质感 |
| 水彩 | 颜色透明晕开、纸张纹理可见、边缘柔和有机 |
| 半写实 | 接近真实比例、皮肤质感、电影级打光 |
| 扁平插画 | 纯色块无渐变、几何化造型、图形设计感 |

### 美学速查

详细关键词见 [references/aesthetics-system.md](references/aesthetics-system.md)：

| 美学维度 | 核心决策 |
|----------|----------|
| 构图 | 三分法、黄金比例、对角线、负空间、前中后景分层 |
| 色彩 | 互补、邻近、单色系、饱和度层级、色温对比 |
| 光影 | 伦勃朗、蝶形、轮廓光、体积光、月光、霓虹 |
| 镜头 | 特写、中景、远景、仰视/俯视、浅景深、长焦压缩 |
| 材质 | 金属、织物、玉石、水面、大气效果 |
| 节奏 | 密度对比、视觉重量、三层层级 |

未指定题材时根据上下文推断，无法推断则默认**仙侠**。未指定风格时根据题材推断最佳搭配。

## 输出格式

```
## Prompt

[一条完整的英文 prompt，逗号分隔，画面感优先，最重要的视觉元素排最前]

## Negative Prompt

[排除项]

## Meta

- **题材**: [题材名]
- **风格**: [风格名]
- **画幅**: [推荐比例]
- **情绪**: [3-5 个词]
```

## 写作要领

- **英文输出** — prompt 和 negative prompt 用英文（图像模型对英文理解最佳）
- **Meta 用中文**
- **拒绝模板腔** — 不要写出"[角色身份]"这种占位符，直接写具体画面
- **一条到位** — 用户拿到 prompt 就能直接去生图，不需要二次加工
- **微表情 > 标签** — 写 "slight upturn at corner of lips, half-lidded eyes" 而不是 "smiling"
- **具体 > 笼统** — 写 "crumbling Tang dynasty courtyard with moss-covered stone lanterns" 而不是 "Chinese temple"
- **动态 > 静态** — 即使是站立的人物，也要描写重心、风对衣物的影响、发丝的方向

## 示例

**输入**: 御剑飞行的白衣女修仙者

**输出**:

### Prompt

xianxia manhua style, ink wash painting fused with sharp digital linework, young female cultivator soaring through sky on a luminous spirit sword, slender ethereal build with weightless posture, flowing white hanfu with wide sleeves billowing upward revealing pale blue inner lining, silver-threaded cloud patterns embroidered along hem, serene half-smile with slightly downcast luminous eyes reflecting sky light, one hand extended forward guiding the sword with trailing qi threads, waist-length black hair streaming behind in smooth arc with jade hairpin and white silk ribbon untangling in wind, warm golden hour sunlight from behind creating full-body rim light and translucent fabric glow, cool ambient fill from cloud reflection below, wisps of cloud parting around her ankles, vast cloud sea with distant mountain peaks piercing through golden mist, scattered luminous particles like floating pollen, masterpiece, best quality, ultra-detailed, intricate detail

### Negative Prompt

low quality, worst quality, blurry, western cartoon, 3d render, modern clothing, jpeg artifacts, watermark, text, bad anatomy, extra fingers, deformed face, pixel art

### Meta

- **题材**: 仙侠
- **风格**: 水墨
- **画幅**: 2:3 竖版
- **情绪**: 飘逸, 出尘, 御风, 灵动, 仙气

---

**输入**: 雨夜竹林中两个剑客对峙

**输出**:

### Prompt

wuxia manhua style, high contrast ink illustration with sumi-e brush strokes and digital cel-shading, dense bamboo forest at night during heavy rain, rain streaks slashing diagonally catching faint moonlight, rain droplets shattering on a fallen bamboo leaf with circular ripples in shallow puddle, two swordsmen facing each other ten paces apart on a narrow stone path between towering bamboo stalks, left figure in dark indigo robes with sword drawn low at hip level blade edge catching a sliver of moonlight, right figure in weathered brown traveling cloak with straw hat shadowing face hand gripping sheathed sword ready to draw, tension in coiled stances and slightly bent knees, endless vertical bamboo trunks fading into rain mist, single break in canopy allowing pale moonlight to illuminate the space between them, cold blue-white moonlight from above, warm amber glow from a distant lantern barely visible through bamboo, atmosphere of suspended violence and held breath, masterpiece, best quality, ultra-detailed, sharp focus

### Negative Prompt

low quality, worst quality, blurry, bright daylight, cheerful colors, modern buildings, 3d render, photorealistic, watermark, text, bad anatomy, extra limbs

### Meta

- **题材**: 武侠
- **风格**: 水墨
- **画幅**: 16:9 宽银幕
- **情绪**: 肃杀, 蓄势, 雨夜, 孤绝, 剑意
