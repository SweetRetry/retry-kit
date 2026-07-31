# Plane-first 与 3D 视觉构成：一手来源研究及 skill 边界建议

研究日期：2026-07-31

## 研究问题

研究 graphic design / 平面视觉是否只能使用二维扁平图形；`image plane` 构图与 3D objects、
perspective、spatial depth、DoF、bokeh、volumetric lighting 是否冲突；以及
`generation/graphic-image-prompt/SKILL.md` 如何区分 `plane-first` 与 `scene-first`。

## 来源范围与方法

本文只使用来源拥有者直接发布的材料：MoMA 与 V&A 馆方术语，Blender manual、Microsoft Direct3D
文档、OpenAI image generation 说明，以及 diffusion image synthesis 与 rendering equation 原始论文。

用户提供的星环图片只作为 routing case，不作为外部事实来源。本文不把软件能实现某种效果，推导为
graphic design 必须采用该效果；也不从单张图的视觉线索反推其真实制作媒介。

## 一手来源事实

### 1. graphic design 是视觉组织与沟通实践，不是“flat rendering”同义词

**事实：** MoMA 的定义将 `image` 与 type、space、color 并列，没有规定 image 必须是几何图形，
也没有把 graphic design 限定为印刷物；其列举范围跨 poster、book、album cover、film title
sequence、website 与 interactive software。
[MoMA: Graphic Design](https://www.moma.org/collection/terms/graphic-design)

**事实：** V&A 说明 digital design 同时跨 physical 与 digital domain，并把 3D models、animation、
video games、AR、VR 列为 digital design 的例子。
[V&A: Digital art & design dictionary](https://www.vam.ac.uk/articles/digital-design-dictionary)

**事实：** MoMA 对 `perspective` 的定义本身就是“在 flat surface 上表现 volume 与 spatial
relationships，使场景看起来向远处延伸”。这证明“承载面是平的”和“图像表现深度”不是互斥概念。
[MoMA: Art terms — Perspective](https://www.moma.org/collection/terms/?filter=P)

**推断：**

- photography、3D imagery、moving image 或有深度的 rendering 可以成为 graphic design 的
  `image` 材料；
- clean geometry、符号化和 typography 是 graphic design 的可能语言，不是它的必要定义；
- DoF、bokeh、复杂反射、体积光和有机质感只证明图像使用了 photographic / optical spatial
  language，不能单独证明它由真实 camera 拍摄，也不能证明它不属于某个 graphic design 成品。

**证据局限：** 博物馆分类说明实践范围，不提供自动 routing 算法；“某媒介可被 graphic design
使用”也不意味着任何使用该媒介的图像都应归为 graphic design。

### 2. 三维内容与二维 image plane 是两个不同层级

**事实：** Blender camera 决定 scene 的哪一部分在 rendered image 中可见，并明确说明 lens 控制
3D objects 在 2D image 中的表示。Perspective 让远处物体显得更小、平行线趋于汇聚；
orthographic 则让大小不随距离变化。
[Blender Manual: Cameras](https://docs.blender.org/manual/en/latest/render/cameras.html)

**事实：** Direct3D 的 geometry pipeline 依次应用 world、view、projection transforms；投影后的
顶点经 clipping、viewport scaling 后成为 screen coordinates。
[Microsoft Direct3D: Transforms](https://learn.microsoft.com/en-us/windows/win32/direct3d9/transforms)
其 viewport 是一个二维矩形，3D scene 被投影到其中。
[Microsoft Direct3D: Viewports and Clipping](https://learn.microsoft.com/en-us/windows/win32/direct3d9/viewports-and-clipping)

**推断：** `image plane` 只说明最终决定可在二维坐标中读取，不说明生成它的内容没有三维结构。
同一 3D scene 可以因 camera、projection、crop 改变，在 image plane 上产生完全不同的 shape、
negative space 与 attention path。反过来，一个具有强烈二维图形秩序的成品也可能由完整 3D scene
render 得到。

**建议：** skill 中可以要求 plane-first prompt 精确描述投影后的 silhouette、screen position、
overlap、crop、value mass 和 layer relationship；但不要因此接管 world-space geometry、
camera realism 或 light transport 的完整设计。

### 3. generative image synthesis 不能泛化为物理 renderer

**事实：** OpenAI 说明 4o image generation 是在 online images 与 text 的 joint distribution 上
训练的生成模型，能力包括 photorealistic output、text rendering、prompt following 与图像转换。
[OpenAI: Introducing 4o Image Generation](https://openai.com/index/introducing-4o-image-generation/)

**事实：** 原始 diffusion 论文把方法描述为 latent-variable model 的 image synthesis 与逐步
denoising；Latent Diffusion 则在 pretrained autoencoder 的 latent space 中进行生成，并用
cross-attention 接受 text 等 conditioning。
[Ho et al.: Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
[Rombach et al.: High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)

**事实：** 物理 rendering 的经典形式化不同。Kajiya 的原始 rendering equation 用积分方程描述
surface points 之间的 emitted 与 scattered light transport，并给出 Monte Carlo 解法。
[Kajiya: The Rendering Equation](https://doi.org/10.1145/15886.15902)

**推断：** 对一般 generative image model，说它会“计算物理光线、真实焦距和景深”并不准确。
模型能合成可信的光照、DoF 或 lens cues，不等于它必然构建显式 3D scene、camera model 并求解
physical light transport。除非具体产品文档明确声明 hybrid renderer 或受约束的物理模拟，否则
prompt 中的 focal length、bokeh、volumetric light 应视为目标图像线索，而不是可验证的物理参数。

**建议：** skill 应描述可观察结果，例如近大远小、汇聚、遮挡、焦外模糊的区域与高光层次；不要承诺
image model 会执行光学或工程上精确的计算。

## 对“摄影 vs 平面设计”二分框架的评估

待评估框架把 photography 定义为真实、光影、深度、质感，把 graphic design 定义为信息、符号、
扁平化；又用 DoF / bokeh、复杂光影互动和有机质感判定“摄影”，用 clean geometry、无景深、
符号化与排版判定“彻底平面设计”。

**判断：这更像 `photographic spatial language` 与 `flat graphic illustration language` 的区分，
不能充当 photography 与 graphic design 的职责定义。**

原因：

1. **媒介与实践类型被混为一谈。** Photography 是图像取得方式及媒介传统；graphic design 是组织
   type、space、image、color 完成视觉沟通的实践。摄影图像可以被平面设计使用。
2. **可见线索不等于来源。** DoF、bokeh、reflection 和 volumetric light 可由真实 camera、3D
   renderer 或 generative image synthesis 产生；仅凭成品无法可靠确认生产机制。
3. **深度不取消平面构成。** Perspective 本就是在 flat surface 上表现空间的技术。Graphic design
   可以借助深度，scene image 也一定有二维 composition。
4. **直接采用会造成系统性漏触发。** photographic fashion cover、带 3D object 的 web background、
   以照片裁切和空间光影构成的 editorial visual 会被错误排除；相反，一张 clean、无景深但依赖角色
   动作与场景叙事的插画可能被错误吸入。

**建议 routing 用法：** DoF、bokeh、复杂 light interaction、材质响应、camera angle 与 scale cues
可以作为“scene authority 可能较高”的证据；clean geometry、typography、repeat、crop invariance
可以作为“plane authority 可能较高”的证据。它们只改变判断权重，不是单项 veto。最终仍应问：
删除或替换三维场景的物理关系后，作品身份是否仍由画框关系保留。

## Plane-first / scene-first 的不重叠边界测试

不要根据“画面是否有 3D”路由。按以下顺序判断：

### A. Identity counterfactual

保留最终画框的 silhouette、position、scale、value blocks、negative space、layer order 与 crop，
替换具体人物、物体或 rendering mechanism：

- 核心身份和用途仍成立：支持 plane-first；
- 主题对象、动作、空间事件或世界可信度随之消失：支持 scene-first。

### B. Dependency test

完成任务前，是否必须先确定以下任一组关系：

- object geometry、world-space scale、camera position / lens、occlusion；
- 人物行动、对象互动、环境因果；
- 光源与表面的空间关系、可信材质响应、连续空间。

如果这些是作品成立的前置，而不仅是服务既定构图的表现选项，归 scene-first。

### C. Crop authority

- identity 依赖可跨画幅保持的 rhythm、field、layer 或 negative-space system，局部 crop 仍成立：
  支持 plane-first adaptive field；
- identity 依赖完整对象、明确视点、空间事件或特定遮挡关系，裁切会破坏世界读取：支持 scene-first。

### D. Prompt ownership

- plane-first 可以拥有：screen-space placement、shape hierarchy、overlap、edge crop、value mass、
  image-as-layer、type、surface treatment；
- scene-first 应拥有：what exists in the world、what is happening、camera/world geometry、spatial
  continuity、lighting/material realism。

两者都需要 composition，但同一任务只让其中一个拥有首要 decision authority。另一个维度只作为
输入约束，不另起固定 skill 调用链。

## 星环图片 case study

用户提供的图片具有清晰的二维读取：宽银幕画框中，巨大环体形成偏心椭圆弧；近景结构从右下方越界，
恒星在下方形成小面积高亮，中央黑场形成大块 negative space。仅看 silhouette、value mass 与 crop，
它确实可以被 plane-first 语言描述。

但当前图片的具体身份还依赖：

- 环体近端与远端的巨大尺度差和强 perspective；
- 可信的 megastructure 截面、表面分段与空间厚度；
- 恒星被环体遮挡所建立的前后关系和尺度参照；
- 逆光、金属反射、远近 detail falloff 与宇宙环境。

**诊断：** 如果任务是“生成一座可信的 giant sci-fi ring world / orbital megastructure”，以上
world-space geometry、camera、occlusion、scale 与 light/material relationship 是前置决策；这张图
应归 scene-first。椭圆构图很强，但它是场景投影后的主形，不是足以替代场景结构的独立合同。

**条件性例外：** 如果 brief 是“做一个由环形弧带、黑色负空间与局部金色峰值构成、可裁切的 web
background”，具体星环工程结构可以被任意 3D form 替换，且 identity 仍成立，则它可以归
plane-first；3D 在此只是实现 shape、layer 与 light response 的材料。

## 当前 skill 的只读诊断

目标文件：`generation/graphic-image-prompt/SKILL.md`

### 仍会造成误读的部分

frontmatter 仍使用“由二维构成决定成败”，正文使用“具体的二维构成与图层 direction”。这在专业语义上
可以理解为 screen-space composition，但在自动触发和普通用户语境中容易被读成：

- 只能用二维扁平图形；
- 只要最终输出为二维图片就都属于该 skill。

正文举了含人物摄影的例子，却没有把 3D、perspective、spatial depth 与 volumetric light 也明确写成
可用材料，也没有写出当 scene/world relationships 成为前置时退出本合同的正向边界。

## 对 skill 的建议措辞

### 推荐 frontmatter 边界

> Plane-first 生图 prompt：把想法、brief 与参考素材转成由最终画框构图决定成败的单张或系列图片
> prompt。用于 web background、时尚封面、偏平面的文章配图、editorial visual、collage、抽象
> graphic 与固定主视觉；触发标准是作品身份主要由画框中的形、位置、比例、图层、裁切、节奏与明度
> 关系决定。允许 photography、3D objects、perspective、spatial depth 与 volumetric lighting；
> 当任务必须先确定场景结构、动作、camera 或空间／光照真实性才能成立时不触发。

### 推荐核心定义

> Plane-first 描述的是 decision authority，不是 flat-only rendering。最终画框中的 composition
> 先于具体成像机制；photography、illustration、3D、pixel art、typography、perspective、depth of
> field 与 volumetric lighting 都可作为按需材料。若替换这些材料后，既定 shape、layer、crop、
> rhythm 与 value structure 仍能保留作品身份，本合同成立；若作品必须依赖场景对象、行动、视点、
> 遮挡、空间尺度或光照／材质真实性，本合同不成立。

## 局限

1. 博物馆术语能证明 graphic design 的媒介范围，但不会替仓库定义唯一 skill taxonomy；
2. Direct3D 与 Blender 证明 3D 到 2D 的投影事实，不证明所有 3D render 都是 graphic design；
3. diffusion 与 OpenAI 资料证明常见 image generation 的 synthesis 路径，不足以断言所有未来模型
   都没有显式 3D、camera 或 physical renderer 模块；
4. 星环 case 的 routing 取决于 brief 的真正不变量。仅看成品可提出高置信诊断，不能替代用户对任务
   目的与必须保持关系的说明。
