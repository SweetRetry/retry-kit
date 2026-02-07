---
name: design-director
description: 设计总监 (Design Director) — 多风格编排与融合规范。当项目需要混合使用 expressive / minimal / swiss 三套风格指南时，本技能负责诊断项目类型、分配风格比例、定义区域策略、解决属性冲突、设计过渡接缝、检测反模式。触发场景：(1) 用户的项目跨越多种风格需求（如 Landing Page + Dashboard），(2) 用户提到"混合风格"、"风格融合"、"主次风格"、"Design Director"，(3) 需要在同一项目中编排不同页面/区域的设计语言。
---

## 快速参考 (Quick Reference)

| 要素 | 规范 |
|------|------|
| 核心职责 | 诊断项目类型 → 推荐风格配比 → 区域映射 → 冲突仲裁 → 接缝设计 → 反模式检测 |
| 前置依赖 | `expressive-style-guide`, `minimal-style-guide`, `swiss-style-guide` |
| 与 frontend-design 的关系 | Director 决定"用什么风格"（上游），frontend-design 审查"是否正确执行"（下游）|
| 融合上限 | 单一项目最多使用 **2 种风格**（1 主 + 1 辅），极端情况可 3 种（需明确的三区域策略）|
| 主辅比例 | 主风格 **70-80%** / 辅风格 **20-30%** |
| 冲突仲裁权限 | 各 style guide 的**硬约束不可覆盖**；**软约束**可在声明条件范围内调整 |
| 色彩空间 | 混合项目统一使用 **oklch** |
| 跨区域通用过渡 | `duration: 0.3, ease: [0.16, 1, 0.3, 1]` (Expo Out) |

---

## 深度参考资料

在执行诊断、仲裁和审查时，参考以下深度文档获取理论支撑和实施细节：

- **融合理论与冲突解决** → [references/blending-theory.md](references/blending-theory.md) — 设计方言与语系、认知一致性理论（5 秒心智模型 / 认知断裂）、视觉重量平衡、属性分类学（硬/软/中性约束）、优先级仲裁 5 条规则、oklch 色彩空间统一的数学原理与 HSL 转换表
- **接缝设计理论** → [references/seam-design.md](references/seam-design.md) — 建筑阈限空间理论、五种接缝策略的设计原理与性能考量与失败模式、张力-释放模型与区域序列编排
- **案例分析** → [references/case-studies.md](references/case-studies.md) — Spotify（Expressive+Swiss）、Linear（Minimal+Swiss）、Apple（Expressive+Minimal）三个真实产品的风格配比、区域策略和接缝处理拆解
- **实施指南** → [references/implementation-guide.md](references/implementation-guide.md) — 项目启动 6 步清单、Tailwind v4 CSS-First 区域作用域配置（@theme + @custom-variant + CSS Variables）、Framer Motion ZoneProvider 配置（React Context + 动效参数）、参考文献

---

## 核心指令 (Core Mandate)

本技能是**指挥家 (Conductor)**，而非演奏者。

**职责边界：**

- **Director 做什么：** 诊断项目需求 → 推荐风格配比 → 绘制区域地图 → 裁决属性冲突 → 设计接缝过渡 → 生成软约束覆盖参数
- **Director 不做什么：** 不生成组件代码、不定义视觉规范、不替代三个具体 style guide 的职责

**权限层级：**

```
WCAG AA 无障碍要求（最高优先级）
    ↓
各 style guide 的硬约束（不可覆盖）
    ↓
Director 的冲突仲裁规则（覆盖软约束）
    ↓
各 style guide 的软约束默认值（最低优先级）
```

**与 `frontend-design` 的关系：**

- Director 是**上游**：决定每个区域应该使用哪种风格、哪些软约束需要调整
- `frontend-design` 是**下游**：审查实现代码是否符合 Token 合规、组件库使用、动效质量等技术标准
- 两者**不冲突**：Director 的输出是策略文档（Zone Map + Override Parameters），`frontend-design` 的输入是实现代码
- 推荐工作流：Director 审查 → 区域实现 → frontend-design 审查

**核心原则：**

1. **有主导风格**：每个项目必须有明确的主风格（70-80%），辅助风格（20-30%）服务于特定区域/情绪
2. **区域纯度**：单个组件内部只遵循一种风格，绝不在组件层面混合
3. **有意识的借用**：每个"异质元素"的引入都必须有明确的理由（用户体验提升 / 品牌调性表达 / 功能需求）
4. **一致的基础设施**：无论使用几种风格，`oklch` 色彩空间、语义 Token 化、`shadcn/ui` 组件库是所有区域共享的基底

---

## 一、项目诊断矩阵 (Project Diagnosis Matrix)

### 诊断输入维度

分析项目时，从以下五个维度收集信息：

| 维度 | 问题 | 典型选项 |
|------|------|----------|
| **项目类型** | 这是什么产品？ | SaaS 应用 / 品牌官网 / 内容平台 / 电商 / 作品集 / 混合型 |
| **目标受众** | 用户是谁？ | 开发者 / 企业用户 / 消费者 / 创意人群 / 混合 |
| **品牌调性** | 品牌想传达什么感觉？ | 高级/电影感 / 克制/专业 / 精确/系统 / 温暖/亲和 / 前卫/实验 |
| **信息密度** | 单屏需要展示多少信息？ | 低（内容英雄，大图大字） / 中（图文混排） / 高（仪表盘，表格，KPI） |
| **主要交互模式** | 用户主要在做什么？ | 阅读/浏览 / 探索/发现 / 操作数据/完成任务 / 创作/编辑 |

### 诊断输出：风格配比推荐

| 项目类型 | 受众 | 调性 | 主风格 | 辅风格 | 配比 | 理由 |
|----------|------|------|--------|--------|------|------|
| **创意作品集 / 品牌官网** | 消费者、创意人群 | 高级/电影感 | Expressive | Minimal | 80/20 | 影院级 Hero 吸引注意力 + 干净的内容阅读区 |
| **内容站 / 博客 / 编辑平台** | 通用读者 | 克制/专业 | Minimal | Expressive | 80/20 | 排版优先的阅读体验 + 特色文章的影院级 Hero |
| **SaaS 仪表盘 / 数据分析** | 企业用户、开发者 | 精确/系统 | Swiss | Minimal | 80/20 | 网格精度处理数据密集界面 + 设置/文档区的可读性 |
| **SaaS 营销站** | 混合 | 克制/专业 | Minimal | Expressive | 70/30 | 清晰的转化流程 + 影院级 Hero 传达品牌价值 |
| **电商平台** | 消费者 | 温暖/亲和 | Minimal | Swiss | 70/30 | 干净的浏览体验 + 产品对比/购物车的数据精度 |
| **全栈 SaaS（营销 + 应用）** | 混合 | 混合 | Swiss 60% (App) | Minimal 30% (Marketing) + Expressive 10% (Hero) | 60/30/10 | 三区域策略：数据应用 + 营销转化 + 品牌首屏 |
| **音乐 / 媒体应用** | 消费者、创意人群 | 高级/电影感 | Expressive | Swiss | 80/20 | 影院级播放体验 + 结构化的曲库/媒体库 |
| **个人网站 / Landing Page** | 通用 | 克制/专业 | Minimal | — | 100/0 | 纯极简即可，无需混合 |
| **企业管理系统** | 企业用户 | 精确/系统 | Swiss | — | 100/0 | 纯瑞士风格即可，数据密集界面不需要混合 |

### 诊断提问模板

当用户需求不明确时，Director 应依次确认：

1. "这个项目的**核心用途**是什么？（展示品牌 / 阅读内容 / 操作数据 / 混合功能）"
2. "目标用户更偏向**消费者**还是**专业用户/企业用户**？"
3. "你希望整体感觉是**沉浸/电影感**、**干净/克制**、还是**精确/高效**？"
4. "项目中是否存在**信息密度差异很大**的不同区域？（如营销首页 vs. 数据仪表盘）"

---

## 二、区域策略 (Zone Strategy)

### 区域分类法

"区域 (Zone)" 是页面中功能和视觉一致的完整区块。每个区域映射到**单一主风格**。

| 区域类型 | 描述 | 推荐风格 | 理由 |
|----------|------|----------|------|
| **Hero / Landing** | 首屏印象区，品牌视觉焦点 | Expressive 或 Minimal | 情绪冲击力 or 排版戏剧性 |
| **Navigation / Header** | 持久性全局导航 | 跟随**项目主风格** | 全局一致性，用户锚点 |
| **Content Body** | 长文阅读、文章、文档 | Minimal | 排版 + 留白优化阅读体验 |
| **Dashboard / Data Panel** | KPI、表格、图表 | Swiss | 网格精度 + 高信息密度 |
| **Settings / Forms** | 配置面板、表单 | Swiss 或 Minimal | 功能性清晰 |
| **Footer** | 页脚信息 | 跟随**项目主风格**（简化版） | 一致性，收尾感 |
| **Modal / Dialog** | 浮层覆盖 | 跟随**父区域风格** | 上下文延续 |
| **Media Showcase** | 图片画廊、视频播放器 | Expressive | 影院级的媒体内容呈现 |
| **Sidebar / Tool Panel** | 侧边工具栏 | Swiss | 功能性导航，紧凑布局 |
| **Empty State / Onboarding** | 空状态、引导流程 | Minimal 或 Expressive | 情绪引导 + 清晰的行动指引 |

### 区域映射规则

**规则 1：单组件单风格**
> 一个组件（Card、Button、Input 等）内部只遵循一种风格。禁止在同一个 Card 中混用 Expressive 的圆角 + Swiss 的 Mono 大写标签。

**规则 2：子组件继承**
> 子组件默认继承父区域的风格。如果需要在某个区域内嵌入不同风格的子区域（如 Content 区域中嵌入一个数据表格），必须使用**内容换框 (Content Wrapper)** 接缝策略（详见第四章）。

**规则 3：全局元素跟随主风格**
> 全局导航、全局 Toast、全局 Modal 跟随**项目主风格**，不因当前页面的区域风格而改变。

**规则 4：区域边界清晰**
> 两个不同风格的区域之间必须有**明确的视觉边界**（接缝）。不允许两种风格在同一垂直空间内"渐混"（除非使用第四章定义的渐变过渡策略）。

### 区域地图模板 (Zone Map Template)

为项目绘制区域地图时，使用以下格式：

```
┌─────────────────────────────────────────────┐
│ Navigation — [主风格]                         │
├─────────────────────────────────────────────┤
│                                             │
│ Hero — [Expressive / Minimal]               │
│                                             │
├─── 接缝：[接缝策略] ────────────────────────┤
│                                             │
│ Content Body — [Minimal]                    │
│                                             │
│  ┌──────────────────────────────┐          │
│  │ Embedded Data — [Swiss]      │          │
│  │ (Content Wrapper 接缝)       │          │
│  └──────────────────────────────┘          │
│                                             │
├─── 接缝：[接缝策略] ────────────────────────┤
│                                             │
│ Dashboard Panel — [Swiss]                   │
│                                             │
├─────────────────────────────────────────────┤
│ Footer — [主风格]                             │
└─────────────────────────────────────────────┘
```

---

## 三、融合规则 (Blending Rules)

### 约束 ID 速查 (Constraint ID Quick Reference)

每个 style guide 的 Composition Notes 中的约束均有唯一 ID，格式为 `[风格前缀].[类型][序号]`。Director 在冲突仲裁和委派指令中引用这些 ID。

| 前缀 | 风格 | 硬约束 (H) | 软约束 (S) |
|------|------|-----------|-----------|
| **E** | Expressive | E.H1 动效引擎 · E.H2 暗色画布 · E.H3 Token 化 · E.H4 内容即英雄 · E.H5 对比度 | E.S1 圆角 · E.S2 动效时长 · E.S3 色彩空间 · E.S4 暗色背景明度 · E.S5 Bento 网格 · E.S6 Stagger · E.S7 视差强度 |
| **M** | Minimal | M.H1 Token 化 · M.H2 oklch · M.H3 单色主导 · M.H4 位移≤10px · M.H5 对比度 · M.H6 OLED 安全暗色 | M.S1 圆角 · M.S2 留白率 · M.S3 动效时长 · M.S4 减法表面 · M.S5 Bento 网格 · M.S6 Stagger |
| **S** | Swiss | S.H1 8pt Grid · S.H2 Token 化 · S.H3 oklch · S.H4 禁用投影 · S.H5 动效<300ms · S.H6 对比度 · S.H7 功能性色彩 | S.S1 圆角 · S.S2 大写标签 · S.S3 网格列数 · S.S4 暗色背景 · S.S5 信息密度 · S.S6 边框厚度 |

> **H = 硬约束**（不可覆盖，身份底线）| **S = 软约束**（可由 Director 在声明范围内覆盖）
> 完整约束定义见各 style guide SKILL.md 末尾 `## 合成笔记` 章节

### 3.1 属性冲突解决矩阵 (Property Conflict Resolution Matrix)

当两种风格在同一项目中共存时，以下属性可能产生冲突。Director 按以下规则裁决：

| 冲突属性 | Expressive 值 | Minimal 值 | Swiss 值 | Director 裁决规则 | 关联约束 |
|----------|---------------|------------|----------|-------------------|----------|
| **圆角** | `rounded-lg` (8px) / `rounded-xl` (12px) | `rounded-md` (6px) / `rounded-lg` (8px) | `rounded-none` (0px)，交互热区 `rounded-sm` (2px) | **各区域使用各自风格的圆角值。** 同一区域内圆角统一。全局共享元素（Nav、Toast）跟随主风格。 | E.S1, M.S1, S.S1 |
| **动效时长** | 0.3–1.5s（影院感） | <400ms（克制） | <300ms（功能性） | **各区域遵循各自风格的时长规范。** 跨区域过渡动画使用 Expo Out 通用曲线，时长取两侧较短者的上限。 | E.S2, M.S3, S.H5 |
| **动效哲学** | Spring Physics + 影院运镜 | Spring Physics + 极克制位移 | Expo Out + 无弹性 | **各区域遵循各自风格的动效哲学。** 跨区域唯一共享曲线：`ease: [0.16, 1, 0.3, 1]` (Expo Out)。 | E.H1, M.H4, S.H5 |
| **色彩空间** | HSL | oklch | oklch | **混合项目统一使用 oklch。** Expressive 的 HSL 值必须转换为 oklch 等价值（见 3.2）。 | E.S3, M.H2, S.H3 |
| **暗色模式背景** | `hsl(0 0% 2%)` 近纯黑 | `oklch(0.145 0 0)` ≈ #1A1A1A | `oklch(0.145 0 0)` ≈ #1A1A1A | **全局基准使用 `oklch(0.145 0 0)`。** Expressive 区域可暗化至 `oklch(0.08 0 0)` 作为影院画布。 | E.S4, M.H6, S.S4 |
| **留白策略** | 内容英雄式（紧凑围绕内容） | 桌面 40%+（呼吸空间） | 网格驱动（8pt 精确） | **各区域遵循各自风格的留白规范。** 接缝区域的留白使用两侧中较大者。 | M.S2, S.H1 |
| **网格系统** | 非对称 Bento | 灵活 4-6 列 | 严格 12 列 8pt Grid | **如果项目中有 Swiss 区域，全局基线对齐到 8pt。** Minimal/Expressive 区域可使用自己的网格，但列宽和间距必须是 8px 的倍数。 | E.S5, M.S5, S.H1, S.S3 |
| **排版系统** | Display 5xl-9xl, tracking-tighter | extralight/bold 极端字重对比 | clamp() 流体, Mono 数据, 大写标签 | **各区域使用各自风格的排版系统。** 全局共享的字体族（Inter/Geist）保持一致；Mono 字体仅在 Swiss 区域使用。 | S.S2 |
| **投影 (Shadow)** | 选择性使用（反射光泽） | 禁用（减法表面） | 禁止（边框层级） | **全局默认无投影。** 仅 Expressive 区域内允许使用投影，且必须服务于光影叙事。 | S.H4, M.S4 |
| **信息密度** | 低（内容聚焦） | 低-中（清晰度优先） | 高（数据密集） | **严格按区域。** Dashboard 区域遵循 Swiss 密度；Content 区域遵循 Minimal 密度；Media 区域遵循 Expressive 密度。 | S.S5 |
| **深度表达** | 光影 + 模糊 + 选择性投影 | 无（平面） | 边框层级（Level 0/1/2） | **各区域遵循各自风格的深度模型。** 接缝处使用最简单的深度手法（通常是留白或分割线）。 | S.H4 |
| **强调色数量** | 单一品牌色 | 单一品牌色 | 双功能色（Action 蓝 + Destructive 红） | **全局统一 `--primary` 为品牌色。** Swiss 区域可额外使用 `--destructive` 红色。其他区域的强调色严格限制为 `--primary`。 | M.H3, S.H7 |

### 3.2 Token 统一策略 (Token Unification Strategy)

混合项目中，所有色彩必须在 CSS Variables 层使用 **oklch** 色彩空间定义。

#### 核心规则

1. **全局共享 Token**：`--primary`、`--destructive`、`--foreground`、`--muted-foreground` 等品牌/语义 Token 在所有区域中保持**同一值**
2. **区域可变 Token**：`--background`、`--card`、`--border` 等表面 Token 通过 `data-zone` HTML 属性实现区域级覆盖
3. **色彩空间统一**：Expressive 风格原始使用 HSL，混合项目中必须转换为 oklch

#### Expressive HSL → oklch 转换参考

| 原始 HSL | oklch 等价值 | 用途 |
|----------|-------------|------|
| `hsl(0 0% 2%)` | `oklch(0.08 0 0)` | Expressive 影院画布 |
| `hsl(0 0% 5%)` | `oklch(0.145 0 0)` | 通用暗色背景（Minimal/Swiss 暗色基准） |
| `hsl(0 0% 8%)` | `oklch(0.205 0 0)` | 卡片/表面提亮 |
| `hsl(0 0% 98%)` | `oklch(0.985 0 0)` | 近白前景 |

#### 区域作用域机制

- 使用 `data-zone="expressive"` / `data-zone="minimal"` / `data-zone="swiss"` HTML 属性标记区域
- 在 CSS 层通过属性选择器 `[data-zone="..."]` 覆盖区域内的表面 Token
- Tailwind v4 中通过 `@theme` 和 `@custom-variant` 在 CSS 文件中直接定义区域变体，无需 JS 配置文件

> 具体的 CSS Variables 定义、Tailwind v4 配置和代码实现模式参见 [references/implementation-guide.md](references/implementation-guide.md)

### 3.3 动效统一策略 (Motion Unification Strategy)

#### 区域内动效：各遵其法

每个区域内部完全遵循所属风格的动效系统：

| 维度 | Expressive 区域 | Minimal 区域 | Swiss 区域 |
|------|-----------------|-------------|------------|
| **交互动效** | Spring Physics (stiffness 280, damping 28) | Spring Physics (stiffness 260, damping 20) | Expo Out, 无弹性 |
| **揭示时长** | 可达 0.8s（Director 可从 1.5s 降低） | <400ms | <300ms |
| **入场位移** | 可达 40px | 严格 ≤10px | 几乎无位移（≤4px）|
| **Stagger 间隔** | 0.08s（可缩短至 0.04-0.06s） | 0.06s（可缩短至 0.03-0.04s） | 0.03s |
| **缓动曲线** | Spring Physics + Expo Out | Spring Physics + Expo Out | 仅 Expo Out |

#### 跨区域过渡：统一 Expo Out

当用户从一个风格区域滚动/导航到另一个风格区域时，过渡动画使用**所有风格共享的通用曲线**：

- **曲线：** `ease: [0.16, 1, 0.3, 1]` (Expo Out)
- **时长：** `0.3s`
- **这是三种风格的唯一公共子集**——Expo Out 在三个 style guide 中都出现

#### 全局动效安全

无论使用几种风格，`prefers-reduced-motion` 必须**在最顶层统一处理一次**，所有区域的动效同时降级为零动画。不允许某些区域尊重运动安全而其他区域忽略。

> 具体的动效配置对象、React Context 注入模式和 reduced motion 实现参见 [references/implementation-guide.md](references/implementation-guide.md)

---

## 四、过渡接缝 (Transition Seams)

### 接缝定义

**接缝 (Seam)** 是两个不同风格区域之间的视觉过渡设计。好的接缝让用户自然地从一种视觉语言过渡到另一种，而不产生认知断裂。

### 五种接缝策略

| # | 接缝类型 | 视觉效果 | 适用场景 | 关键参数 | 注意事项 |
|---|---------|----------|---------|----------|---------|
| 1 | **硬边界 (Hard Boundary)** | 干脆利落的"换场" | 风格差异较小的区域（Swiss ↔ Minimal）；结构性明确的分区 | 全宽 1px 分割线 (`bg-border`) | 两侧留白应为区域内部标准留白的 1.5-2 倍 |
| 2 | **渐变过渡 (Gradient Fade)** | 柔和的"渐入"感，像电影转场 | 明度差异大的过渡（Minimal 亮色 → Expressive 暗色） | 垂直空间 200-400px；oklch 色彩空间插值 | 渐变区域不放置关键内容；过短 (<100px) 像 bug，过长 (>500px) 感觉拖沓 |
| 3 | **留白缓冲 (Whitespace Buffer)** | 呼吸感，给用户"换挡"的心理空间 | 任意两种风格之间的通用接缝 | 桌面 128px+；移动端可折半至 64-96px | 在高留白的 Minimal 区域后可用短分割线打破单调 |
| 4 | **内容换框 (Content Wrapper)** | "画中画"，主风格包裹辅风格 | 在主风格区域内嵌入辅风格功能模块 | 内层容器有明确视觉边界（边框/背景色差异）+ `data-zone` 属性切换 | 内层面积不超过外层的 50%；内层样式完全遵循辅风格 |
| 5 | **全屏截断 (Full-Screen Break)** | 强烈的"场景切换"，像走进电影院 | 从克制风格切入 Expressive 影院区域 | 全出血 100vw × ≥100vh；完全不同的背景色 | 不宜频繁使用；暗→亮过渡底部建议加 50-100px 渐变缓冲 |

### 接缝推荐矩阵

| 起始风格 → 目标风格 | 推荐接缝 | 备选接缝 | 说明 |
|---------------------|----------|----------|------|
| **Minimal → Expressive** | 全屏截断 | 渐变过渡 | Expressive 区域应像"走进电影院"一样有明确入口 |
| **Expressive → Minimal** | 渐变过渡 | 留白缓冲 | 从影院感中"呼出"到阅读空间，需要减压 |
| **Minimal → Swiss** | 硬边界 | 内容换框 | 两者都是浅色/克制，结构性分隔即可 |
| **Swiss → Minimal** | 硬边界 | 留白缓冲 | 从精密网格到自由排版，清晰断开 |
| **Expressive → Swiss** | 留白缓冲 + 硬边界 | 全屏截断 | 视觉对比最大（暗→亮，有机→精密），需要最大分隔 |
| **Swiss → Expressive** | 全屏截断 | 留白缓冲 + 渐变过渡 | 从精密进入影院，用全屏暗色区块做强截断 |

### 接缝处的动效规则

接缝区域的动效**不属于**任何一侧的风格，使用跨区域通用过渡：`duration: 0.3s, ease: [0.16, 1, 0.3, 1]` (Expo Out)。

> 接缝的建筑阈限理论与视觉节奏序列编排参见 [references/seam-design.md](references/seam-design.md)

---

## 五、反模式检测 (Anti-Pattern Detection)

### 禁止模式清单

| # | 反模式名称 | 描述 | 为什么禁止 | 修复方案 |
|---|-----------|------|-----------|----------|
| 1 | **Frankenstein Card** | 单个 Card 组件混用 2+ 种风格的属性（如 `rounded-xl` + `border-2` + `font-mono uppercase`） | 单组件内的视觉语言分裂，用户无法建立一致的心智模型 | 每个组件只遵循**一种**风格，属于哪个区域就用哪个风格的全部属性 |
| 2 | **Motion Clash** | Swiss 区域内出现 Spring Physics 弹性动画，或 Expressive 区域内出现无弹性 Expo Out 微交互 | 同一区域内的交互感受不一致 | 区域内的动效严格遵循该区域风格的动效系统 |
| 3 | **Radius Soup** | 同一个区域/Section 内出现多种圆角值（0px、6px、12px 同时存在） | 视觉秩序混乱 | 同一区域内圆角统一为该风格的规范值 |
| 4 | **Color Space Split** | 部分 CSS Variables 使用 HSL，另一部分使用 oklch | 色彩计算不一致，混合/插值结果不可预测 | 全部统一为 oklch |
| 5 | **Shadow Leak** | 投影 (box-shadow) 出现在 Swiss 或 Minimal 区域内 | 违反 Swiss 的边框深度模型和 Minimal 的减法表面原则 | 移除投影，Swiss 用边框层级表达深度，Minimal 用留白 |
| 6 | **Typography Contamination** | Swiss 的 Mono 大写标签出现在 Minimal 内容区域，或 Expressive 的超大字号出现在 Swiss 仪表盘 | 破坏阅读流程或数据密度 | 排版严格跟随区域风格 |
| 7 | **Density Mismatch** | Swiss 级别的信息密度（4 列 KPI 网格）出现在 Expressive 区块内 | Expressive 要求低密度和影院空间感，高密度数据破坏叙事 | 高密度内容移入 Swiss 区域 |
| 8 | **Three-Style Chaos** | 两风格项目中第三种风格的占比超过 10% | 稀释主次风格身份，视觉语言碎片化 | 严格控制第三风格用量；如果确实需要三种，使用明确的三区域策略 |
| 9 | **No Primary** | 两种风格 50/50 平分，没有明确的主次 | 用户无法建立统一的品牌/产品认知 | 必须建立 70/30 或 80/20 的主次层级 |
| 10 | **Seam-less Transition** | 两种风格的区域直接相邻，没有任何接缝设计 | 突兀的视觉断裂，认知冲击 | 使用第四章定义的接缝策略 |
| 11 | **Token Drift** | 不同区域的 `--primary` 品牌色值不一致 | 品牌识别碎片化 | `--primary` 全局唯一一致 |

### 检测方法

Director 可通过以下方式检测反模式：

```text
1. Radius Soup → 搜索同一 Section 内的所有 rounded-* 类，检查是否多于一种
2. Color Space Split → 搜索 CSS 文件中的 hsl() 和 oklch() 共存
3. Shadow Leak → 搜索 data-zone="swiss" 或 data-zone="minimal" 区域内的 shadow-* 类
4. Typography Contamination → 搜索 data-zone="minimal" 内的 font-mono 和 uppercase
5. Token Drift → 比较不同区域的 --primary 值是否一致
```

---

## 六、合成配方 (Composition Templates)

### 配方 1：SaaS 全栈（营销 + 应用）— 最常见

```
风格配比: Swiss 60% (App) + Minimal 30% (Marketing) + Expressive 10% (Hero)

区域地图:
┌─────────────────────────────────────────┐
│ Marketing Nav — Minimal                  │
├─────────────────────────────────────────┤
│ Hero — Expressive (全屏截断接缝)          │
├─── 渐变过渡 ────────────────────────────┤
│ Features / Pricing — Minimal             │
├─── 硬边界 ──────────────────────────────┤
│ Footer — Minimal                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ App Shell Sidebar — Swiss                │
├──────┬──────────────────────────────────┤
│      │ Dashboard KPIs — Swiss            │
│ Side │ Data Tables — Swiss               │
│ bar  ├──────────────────────────────────┤
│      │ Settings — Minimal (内容换框接缝)  │
│      │ Docs — Minimal (内容换框接缝)      │
└──────┴──────────────────────────────────┘

共享基础:
- oklch 色彩空间
- 统一 --primary 品牌色
- 8pt 基线网格（Minimal 区域也对齐到 8pt）
- Inter 字体族（Swiss 数据区加 JetBrains Mono）
```

### 配方 2：创意作品集

```
风格配比: Expressive 80% + Minimal 20%

区域地图:
┌─────────────────────────────────────────┐
│ Nav — Expressive (透明覆盖)               │
├─────────────────────────────────────────┤
│ Hero Reel — Expressive (全屏影院)         │
├─────────────────────────────────────────┤
│ Project Gallery — Expressive (Bento)     │
├─── 渐变过渡 (暗→亮) ───────────────────┤
│ About / Bio — Minimal (排版比例模式)      │
├─── 渐变过渡 (亮→暗) ───────────────────┤
│ Contact — Expressive                     │
└─────────────────────────────────────────┘

Director 覆盖:
- Expressive 色彩空间 → oklch（从 HSL 转换）
- Minimal 区域留白率维持 40%+
- Expressive 圆角保持 8-12px，Minimal 区域跟随 8px
```

### 配方 3：编辑 / 博客平台

```
风格配比: Minimal 80% + Expressive 20%

区域地图:
┌─────────────────────────────────────────┐
│ Nav — Minimal                            │
├─────────────────────────────────────────┤
│ Featured Article Hero — Expressive       │
│ (全屏截断接缝, 影院级大图 + 运动标题)     │
├─── 渐变过渡 ────────────────────────────┤
│ Article Grid — Minimal (Bento 网格)      │
├─── 硬边界 ──────────────────────────────┤
│ Article Body — Minimal (排版比例 + 分割线) │
├─────────────────────────────────────────┤
│ Footer — Minimal                         │
└─────────────────────────────────────────┘

Director 覆盖:
- Expressive Hero 动效时长上限降至 0.8s（匹配 Minimal 整体节奏）
- Expressive 暗色背景使用 oklch(0.08 0 0)
```

### 配方 4：电商平台

```
风格配比: Minimal 70% + Swiss 30%

区域地图:
┌─────────────────────────────────────────┐
│ Nav — Minimal (含搜索)                    │
├─────────────────────────────────────────┤
│ Hero Banner — Minimal (排版比例模式)      │
├─── 留白缓冲 ────────────────────────────┤
│ Product Grid — Minimal (Bento 网格)      │
├─────────────────────────────────────────┤
│ Product Detail — Minimal                 │
│  ┌──────────────────────────────┐       │
│  │ Specs / Compare — Swiss       │       │
│  │ (内容换框接缝)                │       │
│  └──────────────────────────────┘       │
├─── 硬边界 ──────────────────────────────┤
│ Cart / Checkout — Swiss                  │
├─────────────────────────────────────────┤
│ Footer — Minimal                         │
└─────────────────────────────────────────┘

Director 覆盖:
- Swiss 区域圆角放宽至 6px（匹配 Minimal 整体柔和感）
- Swiss 边框厚度统一为 1px
- Minimal 区域 Bento 网格对齐到 8pt 基线
```

### 配方 5：音乐 / 媒体应用

```
风格配比: Expressive 80% + Swiss 20%

区域地图:
┌─────────────────────────────────────────┐
│ App Shell — Expressive (暗色)             │
├──────┬──────────────────────────────────┤
│      │ Now Playing — Expressive          │
│      │ (全屏影院, Spotlight + 氛围渐变)   │
│ Mini ├──────────────────────────────────┤
│ Side │ Library / Browse — Swiss          │
│ bar  │ (Sidebar Shell + Data Grid)       │
│      ├──────────────────────────────────┤
│      │ Search Results — Swiss            │
│      ├──────────────────────────────────┤
│      │ Playlist Detail — Expressive      │
└──────┴──────────────────────────────────┘

Director 覆盖:
- Swiss 区域暗色背景可暗化至 oklch(0.12 0 0)（与 Expressive 整体暗色调和谐）
- Swiss 区域圆角维持 0px（在暗色环境中直角更显精密）
- 跨区域导航使用 Expo Out 通用过渡
```

---

## 七、Director 审查清单 (The Director Audit)

### 风格配比

- [ ] **主次明确** — 项目是否定义了主风格（70-80%）和辅风格（20-30%）？是否存在 50/50 无主次情况？
- [ ] **配比合理** — 风格选择是否与项目类型、受众、品牌调性匹配（参照第一章诊断矩阵）？
- [ ] **风格数量** — 是否超过 2 种风格（除非使用明确的三区域策略）？

### 区域纯度

- [ ] **Zone Map 存在** — 是否为项目绘制了区域地图，明确每个区域的风格归属？
- [ ] **单组件单风格** — 是否有组件内部混用两种风格属性（Frankenstein Card）？
- [ ] **圆角一致** — 同一区域内的 `rounded-*` 值是否统一？
- [ ] **动效一致** — 同一区域内的动效是否遵循该区域风格的系统？
- [ ] **排版一致** — 同一区域内的排版系统是否遵循该区域风格（如 Mono 不泄漏到 Minimal 区域）？

### Token 统一

- [ ] **色彩空间统一** — 所有 CSS Variables 是否统一使用 oklch？是否存在 HSL/oklch 混用？
- [ ] **品牌色一致** — `--primary` 品牌色是否全局一致？
- [ ] **暗色模式统一** — 全局暗色基准是否为 `oklch(0.145 0 0)`？Expressive 区域的暗化值是否在合规范围内？
- [ ] **Token 使用** — 组件层是否全部使用语义 Token（`bg-background` 等），禁止硬编码 Hex？

### 接缝质量

- [ ] **接缝存在** — 所有不同风格区域之间是否有明确的接缝设计？
- [ ] **接缝类型合适** — 使用的接缝策略是否与风格组合匹配（参照第四章推荐矩阵）？
- [ ] **接缝动效** — 跨区域过渡动效是否使用 Expo Out 通用曲线？
- [ ] **接缝留白** — 接缝两侧的留白是否大于区域内部标准留白？

### 反模式扫描

- [ ] **无 Frankenstein Card** — 单组件不混用多风格属性
- [ ] **无 Motion Clash** — 区域内动效系统一致
- [ ] **无 Radius Soup** — 区域内圆角统一
- [ ] **无 Color Space Split** — 全局 oklch 统一
- [ ] **无 Shadow Leak** — 投影仅限 Expressive 区域
- [ ] **无 Typography Contamination** — 排版不跨区域污染
- [ ] **无 Density Mismatch** — 信息密度匹配区域风格
- [ ] **无 Token Drift** — `--primary` 全局一致

### 无障碍

- [ ] **对比度** — 所有文本 WCAG AA (≥4.5:1)，尤其是 Expressive 暗色区域的浅色文字
- [ ] **运动安全** — `prefers-reduced-motion` 是否在全局顶层统一处理？
- [ ] **OLED 安全** — 暗色模式是否避免纯黑（使用 oklch(0.145 0 0) 或更亮）？

---

## 八、Skill 关联与委派模型 (Skill Delegation Model)

### 关联的 Style Guide Skills

本技能在策略层编排以下三个实现层 skill。当需要为某个区域生成具体的组件代码或审查实现时，**必须委派给对应的 style guide skill**：

| 区域风格 | 委派目标 Skill | 该 Skill 的职责 | 约束 ID 前缀 | Composition Notes 位置 |
|----------|---------------|-----------------|-------------|----------------------|
| Expressive 区域 | `expressive-style-guide` | 影院级质感 UI 的组件实现、视觉模式选择、动效编排 | `E.H*` / `E.S*` | 该 SKILL.md 末尾 `## 合成笔记` 章节 |
| Minimal 区域 | `minimal-style-guide` | 极简主义 UI 的组件实现、减法表面、排版系统 | `M.H*` / `M.S*` | 该 SKILL.md 末尾 `## 合成笔记` 章节 |
| Swiss 区域 | `swiss-style-guide` | Neo-Swiss UI 的组件实现、网格系统、数据密集布局 | `S.H*` / `S.S*` | 该 SKILL.md 末尾 `## 合成笔记` 章节 |

**审查配合：** 实现完成后，可使用 `frontend-design` skill 审查代码层面的 Token 合规、组件库使用和动效质量。

### Director 工作流

```
用户描述项目需求
    ↓
[1] 诊断阶段 — 运行项目诊断矩阵（第一章）
    → 输出：推荐主辅风格 + 配比
    ↓
[2] 区域映射阶段 — 定义区域策略（第二章）
    → 输出：Zone Map（ASCII 图 + data-zone 属性方案）
    ↓
[3] 策略输出阶段 — 为每个区域生成委派指令
    → 输出：每个区域的风格归属 + 软约束覆盖参数 + 接缝策略
    ↓
[4] 实现委派阶段 — 按区域委派给具体 style guide skill
    → 指令格式见下方
    ↓
[5] 审查阶段 — 运行 Director 审查清单（第七章）
    → 随后可运行 frontend-design 进行技术合规审查
```

### 委派指令格式

当 Director 委派给具体 style guide skill 时，使用以下格式传递上下文：

```
区域: [区域名称，如 Hero / Dashboard / Content Body]
委派 Skill: [expressive-style-guide / minimal-style-guide / swiss-style-guide]

软约束覆盖（引用约束 ID，在声明的可调范围内）:
- [ID] [属性]: [调整后的值] ← 原因: [为什么调整]
- [ID] [属性]: [调整后的值] ← 原因: [为什么调整]

相邻区域的接缝:
- 上方接缝: [接缝类型]，连接 [上方区域风格]
- 下方接缝: [接缝类型]，连接 [下方区域风格]
```

**示例：**

```
区域: Hero
委派 Skill: expressive-style-guide

软约束覆盖:
- E.S3 色彩空间: oklch ← 原因: 混合项目统一色彩空间
- E.S4 暗色背景: oklch(0.08 0 0) ← 原因: 影院画布
- E.S2 动效时长上限: 0.8s ← 原因: 匹配 Minimal 主风格的整体节奏
- E.S5 Bento 网格: 对齐 8pt 基线 ← 原因: 项目中包含 Swiss 区域
- E.S6 Stagger 间隔: 0.06s ← 原因: 项目节奏偏快

相邻区域的接缝:
- 上方: 无（Hero 是首屏）
- 下方: 渐变过渡 (Gradient Fade)，连接 Minimal Content Body
```

### 职责边界

- **Director 做什么：** 诊断需求 → 推荐配比 → 绘制 Zone Map → 裁决属性冲突 → 设计接缝 → 生成覆盖参数 → 审查区域纯度
- **Director 不做什么：** 不生成组件代码、不定义视觉规范细节、不替代三个 style guide skill 的职责
- **Director 不知道的：** 具体组件怎么写、shadcn/ui 组件的具体改造方式、Framer Motion 的具体动画代码——这些都由被委派的 style guide skill 负责
- **不存在循环依赖：** Director 是单向调度上游，不被其他 skill 反向调用
