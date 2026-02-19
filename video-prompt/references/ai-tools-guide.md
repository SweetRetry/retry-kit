# AI 视频生成工具 Prompt 适配指南

## 目录

1. [通用 Prompt 原则](#通用-prompt-原则)
2. [主体一致性策略](#主体一致性策略)

---

## 通用 Prompt 原则

以下原则适用于所有 AI 视频生成工具。当用户未指定具体模型时，按此通用规范生成 prompt。

### Prompt 结构公式

```
[主体描述] + [动作/动态] + [场景环境] + [镜头语言] + [光影氛围] + [画面风格] + [特效/后期]
```

### 权重排序

AI 视频工具通常对 prompt 开头的描述赋予更高权重。按重要性排序：

1. **主体**（谁/什么）— 最重要
2. **动作**（在做什么）— 核心动态
3. **环境**（在哪里）— 提供上下文
4. **镜头**（怎么拍）— 视觉表现
5. **风格**（什么调性）— 美学方向
6. **特效**（附加效果）— 锦上添花

### 注意事项

- 避免否定词（"no"、"without"、"don't"），AI 难以理解否定
- 使用具体数量、颜色、方向等明确描述
- 每个 prompt 聚焦单一主要动作，避免过多并行事件
- 时长越短，prompt 越聚焦；时长越长，可加入更多动态变化

### 通用 Prompt 示例

**角色类（动漫/真人叙事）：**
```
[Shot type]. [Subject description] [performing action] in [environment]. [Camera movement]. [Lighting and atmosphere]. [Visual style]. [Additional effects].
```

**产品类（产品广告/展示）：**
```
[Shot type]. [Product description with material/finish] [motion: rotating/floating/assembling] on [background/surface]. [Camera movement]. [Studio lighting setup]. [Visual style].
```

**场景类（纪录片/风光/氛围）：**
```
[Shot type]. [Environment description with weather/season] [natural motion: waves/clouds/wildlife]. [Camera movement]. [Natural lighting]. [Color grade/mood].
```

---

## 主体一致性策略

### 跨镜头保持主体一致

AI 视频工具目前难以自动保持主体一致。以下策略按主体类型分别适用：

### 1. 固定主体描述锚点

为每个主体建立固定描述短语，在每个镜头 prompt 中严格复用。

**角色锚点：**
- 例：`a young man, age 20, sharp jawline, long black hair tied in a high ponytail, wearing white silk celestial robes with gold trim`

**产品锚点：**
- 例：`matte black wireless earbuds with rose-gold accent ring, compact oval charging case with LED indicator strip`

**场景锚点：**
- 例：`misty alpine lake at dawn, snow-capped peaks reflected in still water, sparse pine forest along shoreline`

### 2. 参考图策略

用户提供图片时，根据用途采用不同策略：

**模式 A — 视觉参考（风格/特征提取）：**
- 从图片中提取关键视觉特征（色调、材质、构图、光影）
- 将提取的特征融入主体锚点描述
- 适用于：希望视频风格与参考图一致，但不需要完全还原画面

**模式 B — 首帧输入（Image-to-Video）：**
- 图片直接作为视频生成的起始帧
- Prompt 描述后续运动和变化，而非重复描述画面内容
- 适用于：希望从静态图片"动起来"，进入 image-to-video 工作流

### 3. 特征锚点标记

- 选择 2-3 个最显著的视觉特征在每个 prompt 中重复
- 角色例：始终提及 "white robes with gold trim" + "high ponytail" + "jade sword"
- 产品例：始终提及 "matte black finish" + "rose-gold ring" + "LED strip"
- 场景例：始终提及 "misty lake" + "snow-capped peaks" + "pine forest"

### 4. 分镜连接语

- 使用 "same character as before" / "continuing from previous shot"
- 虽然工具可能不完全理解，但有助于保持描述一致性

### 主体描述模板

输出语言跟随用户自然语言或用户明确指定，不做 CN/EN 双语拆分。

**角色模板：**
```
[称呼/性别/年龄], [面部特征], [发型发色], [服装主体], [服装细节/配饰], [标志性道具]
```

示例：
```
二十出头的青年男子，五官棱角分明，眼神锐利，黑色长发束成高马尾，身穿白色丝质仙袍，衣领和袖口绣有精致金色花纹，颈戴玉坠，手持发光玉剑
```

**产品模板：**
```
[产品名称/类别], [材质/表面处理], [核心外观特征], [尺寸/比例印象], [品牌标识元素]
```

示例：
```
无线耳机，磨砂黑聚合物外壳搭配玫瑰金装饰环，椭圆紧凑充电盒，前缘一条细长 LED 指示灯带，盒盖压印极简 logo
```

**场景模板：**
```
[地理环境], [天气/时间/季节], [核心自然元素], [氛围关键词], [色彩基调]
```

示例：
```
海拔 3000 米的高山湖泊，薄雾黎明中第一缕阳光越过雪山山脊，静水倒映山峰剪影，岩石岸线上稀疏松林，宁静原始氛围
```
