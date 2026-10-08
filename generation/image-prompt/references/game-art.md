# 游戏美术

先确定交付物和游戏视觉系统。“游戏风格”可指生产原画、宣传图、实机观感或可复用资产；这些目标有不同的信息组织。

## 1. 确定生产环节

| 术语 | 所指交付物 | Prompt 必须明确 |
| --- | --- | --- |
| concept art（概念设计） | 探索角色、道具或场景方案 | 设计重点、造型语言、功能线索；是否需要方案比较 |
| character sheet / model sheet（角色设定图） | 记录比例、服饰、配色和细节 | 视图组成、固定识别点、细节图与文字职责 |
| turnaround（转面设定） | 同一角色或物件的多方向视图 | 每个朝向、统一比例与基准线；不能写成多个角色 |
| key art（宣传主视觉） | 传达游戏题材与核心形象 | 主次角色、戏剧构图、标志位置或留白；不套游戏内镜头 |
| in-game screenshot（游戏内截图） | 游戏运行时的可见画面 | 玩家镜头、关卡结构、角色尺度、界面是否出现 |
| inventory icon（物品图标） | 小尺寸界面中的识别资产 | 剪影、焦点、材质区分、背景与裁切；缩小后仍能识别 |
| sprite（精灵图像） | 2D 游戏中的图像元素 | 视角、姿态、完整轮廓、背景和边界；不必是像素画 |
| sprite sheet（精灵表） | 把多帧或多个精灵排进一张图 | 网格、每格内容、顺序、角色比例与基线；不是角色转面图的同义词 |
| tileset（图块集） | 构建地图的可拼接图块集合 | 单块尺寸、边缘连接、地形过渡与统一视角；不是一张完整关卡插画 |
| tilemap（图块地图） | 用图块拼好的地图或关卡 | 已拼接的布局、通路、遮挡与地形关系；与供拼接的图块集分开 |

只要求一张图时，按用途选择一种结构。请求本来包含多视图或多格时保留，不把单张限制误解成单个对象。

单块或单格尺寸未指定时，普通 Prompt 用统一尺寸、网格和基线表达一致性。只有数值影响当前生产交付时才追问，不为视觉草案虚构尺寸。

## 2. 选择游戏视觉系统

| 方向与术语 | 可见特征和使用条件 | 补读 |
| --- | --- | --- |
| stylized hand-painted（风格化手绘） | 概括形体、手绘色块、选择性纹理；区分直接绘画与贴在模型上的纹理 | [illustration-2d.md](illustration-2d.md)；模型表现另读 [render-3d.md](render-3d.md) |
| painterly concept art（绘画式原画） | 大明度分组、焦点细化、边缘控制；用于设计或气氛表达 | [painting-printmaking.md](painting-printmaking.md) |
| cel / toon shading（赛璐璐／卡通着色） | 分层阴影、简化高光，可选描边；说明是 2D 画法还是 3D 着色 | [anime-comics.md](anime-comics.md) 或 [render-3d.md](render-3d.md) |
| pixel art（像素画） | 像素簇、有限色阶和统一像素尺度；不是任意低分辨率图 | [pixel-art.md](pixel-art.md) |
| low-poly（低多边形） | 简化模型结构；只有要求 faceted 时才突出平面折角 | [render-3d.md](render-3d.md) |
| PBR（基于物理的材质响应） | 金属、粗糙度、反射和光照共同塑造材质；可配写实或风格化造型 | [render-3d.md](render-3d.md) |
| 2.5D / HD-2D | 前者可能是平面玩法与三维表现，也可能是分层空间；后者是特定游戏视觉名称 | 明确精灵、三维场景、投影与光效的实际组合；按元素补读 |

保留用户指定的游戏名或流派作为锚点，同时拆出形状语言、角色比例、材质、调色和镜头。ARPG、JRPG、CRPG、roguelike 等类别可以帮助理解用途，不能单独决定画法。

## 3. 镜头、关卡与资产语言

- **Top-down（俯视）**只说明观察方向。**Orthographic（正交）**说明投影方式。**Isometric（等距）**是特定轴向关系；不能把任意斜俯视都称为等距。**Dimetric（二等轴测）**与等距不同。没有精确几何要求时，写清实际视角比随意添加角度更可靠。
- **Silhouette readability（剪影可读性）**用于角色、武器、道具和图标。优先决定外轮廓、主要色块和识别性装备，再分配次级细节。
- **Shape language（形状语言）**指定形体家族与比例关系，如厚重方形装甲或纤长锐角轮廓；不是自动给所有角色套圆、方、三角。
- **Hero asset（重点资产）**与场景填充物有不同细节预算。重点道具明确叙事和材质焦点；背景装饰服从层级。
- **Modular kit（模块套件）**明确模块尺度、接口和重复规则。**Tileable texture（可平铺纹理）**要求图像边缘衔接；**Autotile（自动图块）**还依赖相邻关系与图块布局，不能仅写 seamless。
- **Diegetic UI（场景内界面）**作为世界中的实体存在；**HUD（屏幕界面）**叠在画面上。只在请求需要界面时说明其位置和职责。

## 4. 分开视觉效果与生产规格

Normal map（法线贴图）、roughness map（粗糙度贴图）、metallic map（金属度贴图）、texture atlas（纹理图集）、trim sheet（条带纹理）和 LOD（细节层级）是生产术语。用户确实要这些交付物时保留并核对规格；普通成片则写其可见结果，不默认把资源结构画进画面。

game-ready 是验收目标，不是可见画风。单张生成图不证明网格、UV、图块拼接、各帧配准或贴图通道可用。最终资产需在实际尺寸或引擎中验证。

## 5. 写法对照

- **角色转面**：`character turnaround, front / side / back views of the same character, aligned proportions, consistent costume construction`。补身份、服饰和配色；不加入宣传图的大幅透视。
- **游戏内画面**：`orthographic three-quarter gameplay view, stylized hand-painted environment, readable player silhouette, terrain organized into traversable paths`。补镜头和关卡关系；不自动附带 HUD。
- **物品图标**：`inventory icon, oversized readable silhouette, broad material highlights, centered isolated object`。补图标在小尺寸下的识别点；不堆远景场景。

## 术语来源

- [Riot：从草图到宣传 key art](https://playvalorant.com/en-gb/news/dev/astra-from-sketch-to-key-art/)
- [Unreal：sprite、sprite sheet、Tile Set 与 Tile Map](https://dev.epicgames.com/documentation/unreal-engine/paper-2d-overview-in-unreal-engine)
- [Unity：Isometric Tilemap 与默认 dimetric](https://docs.unity3d.com/es/2018.4/Manual/Tilemap-Isometric-CreateIso.html)
- [Unity：Rule Tile 的图块邻接规则](https://github.com/Unity-Technologies/2d-extras/blob/master/Documentation~/RuleTile.md)
- [Square Enix / Acquire：HD-2D 的像素与三维组合](https://www.unrealengine.com/spotlights/octopath-traveler-s-hd-2d-art-style-and-story-make-for-a-jrpg-dream-come-true)
