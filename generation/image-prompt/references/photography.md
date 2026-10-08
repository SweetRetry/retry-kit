# 真实摄影

先确定拍摄类型，再选择机位、布光和成像语言。摄影 prompt 的目标是一个可信的拍摄结果，不是相机参数清单。

## 1. 按拍摄类型选择重点

| 类型 | 主要判断 | 易偏离之处 |
| --- | --- | --- |
| portrait / environmental portrait（人像／环境人像） | 五官识别、姿态、肤质、环境与人物的关系 | 自动修成无纹理塑料皮肤；环境人像被写成纯背景棚拍 |
| editorial / fashion（编辑摄影／时尚摄影） | 服装结构、造型、动作与构图概念 | 用“高级”替代具体造型；把所有时尚图都写成商业白底 |
| product / packshot（产品摄影／标准产品展示） | 结构、表面、包装文字、反射与背景 | 暗部或浅景深遮住关键结构；擅自改变包装与标志 |
| food / still life（食物／静物） | 排列、尺度、食物状态、器皿与表面 | 为新鲜感统一加入蒸汽、水滴和强高光 |
| architectural / interior（建筑／室内） | 空间关系、视点、垂直线与采光 | 广角倾斜改变建筑形状；景深过浅丢失空间信息 |
| documentary / street（纪实／街头） | 人与环境的真实瞬间、现场光与偶然性 | 套用无痕棚灯与摆拍姿势；用随意模糊代替抓拍感 |
| landscape / wildlife / macro（风景／野生动物／微距） | 尺度、天气、拍摄距离、主体与环境 | 风景统一虚化背景；微距只加细节词却不改变尺度 |

## 2. 镜头与空间术语

| 术语 | 可见作用 | 使用条件 |
| --- | --- | --- |
| wide-angle（广角） | 视野宽，近物与远物尺度差易明显 | 写清拍摄距离与机位，避免近距离人物比例无意变形 |
| telephoto / compressed perspective（长焦／压缩观感） | 较远拍摄位置下，前后尺度差减弱 | 压缩主要来自观察距离；不能把焦距当作独立空间魔法 |
| shallow depth of field（浅景深） | 焦点区域清晰，前后逐渐失焦 | 主体需要分离时；不与所有前后对象全清晰同时要求 |
| deep focus（大景深观感） | 多个空间层次可辨认 | 建筑、环境叙事或产品细节需要同时清楚时 |
| bokeh（焦外光斑观感） | 失焦点光源的形状与分布 | 背景存在点光源且需要虚化时，不是任何柔软背景的同义词 |
| motion blur / panning（运动模糊／追随拍摄） | 指定主体或背景的运动拖影 | 先说明谁清晰、谁模糊，以及运动方向 |
| macro（微距） | 近距离放大细小对象与局部 | 写出画面尺度与焦点区域，不仅写“极致细节” |
| perspective control（透视控制） | 保留建筑垂直线或控制汇聚 | 建筑展示需要时；不等同于删除全部透视 |

焦距、光圈、快门数值可保留明确指定或有必要的参数。相机型号和 EXIF 不能替代可见效果，也不保证生成结果有对应成像。

## 3. 布光术语

- **Key / fill / rim light（主光／补光／轮廓光）**分别建立形体、控制暗部和分离轮廓；不要默认每张图三灯齐全。
- **Soft / hard light（柔光／硬光）**控制阴影过渡和高光边缘。明暗强弱是另一维度，柔光仍可有强反差。
- **Rembrandt lighting（伦勃朗布光）**在背光侧面颊形成小三角亮区；**split lighting（分割布光）**使面部左右明显分明暗；按面部效果选择。
- **Butterfly lighting（蝶形布光）**以较高正面光形成鼻下阴影；**broad / short lighting（宽面／窄面布光）**区分受光的是朝镜头较宽或较窄的面部。
- **High-key / low-key（高调／低调）**描述整体明度与暗部组织，不等同于过曝或欠曝。
- **Negative fill（减光）**减少反弹光以加深暗部；**practical light（场景内光源）**如台灯或霓虹可在画面中可见。两者与抽象“电影感”不同。

产品摄影先考虑高光和反射的形状。金属依赖环境反射，玻璃需要边缘、透射与背景关系；“柔光箱”这个词不能独自交代它们。

## 4. 表面与成像

肤质、布料纹理和磨损按景别与光线决定。真实感不要求人人毛孔特写、所有物体都脏。

Film grain（胶片颗粒）、halation（高光晕染）、color cast（色偏）、direct flash（直闪）和 vignette（暗角）各自改变不同的成像特征；只在目标风格需要时组合。胶片名可作锚点，仍需明确颜色和反差。

## 5. 写法对照

- **玻璃产品**：`controlled studio product photograph, narrow edge highlights defining the transparent glass, clean transmitted background, readable label`；焦点与反射服从产品结构。
- **环境人像**：`eye-level environmental portrait, soft window key light, restrained fill, the room remains legible behind the subject`；保留环境叙事，未要求时不加极浅景深。

## 术语来源

- [Nikon：焦距、视野与放大关系](https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/understanding-focal-length)
- [Nikon：人像镜头、视角与焦点](https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/quick-tips-for-taking-better-portraits)
- [Nikon：建筑透视控制](https://www.nikonusa.com/learn-and-explore/c/tips-and-techniques/the-pc-lens-advantage-what-you-see-is-what-youll-get)
- [Corel：分割、伦勃朗与蝶形布光](https://learn.corel.com/wp-content/uploads/2022/03/INDOOR-LIGHTING-SETUPS-FOR-PHOTOGRAPHY.pdf)
- [Profoto：宽面与窄面布光](https://www.profoto.com/nl/en/still-photography/profoto-stories/character-portraits-with-john-russo-and-profoto-d2)
