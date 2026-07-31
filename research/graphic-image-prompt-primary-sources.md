# 二维平面视觉生图 Prompt：一手来源研究与职责建议

研究日期：2026-07-31

## 研究问题

本次研究不把目标限定为“有文案、承担传播任务的传统海报”。需要覆盖的是更宽的二维平面视觉：

- pixel poster、抽象或具象 poster；
- 时尚杂志式 editorial visual；
- collage、版画感、印刷实验、纯 typography 或完全无字的 graphic image；
- 固定画框的主视觉，以及需要耐裁切、可铺展的 web background；
- photography、illustration、3D、pixel art、type 等只作为可选材料，不预设其中任何一种是主媒介。

核心问题是：这类任务是否需要一套不同于“主体／场景／镜头／光线”的决策顺序；若需要，它的职责、
输入、决策步骤、输出合同与审美质量门槛应是什么。

## 仓库事实与证据边界

### 仓库事实

1. 当前仓库只有一套通用单图 prompt 合同。它以视觉核心为统领，稳定字段包括
   `Visual Intent`、`Subject and Setting`、`Composition and Viewpoint`、`Art Style`、
   `Lighting and Color`、`Texture and Materials`、`Medium`、`Mood`。其方法可以写平面视觉，
   但主要决策语言仍是主体、场景、机位、景别、透视、光线和成像媒介。
2. 当前仓库另有一套纯视觉 Style Spec 合同。它明确排除主体、场景、对象排列、文字和单图构图，
   只交付替换内容后仍成立的可复用视觉语言。
3. 当前仓库没有名为 `background` 或 `backgrounds` 的 skill，也没有可据此确认的 background 输出合同。
   因此下文只把 background 当作用户提出的一类结果形态分析，不虚构“现有 background skill”事实。
4. `research/` 是本仓库一手来源研究的统一落库目录，因此本文沿用该目录约定。

### 一手来源范围

本文只使用以下来源拥有者直接发布的材料：

- MoMA 与 Cooper Hewitt, Smithsonian Design Museum 的 graphic design / poster collection、
  exhibition 与馆方说明；
- IBM Carbon Design System 的 grid、typography、layout 与 color 官方规范；
- W3C WCAG 2.2 官方规范与 Understanding 文档；
- OpenAI 官方 Image API 文档与 GPT Image prompting guide；
- Adobe InDesign / Acrobat 官方 print production 文档。

博物馆个案说明证明的是“设计实践中确实存在这些组织方法”，不是某种风格必然更美。Design system
规范主要面向 digital product，不直接等同于 poster 法则；本文仅把其中关于 hierarchy、grid、
spacing、contrast 的可观察机制作为跨媒介推断依据。模型官方文档只证明当前列明的能力与局限，
不证明遵守 prompt 就能稳定生成优秀设计。

## 结论

### 建议新增，但不应命名为 poster 专用能力

**建议：** 新增一套面向“target-specific 二维平面构成”的生图 prompt 能力是合理的。推荐候选名为
`graphic-image-prompt`；`art-direction-image-prompt` 可作为备选，但不优先。

理由不是“海报比摄影更追求美”，而是两类任务的**决策对象不同**：

- pictorial image 先决定画什么、主体处在什么空间、从哪里看、光如何塑造对象；
- graphic image 先决定画框内由哪些视觉材料组成，以及形、色块、图像、文字、空白、纹理和图层
  如何形成秩序、冲突、节奏与注意力路径。

二者都可能使用摄影，也都可能没有人物。分界不应是“摄影 vs 平面设计”，而应是：

> 成败主要由场景与成像是否成立，还是由二维形式关系与版面系统是否成立。

`graphic-image-prompt` 比 `poster-prompt` 覆盖面准确；后者会错误暗示文案、宣传用途和固定海报格式是
必需输入。`art-direction-image-prompt` 则过宽，容易把所有图片 prompt、可复用风格探索和一般视觉
审美都吸入同一职责，无法保持独立边界。

### typography 是可选材料，不是前置条件

**事实：** MoMA 把 graphic design 定义为通过 type、space、image、color 进行视觉沟通，覆盖 poster、
book、album cover、film titles 与 digital works。[MoMA: Graphic Design](https://www.moma.org/collection/terms/graphic-design)
MoMA 的 typographic poster 展览又显示，type 可以从被动基础变成 expressive medium。
[MoMA: Typography and the Poster](https://www.moma.org/calendar/exhibitions/443)

**事实：** Cooper Hewitt 对 125 件以上 poster 的分析分成 14 类机制，包括 focus the eye、overwhelm
the eye、use text as image、overlap、simplify、manipulate scale、activate the diagonal、make a
system 等。“use text as image”只是其中一种机制，不是所有作品的前置。
[Cooper Hewitt: How Posters Work press release](https://www.cooperhewitt.org/wp-content/uploads/2015/02/Final-How-Posters-Work-Release-4-30-15.pdf)

**推断：** 新能力必须能处理纯 shape / color / texture / image 的构成。只有输入真实包含文字时，才进入
typography 与 exact-copy 决策；不应为了让结果“像海报”而主动添加标题、Logo 或装饰字符。

### background 可以是该能力的一种构成模式

**推断：** 固定主视觉与 web background 使用的是同一组基础变量：画框、尺度、图底关系、色块、
密度、节奏、图层、纹理、空白与裁切。差异主要是构图约束：

- fixed composition 允许关键焦点、文字或物件依赖特定位置；
- adaptive field 要求视觉身份由跨画框的连续关系成立，局部裁切后仍保留节奏与层次，不能依赖唯一
  且必须完整出现的中心对象。

因此，在当前仓库没有既有 background 合同的前提下，最简单的长期结构是把 background 作为
`graphic-image-prompt` 的一个结果模式，而不是默认再设一套重叠职责。只有未来出现独有且稳定的
操作约束——例如特定 responsive crops、页面文字 safe zones、可循环纹理或独立的动态化生产合同——
才有证据把它收窄为单独能力。单纯“美观背景”不足以形成独立边界。

## 一手来源支持的核心判断

### 1. graphic image 的基本单位是形式关系，不是摄影对象

**事实：** MoMA 的定义直接把 type、space、image、color 并列为 graphic design 的视觉材料，而不是
把 graphic design 定义成一种摄影或插画风格。
[MoMA: Graphic Design](https://www.moma.org/collection/terms/graphic-design)

**事实：** Cooper Hewitt 的分类以观看机制命名：聚焦、过载、重叠、剪贴、简化、放大、双重意义、
对角线、系统等。它们可以由文字、图片、shape 或材料共同实现。
[Cooper Hewitt: How Posters Work](https://www.cooperhewitt.org/exhibitions/how-posters-work/)

**推断：** prompt 的第一步不应默认询问 camera、lens、shot size 或 lighting。它应先回答：

1. 哪一种二维关系使作品成立；
2. 哪些材料承担主形、次形、背景、连接与表面职责；
3. 观众先感知整体图形，还是先识别具象内容；
4. 哪个局部变化打破系统并成为记忆点。

摄影、插画、3D、pixel art、type 都可以进入，但它们是材料或表现方式，不是固定骨架。

### 2. grid 是对齐与节奏的骨架，不是必须可见的方格

**事实：** IBM Carbon 把 2x Grid 称为 typography、columns、boxes、icons 与 illustrations 的几何
基础；columns、rows、margins、padding、gutters 共同建立 visual rhythm。该系统也强调 grid 应适配
内容，而不是用同一尺寸机械填满空间。
[Carbon: 2x Grid overview](https://carbondesignsystem.com/elements/2x-grid/overview/)

**事实：** Carbon 的 layout 指南把 hierarchy、scale、proportion、contrast、harmony、rhythm、
repetition 列为 composition 原则；同时指出仅仅“技术上正确”地使用 grid，但把所有内容做成同一
scale，仍会使层级丢失。它还把 negative space 与 asymmetry 列为制造 contrast 的方式。
[Carbon: 2x Grid usage](https://carbondesignsystem.com/elements/2x-grid/usage/)

**事实：** MoMA 对 Herbert Bayer 1926 年 poster 的馆方说明，将 underlying grid、asymmetrical
composition、单一 type treatment 与 clarity 联系在一起。这是一个历史个案，不是 universal rule。
[MoMA: Herbert Bayer poster](https://www.moma.org/collection/works/5101)

**推断：** 新能力应要求“选一个主 grid logic”，但允许严格网格、偏移网格、自由场或刻意破格。
真正门槛是关键元素之间存在可解释的 alignment、interval 与 scale system；不是要求所有作品都使用
12 栏、16 栏或 8px unit。

### 3. hierarchy 可以由尺度、位置、密度、色值和空白建立，不依赖文字

**事实：** Carbon 说明 hierarchy 让观众在复杂内容中定位优先级；size 与 proximity 会改变内容之间的
关系。相同尺度会削弱方向感，而 grouping 与 spacing 可以显示依赖或相似性。
[Carbon: 2x Grid usage](https://carbondesignsystem.com/elements/2x-grid/usage/)

**事实：** Cooper Hewitt 的 poster 分析同时包含 focus the eye 与 overwhelm the eye，说明高密度与
低密度都可能是有意策略；关键是它们造成明确的观看行为，而不是统一追求“极简”和“大留白”。
[Cooper Hewitt: How Posters Work press release](https://www.cooperhewitt.org/wp-content/uploads/2015/02/Final-How-Posters-Work-Release-4-30-15.pdf)

**推断：** negative space 不应作为固定审美偏好。它至少可以承担四种职责：

- 分离层级与对象；
- 形成主形的反形；
- 控制观看停顿与密度节奏；
- 为裁切、叠字或跨尺寸适配保留弹性。

高密度作品也要有层级；其“空白”可以是低频区、低对比区或结构性停顿，不一定是纯色大空地。

### 4. typography 需要系统决策，但只在输入需要时启用

**事实：** Carbon 的 typography 系统用有限的 size、weight、leading 等 token 形成 hierarchy；其规范
指出，过多 type styles 会扰乱层级，weight 与 size 必须共同判断，expressive type 可以承担更强的
graphic role。[Carbon: Typography overview](https://carbondesignsystem.com/elements/typography/overview/)

**事实：** Cooper Hewitt 对 Philippe Apeloig poster 的过程说明显示，punctuation 被操作为形体，
spacing、weight、scale、layering、screenprint ink、paper texture 与 concentrated color 共同构成
最终作品。文字在这里同时是语义和图像材料。
[Cooper Hewitt: Making a Poster is a Process](https://www.cooperhewitt.org/2014/12/05/making-a-poster-is-a-process/)

**推断：** 当文字存在时，prompt 不只写“现代 sans serif”。它应明确：

- 文字是信息、图形、纹理还是空间骨架；
- 层级数量和每级的 scale / weight / width / case / spacing；
- 对齐、换行、旋转、重叠和被裁切关系；
- 文字与图像谁主谁次，是否共享轮廓或互相遮挡。

当文字不存在时，以上字段全部省略，不用 placeholder copy 填空。

### 5. 色彩应有角色和面积关系，不以色名堆叠代替构成

**事实：** Carbon 的 color system 以 role 管理 color；neutral value 用来组织 zones，主色与附加色
被有目的地使用，高反差 moment 用于聚焦或制造 tension。
[Carbon: Color overview](https://carbondesignsystem.com/elements/color/overview/)

**推断：** 对 graphic image 更有效的描述不是列出许多 palette 名称，而是写清：

- 主色域、支撑色域、强调色各占什么面积与层级；
- value blocks 如何分区；
- 哪种颜色绑定主形、背景、连接层或局部断裂；
- 饱和度、高光或互补关系集中在哪里。

灰度下仍应能读出主次；但色彩本身就是主题时，可以让 hue contrast 承担作品身份，只需诚实说明其
对特定输出媒介的依赖。

### 6. 纹理与“印刷感”必须来自材料行为，而不是复古滤镜词

**事实：** Cooper Hewitt 记录 Apeloig 选择 screenprint，是因为 ink on paper 的质地、饱和度与触感
对作品是必要组成；成品由 typography、velvety texture 与 concentrated colors 共同成立。
[Cooper Hewitt: Making a Poster is a Process](https://www.cooperhewitt.org/2014/12/05/making-a-poster-is-a-process/)

**推断：** “risograph、screenprint、offset、xerox、halftone、newsprint”不能只作为 style tag。
如果选择印刷模拟，应进一步锁定与作品相关的可见结果，例如 ink coverage、registration offset、
dot scale、paper tooth、edge absorption、overprint、limited plates、toner noise 或 cut-paper edge。
只保留真正改变 shape edge、color mixing、layer order 或 surface 的机制。

### 7. 图层关系是二维构成合同，不等同于前中后景摄影空间

**事实：** Cooper Hewitt 的分类明确包含 overlap、cut and paste、assault the surface、make a system
等平面操作；Apeloig 个案也通过不同 scale 的 text forms layering 形成图像。
[Cooper Hewitt: How Posters Work press release](https://www.cooperhewitt.org/wp-content/uploads/2015/02/Final-How-Posters-Work-Release-4-30-15.pdf)
[Cooper Hewitt: Making a Poster is a Process](https://www.cooperhewitt.org/2014/12/05/making-a-poster-is-a-process/)

**推断：** 新能力需要显式描述：

- base field：底色、纸面、连续纹理或空间底；
- dominant layer：承担第一读取的主形或主图；
- support layer：重复单元、网格、次级图像或色块；
- connector layer：线、遮罩、切口、阴影、文字或跨层形体；
- surface layer：颗粒、套印、压痕、扫描噪声等最终表面。

不是每张图都要五层；字段应按实际内容省略。关键是每层承担不同视觉职责，不能把装饰粒子当成
“层次丰富”。

### 8. 模型可以接受版面指令，但不能被当作精确排版引擎

**事实：** OpenAI 官方 prompting guide 建议在 layout 重要时明确元素 placement 和 negative space；
图中文字应给出 literal copy、font style、size、color、placement。它也建议把复杂产物写成 artifact
spec，并通过小步修改迭代，而不是用一个过载 prompt 解决所有问题。
[OpenAI: GPT Image prompting guide](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)

**事实：** 同一官方 API 文档同时列出限制：模型仍可能在 precise text placement / clarity，以及
structured or layout-sensitive composition 中遇到困难。
[OpenAI: Image generation limitations](https://developers.openai.com/api/docs/guides/image-generation#limitations)

**推断：** “写得更具体”能提高可控性，但不是像素级保证。新能力应把 prompt 做成明确 artifact
spec，同时：

- 文字短、用于概念图时，可要求模型直接生成并逐字验收；
- 长文案、法规文字、价格、日期、品牌字标或必须 print-ready 时，应把生成图视作 visual base /
  concept，最终 type 与 Logo 由可编辑排版层完成；
- 对高风险版面，优先用参考 layout、mask 或 iterative edit 锁定局部，而不是继续堆长 prompt；
- 不得宣称模型会可靠生成准确 kerning、baseline、精确 grid 或合法品牌资产。

### 9. print 与 screen 是交付约束，不应伪装成模型画面风格

**事实：** Adobe 的 print-ready PDF 指南要求交付前检查 links、fonts、bleed、margins、print color、
preflight、low-resolution images 与 overset text；其流程建议依据印厂要求使用 PDF preset、
bleed 与 destination color profile。
[Adobe: Produce print-ready PDF files](https://helpx.adobe.com/indesign/desktop/print/print-production-and-file-creation/produce-print-ready-pdf-files.html)

**事实：** Adobe 说明 bleed 用于让触边对象延伸过 trim line，补偿裁切偏差；RGB 转 CMYK 时颜色可能
变化，屏幕显示与印刷输出也可能不同。
[Adobe: Print bleed and slug areas](https://helpx.adobe.com/indesign/desktop/print/page-set-up-and-printer-marks/print-bleed-and-slug-areas.html)
[Adobe: CMYK process colors](https://helpx.adobe.com/indesign/desktop/print/ink-and-color-management/process-colors-cmyk-overview.html)

**事实：** W3C WCAG 2.2 要求普通文字及 images of text 达到至少 4.5:1 contrast，大字为 3:1；
同时建议在技术允许时使用真实 text，而非 rasterized image of text，因为后者不易缩放和自定义。
[W3C: WCAG 2.2 Contrast Minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum)
[W3C: Understanding Images of Text](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html)

**推断与建议：**

- image prompt 只能描述 bleed-aware composition、边缘延展、色域倾向或 raster surface，不能产出
  真正的 trim box、embedded font、ICC profile、PDF/X 或 preflight 结果；
- print-ready / responsive / accessible 是后续文件与实现验收，不是“画面看起来像印刷品”就算通过；
- 纯美术图不必机械套 WCAG；但当 graphic image 承担网页正文信息或文字功能时，应把真实 text、
  contrast 与替代文本留在可实现层处理。

## 推荐职责边界

| 能力对象 | 主要成败标准 | 核心决策 | 明确不负责 |
| --- | --- | --- | --- |
| 现有通用单图能力 | 一张统一的 pictorial image 是否成立 | 主体、场景、空间、视点、光色、材质、媒介、情绪 | 不必为所有任务建立 graphic system |
| 建议的 graphic image 能力 | 某一张或某一组目标画面的二维形式关系是否成立 | shape、色块、grid、scale、rhythm、negative space、layer、crop behavior，以及可选的 image / type | 不探索可跨内容复用的纯 style；不保证 print-ready 文件 |
| 现有纯 Style Spec 能力 | 换掉主体、场景、布局后视觉语言是否仍成立 | 媒介、边缘、色彩、光影、材质、完成度 | 不决定对象排列、单图构图与目标版面 |
| background 结果模式 | 连续视觉场在裁切和铺展后是否仍保留身份 | crop invariant、连续节奏、低频区与局部峰值、可选层次 | 不默认推测网页组件与固定文字位置 |

**关键边界测试：**

- 把主体和场景替换后，结果仍应完全成立：这是 reusable style，不属于 target-specific graphic
  composition。
- 把 layout、shape placement、layer order 或 crop rule 替换后，作品身份明显变化：这是 graphic
  image 的核心职责。
- 主要问题是人物、物体、空间可信度、动作阶段或镜头可见性：这是 pictorial image。
- 主要问题是画面被不同尺寸裁切仍否成立：这是 graphic image 的 adaptive-field 分支。

## 推荐输入合同

### 最小必需输入

只要求至少有一个可识别的目标核心：

- 主题、概念、情绪、品牌线索、主体、现成素材或希望出现的形式关系中的任意一种。

不把 copy、typography、受众、传播目标、output channel、camera 或 reference image 设为必填。
信息不足但不会改变作品身份时作最小假设。

### 会实质改变结果时才确认的输入

1. **画框与适配：** 固定画幅，还是需要横竖裁切／全屏铺展仍成立。
2. **必须保留的材料：** 产品、人物、Logo、图片、既有 shape、品牌色、pixel grid 等。
3. **文字：** 是否存在 exact copy；若存在，哪些字符必须逐字保留，哪些只作视觉占位。
4. **系列关系：** 单张，还是一组图；若为系列，什么必须不变、什么允许变化。
5. **交付用途：** 只有在用户要求 print-ready、网页信息可访问性或特定尺寸时才确认 print /
   screen 的实现限制。

开放需求下不应把用户拖入固定问卷。真正需要提问时，每轮只问会改变 graphic premise 或 layout
mode 的 2–3 项。

## 推荐决策步骤

### 1. 先判定画面模式

在以下两种模式中选择一种：

- **fixed composition：** 关键形、焦点、文字或图像依赖固定位置；
- **adaptive field：** 视觉身份来自连续场、重复系统或跨画框关系，允许多方向裁切。

系列图另加一层 invariant / variable 决策，不另立第三种基础模式。

### 2. 写出一个 graphic premise

用一句可见关系说明作品为何成立，例如：

- 大面积寂静色块被一条高密度 pixel seam 切开；
- 两套不同比例的圆形系统互相错位，只有一个局部完全重合；
- 柔软扫描纹理被刚性网格裁成不等宽带状；
- 单一具象图像被重复、裁断与反相，形成从识别到抽象的节奏。

这不是主题寓意，也不是“高级、先锋、杂志感”等评价词。删除这一关系后，作品应明显失去身份。

### 3. 分配视觉材料与图层职责

从 shape、color field、photo、illustration、3D render、pixel form、type、line、texture 中只选真正需要
的材料。为每个材料指定 dominant、support、connector、surface 或 base-field 职责；同一职责不要
由多个互相竞争的系统承担。

### 4. 建立二维 composition system

依次确定：

1. 主 grid logic 与关键 alignment；
2. 最大、中等、最小三个尺度层级是否都必要；
3. 主形、反形与边缘裁切；
4. repetition、interval、density 与 break point；
5. overlap、mask、cut、rotation、diagonal 或 asymmetry 的使用边界；
6. 第一读取、第二读取与停留区域。

不默认追求居中、对称、极简或大留白。只保留一个主 formal device 和一个有控制的破格点。

### 5. 设计 color、value 与 surface

- 用面积和职责描述主色域、支撑色域与强调色；
- 灰度检查主次与大形，色相检查作品身份；
- 选择一种主 surface / print logic，并写出它如何影响 edge、overlap、color mixing 与 detail；
- texture 只进入承担表面或层间关系的区域，不平均铺满全图。

### 6. 按需启用 typography 与具象成像

- 有真实文字才建立 type hierarchy，并逐字引用 exact copy；
- 有 photography / illustration / 3D 才描述对象、视点、光线与材料；
- 如果具象内容只是 texture 或被裁切的图层，不要把它重新写成完整叙事场景；
- 如果任务实际由人物、空间与事件主导，应回到 pictorial decision order，而不是强行“做平面”。

### 7. 写清适配与生产边界

- fixed composition 说明边缘是否出血、哪些关系不可移动；
- adaptive field 说明 crop invariant、允许的局部峰值和低频区域；
- series 说明系统不变量与每张图的变化轴；
- print / screen 只写 image generation 能控制的视觉结果，并明确真正的 bleed、font、profile、
  responsive layout 与 accessibility 仍需后续实现验证。

### 8. 转成一份 artifact-spec prompt

使用可观察的 shape、position、scale、interval、area、edge、layer、color 与 texture 语言。删除艺术家
名字或抽象风格词后，prompt 仍应能重建作品的形式身份。复杂任务通过小步 edit 收敛，不靠堆叠长串
互相竞争的风格形容词。

## 推荐输出合同

建议最终仍只交付一份可直接用于 image generation 的多行自然语言 prompt。字段按实际内容省略，
避免为无字画面、无主体画面或纯色块构成制造空字段。

```text
【Graphic Core】
Graphic premise：这张图独有的二维形式关系与一个受控破格点。
Canvas mode：fixed composition 或 adaptive field；画幅方向、裁切不变量与边缘关系。

【Composition System】
Shape and scale：主形、次形、反形、比例层级与重复单元。
Grid and rhythm：alignment、interval、density、repetition、asymmetry 与注意力路径。
Layer relations：base、dominant、support、connector、surface 的遮挡、裁切、透明与混合关系。
Image role：仅在有 photography、illustration、3D、pixel form 或其他具象材料时出现。
Typography：仅在有真实文字时出现，包含语义／图形职责、层级、字面内容、排列与可读性要求。

【Visual Treatment】
Color and value：色域、面积、明度层级、强调色位置与主体／背景分离。
Material and surface：纸面、油墨、网点、扫描、像素、拼贴或其他表面如何影响边缘与叠色。
Finish：细节密度、锐度、噪声尺度、局部精度与整体完成度。

【Invariants】
Must preserve：只列输入中真实存在的资产、文字、品牌或系列不变量。
```

中文实现时应翻译成自然中文 label；上面保留英文概念仅用于说明字段职责。具体模型的 size、quality、
format 与 compression 继续由 generation 入口控制，但 prompt 内必须描述会改变构图的画幅方向与
crop behavior。

## 美学质量门槛

### 必过 gate

1. **Graphic premise：** 能否用一句可见关系复述作品身份；若只能说“高级、时尚、有设计感”，不通过。
2. **Thumbnail read：** 缩小后是否仍能读出主要 shape、value blocks 和节奏；高密度作品也必须有
   dominant read。
3. **Layer necessity：** 删除任一主要 layer 后，作品关系是否改变；可随意删除的层属于装饰噪声。
4. **Grid coherence：** alignment、interval、scale 与破格是否来自同一系统；随机错位不等于活力。
5. **Negative-space function：** 空白或低频区是否承担反形、分组、停顿、适配或焦点职责；没有职责的
   “留白感”不是质量。
6. **Color role：** 每个主色是否有面积和层级职责；不能只列 palette 名称。
7. **Surface causality：** print / pixel / scan / collage 机制是否改变 edge、layer 或 color mixing；
   仅加均匀 grain 不通过。
8. **Mode fit：** fixed composition 的关键位置稳定；adaptive field 经中心、边缘、横向、纵向裁切后
   仍至少保留核心节奏和一条层级关系。
9. **Optional-material discipline：** 没有真实需要时不自动添加摄影主体、illustration、3D object、
   typography、Logo、UI 或装饰符号。
10. **Model honesty：** prompt 不把 exact typography、precise layout、print-ready 或 accessibility
    写成模型保证；这些边界有明确验收位置。

### “极致美感”的可操作定义

本研究没有找到一手来源支持某一种固定风格等于“极致美感”。更可执行的定义是：

- 形式选择少而明确；
- 每个材料只有一个主要职责；
- 系统与破格同时存在；
- 大形、局部、表面三个尺度都有控制，但不平均堆满；
- 作品即使移除题材名与风格名，仍能凭 shape、scale、interval、color area、layer 与 surface 被复述；
- 审美判断以可观察差异和比较验证，而不是形容词数量为证据。

Cooper Hewitt 的 14 类 poster 机制本身说明，聚焦、过载、简化、对角线、叙事、系统化等都可以成为
强作品；质量来自选择贯彻，而不是收敛到单一“正确版式”。

## 推荐验证方式

如果后续实现该能力，静态检查不能证明审美与边界成立。建议锁定现有能力为 baseline，并用至少以下
held-out tasks 做匿名对比：

1. 无文字、无主体的 abstract pixel poster；
2. 有摄影素材但由裁切、重复、色块和 type-image 关系主导的 fashion editorial visual；
3. 完全无文案、要求横竖裁切仍成立的 web background；
4. 高密度 collage，明确不允许自动极简化；
5. typography-only graphic image；
6. 普通人物叙事关键帧，用来确认新能力不会误吸 pictorial task；
7. 只给 reusable style 的任务，用来确认不会把 style exploration 变成单图 layout。

预先声明 hard failures：

- 无输入依据地添加标题、Logo、人物或 UI；
- 把所有任务默认做成摄影海报、居中 hero object 或大留白；
- prompt 没有 graphic premise，只剩风格词；
- background 裁切后失去全部识别关系；
- pure style 任务被写入单图对象排列；
- 对 precise type / layout / print-ready 作无依据保证。

blind judge 至少分开评分：二维构成、层级与节奏、材料／图层因果、审美统一、输入忠实、模型可执行性、
边界正确性。只有在新任务上改善且不损害 pictorial / reusable-style 边界，才有证据证明新增能力成立；
一两个主观样例不能证明长期优越。

## 最终建议

1. 新能力以 `graphic-image-prompt` 为首选候选名，职责是为某一张／一组目标视觉完成二维 composition
   与 layer direction，并交付 image-generation-ready prompt。
2. 不把 poster、copy、typography、传播任务或 output channel 设为必要输入；这些都是按需材料。
3. 不把“探索纯视觉风格”纳入核心职责；已有 Style Spec 合同负责可跨内容复用的 visual language，
   新能力只消费当前上下文中已有或可合理推断的风格方向，为具体画面作 arrangement。
4. background 在当前证据下更适合作为 adaptive-field 结果模式，与 fixed composition 共用同一套
   shape / grid / rhythm / layer 决策；未来只有出现独有生产合同时再拆分。
5. 与现有通用单图能力的真正分界是 decision order：scene-first 与 plane-first，而不是 photography
   与 design、写实与抽象、视频与海报。
6. 后续若写入任何 `SKILL.md`，按仓库独立性硬规则，只描述本能力做什么与交付粒度，不应在文件内用
   其他 skill 名称做路由或边界说明。
