# AI 视频生成工具 Prompt 适配指南

## 目录

1. [通用 Prompt 原则](#通用-prompt-原则)
2. [模型参数查询](#模型参数查询)
3. [角色一致性策略](#角色一致性策略)

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

**中文通用格式：**
```
[角色外貌描述]，[服装细节]，[正在做的动作]，[场景环境]，[镜头景别与运动]，[光影效果]，[画面风格]
```

**英文通用格式：**
```
[Shot type]. [Subject description] [performing action] in [environment]. [Camera movement]. [Lighting and atmosphere]. [Visual style]. [Additional effects].
```

---

## 模型参数查询

**核心原则：不猜测任何具体模型的参数。**

当用户指定了具体的 AI 视频生成模型（无论是 fal.ai 平台模型还是其他工具），必须通过 `fal-ai-model-search` skill 搜索并获取真实参数后再生成 prompt。

### 触发条件

- 用户提到具体模型名称（如某个 fal.ai 模型 ID）
- 用户要求推荐适合的视频生成模型
- 需要确认模型的分辨率、时长、宽高比等限制

### 流程

1. 调用 `fal-ai-model-search` skill 搜索模型
2. 获取模型详情（llms.txt）中的真实 API 参数
3. 根据实际参数约束调整 prompt 输出（时长、分辨率比例、prompt 格式等）

### 禁止行为

- 禁止猜测任何模型的分辨率、时长限制、参数字段
- 禁止使用过期的模型 ID 或参数
- 禁止硬编码工具的具体能力描述

---

## 角色一致性策略

### 跨镜头保持角色一致

AI 视频工具目前难以自动保持角色一致。以下策略可提高一致性：

1. **固定角色描述锚点**
   - 为每个角色建立固定描述短语，在每个镜头 prompt 中复用
   - 例：`a young man, age 20, sharp jawline, long black hair tied in a high ponytail, wearing white silk celestial robes with gold trim`

2. **参考图策略**（图生视频模式）
   - 先用图像生成工具生成角色参考图
   - 以参考图作为视频起始帧
   - 每个新镜头都使用同一参考图的不同角度/裁切

3. **特征锚点标记**
   - 选择 2-3 个最显著的视觉特征在每个 prompt 中重复
   - 例：始终提及 "white robes with gold trim" + "high ponytail" + "jade sword"

4. **分镜连接语**
   - 使用 "same character as before" / "continuing from previous shot"
   - 虽然工具可能不完全理解，但有助于保持描述一致性

### 角色描述模板

```
[称呼/性别/年龄], [面部特征], [发型发色], [服装主体], [服装细节/配饰], [标志性道具]
```

示例：
```
EN: a young man in his early 20s, sharp features with piercing dark eyes, long black hair in a high ponytail, wearing white silk celestial robes with intricate gold embroidery along the collar and sleeves, a jade pendant around his neck, holding a luminous jade sword

CN: 二十出头的青年男子，五官棱角分明，眼神锐利，黑色长发束成高马尾，身穿白色丝质仙袍，衣领和袖口绣有精致金色花纹，颈戴玉坠，手持发光玉剑
```
