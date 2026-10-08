# 像素画

像素画按离散像素组织形状和明暗。先确定像素尺度与交付形式，再选择调色、边缘和纹理策略。低分辨率、复古题材或“8-bit”标签不能替代这些决定。

## 1. 选择交付形式

独立插画关注整幅构图；游戏 sprite、sprite sheet 与 tileset 还需结构约束，读 [game-art.md](game-art.md)。像素字体或海报同时需要 [graphic-design.md](graphic-design.md)。

原生尺寸与展示尺寸分开。需要明确文件尺寸时写原生画布；放大展示时说明整数倍缩放与 nearest-neighbor（最近邻采样）的硬边观感。最终尺寸与采样方式仍需检查文件。

## 2. 专业词与画面决策

| 术语 | 改变什么 | 使用条件 |
| --- | --- | --- |
| pixel cluster（像素簇） | 用连贯像素块表达形状与体积 | 明确大块面、轮廓转折和高光形状，避免随机单像素噪点 |
| limited palette（有限调色板） | 控制色数与色彩关系 | 需要统一视觉或模拟特定限制；色数只有确有规格时固定 |
| color ramp（色阶序列） | 每种材质如何从暗到亮 | 指定分级数量或变化趋势；不自动加入平滑渐变 |
| hue shifting（色相偏移） | 明暗级同时改变色相 | 需要更有色彩关系的阴影与高光；方向按调色决定 |
| dithering（抖色） | 用相邻颜色的像素图案模拟过渡 | 需要粗糙纹理或有限色过渡时；小图标和清晰平涂可能无需抖色 |
| selective outlining（选择性描边） | 轮廓随光照或邻接背景变化 | 需要轮廓层次；与全周等粗黑描边区分 |
| pixel-level anti-aliasing（像素级抗锯齿） | 用中间色手工修整轮廓阶梯 | 可保持离散像素；与缩放插值造成的整体模糊区分 |

## 3. 组织形状与视角

- 从剪影和主要色块开始，局部纹理服从像素预算。人物五官、装备或建筑窗格按可用像素选择识别点。
- 俯视、侧视和轴测使用一致的轮廓阶梯与遮挡关系。常见游戏中的 2:1 菱形图块属于特定轴测习惯，不等同于严格几何等距；要求哪种就写哪种。
- 统一像素尺度：主体、背景和特效不能无意中使用不同粒度。要求混合高分辨率背景时，明确其作用范围。
- 光照可很复杂，但最终以离散色阶和像素簇呈现。发光边缘需要决定是像素化光晕，还是明确要求的后期柔光。

## 4. 资产约束

Sprite sheet 写网格、顺序、基线和每格留白。Tileset 写地形、连接方向、边缘过渡和图块尺度；不能用整幅景观代替。透明背景是文件要求，不能用棋盘格背景模拟。

固定帧数、通道透明度、像素配准与接缝不是靠术语就能保证的结果。若要求最终资产，按原生尺寸检查并在相应工具中预览。

## 5. 写法对照

- **小尺寸图标**：`compact pixel clusters, a limited warm palette, discrete shading ramps, crisp silhouette`；优先识别，未要求时省去抖色。
- **较大像素场景**：`consistent pixel scale, layered silhouettes, hue-shifted shadow ramps, selective dithering on stone surfaces`；抖色限制在材质区域，不覆盖整张图。

## 术语来源

- [Aseprite：Sprite sheet 的帧结构](https://www.aseprite.org/docs/sprite-sheet/)
- [Aseprite：Tilemap 与 tileset](https://www.aseprite.org/docs/tilemap/)
- [Aseprite：渐变与 dithering 选项](https://www.aseprite.org/docs/context-bar/)
- [Unity：轴测网格与等距投影区别](https://docs.unity3d.com/es/2018.4/Manual/Tilemap-Isometric-CreateIso.html)
