---
name: graphic-image-prompt
description: 把想法、brief 与参考素材转化为 plane-first 的二维平面视觉生图 prompt，控制 shape、grid、scale、rhythm、negative space、layer、crop、色彩与表面。用于 pixel poster、editorial visual、collage、抽象 graphic、封面、固定主视觉、web background，以及由版面关系而非三维场景决定成败的单张或系列图片。
---

# 平面视觉 Prompt

## 核心任务

为一张或一组目标图片完成具体的二维构成与图层 direction，并交付一份可直接用于 image generation model 的分层自然语言 prompt。先确定作品独有的平面关系，再安排形、色块、图像、文字、空白、纹理与边缘；photography、illustration、3D、pixel art 和 typography 都只是按需材料。

本 skill 独立使用当前上下文中的想法、brief、文字、图片与既有约束。至少需要主题、情绪、主体、品牌线索、参考素材或形式关系中的一项；copy、typography、传播目标与输出渠道均非前置。缺失信息不会改变作品身份时作最小假设，会改变构图模式或必须保留内容时才确认。

## 判定平面核心

当作品身份主要取决于画框上的 shape placement、比例、对齐、间隔、图层顺序、裁切与表面关系时，采用本合同。即使画面含有人物摄影，摄影也可以只是被裁切、重复、遮罩或叠印的平面材料。

先选择画框模式：

- **fixed composition**：关键焦点、形体、图像或文字依赖固定位置。
- **adaptive field**：视觉身份来自连续场、重复系统或跨画框关系；横竖裁切后仍须保留核心节奏与层级。

系列图沿用其中一种模式，另行确定不变量和每张图的变化轴。

## 构建设计

1. 用一句可见关系写出 `graphic premise`：哪个主系统建立秩序，哪个受控变化形成记忆点，例如“大面积寂静色块被一条高密度 pixel seam 切开”。它不能只是“高级、先锋、杂志感”等评价。
2. 从 shape、color field、photo、illustration、3D、pixel form、type、line 与 texture 中选择必要材料，分别承担 base、dominant、support、connector 或 surface 职责；不为“丰富”添加无任务图层。
3. 建立一个主 grid logic。写清 alignment、主形与反形、尺度层级、repetition、interval、density、edge crop 与注意力路径；只保留一个主 formal device 和一个有控制的破格点。
4. 用面积与职责组织主色域、支撑色域和强调色，以 value blocks 保持缩略图下的主次。空白或低频区必须承担反形、分组、停顿、焦点或裁切适配职责。
5. 选择一种主 surface logic。印刷、扫描、pixel、拼贴或纸面机制要具体改变 edge、layer 或 color mixing；均匀 grain 与媒介名本身不算表面设计。
6. 只有输入含具象材料时才描述其裁切、视点、光色与平面职责；只有输入真实需要文字时才逐字保留 copy，并说明它作为信息、图形、纹理或空间骨架的角色。
7. 参考作品或设计师只用于提取可观察的 shape、scale、interval、color area、layer 与 surface 决定。暂时移除参考名称后，剩余 prompt 仍须能重建作品的形式身份。

## 模式细化

fixed composition 要明确不可移动的关键关系、触边元素和画外延展。adaptive field 要明确 crop invariant、连续节奏、低频区与允许的局部峰值，不能依赖唯一且必须完整出现的中心对象。系列图要写清构图系统、palette 或表面中的稳定项，以及每张只变化的一至两个轴。

画幅方向和 crop behavior 会改变构图时写入 prompt；具体 size、quality、format 与 compression 由生成入口控制。图像模型不能保证 precise typography、pixel-perfect layout、responsive implementation 或 print-ready 文件；任务要求这些结果时先说明可验证边界，再把 prompt 定位为 visual base 或 concept。

## 质量门槛

交付前检查：

- 一句话能复述 graphic premise；删除它后作品会失去身份。
- 缩略图下仍能读出 dominant shape、value blocks 与主要节奏。
- 每个主要 layer 都有唯一职责，删除后会改变形式关系。
- alignment、interval、scale 与破格来自同一系统；随机错位不算张力。
- 色彩有面积和层级角色，texture 对 edge、叠色或图层产生因果影响。
- adaptive field 经中心、边缘、横向与纵向裁切后，仍保留核心节奏和至少一条层级关系。
- 没有输入依据时不自动添加标题、Logo、人物、UI、装饰字符或摄影主体。
- 删除题材名、风格名和审美形容词后，具体形式决定仍然完整。

## 输出合同

最终只输出一份目标语言的多行自然语言 prompt。始终保留三个二级标题与六个必填 label；可选字段只在真实适用时出现。字段值使用高信息密度的完整短句或短语，同一决定只写一次。

```text
## 平面核心
设计主轴：<graphic premise、第一读取与记忆点>
画框模式：<fixed composition 或 adaptive field、方向、边缘与裁切不变量>
元素与图层：<必要材料及 base、dominant、support、connector、surface 关系>

## 构成系统
图形与尺度：<主形、次形、反形、比例层级与重复单元>
网格与节奏：<alignment、interval、density、repetition、破格与注意力路径>
图像表现：<仅在使用 photography、illustration、3D、pixel form 等具象材料时出现>
字体排印：<仅在存在真实文字时出现；逐字 copy、职责、层级、排列与可读性>

## 视觉表现
色彩与明度：<色域面积、value 层级、强调色位置与分离关系>
材质与表面：<纸面、油墨、网点、扫描、pixel、拼贴或其他表面因果；无纹理时写清平整边缘与纯净色面>
必须保持：<仅在输入存在 exact copy、资产、品牌或系列不变量时出现>
```

中文使用上述 canonical label；英文依次使用 `Graphic Premise`、`Canvas Mode`、`Elements and Layers`、`Shape and Scale`、`Grid and Rhythm`、`Image Treatment`、`Typography`、`Color and Value`、`Material and Surface`、`Must Preserve`。其他语言按相同语义稳定翻译。主 prompt 使用肯定、可观察的关系描述；无法正向等价表达的 hard exclusion，只在最相关字段保留一句最小限制。
