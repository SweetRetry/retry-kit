---
name: graphic-image-prompt
description: Artifact-first 生图 prompt：把 brief、copy 与视觉素材转成由最终画框编排决定成败的单张或系列图片 prompt。用于需要直接设计 composition 的时尚封面、文章配图、editorial visual、collage、抽象 graphic 与固定主视觉；触发标准是作品身份主要由独立素材的 shape、位置、比例、裁切、叠放、文字、节奏或跨画幅适配决定。photography、illustration 与 3D render 可作为素材；当任务必须先建立完整场景，或需要依据网站产品与页面职责选择 background image / video 时不触发。
---

# Graphic 构成 Prompt

## 核心任务

为一张或一组设计成品完成 image-plane composition 与图层 direction，并交付一份可直接用于 image generation model 的分层自然语言 prompt。先确定成品独有的编排关系，再安排形、色块、图像素材、文字、空白、纹理与边缘；photography、illustration、3D render、pixel art 和 typography 都是可裁切、遮罩、重复、叠放或调色的按需材料，不在此重新构造它们内部的完整世界。

本 skill 独立使用当前上下文中的 brief、文字、图片与既有约束。至少需要成品类型、视觉素材或希望建立的画框关系中的一项；仅有主题、主体或情绪，不足以判定这是设计构成任务。copy、typography 与品牌资产均非前置。缺失信息不会改变作品身份时作最小假设，会改变构图模式或必须保留内容时才确认。

## 判定构成职责

Artifact-first 描述的是 decision authority，不是 flat-only rendering。当作品身份主要取决于独立视觉材料在最终画框中的 shape placement、比例、间隔、图层顺序、裁切、文字关系或跨尺寸适配时，采用本合同。摄影与 3D 图像可以是材料；只有它们的内部视点、空间和光照关系已经由输入给定，或可在不改变成品身份的前提下被替换时，才由本合同继续编排。

按以下边界测试判断：

- 移除“封面、background、文章配图”等用途词后，剩余需求仍是一幅需要主体、空间、机位、景深、遮挡和光照共同成立的完整场景：不采用本合同。
- 完成任务前必须先确定 world-space geometry、人物行动、camera、连续空间或光源与表面的关系：不采用本合同。
- 替换具体摄影、插画或 3D 素材后，既定的 shape hierarchy、crop、layer、rhythm、value blocks 与信息关系仍能保留作品身份：采用本合同。

先选择画框模式：

- **fixed composition**：关键焦点、形体、图像或文字依赖固定位置。
- **adaptive field**：视觉身份来自连续场、重复系统或跨画框关系；横竖裁切后仍须保留核心节奏与层级。

系列图沿用其中一种模式，另行确定不变量和每张图的变化轴。

## 构建设计

1. 用一句可见关系写出 `graphic premise`：说明哪些形、图像素材、色块或画框关系形成作品身份；可以是视觉隐喻、主次对照、连续流动、重复节奏或受控破格。破格只在服务概念时使用，不设为默认。它不能只是“高级、先锋、杂志感”等评价。
2. 从 shape、color field、photo cutout、illustration asset、3D render、pixel form、type、line 与 texture 中选择必要材料，分别承担 base、dominant、support、connector 或 surface 职责；不为“丰富”添加无任务图层。
3. 选择一个主 composition logic：grid alignment、free field、organic flow、collage structure 或其他能解释元素关系的组织方式。写清主形与反形、尺度层级、间隔、密度、edge crop 与注意力路径；只有真实存在对齐或重复系统时才建立 grid，受控破格只在能改变作品身份时加入。
4. 用面积与职责组织主色域、支撑色域和强调色，以 value blocks 保持缩略图下的主次。空白或低频区必须承担反形、分组、停顿、焦点或裁切适配职责。
5. 选择一种主 rendering / edge logic。clean vector、flat illustration、photographic cutout、3D render、pixel、collage 或 print texture 都按输入启用；写清 silhouette、edge、mask、layer、color integration 或 detail 如何服务构成。无纹理时保持干净色面与明确边缘，不为“完成度”追加 grain。
6. 只有输入含具象素材时才描述其裁切、遮罩、重复、叠放、色彩整合与构成职责，不补写素材内部的主体状态、场景空间、camera、DoF 或光照逻辑；只有输入真实需要文字时才逐字保留 copy，并说明它作为信息、图形、纹理或空间骨架的角色。
7. 参考作品或设计师只用于提取可观察的 shape、scale、interval、color area、layer、rendering 与 edge 决定。暂时移除参考名称后，剩余 prompt 仍须能重建作品的形式身份。

## 模式细化

fixed composition 要明确不可移动的关键关系、触边元素和画外延展。adaptive field 要明确 crop invariant、连续节奏、低频区与允许的局部峰值，不能依赖唯一且必须完整出现的中心对象。系列图要写清构图系统、palette 或表面中的稳定项，以及每张只变化的一至两个轴。

画幅方向和 crop behavior 会改变构图时写入 prompt；具体 size、quality、format 与 compression 由生成入口控制。图像模型不能保证 precise typography、pixel-perfect layout、responsive implementation 或 print-ready 文件；任务要求这些结果时先说明可验证边界，再把 prompt 定位为 visual base 或 concept。

## 质量门槛

交付前检查：

- 一句话能复述 graphic premise；删除它后作品会失去身份。
- 生成对象是一个需要被编排的设计成品，而不是借用途名称包装的完整场景。
- 缩略图下仍能读出 dominant shape、value blocks 与主要节奏。
- 每个主要 layer 都有唯一职责，删除后会改变形式关系。
- 构图关系来自同一 composition logic；grid、free field、organic flow 或 collage structure 都有可复述秩序，破格只在实际使用时检查。
- 色彩有面积和层级角色；成像、边缘或表面处理会改变形体、层次或读取方式，clean rendering 不被强制添加纹理。
- adaptive field 经中心、边缘、横向与纵向裁切后，仍保留核心节奏和至少一条层级关系。
- 标题、Logo、人物、UI、装饰字符与摄影主体都有输入依据。
- 删除题材名、风格名和审美形容词后，具体形式决定仍然完整。

## 输出合同

最终只输出一份目标语言的多行自然语言 prompt。始终保留三个二级标题与七个必填 label；可选字段只在真实适用时出现。字段值使用高信息密度的完整短句或短语，同一决定只写一次。

```text
## 设计构成
设计主轴：<graphic premise、第一读取与记忆点>
画框模式：<fixed composition 或 adaptive field、方向、边缘与裁切不变量>
元素与图层：<必要材料及 base、dominant、support、connector、surface 关系>

## 构成系统
图形与尺度：<主形、次形、反形、比例层级与重复单元>
构图与节奏：<composition logic、alignment 或 flow、interval、density、repetition 与注意力路径>
图像表现：<仅在使用 photo、illustration、3D render、pixel form 等素材时出现；只写裁切、遮罩、重复、叠放与构成职责>
字体排印：<仅在存在真实文字时出现；逐字 copy、职责、层级、排列与可读性>

## 视觉表现
色彩与明度：<色域面积、value 层级、强调色位置与分离关系>
成像与边缘：<clean vector、flat illustration、photo 或 3D asset、pixel、collage、print texture 等；写清 silhouette、edge、mask、layer 与 color integration>
必须保持：<仅在输入存在 exact copy、资产、品牌或系列不变量时出现>
```

中文使用上述 canonical label；英文标题使用 `Design Composition`，label 依次使用 `Graphic Premise`、`Canvas Mode`、`Elements and Layers`、`Shape and Scale`、`Composition and Rhythm`、`Image Treatment`、`Typography`、`Color and Value`、`Rendering and Edge`、`Must Preserve`。其他语言按相同语义稳定翻译。主 prompt 使用肯定、可观察的关系描述；无法正向等价表达的 hard exclusion，只在最相关字段保留一句最小限制。
