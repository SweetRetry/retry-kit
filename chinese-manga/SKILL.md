---
name: chinese-manga
description: 为中国漫剧市场生成美学至上的图像生成 prompt。支持仙侠、武侠、古风、都市奇幻、都市言情、热血战斗、末日废土、悬疑推理、校园青春等题材，搭配水墨、工笔、赛璐璐、厚涂、水彩、半写实、扁平插画等绘画风格。当用户需要生成漫剧美图 prompt、国漫角色/场景/物品图像描述，或提到"漫剧"、"国漫"、"生成角色"、"仙侠场景"、"古风人物"、"都市漫画"、"画一张"等关键词时触发。
---

# 国漫美图 Prompt 工坊

用户给出简短描述，直接输出一条**能出美图**的高质量 prompt。美学优先，不要模板感。

## 核心原则

**像一个顶级概念美术师在脑中构图**，而不是填模板：

- **少即是多** — prompt 不是越长越好，≤800 字符以内只写决定性的视觉锚点，让模型自由补全剩余细节
- **信任模型** — 模型对常见场景有内建认知，不必事无巨细地描写，留白会带来意想不到的惊喜
- **先抓画面感** — 脑中先浮现一幅完整的画，再用语言精准还原
- **细节即取舍** — 每个细节都要服务于情绪或故事，写三个精准的锚点胜过十个泛泛的描写
- **光影即情绪** — 光源设计是 prompt 的灵魂，永远显式描写光从哪来、什么色温
- **材质即真实** — 丝绸的透光、金属的反射、皮革的磨损，关键物体点到即止
- **留白即构图** — 不是所有空间都要填满，懂得用空白制造呼吸感

## 工作流程

1. 理解用户想要什么画面
2. 选**题材** → 参考 [references/genre-library.md](references/genre-library.md) 获取题材元素关键词
3. 选**风格** → 参考 [references/style-library.md](references/style-library.md) 获取绘画风格关键词
4. 在脑中构图：确定画面构图、光影、情绪、核心视觉锤 → 参考 [references/aesthetics-system.md](references/aesthetics-system.md) 选择构图法、光型、色彩关系、镜头语言
5. **避坑自检** → 参考 [references/prompt-pitfalls.md](references/prompt-pitfalls.md)：构图/景别/精写是否自洽？有无文化劫持风险？是否在模型弱项区域过度精写？
6. 一气呵成写出 prompt，最重要的视觉元素排最前
7. 补充 negative prompt 和简要 meta

## 出稿自检

有任何一条不过关就返工。前 8 条检查画面美学，后 3 条检查 AI 模型避坑。

**画面美学**：
- **焦点缺失** — 画面是否有一眼能看到的核心视觉锤？
- **光影缺失** — 是否显式描写了光源方向、色温？
- **情绪空洞** — 画面是否传递了某种情感或叙事张力？
- **文化穿帮** — 服饰、建筑、道具是否符合题材时代？文化方向是否靠正面 prompt 的具体服饰/建筑/器物锁死？（negative 只是辅助）
- **字符超限** — prompt 正文是否 ≤800 字符？超限时砍装饰细节层，保留核心锚点和情绪氛围
- **堆砌感** — 是否每个细节都有存在的理由？能砍掉后画面不塌的描写一律砍掉
- **构图失衡** — 是否选择了合适的构图法？元素的视觉重量是否平衡？
- **材质模糊** — 关键物体的材质是否有具体描写？材质名是否直写视觉效果而非依赖隐含色彩认知？

**模型避坑**：
- **指令打架** — 构图、景别、精写程度是否指向同一画面？（中心对称 + "渺小"矛盾；大远景 + 精写五官矛盾；"悬浮" + 完整人体矛盾）
- **文化锚定缺失** — 使用赛璐璐/外来风格词时，正面 prompt 是否有足够的中式元素强锚定？
- **危险区精写** — 是否在模型弱项区域过度精写？光影写效果不写因果；小饰品写氛围不写实体；关节/投影/重复结构模糊处理或省略

> 自检不确定时，查阅 [美学系统](references/aesthetics-system.md) 的「常见翻车与修正」和 [避坑指南](references/prompt-pitfalls.md)。

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

[一条完整的 prompt（语言跟随用户输入），逗号分隔，画面感优先，最重要的视觉元素排最前]

## Negative Prompt

[排除项]

## Meta

- **题材**: [题材名]
- **风格**: [风格名]
- **画幅**: [推荐比例]
- **情绪**: [3-5 个词]
```

## 写作要领

- **≤800 字符硬约束** — prompt 正文（不含 negative 和 meta）必须控制在 800 字符以内（中文按字数、英文按字符数），超限即返工精简
- **三层筛选** — 核心锚点（构图/人物动作/光影 → 必写）→ 情绪氛围（色调/气氛 → 选写）→ 装饰细节（小饰品/重复材质/环境填充 → 砍掉）
- **跟随用户语言** — 用户用中文描述则输出中文 prompt，用英文描述则输出英文 prompt。Negative prompt 和 Meta 与主 prompt 保持同语言
- **克制再克制** — 写完初稿后再砍一轮，问自己"这个短句去掉后画面会塌吗？"，不会塌就砍。宁短勿长，模型会自行补全合理细节
- **拒绝模板腔** — 不要写出"[角色身份]"这种占位符，直接写具体画面
- **一条到位** — 用户拿到 prompt 就能直接去生图，不需要二次加工
- **质量 > 数量** — 写 "slight upturn at corner of lips, half-lidded eyes" 而不是 "smiling"；三个精准描写胜过十个泛泛形容
- **具体 > 笼统** — 写 "crumbling Tang dynasty courtyard with moss-covered stone lanterns" 而不是 "Chinese temple"
- **动态 > 静态** — 即使是站立的人物，也要描写重心、风对衣物的影响、发丝的方向
- **不写质量尾巴** — 禁止在 prompt 末尾追加 "masterpiece, best quality, ultra-detailed" 等无意义标签

## 示例

### 示例 1 — 武侠 × 半写实（雨夜女刺客）

> **避坑亮点**：伦勃朗光单主光源 + 湿地面反射做冷暖对比，不描写投影因果；交互仅"hand hidden beneath cloak gripping blade"低难度握持；正面用"traditional Chinese shopfronts"锚定文化方向。

**输入**: 雨中古镇撑伞的女刺客回眸

**输出**:

#### Prompt

wuxia manhua, semi-realistic digital painting, young female assassin pausing mid-step on rain-soaked ancient town stone street, looking back with sharp cold eyes and faint smirk, rain-drenched black hair clinging to pale cheeks, holding oil-paper umbrella in left hand tilted back, right hand hidden beneath dark crimson cloak gripping concealed blade, rain streaks catching dim lantern light, wet stone ground reflecting warm orange glow and her silhouette, traditional Chinese shopfronts with wooden signs lining narrow alley, fog between tiled rooftops, Rembrandt lighting from hanging lantern above right, cool blue ambient fill, tense atmosphere

#### Negative Prompt

low quality, worst quality, blurry, modern clothing, 3d render, neon colors, cheerful, watermark, text, bad anatomy, extra fingers, Japanese style

#### Meta

- **题材**: 武侠
- **风格**: 半写实
- **画幅**: 2:3 竖版
- **情绪**: 杀意, 雨夜, 回眸, 危险, 暗香

---

### 示例 2 — 仙侠 × 水彩（少年与灵狐初遇）

> **避坑亮点**：人-动物交互仅"四目相对"（低难度对视）；白狐坐青石上（稳定姿态）；剑穗写动态不精写实体；浅景深虚化远景竹林避免重复结构精写；砍掉地面碎细节（露珠折光、野兰花）让模型自由补全。

**输入**: 竹林深处少年剑客遇到三尾白狐

**输出**:

#### Prompt

xianxia manhua watercolor illustration, visible paper grain texture, early morning bamboo forest in thin mist, young swordsman kneeling on one knee facing a three-tailed white fox in quiet gaze, fox sitting on moss-covered stone with faint golden glow at tail tips, youth with ink-black hair tied high and stray lock across brow, moon-white cross-collar right-over-left robe, sheathed sword at waist with tassel swaying in breeze, leaning forward with gentle reverent eyes, morning sunlight through bamboo canopy forming golden volumetric light shafts, shallow depth of field blurring bamboo groves fading into mist, verdant greens and moon-white palette with golden light accents, quiet spiritual atmosphere

#### Negative Prompt

low quality, worst quality, blurry, modern clothing, 3d render, neon colors, watermark, text, bad anatomy, extra fingers, Japanese style, crowded composition

#### Meta

- **题材**: 仙侠
- **风格**: 水彩
- **画幅**: 2:3 竖版
- **情绪**: 灵性, 初遇, 晨雾, 温柔, 缘起

---

### 示例 3 — 武侠 × 厚涂（月夜老剑客独饮）

> **避坑亮点**：显式要求"笔触浓郁可见"的风格一致性（对抗面部美颜）；交互仅"手举酒坛"（单手握持，可控难度）；"交领右衽"精确锚定中式服装；"无鞘长剑靠树干"回避手持武器的交互难度；砍掉草原延伸到地平线等环境填充，让模型自行补全远景。

**输入**: 月夜枯树下白发老剑客独自饮酒

**输出**:

#### Prompt

Chinese wuxia manhua, thick digital oil painting with dense visible brushstrokes, moonlit autumn night beneath a massive dead tree, white-haired old swordsman sitting cross-legged on gnarled roots drinking alone, three-quarter side view, white hair loose over shoulders stirred by night wind, aged face deeply lined but eyes bright with quiet amusement, one hand raising rough clay wine jug toward lips, cross-collar right-over-left grey-blue patched robe with mending marks, unsheathed long sword with chipped blade leaning against trunk, cold moonlight from upper left illuminating half of face, bare branches silhouetted against full moon, low-saturation grey-blue palette with silver moonlight accent, rule of thirds with figure on left and moon on right, desolate yet liberated atmosphere

#### Negative Prompt

deformed limbs, bad anatomy, extra limbs, fused fingers, Japanese kimono, katana, 3d render, neon colors, watermark, text, bright cheerful colors, smooth skin, airbrushed face, CG render, flawless complexion

#### Meta

- **题材**: 武侠
- **风格**: 厚涂
- **画幅**: 2:3 竖版
- **情绪**: 苍凉, 豁达, 月夜, 独饮, 暮年
