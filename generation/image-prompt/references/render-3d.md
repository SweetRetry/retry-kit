# 3D 渲染

先选造型与着色系统，再描述材质和灯光。PBR、低多边形与卡通着色分别影响不同层面，不能当作互斥画风标签。

## 1. 选择表现目标

- **Photorealistic CG（写实 CG）**：比例、表面、灯光与成像共同接近实拍。产品展示关注结构和材质，不自动加入污损。
- **Stylized 3D（风格化三维）**：主动简化或夸张几何与表面，明确简化程度；与真实光照可以共存。
- **Low-poly（低多边形）**：减少几何复杂度。需要可见面折角时指定 faceted shading；低面数不必呈现硬折面。
- **NPR（非真实感渲染）**：指定 toon、cel、ink、painterly 等实际机制；NPR 本身范围太广。
- **Clay render / claymation look（黏土渲染／黏土动画观感）**：单色模型展示与有指痕的黏土角色不同。实物工艺再读 [material-collage.md](material-collage.md)。

游戏资产或游戏内画面另读 [game-art.md](game-art.md)。二维图像同样能画出三维体积，不能仅因有体积就归到 CG。

## 2. 术语与使用条件

| 层面 | 术语 | 可见作用与边界 |
| --- | --- | --- |
| 几何 | bevel（倒角）、faceted（面状）、smooth shading（平滑着色） | 控制轮廓、边缘高光与表面连续性；倒角不是到处加亮边 |
| 材质系统 | PBR（基于物理的渲染） | 用一致的材质参数与光照响应建立表面；不自动规定写实造型 |
| 基础色 | base color / albedo（基础色／反照率） | 区分材质本色与光照造成的亮暗；术语按当前管线含义使用 |
| 金属与粗糙度 | metallic、roughness | 决定反射性质和高光展宽；粗糙不等于表面脏，金属不等于只有灰色 |
| 反射与透明 | specular、transmission、IOR（折射率） | 区分非金属高光、透射和折射；玻璃还需厚度与背景关系 |
| 次表面 | subsurface scattering（次表面散射） | 皮肤、蜡、半透明材料的透光；不是统一添加自发光 |
| 自发光 | emission、bloom（辉光） | 前者是发光表面，后者是亮部扩散；发光外观不自动保证照亮周围，需分别描述 |
| 凹凸 | bump / normal / displacement | 法线与凹凸改变光照细节；启用真实位移时才实际改变表面几何和轮廓 |
| 阴影与间接光 | ambient occlusion、contact shadow、global illumination | 分别强调遮蔽、接触和反弹光；不把所有阴影写成同一种黑边 |
| 着色 | toon / cel shading、outline pass | 明暗分层、可选外轮廓；描边并非 cel shading 的必需项 |

普通成片优先写这些术语对应的表面结果。只有请求材质测试或贴图交付时，才列参数、通道与地图结构。

## 3. 灯光与空间

1. 确定透视或正交投影、观察高度和对象朝向。
2. 用主光与环境光建立体积，按需要补反射板、轮廓光或接触阴影。
3. 按材质决定高光形状、反射内容和透光区域。
4. 最后决定景深、雾、bloom 等成像效果，避免掩盖结构。

HDRI 指环境图的照明或反射来源，不能只写 HDRI 就省略环境方向与观感。Studio render、product visualization、diorama（微缩场景）分别说明展示用途；它们不规定同一种材质。

## 4. 兼容与冲突

PBR 可以配合风格化造型。Hand-painted texture 可以与实时光照结合；若把明暗画进纹理，需决定它与场景光的关系。硬边 cel shading 可以配合真实材质局部表现，但要指出哪些区域采用哪种机制。

引擎或渲染器名称可保留为用户的锚点。重要约束仍应落在几何、表面和灯光；引擎名不保证某种默认视觉效果。

## 5. 写法对照

- **风格化物件**：`rounded beveled forms, matte nonmetallic surfaces, broad soft highlights, orthographic product view`。
- **低多边形场景**：`simplified low-poly geometry with visible planar facets, restrained material variation, directional lighting that reveals the facets`。
- **卡通角色**：`stylized 3D proportions, two-band cel shading, controlled rim highlights, thin silhouette outlines`；描边是本次选择，不是所有卡通渲染的必需词。

## 术语来源

- [Blender：平滑着色与几何面](https://docs.blender.org/manual/en/latest/modeling/meshes/editing/face/shading.html)
- [Unreal：PBR 对写实与风格化材质的支持](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-materials-and-textures-in-unreal-engine-for-maya-users)
- [Blender：bump 与真实 displacement](https://docs.blender.org/manual/en/latest/render/materials/components/displacement.html)
- [Unreal：Emissive 与场景照明](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-emissive-material-input-in-unreal-engine)
- [Unreal：材质参数与反射](https://dev.epicgames.com/documentation/en-us/unreal-engine/physically-based-materials-in-unreal-engine)
