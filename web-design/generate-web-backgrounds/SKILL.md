---
name: generate-web-backgrounds
description: Website background 设计：根据产品、页面职责、前景和运行约束，在 static image 与 background video 中选择媒介并交付资产 brief 与 prompt。仅供用户显式调用。
disable-model-invocation: true
---

# Web Backgrounds

## 核心任务

先判断 background 在产品页面中承担什么职责，再决定是否使用生成素材以及采用 static image 还是
background video。媒介服从产品属性、页面任务、前景内容与运行条件，不从“科技、奢华、年轻、
高级”等类别标签反推答案，也不把 video 当作默认升级。

本 skill 独立完成产品判断、背景视觉系统、媒介选择和所选素材的生成 prompt，不设计整张网页。
背景只能强化页面的 proof、context、emotion 或 identity，不能承载用户完成任务所必需且只在背景中
出现的信息。需要用户阅读、操作、比较或控制的内容应保持为前景内容。

## 1. 读取产品与页面

从当前 brief、产品资料、页面内容、品牌资产和实现上下文中确定：

- **产品信号**：用户必须在这一屏感知到的独特价值、行为或气质。
- **页面任务**：当前 surface 要让用户理解、相信、选择、开始还是沉浸。
- **背景职责**：只选 proof、context、emotion、identity 中最主要的一项。
- **前景关系**：标题、正文、CTA、导航、表单或产品截图的真实位置、密度与优先级。
- **运行条件**：desktop / mobile、加载预算、autoplay 条件、motion tolerance、已有 image / video
  资产与静态 fallback。

优先从仓库、现有页面或用户提供素材中读取这些事实。只有缺失信息会改变“无生成素材 / image /
video”选择时，才确认最多 2–3 项：产品在首屏必须证明什么、前景需要承载多少内容、motion 是否表达
产品真实特性。

## 2. 选择是否使用生成背景

先通过必要性测试：

- 移除背景后，页面仍能完整表达产品，但会失去有证据支持的 context、emotion 或 identity：
  可以使用背景素材。
- 背景只是填补空白、制造“高级感”或复制类别惯例：不使用生成素材，改用产品现有 surface、
  token 或克制的纯色关系。
- 素材实际承担教程、功能步骤、关键 proof 或必须控制的播放内容：它不是 background，应作为前景
  media 处理。

不因为竞争产品普遍使用动态 hero 就选择 video，也不因为产品强调信任或效率就机械选择静态。

## 3. 在 Image 与 Video 之间决策

选择 **static image**，当：

- 产品价值主要通过稳定形态、质感、场域、品牌符号或单一瞬间表达；
- motion 不增加独有信息，只增加注意力竞争；
- 前景文字、表单或操作密度高，需要稳定的 contrast 与观看重心；
- 移动端、加载、功耗、autoplay 或维护条件无法可靠支持持续 motion；
- 没有可信、可持续更新的 motion 素材。

选择 **background video**，只有当：

- 时间变化本身能表达产品属性、真实使用状态、材料行为或品牌节奏，静态图会丢失这一层意义；
- motion 仍保持低频和从属，不要求用户观看完整过程才能理解产品；
- 任意时刻都能维持前景可读性，responsive crop 不会破坏关键关系；
- 可以提供首帧／poster fallback，并在 reduced-motion 或无法播放时保持同一产品信号；
- 页面运行条件能够承担该资产。

如果 video 中的动作、台词、步骤或剪辑必须被完整观看，它应成为前景内容，不作为 background。

## 4. 建立 Background System

无论选择 image 还是 video，都先固定同一套 product-led background system：

1. 用一句话写出背景如何强化产品，而不是只描述题材。
2. 选择一个主要视觉机制：连续色场、结构场、有机场、材质场、产品界面痕迹、具象环境或其他由
   产品事实支持的系统。
3. 根据真实前景建立 visual peak、quiet zone、safe zone、value range 与 crop invariant。
4. 让关键形体从画框外进入或延展，避免依赖必须完整可见的居中 hero object。
5. 只保留一个有产品依据的 signature；不自动添加 chrome orb、紫色 glow、粒子、网格、玻璃、
   星云或无意义 dashboard 痕迹。
6. 使用 photography、3D、illustration、graphic shape 或 mixed media 时，让媒介解释产品属性，
   不让媒介类别替代产品理由。

## 5. 写 Static Image Prompt

选择 static image 时，在 prompt 中写清：

- 产品信号与背景职责；
- 主视觉机制、关键形体、尺度与材质；
- desktop / mobile 的构图、裁切不变量、visual peak 与 quiet zone；
- 前景内容覆盖区域所需的明度、对比与细节密度；
- 色域、光线、边缘、texture 与整体成像逻辑；
- 必须保留的品牌资产，以及不应伪造的文字、Logo、UI 或产品事实。

图片要在缩略图、局部裁切和前景覆盖后仍保留身份。不要为尚未给出的 CTA 或标题虚构固定位置。

## 6. 写 Background Video Prompt

选择 background video 时，只设计一个可持续观看的低频 motion system，不写宣传片或多镜叙事：

- 用一个主变化说明 motion 如何强化产品信号；
- 写清稳定的画框、visual peak、quiet zone、responsive crop 与前景覆盖关系；
- 描述起始状态、连续变化、峰值和回到起点的可见过程，使首尾可以自然 loop；
- camera 默认稳定；只有 camera motion 本身表达产品属性且不破坏前景时才启用；
- 控制速度、幅度、亮度闪烁、detail frequency 与对象数量，让任意 frame 都可作为背景；
- background video 默认不依赖声音，不让对白、音效或音乐承载信息；
- 同时定义 poster frame：它在 video 未加载、无法 autoplay 或 reduced-motion 时仍表达同一产品信号。

不要用频繁剪辑、情节转折、强 rack focus、快速推拉、持续视差或大面积亮度变化制造存在感。

## 7. 运行与验收

交付前检查：

- medium choice 能由产品属性和页面任务解释，而不是由风格偏好解释。
- 背景不承载唯一的功能说明、关键 proof、操作或法律信息。
- 最不利 crop 和最亮／最暗 frame 下，前景层级仍然稳定。
- mobile 不是 desktop 的随意中心裁切；关键关系有明确保留或降级方式。
- video 有静态 poster，reduced-motion 与播放失败不会丢失产品信号。
- 背景不会造成 layout shift，也不要求页面等待完整素材后才可理解和操作。
- 移除品牌名后，视觉机制仍能由该产品的真实行为、内容或受众环境解释。

## 输出合同

只交付一个已选择的方向，不并列 image / video 方案。

若结论是不使用生成素材：

```text
## 产品判断
背景职责：<当前页面是否真的需要背景承担职责>
媒介选择：不使用生成素材
选择依据：<为什么 image 与 video 都不能增加足够产品价值>
替代关系：<使用既有 surface、token、纯色或前景内容建立层级>
```

若选择 image 或 video：

```text
## 产品判断
背景职责：<proof、context、emotion 或 identity，以及对应产品事实>
媒介选择：<static image 或 background video>
选择依据：<为什么所选媒介比另一种更适合当前产品、页面与运行条件>

## 页面约束
前景关系：<真实内容层级、visual peak、quiet zone 与 safe zone>
响应式策略：<desktop / mobile 的 crop invariant、保留与降级关系>
运行约束：<加载、播放、reduced-motion 与可读性边界>

## 素材 Prompt
<一份可直接用于所选 image 或 video generation model 的自然语言 prompt>

## 回退
静态回退：<video 必填；poster frame 的构图与产品信号。image 只有存在独立 fallback 时出现>
```

沿用用户语言。素材 prompt 只描述背景资产，不生成网页、浏览器框、按钮、卡片或伪造产品 UI。
