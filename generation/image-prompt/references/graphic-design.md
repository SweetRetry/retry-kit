# 平面设计

先确定信息与阅读顺序，再组织文字、图形和图像。海报、封面、标志与图标各有不同结构；一张漂亮的插画不能自动满足版式任务。

## 1. 区分交付物

| 交付物 | 优先决定 | Prompt 应包含 |
| --- | --- | --- |
| poster / cover（海报／封面） | 主标题、主视觉与阅读路径 | 文字原文、信息层级、位置、比例和留白 |
| logo / wordmark（标志／字标） | 识别轮廓、符号与文字关系 | 简化原则、图形结构、字形倾向、单色适应性 |
| icon（图标） | 小尺寸下的形状与一致性 | 轮廓、描边或填充、线宽、圆角和视觉重量 |
| infographic（信息图） | 信息关系和比较方式 | 数据、标签、编码与顺序，不能由模型编造数值 |
| packaging mockup（包装效果图） | 包装结构和其上版式 | 哪些内容印在表面、展开或立体视图；CG 或实拍规则另补 |
| pattern（图案） | 重复单元和节奏 | 单元、方向、密度、色彩与平铺要求 |

## 2. 版式与文字术语

| 术语 | 作用 | 使用条件 |
| --- | --- | --- |
| grid / modular grid（网格／模块网格） | 对齐、分栏和元素分组 | 根据内容选择列与模块；不固定所有海报同一网格 |
| hierarchy（层级） | 区分主标题、次标题、正文和辅助信息 | 用尺寸、位置、明度与间距写出阅读先后 |
| typographic contrast（字体对比） | 通过大小、字重或字形差异建立重点 | 对比须服务层级，不自动混用大量字体 |
| serif / sans-serif / display type（衬线／无衬线／展示字体） | 决定字形气质与阅读用途 | 精确品牌字体有要求时保留；普通请求写关键字形特征 |
| condensed / expanded（窄体／宽体） | 改变文字块比例 | 与实际标题长度和版面宽度共同选择 |
| tracking / kerning / leading（字距／字偶距／行距） | 分别控制整体字间距、特定字偶与行间距 | 概念不能混用；只指定关键效果，无需虚构精确排版参数 |
| alignment / negative space（对齐／负空间） | 组织关系、空隙和轮廓 | 明确相对位置与留白用途，比泛称“简洁”更有效 |
| bleed / safe area（出血／安全区） | 区分裁切外延与重要信息保护区 | 仅在印刷交付或裁切需要时说明；生成图不证明文件具备印前规格 |

必须出现的文字逐字引用，明确换行与位置。指定文本与装饰符号分开；未要求文字的图像不能默认塞入伪文字。要求精确排版文件时另行制作与验证。

## 3. 图形与印刷语言

- **Swiss / International Typographic Style（瑞士／国际主义字体风格）**可落实为网格、对齐、无衬线层级和非对称组织；不把名称当所有元素的替代。
- **Bauhaus-inspired（包豪斯启发）**明确几何形体、功能性组织或配色选择；并非必定红黄蓝圆方三角。
- **Duotone（双色调）**用两种颜色组织图像的调性；**spot color（专色）**是指定油墨或色版，两者含义不同。
- **Overprint（叠印）**描述色版重叠的结果；**misregistration（套色偏移）**描述色版不完全对齐。需要旧印刷观感时才加入偏移。
- **Risograph look（孔版复制印刷观感）**需选油墨色、颗粒、覆盖与叠色；不是无条件添加荧光色和错位。
- **Halftone（半色调网点）**说明点的尺度、作用区域和色彩关系。印刷技法的细节另读 [painting-printmaking.md](painting-printmaking.md)。

## 4. 组合与资产边界

照片、插画或 CG 作为主视觉时，只对图像区域补对应 reference。文字采用清晰排版不意味着照片也要变成硬边图形。

生成的标志和图标可呈现矢量观感，但不证明它们是可编辑路径。包装效果图不证明存在刀模；信息图的美观不能替代数据正确性。交付最终文件时检查对应要求。

## 5. 写法对照

- **字体海报**：`asymmetric modular grid, an oversized condensed headline reading "NIGHT WALK", generous negative space, a small aligned date block`；补用户给定日期，不捏造内容。
- **双色印刷封面**：`two spot-color layers, visible overprinted intersections, coarse halftone confined to the image area, crisp readable title typography`；图像的印刷颗粒不覆盖重要文字。

## 术语来源

- [Adobe：网格、层级与留白](https://www.adobe.com/learn/illustrator/web/layout-basics)
- [Adobe：Kerning 与 tracking](https://helpx.adobe.com/indesign/desktop/format-and-style-text/tabs-indents-and-spacing/about-kerning-and-tracking.html)
- [Adobe：Duotone 的色调映射](https://helpx.adobe.com/photoshop/desktop/adjust-color/color-effects-techniques/create-and-edit-duotone-images.html)
- [RISO：模板、滚筒与油墨机制](https://www.riso.co.jp/english/tech_portal/core/ink.html)
