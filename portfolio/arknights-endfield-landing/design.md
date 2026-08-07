# 明日方舟：终末地 ·「奇象巡展」风格落地页 — Design Contract

> 依据：`analysis-round1-poster.md`（原图拆解）、`verify-round1.md`（子 agent 交叉验证 + 色值校准）、`research-endfield.md`（终末地事实底座）。
> 交付物：`portfolio/arknights-endfield-landing/design.md`（本文件）+ `portfolio/arknights-endfield-landing/index.html`（Tailwind 单文件落地页）。

## 0. 项目边界

- 性质：粉丝向概念落地页（非官方），内容为终末地已公开的真实信息，页脚放免责声明与来源链接。
- 技术：单文件 HTML + Tailwind CSS（CDN）+ Google Fonts + 内联 SVG 线稿；无构建步骤。
- 视觉 authority：用户提供的竖版「奇象巡展 INTERACTIVE EXHIBITION」海报为主，横版 KV 实测色值校准；终末地侧提供题材与工业母题。

## 1. THESIS

**「终末地工业·塔卫二考察图鉴」**：把落地页做成一份虚构的展会导览技术图鉴——高调白底上，终末地的工业世界（帝江号、AIC 产线、塔卫二地形）以黑色技术线稿 + 荧光标注贴纸的方式被"展陈"出来。

- 拒绝的类别默认：游戏官网惯用的暗色全屏 KV + 居中 logo + 双下载按钮 + 角色立绘轮播模板。
- 拒绝 AI default：无 purple/mesh gradient、无玻璃拟态、无渐变文字、无居中大 Hero 配双 CTA 的营销 scaffold。
- 两个视觉世界的分工：**巡展海报提供"形"**（高调白、glitch 切片标题、色散、贴纸标注、线稿），**终末地提供"物"**（工业母题：黄黑警示条纹、三角形、编号系统、真实设定内容）。

## 2. STORY / TASK（Persuade mode）

1. 先理解：这是终末地，一个"已公测的 3D 即时策略 RPG"，视觉第一冲击来自 glitch 大标题 + 线稿展台。
2. 再浏览：按"图鉴"顺序认识塔卫二（世界）→ 玩法三支柱 → 干员档案。
3. 最终行动：前往官网 / 下载（平台：PC / iOS / Android / PS5）。

## 3. OWN WORLD

### 3.1 色彩（角色制，非装饰制）

| 角色 | 值 | 语义映射 | 用量规则 |
|---|---|---|---|
| `bg` | `#F4F4F2` | 图鉴纸面 | 全局底 |
| `surface` | `#FFFFFF` | 展台/卡片 | 区块容器 |
| `ink` | `#111111` | 线稿、标题、正文 | 主前景 |
| `muted` | `#6B6B66` | 微文字、编号 | 辅助 |
| `line` | `#111111` @ 12–20% | 制图细线、分隔 | 1px |
| `cyan` | `#1DD4DC` | **塔卫二/流体/探索** | 最大面积 accent：hero 流体块、世界区图形 |
| `pink` | `#FB3799` | **活动/导览高亮** | 小面积为主（切片短杠、星爆贴）+ 唯一通栏底条例外（复刻 KV 签名，见 §5.7） |
| `acid` | `#CACC21` | **工业/警示/标注** | 小面积：光带、星爆贴、编号标签（收窄用量是主动决策，见表下规则） |
| 警示黄 | `#F5D90A` | 终末地工业警示带（推导值，源自"柠檬黄"第三方观察，非官方标准色） | 仅用于斜纹带（与 ink 交替） |
| 切片色 | `#FF2BA0` / `#D0D500` / `#0FD8EA` | glitch 标题切片短杠与色散（实测校准值） | 仅 hero 大标题 |

规则：
- CTA 一律 `ink` 底白字（黑色 pill 系统，IP 稳定签名），不用彩色按钮；彩色只承担标注与高亮。
- 多 accent 不随机分色：同层级元素的颜色由其语义映射决定（世界=cyan、活动=pink、工业=acid）。
- KV 中 acid 与 cyan 接近并列；本落地页主动收窄 acid 至标注层，避免三 accent 争夺第一焦点，面积让位给 cyan。
- 切片色（#FF2BA0/#D0D500/#0FD8EA）只服务于标题艳度层级，不与贴纸色（#FB3799/#CACC21）混用。
- 大面积氛围允许柔和径向光晕（验证结论推翻了"禁止渐变"）；信息性色块一律硬切边或半调网点，不用平滑线性渐变。
- 色散（chromatic aberration）只出现在 hero logomark 与大标题上，全色谱、低透明度，不扩散到正文/UI。

### 3.2 字体

| 角色 | 字体 | 规格 |
|---|---|---|
| Display（英） | Archivo Black | 超大、全大写、紧字距、glitch 切片处理 |
| Display（中） | Noto Sans SC 900 | 粗黑，配黑色 pill 或直连排版 |
| Body | Noto Sans SC 400/700 | 15–16px，行高 1.75，measure ≤ 34em |
| Label / 编号 / 标注 | IBM Plex Mono 400/500 | 11–12px、全大写、字距 0.15–0.4em（设计决策：以 monospace 承载技术标注，非复刻海报伪文字） |

字体加载控制在 3 个家族：Archivo Black（仅 400 一档）、Noto Sans SC（400/700/900）、IBM Plex Mono（400/500）。

### 3.3 图形语言

- **技术线稿**：1–1.5px 黑线，轴测/立面制图感；全案 3 幅核心线稿：帝江号（hero）、塔卫二地形（世界区）、AIC 产线（玩法区）；线稿即内容（不是截图占位）。
- **流体色块**：有机气泡形（SVG path），cyan，边缘带全色谱低透明色散叠层。
- **光带**：荧光黄绿（acid）水平长曝光光带，竖版海报签名图形，用于 hero 横贯与个别 section 过渡。
- **标注贴纸**：① acid/白底气泡标签 + mono 黑字；② 锯齿星爆贴（pink 或 acid）+ 黑粗字；③ 虚线引导线 + 小箭头。
- **黄黑警示斜纹带**：终末地工业签名，用作 section 分隔带与页眉底边。
- **三角形**：终末地 UI 母题，用作 bullet、编号底标、装饰角标；干员卡以三角编号 + 几何符号线稿替代人物剪影。
- **半调网点**：radial-gradient dots 图案，用于大色块暗部与背景局部，替代平滑渐变。
- **logomark**：黑圆环 + 放射刻度 + 缺口指针（仪表盘形，按验证修正），带色散。

### 3.4 Motion

- 唯一 authored moment：**hero 标题 glitch**——三层 clip-path 切片错位 + 色散层轻微漂移，transform/opacity only。
- 其余 motion 从属：sticker hover 微浮、警示带 marquee 慢速滚动、锚点平滑滚动。
- `prefers-reduced-motion`：全部动画静止为"错位后的静态帧"，界面完整可读。

## 4. FIRST VIEWPORT

- 第一焦点：左侧 glitch 大标题组「ARKNIGHTS:ENDFIELD / 明日方舟：终末地」+ 超大字距 mono 微文字行。
- 主内容：右侧"展台"——帝江号 / 塔卫二技术线稿 + cyan 流体块 + 仪表盘 logomark + 气泡/星爆标注贴纸，一条 acid 光带横贯展台。
- Primary action：黑色 pill「前往官网 ↗」；secondary「玩法图鉴 ↓」文字锚点。
- 空间关系：顶部 nav（黑 pill 标志 + mono 锚点）→ 标题区 → 展台区；页眉底边一条黄黑警示带；四角极淡 cyan/黄绿光晕。
- 发行状态以星爆贴形式出现：「2026.01.22 全球公测」——真实信息，不伪造。

## 5. TOPOLOGY

1. **Nav**：黑 pill logotype（ENDFIELD）+ mono 锚点（世界 / 玩法 / 干员 / 下载）+ CTA。
2. **Hero**：见 §4。
3. **警示 marquee 带**：黄黑斜纹 + mono 滚动词（TALOS-II / ENDFIELD INDUSTRIES / AIC / PROTOCOL-ORIGINIUM）。
4. **世界图鉴**：编号条目（FILE 01–03：塔卫二 / 帝江号 / 协议源石），线稿图 + mono 编号 + 气泡标注 + 短文案；条目间错位排版（非三等分卡片）。
5. **玩法三支柱**：即时策略 RPG / AIC 自动化工业 / 区域探索——技术标注版式，acid 编号三角标。
6. **干员档案**：档案卡（佩丽卡 / 陈千语 / 莱万汀 / 伊冯）：mono 编号、三角编号标、几何符号线稿（非人物剪影）+ 定位一句话，明确标注"示意图形，非官方立绘"。
7. **发行信息 / CTA**：通栏 pink 活动条带（复刻 KV 底条签名）+ 平台列表（PC / iOS / Android / PS5）+ 黑色 pill CTA。
8. **Footer**：免责声明（粉丝概念作品、与鹰角/Gryphline 无关）、信息来源链接、制作说明。

Mobile：标题组与展台上下堆叠，展台线稿缩放不裁切；图鉴条目单列；marquee 降速；touch target ≥ 44px。

## 6. STATES

- Hover：链接下划线偏移动效；贴纸 translateY(-2px)；CTA 反色。
- Focus：2px ink outline + 2px offset，不用浏览器默认蓝圈。
- 静态页无 loading/empty/error；线稿 SVG 内联，无外部图片依赖，天然无 broken image。
- Reduced motion：见 §3.4。

## 7. SIGNATURE

**Hero glitch 切片标题**：大标题被水平切成 3 段（clip-path），段间 2–6px 水平错位，切片接缝处穿插 pink/acid/cyan 短斜杠（复刻海报标题处理）；背后叠全色谱低透明色散副本。
- 性能：纯 CSS transform/opacity + steps() 关键帧，无 JS 驱动。
- 可访问性：标题真实文本保留在语义 `<h1>`，glitch 层 `aria-hidden`；reduced-motion 下退化为静态错位。

## 8. 反默认测试

1. 换皮测试：去掉明日方舟内容后，版式仍被"展会技术图鉴"机制解释（编号档案、标注贴纸、线稿展台），不是通用营销模板。✓
2. 去装饰测试：移除色散/半调/斜纹后，黑白线稿 + 字级层级仍成立。✓
3. 重复测试：世界/玩法/干员三区分别用"错位条目 / 标注版式 / 档案卡"三种结构，无同构 section。✓

## 9. 未验证项

- 酸性黄绿 `#CACC21` 上黑字对比度约 8.9:1（计算值），cyan `#1DD4DC` 上黑字约 9.6:1，均满足 4.5:1；最终渲染后截图复核。
- 国服官网 URL 未亲自验证，CTA 统一指向已验证的国际官网 `endfield.gryphline.com`。
- 角色定位为调研所得简写，页面措辞避免官方未确认的强度/数值 claim。
