# 游戏美术与 3D 图像 prompt 术语边界

- 日期：2026-10-08
- 问题：哪些游戏美术与 3D 术语会改变单张生成图的可见结果，哪些描述的是生产资产、通道或引擎机制；各术语何时适用，误用会让结果偏向哪里？
- 来源范围：Riot 与 Disney Animation 的制作团队资料；Unity、Unreal Engine、Blender、Aseprite、Adobe Substance 3D 的一手文档；Square Enix / Acquire 的制作访谈。资料于 2026-10-08 查阅。未使用二手教程或社区解释。

## 来源事实

### 交付物与制作环节

1. **Concept art、key art 与游戏内画面承担不同任务。** Riot 的 VALORANT 主插画师说明，Agent 插画从缩略草图开始，逐步探索姿势、构图、角色气质与职责；该团队把 key art 定义为用于宣传新内容的主视觉。另一篇 Riot 设计团队资料区分游戏内产品素材与品牌、发行素材。因而 `concept art` 更适合探索设计或氛围，`key art` 更适合有主题与叙事的宣传插画，二者都不等于实际游戏画面。[Riot：Astra: From Sketch to Key Art](https://playvalorant.com/en-gb/news/dev/astra-from-sketch-to-key-art/)；[Riot：Complementary Visual Design in Spirit Blossom](https://www.riotgames.com/en/news/complementary-visual-design-in-spirit-blossom)

2. **Model sheet 与 turnaround 是参考页，不是游戏角色模型。** Disney Animation 将 model sheet 列为 visual development 的产物；Animation Guild 将 model sheet 描述为绘有人物、道具或特效设计的制作页。Disney Animation 的制作论文也把 character turnaround 标为角色概念页中的一种多视角参考。工作室间页内要素会不同；prompt 应写出视图、比例、服装和识别点，而不要只给术语。[Disney Animation：Visual Development](https://www.disneyanimation.com/process/visual-development/)；[Animation Guild：Craft: Color Design](https://animationguild.org/craft-color-design/)；[Disney Animation：Myth: A Frozen Tale production paper](https://media.disneyanimation.com/technology/publications/2020/myth_siggraph_2020.pdf)

3. **In-game screenshot 指游戏运行画面。** Unreal 将其定义为对环境或 gameplay 的截图，截图工具捕获游戏帧；Unreal 还把 camera 描述为玩家观看游戏世界的视点。由此推断，生成模型 prompt 中的 `in-game screenshot` 通常表达截图观感，而非真的从游戏运行中抓取画面。应补玩家镜头、关卡状态及 HUD 是否显示；如果用户要真实截图，则需要游戏或引擎中的实际帧。[Unreal：Taking Screenshots](https://dev.epicgames.com/documentation/en-us/unreal-engine/taking-screenshots-in-unreal-engine)；[Unreal：Cameras](https://dev.epicgames.com/documentation/en-us/unreal-engine/cameras-in-unreal-engine)

### 2D 游戏素材与像素表达

4. **Sprite 不等于像素画。** Unreal Paper 2D 把 Sprite 作为代表角色或物件的静态二维纹理；Unity 也允许将 Sprite 映射到平面网格，并与 3D 场景内容组合。因此 `sprite` 表示二维图像素材及其用途，不规定像素画、画布尺寸或绘画风格。[Unreal：Paper 2D Overview](https://dev.epicgames.com/documentation/unreal-engine/paper-2d-overview-in-unreal-engine)；[Unity：Graphic and font assets preparation](https://docs.unity3d.com/cn/6000.0/Manual/best-practice-guides/ui-toolkit-for-advanced-unity-developers/graphic-and-font-assets-preparation.html)

5. **Sprite sheet、texture atlas、tileset 与 tilemap 不是同一交付物。** Aseprite 将 sprite sheet 定义为一张含同一 Sprite 多帧的大图；Unreal 也把它用于收纳多个变体并顺序播放动画。Aseprite 的 tilemap 是格子引用 tileset 中图块的图层；Unreal 的 Tile Set 是图块集合，Tile Map 用这些图块构成关卡。Texture atlas 则可把多个独立图像合并到一张纹理，或把不同模型区域映射到同一张纹理。术语在工具中会有局部差异，prompt 应先说用户要的是动画帧、独立素材图集、可拼图块，还是拼好的关卡。[Aseprite：Sprite sheets](https://www.aseprite.org/docs/sprite-sheet/)；[Aseprite：Tilemap](https://www.aseprite.org/docs/tilemap/)；[Unreal：Paper 2D Overview](https://dev.epicgames.com/documentation/unreal-engine/paper-2d-overview-in-unreal-engine)；[Unity：Creating and Using Materials](https://docs.unity3d.com/cn/2018.3/Manual/Materials.html)

6. **Autotile 是邻接规则，不是“可平铺”的同义词。** Unity Tilemap Extras 的 Rule Tile 根据周围格子匹配规则并选择显示的 Sprite；图像本身仍需提供边缘、角、内外转接等适用变体。`seamless` 只说明边缘衔接，不足以说明邻接逻辑或完整图块集合。Unity 的术语是 `Rule Tile`；不同引擎可能采用别的名称。[Unity-Technologies：2D Tilemap Extras / Rule Tile](https://github.com/Unity-Technologies/2d-extras/blob/master/Documentation~/RuleTile.md)

7. **Pixel art 的 dithering 需要限定意思。** Aseprite 将抖色作为渐变或 RGB 转 indexed 色彩时可选的算法与矩阵；Adobe Photoshop 也用 dithering 减少渐变 banding。两者支持同一核心：用可用色模拟中间色或平滑色带，但画面模式不唯一。若要复古像素纹理，应写 ordered/checker-like pixel clusters、作用区域和有限色阶；如果只想平顺渐变，不应自动加入显眼棋盘图案。有限调色板、画布像素尺度和颜色渐变也是独立决策。[Aseprite：CLI dithering options](https://www.aseprite.org/docs/cli/)；[Aseprite：Gradient dithering options](https://www.aseprite.org/docs/context-bar/)；[Adobe：Apply a gradient fill](https://helpx.adobe.com/photoshop/desktop/adjust-color/color-effects-techniques/apply-gradient-fill.html)

### 镜头、投影与混合维度

8. **Orthographic、俯视、isometric 与 dimetric 描述不同维度。** 正交投影使物体表观尺寸不随镜头距离变化；它不指定镜头朝向。俯视是观察方向。Isometric 是轴向／投影关系，不能由“斜俯视”自动推出。Unity 的 Isometric Tilemap 默认 cell size 模拟 dimetric；另设比例才模拟 true isometric。常见 2:1 菱形图块是视觉和网格习惯，不保证严格三轴等长的几何等距。[Unreal：Orthographic Camera](https://dev.epicgames.com/documentation/en-us/unreal-engine/orthographic-camera-in-unreal-engine)；[Unity：Creating an Isometric Tilemap](https://docs.unity3d.com/es/2018.4/Manual/Tilemap-Isometric-CreateIso.html)

9. **2.5D 与 HD-2D 不提供统一实现规格。** Unreal 文档称其 Paper 2D 可以做 2D 与 2D/3D hybrid 游戏，说明混合维度是多种组合。Square Enix / Acquire 对 Octopath Traveler 的 HD-2D 描述是将 2D 像素与 3D 环境融合，并加入光影效果；这是一种具体作品路线，不能推成所有 HD-2D 游戏的固定清单。使用 `2.5D` 或 `HD-2D` 时，应拆成精灵、三维场景、镜头、光效和景深等实际画面特征。[Unreal：Paper 2D Overview](https://dev.epicgames.com/documentation/unreal-engine/paper-2d-overview-in-unreal-engine)；[Unreal：Octopath Traveler and HD-2D](https://www.unrealengine.com/spotlights/octopath-traveler-s-hd-2d-art-style-and-story-make-for-a-jrpg-dream-come-true)

### 3D 画风与材质

10. **低面数与可见折面是两个选择。** Low-poly 的生产含义是较少的多边形；Blender 的 smooth shading 通过法线插值隐藏面边界，不改变几何；flat shading 会让面边界清晰可见。因此低面数模型可以平滑着色。若 prompt 想要 faceted 外观，应另写平面折角或 flat shading；若只要低复杂度结构，不应自动加上晶面观感。[Adobe Substance 3D：Create Low-poly Models](https://www.adobe.com/uk/products/substance3d/discover/how-to-create-low-poly-3d-models-and-characters.html)；[Blender：Shade Smooth & Flat](https://docs.blender.org/manual/en/latest/modeling/meshes/editing/face/shading.html)

11. **PBR 是材质／光照响应方法，不是“写实风格”开关。** Unreal 说明 PBR 可在不同灯光下提供较一致的材质响应，并明确将 photorealistic surfaces 与 hand-painted 到 cel-shaded 的风格化效果都列为适用方向。故可以组合 PBR 材质响应与风格化造型；若想要写实，仍要分别描述比例、表面、灯光与成像。[Unreal：Using Materials and Textures for Maya Users](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-materials-and-textures-in-unreal-engine-for-maya-users)

12. **Hand-painted texture 描述的是绘制式表面表达。** Unreal 的 stylized rendering 示例通过材质与后处理实现手绘观感，也指出实现路径不止一种。用于单张渲染 prompt 时，应说清笔触、色块、手绘高光／阴影等可见特征；术语本身不保证纹理资产已绘制，也不排斥 PBR 光照。[Unreal：Stylized Rendering](https://dev.epicgames.com/documentation/unreal-engine/stylized-rendering?application_version=4.27)；[Unreal：PBR Materials](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-materials-and-textures-in-unreal-engine-for-maya-users)

13. **NPR、toon 与 cel 的范围不同。** NPR 是非写实渲染的大类；Blender 将 Shader to RGB 用于 NPR，并演示通过色带构造 toon shader，同时警告它会打断 PBR 管线并影响部分渲染效果。对成图更有效的是写明色阶分段、硬／软阴影边界、线稿是否出现；toon 或 cel 本身不规定描边、几段阴影或材质光泽。[Blender：Shader to RGB](https://docs.blender.org/manual/en/4.3/render/shader_nodes/converter/shader_to_rgb.html)

### 生产贴图与成像效果

14. **Texture atlas 与 trim sheet 都是 UV／纹理复用方案。** Unity 的例子将模型不同区域映射到同一 texture atlas；Adobe Substance 说明 trim sheet 用一组纹理给多个资产贴图，以节约纹理内存。前者常装入多个独立区域；后者设计可重复使用的条带区域。生成一张可见图表不证明 UV、边缘留白、纹理分辨率或运行时复用正确。[Unity：Creating and Using Materials](https://docs.unity3d.com/cn/2018.3/Manual/Materials.html)；[Adobe Substance 3D：Trim Sheets](https://www.adobe.com/learn/substance-3d-painter/web/trim-sheets-with-substance-painter)

15. **Normal、bump 与 displacement 的效果和条件不同。** Normal map 编码表面法线方向，改变光照计算而不改变网格轮廓；bump mapping 也可以伪造表面起伏而不动网格。Blender 的 displacement 默认可能只使用 bump mapping；只有启用 true displacement 时，表面几何才真的被推移，而且需要足够细分。故生产 prompt 应说明需要的是微小光照细节，还是轮廓／几何形变；渲染 prompt 宜改写成可见的刻痕、压纹或隆起。[Unity：Introduction to normal maps](https://docs.unity3d.com/6000.1/Documentation/Manual/StandardShaderMaterialParameterNormalMap.html)；[Blender：Displacement](https://docs.blender.org/manual/en/latest/render/materials/components/displacement.html)

16. **Roughness 与 metallic 是材质参数，不等于贴图画面。** Unreal 的 roughness 控制反射清晰或模糊：低值偏镜面，高值偏漫反射／哑光；metallic 说明表面更像金属还是非金属。对普通成图使用 `matte stone`、`sharp metallic reflections` 这类可见结果；需要通道贴图时，才要求 roughness/metallic map。灰度 roughness 贴图和黑白 metallic mask 是数据图，不是要画在物体表面的污渍或纹理。[Unreal：Physically Based Materials](https://dev.epicgames.com/documentation/en-us/unreal-engine/physically-based-materials-in-unreal-engine)；[Unreal：Creating Shiny Materials](https://dev.epicgames.com/documentation/unreal-engine/creating-shiny-materials-in-unreal-engine)

17. **Emission 与 bloom 分属材质和后处理。** Unreal 将 emissive 作为材质输入；Bloom 是后处理，使亮部向周围扩散，且可独立调节。强 emissive 不自动保证它照亮周边，场景照明还依赖引擎和 GI 设置。单张成图可以分别写“发光表面”和“柔和光晕”；技术交付需确认光照贡献和 bloom 配置。[Unreal：Using the Emissive Material Input](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-emissive-material-input-in-unreal-engine)；[Unreal：Add Post Process Volumes](https://dev.epicgames.com/documentation/en-us/unreal-engine/add-post-process-volumes)

## 对 `generation/image-prompt` 的建议

以下为基于上述事实的推断与编辑建议，不是来源原文。

### 让分流从交付物开始

- 先让模型判断用户需要宣传插画、设计探索、转面参考、运行中游戏画面、单个 sprite、动画帧 sheet、tileset，还是完整关卡图。每类给不同的排布要求；“游戏风格”只指出来源或用途，不够决定画面结构。
- 将游戏视觉系统作为第二个选择轴，而不是把游戏预设成一种美术方向。将术语分成可扩展的类别：写实 CG、风格化 3D、2D 插画、像素画、toon/cel、低面数几何等。名单应作为提示，不应封闭成穷举分类。
- 玩法分类（如 ARPG、JRPG）可作为题材锚点，再具体抽取可保留的形状、角色比例、材质、色彩、镜头和 UI；不要默认由玩法缩写推断画风。

### 明确哪些术语可以写成成图提示

| 术语层级 | 适合写入普通成图 prompt 的内容 | 不足以保证的内容 |
| --- | --- | --- |
| 交付物 | 宣传主视觉、概念草图、同一角色多视图、游戏运行画面 | 多视图的身份完全一致、真实运行截图 |
| 视觉系统 | 手绘色块、离散像素簇、硬边 cel 阴影、哑光石材、锐利金属高光、可见平面折角 | 原生尺寸、帧对齐、实际面数、真实 PBR 参数 |
| 视角 | 俯视、正交投影、严格等距、指定菱形网格 | 仅靠标签得到精确相机角度或可用关卡排序 |
| 贴图数据 | 用户明确要求的 sprite sheet、tileset、texture atlas、trim sheet、normal/roughness/metallic map | 正确 UV、通道值、引擎兼容、无缝图块或有效邻接规则 |
| 成像效果 | emissive surface、bloom、景深、轮廓光 | 物体实际照亮场景、指定引擎效果或性能结果 |

### 建立术语防混淆规则

- 先写目标可见结果，再附可选专业词。`faceted`、`flat shading`、`crisp cel bands`、`painted shadow blocks` 比只写 `low-poly`、`NPR`、`toon` 更能限定成图。
- 允许互补标签并存：风格化几何 + PBR 材质响应、低面数 + smooth shading、hand-painted texture + 实时光照。只在用户指定时才混搭矛盾结果，如硬边 cel 影与柔软摄影式高光；如需混搭，指出作用区域。
- 区分技术图与渲染图。若用户要 map / sheet，明确这是单独贴图或网格资产，补通道、透明度、视图排列等规格；若用户要成图，则把 map 名改成光照或材质结果描述。
- 对精确交付增加验证提醒：图块接缝和邻接规则、sprite sheet 网格与帧序、转面比例一致性、UV 与贴图通道、像素配准、引擎中的 emissive/GI/bloom 结果都需要实际工具检查。

## 局限

- 游戏团队没有通用的 concept art、model sheet、turnaround 或 HD-2D 模板。本记录引用 Riot、Disney Animation、Square Enix / Acquire 的具体用法，不能推为每间工作室都采用同一术语边界。
- 2D/3D 混合、low-poly、hand-painted、PBR 与 NPR 的视觉效果会随模型、相机、灯光、渲染器和生成模型变化。专业词能缩小方向，不能证明生成资产可投入生产。
- Unity 的具体 Isometric Tilemap 文档用于解释 dimetric 与 true isometric 的技术差异；目标引擎的实现细节应按该引擎版本复核。
- 本研究核对的是术语事实与 prompt 决策，不包含图像生成模型的对照实验。是否某个词能在目标模型中稳定改变结果，需要用代表性正反例验证。
