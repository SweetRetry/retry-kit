---
name: visual-design
description: >
  Web UI 审美约束层。消除 LLM 默认视觉惯性（Inter 字体、居中 Hero、紫蓝渐变、3列卡片、纯黑色），
  用强主张规则驱动高品质 UI 输出。Claude 根据上下文自判场景，不向用户提问，直接应用对应档位的审美标准。
  触发场景：(1) 设计或实现任何 Web UI 页面/组件，(2) 审查 UI 代码视觉质量，
  (3) 用户提到 UI 风格、视觉规范、设计系统，(4) 用户提到"好看"、"有质感"、"高级感"、"设计感"。

  职责边界：本 skill 只管视觉样式约束（字体、色彩 token、圆角、动效、布局反模式）。
  landing-structure 管落地页的页面结构与信息架构；两者独立运作，不存在优先级冲突。

  技术栈范围：React + shadcn/ui + Motion (Framer Motion)。超出范围时输出一行提示：
  `[visual-design] 超出范围：[项目类型]。以下建议为类比参考，请按项目实际适配。`

  English triggers: Web UI visual design constraints, high-quality UI, design system, visual polish.
---

## 档位确认流程

**写任何 UI 代码前先走这个流程。**

```
本会话有已确认档位？
  → 是：静默继承，不重复声明
  → 否：检查当前指令 → 会话历史 → 全无则默认 Tool

当前任务是单组件（Button/Card/Badge 等）？
  → 是：继承已确认档位，静默应用，跳过声明
  → 否：输出锁定声明
```

**档位信号**（从上下文找，找到即停）：

| 信号 | 判定 |
|------|------|
| "仪表盘" / "后台" / "SaaS" / "工具" / 参考 Linear・Notion・Raycast | **Tool** |
| "落地页" / "官网" / "营销页" / "品牌页" / 参考 Apple・Stripe・Framer | **Brand** |
| 信号冲突（如"SaaS 落地页"） | Brand，声明中注明冲突原因 |
| 无信号 | 默认 **Tool**，声明标注"信号缺失" |

**混合页面**（onboarding / 空状态 / 付费升级页）：首次或低频 → Brand；嵌套高频工作流 → Tool；两者都是 → Brand 但动效降至 Tool 强度（参数见 TOOL 档位动效行，不用 Spring）。

**锁定声明格式**（推断档位时输出，继承时不输出）：
```
[visual-design] 档位：Tool（依据：用户提到"管理界面"）| 字体：Geist | 圆角：rounded-md | 深度：border | 动效：minimal
[visual-design] 档位：Tool（信号缺失，默认值）| ... — 说"Brand档"或"落地页风格"可切换
```

**档位切换**：说"Brand 档 / 落地页风格 / 官网感" → 切换 Brand 重新生成；说"Tool 档 / 后台风格" → 切换 Tool；说"更高级感 / 有质感" → 当前档位内提升上限；说"更简洁 / 克制" → 降低复杂度。

**"显式确认"定义**：用户对锁定声明未反驳并继续提 UI 任务 = 确认。

---

## 审查模式

任务是审查现有代码时，不生成代码，输出：
```
[visual-design 审查] 档位推断：X（依据：Y）
✅ 符合：...
❌ 违反：[标注 [严重]/[品味] + 修复建议，严重级必须给可替换代码片段]
⚠️ 风险：...
```

---

## TOOL 档位

> 核心原则：界面退到后台，任务本身最显眼。每个决策都在问："这会分散注意力吗？"

| 维度 | 规则 |
|------|------|
| **字体** | Geist Sans 或 Inter；Geist Mono 用于数字/代码/时间戳；禁 Display 字体；禁 extralight/thin 字重 |
| **排版** | H1 `text-2xl font-semibold tracking-tight`（最大 text-3xl）；Body `text-sm text-muted-foreground leading-relaxed max-w-[65ch]`；数字加 `tabular-nums`；禁居中 Hero |
| **色彩** | 90% 无彩色（`bg-background` / `bg-muted` / `text-foreground`）；品牌色仅限主 CTA・选中态・Link；饱和度 ≤ 70%，禁用饱和度 > 80% 的纯蓝/纯紫（`#7c3aed`、`#2563eb`）；一屏最多 1 个彩色焦点（同一 section 内）；状态色：`text-destructive`（错误）/ 绿色用 Tailwind `text-emerald-500`・橙色用 `text-amber-500`，搭配 `/10` 透明底，品牌色不复用为状态色 |
| **圆角** | `rounded-md` 全局统一 |
| **深度** | 三选一全局统一：`border border-border` / `bg-muted`+`bg-card` 色差 / 纯留白。不混用。弹出层例外可加 `shadow-md` |
| **动效** | 默认不加。允许：路由切换 `opacity 0→1 200ms`，主 CTA hover `scale-[1.02] 150ms`，列表入场 `y:4px→0 opacity 0→1 200ms staggerChildren:30ms`，按钮 press `whileTap={{scale:0.97}}`（全档位通用）。禁 bounce / spring / parallax / 鼠标跟随 |
| **间距** | `py-12`~`py-16`；4/8px 网格；禁连续 3 个等间距 section |

**暗色模式**：直接用 shadcn token（`bg-background` / `bg-card` / `bg-popover` / `border-border`），由 `.dark` class + CSS variable 自动处理，禁止手写色值取反。

---

## BRAND 档位

> 核心原则：界面是体验的一部分，用户第一屏就要感受到产品气质。

| 维度 | 规则 |
|------|------|
| **字体** | Hero H1：Cal Sans / Instrument Serif / Geist Sans extralight（三选一全局统一）；Body：Geist Sans 或 Outfit；禁 Inter（Web UI 过于通用，缺乏品牌辨识度） |
| **排版** | Hero H1 `text-6xl md:text-8xl font-extralight tracking-tighter`；Body `text-base md:text-lg leading-relaxed max-w-[60ch]`；禁居中 Hero（标题 > 5 词时）→ 改左对齐或 Split |
| **色彩** | 可大面积深色底・Mesh 渐变・光晕；渐变只用同色相（例：`hsl(var(--primary)/0.8)→hsl(var(--primary)/0.2)`）；视觉焦点递进 Hero > 功能介绍 > CTA；禁"AI 紫/蓝"（`#7c3aed` 系列） |
| **圆角** | `rounded-2xl` 全局统一；Neo-brutalism 改 `rounded-none`（不混用） |
| **深度** | 二选一：暗光 Cinematic（`border-white/10` + `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]` 顶部光带）/ 重质感（Neo-brutalism `border-2 border-black shadow-[4px_4px_0_#000]`，或局部浮层 Glassmorphism `backdrop-blur-xl bg-white/10`，仅限 Dropdown・Sidebar・浮层）。全页面 glassmorphism 已过气，禁用 |
| **动效** | 入场 `y:40px→0 scale:0.96→1 opacity:0→1 staggerChildren:60ms`；Spring 参数见 `references/tokens.md`；允许 Spring・Spotlight 鼠标跟随・视差；用 `useMotionValue`+`useTransform`，禁 useState 做动效；只 animate `transform` 和 `opacity` |
| **间距** | Hero `py-24 md:py-32`；相邻 section 换构图制造节奏 |

**暗色模式**：`bg-background` / `bg-card` 或 `bg-white/5` / `border-white/10`（透明叠层，非硬编码）。

**性能熔断**（条件满足时直接跳过动效）：`layoutId` 列表项 > 50 → 跳过列表动效；Spotlight 鼠标跟随 + Parallax Tilt → 移动端无条件禁用；永久循环动效（Carousel、呼吸圆点）→ 必须隔离在独立 Client Component。

---

## 全局禁令

`[严重]` = 影响可用性/无障碍，必须遵守。`[品味]` = 影响视觉质量，强烈遵守。Token 压力下优先保 `[严重]`。

**色彩**
- `[严重]` 硬编码色值（`#000000`、`#f4f4f5`、`#18181b` 等）→ 用 shadcn token
- `[品味]` 跨色相渐变（Brand）→ 只用同色相；neon 过饱和发光 → 改 tinted shadow；H1 文字渐变填充 → 禁用
- `[品味]` serif 字体用于 SaaS/Dashboard → 禁用，serif 只用于 editorial

**布局**
- `[品味]` 3 列等密度卡片网格 → 改 Bento 或 Zig-Zag；居中 Hero（Brand 超 5 词）→ 改左对齐；全 section 等间距 → 至少 2 种节奏

**内容**
- `[严重]` 占位数据（John Doe、Acme Corp）→ 用贴近真实的虚构内容
- `[品味]` 创业黑话（Seamless、Powerful、Unleash）；完美数字（99.99%、10,000+ users）

**动效**
- `[严重]` animate `width`/`height`/`top`/`left` → 只 animate `transform` 和 `opacity`
- `[品味]` CSS transition 做复杂动效 → 用 Motion；useState 控制 hover → 用 `useMotionValue`

**组件**
- `[严重]` emoji 替代图标 → Lucide / Phosphor / Radix（全项目统一一套）
- `[严重]` border + shadow 同时作用于同一元素 → 选一种深度模型
- `[严重]` mutation 刷新回到骨架屏 → 用 `opacity-50 pointer-events-none transition-opacity` 降权 + 按钮级 Spinner
- `[严重]` 横向滚动裸露原生滚动条 → `scrollbar-width:none` 或 `scrollbar-thin`
- `[品味]` 混用圆角值 → 按档位统一

**禁令冲突**：`[严重]` 不可违反，直接给替代方案。`[品味]` 与用户需求冲突时提示：`[visual-design] 冲突：[原因]，推荐[方案]，若坚持请确认。`

---

## 底线约束（不可违反）

- **对比度**：正文 WCAG AA ≥ 4.5:1，大文字/图标 ≥ 3:1
- **焦点样式**：`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1`
- **触控目标**：≥ 44×44px（移动端）
- **动效降级**：所有动效必须处理 `prefers-reduced-motion: reduce`
- **移动端**：`md:` 以下强制单列 `w-full px-4 py-8 flex-col`，禁横向滚动
- **字体加载**：Next.js 用 `next/font`；非 Next.js 用 `<link rel="preconnect">` + `font-display: swap`；禁裸 `@import url()` 放 CSS 顶层

---

## References 加载时机

默认不加载，仅在以下明确条件触发：

| 文件 | 仅在此时加载 |
|------|------------|
| `references/visual-patterns.md` | 生成完整页面且需在 Hero 变体 / Feature Section 排布之间做选择 |
| `references/case-studies.md` | 用户提到具体参考产品，或明确问"参照哪种风格" |
| `references/tokens.md` | 需要查具体 shadcn/ui token 名称或 Motion Spring 参数时 |
| `references/techniques.md` | 需要实现布局构图・卡片特效・背景氛围・微交互技法时 |
