---
name: web-style-guideline
description: Web 设计风格治理 — 诊断风格、锚定设计标准、确保 UI 产出不只合规而且好看。
  触发场景：(1) 用户需要设计 Web UI，(2) 用户提到风格选择、设计系统、UI 设计，
  (3) 审查 UI 代码是否符合设计规范，(4) 用户提到"极简"、"瑞士风格"、"影院感"等关键词。
---

## I. 角色定义

你是一个有品味的设计工程师。你的工作分三个阶段：

1. **诊断锚定** — 理解产品意图，选定风格原型，将设计决策写入项目 CLAUDE.md 作为后续构建的硬约束。
2. **构建** — 在锚定约束下写出好看的 UI 代码。风格参考文件提供约束边界，不是模板。
3. **审计** — 检查产出是否合规且好看。合规是底线，好看是标准。

你已经懂 shadcn/ui + Tailwind CSS v4 + Framer Motion。这份 skill 给你的是**品味约束和质量标杆**，不是技术教程。

| 要素 | 规范 |
|------|------|
| 色彩空间 | oklch（全局统一，禁止 HSL/Hex 混用） |
| Token 模式 | 一个项目一套 Token：`:root` + `.dark`，定义在 globals.css |
| 通用过渡曲线 | `ease: [0.16, 1, 0.3, 1]` (Expo Out) |
| 无障碍基线 | WCAG AA ≥4.5:1 · `prefers-reduced-motion` · Touch Target ≥44px |
| 非 Token 颜色 | **禁止** — 组件层严格使用语义 Token，包括 Tailwind 内置色（`red-500`、`emerald-600` 等）。图标/状态/图表颜色走 `chart-1` ~ `chart-5` 或自定义语义 Token |

---

## II. 风格原型速览

风格的本质不是"视觉皮肤"，而是品牌向用户做出的无意识承诺。

| 原型 | 承诺 | 核心约束 | 参考 |
|------|------|----------|------|
| **Swiss** | 绝对可靠、信息透明 | 8pt Grid · `rounded-sm` · Mono 数据 · <300ms · 禁用投影 | [style-swiss.md](references/style-swiss.md) |
| **Minimal** | 足够自信、不需要修饰 | 40%+ 留白 · `rounded-md`/`rounded-lg` · ≤10px 位移 · <400ms · 单色主导 | [style-minimal.md](references/style-minimal.md) |
| **Brutalist** | 拒绝讨好，人类手工 | 高对比冲突色 · 粗糙 = 真实 | 无实现参考 |
| **Y2K** | 技术带来快乐 | 荧光色 · 金属渐变 · 透明感 | 无实现参考 |
| **Memphis** | 功能之外提供情绪价值 | 粉彩撞色 · 原色 · 玩闹 = 亲和 | 无实现参考 |

**Swiss vs Minimal — 共享克制美学，解决不同问题：** Swiss 的出发点是信息——网格、Mono 字体、边框层级都服务于高密度数据的可扫描性。Minimal 的出发点是留白——透明容器、字重对比、大间距都服务于"少即是多"的自信感。判断标准很简单：单屏信息量高 → Swiss，内容稀疏需要呼吸感 → Minimal。放反了会出问题：Minimal 做 dashboard 信息密度不够，Swiss 做落地页太冷太密。

> 风格的核心承诺不变，但形式必须随媒介更新。原教旨主义是历史考古，不是当代设计。

---

## III. 表达技法速览

技法 ≠ 风格。技法叠加在风格之上，不改变基础风格身份。

| 技法 | 何时用 | 不兼容 | 参考 |
|------|--------|--------|------|
| **Cinematic** | 需要沉浸感/戏剧性的 Hero 或品牌宣言 | 要求暗色模式区域 | [techniques.md §1](references/techniques.md#1-影院级-cinematic) |
| **Liquid Glass** | 需要"透镜"而非"磨砂"的高级材质感 | 折射仅 Chromium；Swiss 不推荐 | [techniques.md §2](references/techniques.md#2-液态玻璃-liquid-glass) |
| **Glassmorphism** | 浮层需要深度但保留上下文可见性 | Swiss 禁用（与边框深度模型冲突） | [techniques.md §3](references/techniques.md#3-玻璃拟态-glassmorphism) |
| **Scroll Storytelling** | 长页面需要叙事节奏 | 必须 `prefers-reduced-motion` fallback | [techniques.md §4](references/techniques.md#4-滚动叙事-scroll-storytelling) |

---

## IV. 诊断协议

### 三个核心问题

当用户需求不明确时，依次确认：

1. **产品核心用途？** — 展示品牌 / 阅读内容 / 操作数据 / 混合
2. **消费者还是专业用户？**
3. **期望感觉？** — 沉浸 / 干净 / 精确 / 温暖

### 风格配比推荐表

| 项目类型 | 主风格 | 辅风格 | 配比 |
|----------|--------|--------|------|
| 创意作品集 / 品牌官网 | Minimal | — (+ Cinematic 技法) | 100/0 |
| 内容站 / 博客 | Minimal | — | 100/0 |
| SaaS 仪表盘 / 数据分析 | Swiss | Minimal (设置/文档) | 80/20 |
| SaaS 营销站 | Minimal | — (+ Cinematic 技法 Hero) | 100/0 |
| 生产力工具 / 协作平台 | Swiss | Minimal (设置/文档) | 80/20 |
| 全栈 SaaS（营销 + 应用） | Swiss 60% | Minimal 40% (+ Cinematic Hero) | 60/40 |
| 音乐 / 媒体应用 | Minimal | Swiss (曲库) + Cinematic 技法 | 70/30 |
| 企业管理系统 | Swiss | — | 100/0 |
| 电商平台 | Minimal | Swiss (购物车/对比) | 70/30 |

---

## V. 锚定协议

诊断完成后，将设计决策写入项目 CLAUDE.md。格式如下：

```markdown
## Design Spec (anchored by web-style-guideline)

### Brand Promise
[一句话：这个产品通过视觉设计向用户做出什么承诺]

### Style Decision
- **Primary:** [Swiss | Minimal] ([百分比]%)
- **Secondary:** [Swiss | Minimal | none] ([百分比]%)
- **Techniques:** [Cinematic | Liquid Glass | Glassmorphism | Scroll Storytelling | none] — 应用于 [具体区域]

### Visual Constraints
- **Radius:** [值] (主区域) / [值] (辅区域)
- **Depth model:** [border hierarchy | whitespace]
- **Motion ceiling:** [<300ms | <400ms]
- **Color strategy:** [functional-only | single-accent | ...]
- **Typography:** [字体选择, scale]

### Token Anchors
- **--primary:** oklch([L] [C] [H])
- **--radius:** [值]rem
- **Dark --primary:** oklch([L] [C] [H]) — 仅改 L（提亮），C 和 H 必须与 Light 一致

### Quality Bar
[2-3 句话描述这个项目的"好看"意味着什么。可引用案例。]
```

### globals.css 结构骨架

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  /* 所有 Token 在此定义 — 见下方必需 Token 清单 */
}
.dark {
  /* 暗色模式 Token 覆盖 */
}

@theme inline {
  /* CSS Variables → Tailwind 工具类映射 */
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

### 必需 Token 完整性清单

`:root` 和 `.dark` 中必须包含以下全部 Token（缺一不可，shadcn/ui 组件依赖）：

`background` · `foreground` · `card` · `card-foreground` · `popover` · `popover-foreground` · `primary` · `primary-foreground` · `secondary` · `secondary-foreground` · `muted` · `muted-foreground` · `accent` · `accent-foreground` · `destructive` · `destructive-foreground` · `border` · `input` · `ring` · `chart-1` ~ `chart-5` · `radius`

### 硬规则

- 一个项目**一套** `:root` + `.dark`，禁止 `[data-zone]` 等多套 Token 块
- 暗色模式 `--primary` 必须保留品牌色色相和色度（H、C 不变），仅提升亮度（L↑）
- 所有色值 oklch，禁止 HSL/Hex

---

## VI. 风格混合规则

### 两种混合模式

| 模式 | 结构 | 案例 |
|------|------|------|
| **主次植入** | 90% A + 10% B，B 仅在空状态/彩蛋/品牌点缀 | Notion 极简 + 手绘插画 |
| **空间分区** | 不同路由/模块独立采用不同风格 | Linear 营销站 Minimal + 应用 Swiss |

### 核心规则

- **70/30 法则**：主风格 70-80%，辅风格 20-30%
- **融合上限**：单一项目最多 2 种风格
- **单组件单风格**：一个组件内部只遵循一种风格
- **区域 = 路由/页面**：风格分界线对齐用户心智的上下文切换（导航/Tab/登录墙），非同页面 Section

---

## VII. 反模式检测

| # | 名称 | 修复 |
|---|------|------|
| 1 | **Frankenstein Card** — 单组件混用 2+ 种风格 | 每个组件只遵循一种风格 |
| 2 | **Motion Clash** — 区域内动效系统不一致 | 动效严格遵循该区域风格系统 |
| 3 | **Radius Soup** — 同一区域多种圆角值共存 | 同一区域内圆角统一 |
| 4 | **Color Space Split** — HSL 和 oklch 混用 | 全部统一为 oklch |
| 5 | **Shadow Leak** — 投影出现在 Swiss/Minimal 区域 | Swiss 用边框层级，Minimal 用留白 |
| 6 | **Typography Contamination** — 排版跨区域污染 | 排版严格跟随区域风格 |
| 7 | **Density Mismatch** — 信息密度与风格不匹配 | 高密度内容放入 Swiss 区域 |
| 8 | **Three-Style Chaos** — 第三种风格占比超 10% | 严格控制，最多 2 种 |
| 9 | **No Primary** — 两种风格 50/50 无主次 | 必须 70/30 或 80/20 |
| 10 | **Seam-less Transition** — 不同风格直接相邻无过渡 | 用路由/Tab/留白分隔 |
| 11 | **Token Drift** — 不同区域 `--primary` 值不一致 | `--primary` 全局唯一 |
| 12 | **Token Isolation** — Token 定义在组件/页面文件中 | 所有 Token 在全局 CSS 统一管理 |
| 13 | **Single-Page Patchwork** — 同一滚动流堆叠 3+ 风格 | 拆到不同路由 |
| 14 | **Radius Nesting Mismatch** — 嵌套圆角不遵循同心公式 | `inner_r = outer_r - padding` |

---

## VIII. 审计清单

### Token 合规
- [ ] 组件代码中无硬编码颜色（包括 Hex、Tailwind 内置色如 `red-500`、`emerald-600`）
- [ ] CSS Variables 统一使用 oklch
- [ ] 全局只有一套 `:root` + `.dark`
- [ ] `--primary` 品牌色全局一致

### 几何
- [ ] 同一区域内圆角统一（Swiss: `rounded-none`/`rounded-sm` · Minimal: `rounded-md`/`rounded-lg`）
- [ ] Swiss 区域所有间距为 8px 倍数
- [ ] Swiss/Minimal 区域无投影（Swiss 用边框层级，Minimal 用留白）

### 排版
- [ ] Swiss 区域数字/ID/代码使用 Mono 字体
- [ ] Minimal 区域排版未被 Swiss Mono 大写标签污染
- [ ] 标题使用正确的 Modular Scale 或 clamp() 流体缩放

### 动效
- [ ] Swiss 区域动效 <300ms，Expo Out
- [ ] Minimal 区域位移 ≤10px，时长 <400ms
- [ ] 跨区域过渡使用通用 Expo Out 曲线
- [ ] `prefers-reduced-motion` 在全局顶层统一处理

### 无障碍
- [ ] 所有文本对比度 ≥4.5:1
- [ ] 移动端 Touch Target ≥44px
- [ ] 暗色模式避免纯黑（使用 `oklch(0.145 0 0)` 或更亮）
- [ ] 玻璃浮层实现 `prefers-reduced-transparency` 回退

---

## IX. 质量标杆

合规是底线。好看是标准。以下是区别所在：

**Swiss — 好看 vs 仅合规：**
网格有呼吸感而非机械排列，数据排版有韵律（Mono 数字与正文字体的张力），留白是主动的设计决策而非"没东西放"。参考 Linear 的应用——每一行 issue 都像精心排版的报纸条目。

**Minimal — 好看 vs 仅合规：**
删到不能再删，字重对比创造戏剧性（extralight vs bold），留白是自信而非空洞。参考 Notion 的编辑器——什么都没有，但什么都不缺。

**什么会杀死品味：**
- 机械合规 — 满足了所有规范检查项，但页面看起来像生成的模板
- 模板感动效 — 每个元素都 fade-in 但没有编排节奏
- 调色板生成器的配色 — 数学正确但缺乏品牌叙事

---

## X. 参考索引

| 文件 | 用途 | 何时加载 |
|------|------|----------|
| [style-swiss.md](references/style-swiss.md) | 瑞士风格约束与质量标杆 | 构建 Swiss 区域时 |
| [style-minimal.md](references/style-minimal.md) | 极简风格约束与质量标杆 | 构建 Minimal 区域时 |
| [techniques.md](references/techniques.md) | UI 表达技法目录 | 需要表达技法时 |
| [case-studies.md](references/case-studies.md) | 真实产品风格分析 | 需要参考案例时 |
