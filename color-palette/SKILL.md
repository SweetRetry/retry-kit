---
name: color-palette
description: >
  产品级配色方案生成与 shadcn/ui design token 输出。通过 3 问诊断产品意图，基于参考色板库和色彩系统（Radix Colors、Open Color、Tailwind CSS Colors），
  输出可直接使用的 globals.css design tokens。
  触发场景：(1) 用户需要为项目生成配色方案或 design tokens，
  (2) 用户提到"配色"、"color palette"、"design tokens"、"globals.css"、"主题色"等关键词，
  (3) 用户希望基于特定色彩来源（Radix、Open Color、Tailwind）生成方案，
  (4) 用户需要将配色方案映射为 shadcn/ui globals.css。
---

# Color Palette

产品级配色方案生成器。通过产品意图诊断，从参考色板库中选择方向，输出 shadcn/ui `globals.css` design tokens。

## 工作流总览

```
1. 诊断  → 向用户提 3 个问题（产品类型 / 品牌调性 / 目标用户）
2. 选方向 → 从参考色板库中推荐 2-3 个方向，获得用户确认
3. 选色  → 基于确认的方向，从色彩系统中按五角色模型挑选具体色值，获得用户确认
4. 输出  → 生成完整 globals.css（:root + .dark + @theme inline + @layer base）
```

每个阶段需要用户确认后再进入下一阶段。

---

## I. 参考色板库

以下是经过验证的产品配色方向。**诊断完成后，从中推荐 2-3 个最匹配的方向供用户选择**，而不是从零推导色值。

| 方向 | 代表产品 | 主色 H | 情绪 | 适合 |
|------|----------|--------|------|------|
| **纯蓝** | Tailwind (H≈210 cyan-blue) | 200-245 | 清澈、专业、开放 | SaaS、开发者工具、通用 B 端 |
| **翠绿** | Supabase (H≈162)、Spotify (H≈150) | 145-170 | 活力、开源、成长 | 开发者工具、生产力、健康 |
| **珊瑚暖红** | Raycast (H≈20) | 15-40 | 大胆、精致、craft 感 | 创意工具、设计类、dark-mode 产品 |
| **琥珀暖黄** | Lemon Squeezy (H≈80) | 60-90 | 温暖、亲切、独立 | 创作者经济、电商、社区 |
| **紫罗兰** | Stripe (H≈277) | 280-310 | 创新、高端、金融信任 | 金融科技、创意平台 |
| **无色相** | Vercel、Notion、Cal.com | — | 极简、工具感、中性画布 | 基础设施、文档/笔记、嵌入式工具 |

**审美红线**：
- 避开 H 255-275（indigo 灰区）——蓝紫之间的模糊地带，视觉沉闷且缺乏辨识度。要蓝就纯蓝，要紫就真紫
- 主色必须有明确的色相主张：用户应能一眼说出"这是蓝色"或"这是绿色"，而不是"这是……紫蓝？"

### 色彩系统

从以下系统中取具体色值，所有值输出前转换为 oklch（保留 3 位小数）：

| 来源 | 规模 | 特点 | 适用场景 |
|------|------|------|----------|
| **Radix Colors** | 30 色阶 × 12 级 | 专为 UI 设计，内置可访问性对比度 | SaaS、工具类产品 |
| **Open Color** | 13 色系 × 10 级 | 简洁、通用、高可读性 | 通用 Web 项目 |
| **Tailwind CSS Colors** | 22 色系 × 11 级 | 生态最广、开发者最熟悉 | 已使用 Tailwind 的项目 |

---

## II. 产品意图诊断 SOP

**在输出任何配色方案前，必须完成以下 3 问诊断。** 即使用户已给出色值偏好，也应先完成诊断以确保方案完整性（可结合用户偏好快速完成）。

### 问题 1：产品类型

> 你的产品属于哪个类型？

- **SaaS / 后台工具** — 大量表格表单，需长时间使用不疲劳
- **电商 / 交易** — 强调信任感和行动引导，CTA 突出
- **内容 / 媒体** — 阅读为主，色彩克制
- **工具 / 效率** — 简洁功能导向，低干扰
- **社交 / 社区** — 活跃互动，个性化
- **文化 / 品牌** — 强文化调性，视觉表达为核心

### 问题 2：品牌调性

> 你希望品牌传递什么感觉？

- **专业严肃** — 低饱和、冷色调、高对比度
- **活泼年轻** — 中高饱和、暖色或多色
- **温暖亲和** — 暖色中低饱和、柔和过渡
- **极客科技** — 冷色、高对比、深色优先
- **克制高级** — 极低饱和、大面积留白

### 问题 3：目标用户

> 产品的核心用户是？

- **B 端专业用户** — 严格对比度、低疲劳、信息密度优先
- **C 端大众** — 友好、清晰、情感引导
- **创意设计师** — 审美敏感、允许更大胆配色
- **开发者** — 深色模式重要、代码风格审美

### 诊断决策表

品牌调性是主要决策轴，产品类型和目标用户作为修正因子：

| 品牌调性 | 推荐方向（从参考色板库选） | 饱和度 | Primary L | 对比度 |
|----------|--------------------------|--------|-----------|--------|
| 专业严肃 | 纯蓝 / 翠绿 / 无色相 | 低 C<0.05 | 0.40-0.55 | AAA |
| 活泼年轻 | 珊瑚暖红 / 琥珀暖黄 / 紫罗兰 | 高 C>0.15 | 0.50-0.65 | AA |
| 温暖亲和 | 琥珀暖黄 / 珊瑚暖红 | 中 0.05-0.15 | 0.55-0.65 | AA |
| 极客科技 | 纯蓝 / 翠绿 / 无色相 | 中 0.05-0.15 | 0.45-0.55 | AA |
| 克制高级 | 无色相 / 纯蓝（极低饱和） | 极低 C<0.03 | 0.35-0.50 | AAA |

**修正规则**：

- 产品类型为 SaaS / 工具 → 对比度升一级（AA→AAA），饱和度降一档
- 目标用户为 B 端专业用户 → 背景 L ≥ 0.95（更白），减少视觉疲劳
- 目标用户为开发者 → dark mode 为主模式，优先验证 dark 配色

**WCAG 对比度硬约束**：

- 正文文字（foreground on background）≥ 4.5:1（AA）
- 标题/大字 ≥ 3:1（AA）
- 决策表标注 AAA 的方案需 foreground on background ≥ 7:1
- 输出 globals.css 后必须列出关键 token 对的实际对比度数值

### 诊断输出

基于决策表，向用户推荐 2-3 个参考色板方向（附代表产品），加上色温方向、饱和度区间（含 C 值）、明度策略（background L + primary L）、对比度要求（AA/AAA）。确认后进入配色阶段。

---

## III. 配色方案生成

### 五角色模型

| 角色 | 功能 | 选色约束 |
|------|------|----------|
| **主色 Primary** | 品牌识别、CTA、关键交互 | 从用户确认的参考方向取色，H 值落在该方向区间内 |
| **辅色 Secondary** | 次要按钮、标签、辅助信息 | 与主色同温但饱和度更低，或互补色的低饱和版本 |
| **强调色 Accent** | 高亮、通知、特殊状态 | 与主色色相距离 ≥ 60°，提供视觉跳跃 |
| **中性色 Neutral** | 文字、边框、分隔线 | C < 0.02，保留极微色彩倾向（暖中性 / 冷中性） |
| **背景色 Background** | 页面底色、卡片底色 | L ≥ 0.90（light）/ L ≤ 0.20（dark），与主色同温 |

### 选色策略

- **Radix / Open Color / Tailwind**：基于已知色值选取，标注来源和色阶名（如 `Tailwind emerald-600`）
- **混合选色**：允许跨来源组合，但同一角色层级内应来自同一色系以保证和谐

### 输出格式

```
## 配色方案：{方案名称}

**诊断依据**：{产品类型} · {品牌调性} · {目标用户}
**参考方向**：{用户选择的方向}（{代表产品}）
**色板来源**：{使用的来源}

| 角色 | 色名/色阶 | oklch | 来源 | 用途 |
|------|-----------|-------|------|------|
| 主色 | emerald-600 | oklch(0.56 0.155 163) | Tailwind | CTA、品牌色 |
| ... | ... | ... | ... | ... |
```

用户确认方案后，进入 token 映射阶段。

---

## IV. Token 映射与输出

生成 `globals.css` 时，读取 [references/token-output.md](references/token-output.md) 获取完整 token 映射规则、Dark Mode 规则、输出模板和端到端 CSS 示例。

---

## V. 端到端示例

以下展示三个不同色相方向的配色方案摘要，说明同一工作流可以产出截然不同的结果。

### 示例 A：翠绿方向

**输入**：开发者工具 / 极客科技 / 开发者

**诊断输出**：Tailwind · 冷色 · 中饱和 · AA · 参考方向：翠绿（Supabase）

| 角色 | 色阶 | oklch | 来源 |
|------|------|-------|------|
| 主色 | emerald-600 | oklch(0.56 0.155 163) | Tailwind |
| 辅色 | zinc-100 | oklch(0.93 0.003 106) | Tailwind |
| 强调色 | amber-500 | oklch(0.75 0.165 70) | Tailwind |
| 中性色 | zinc-500 | oklch(0.55 0.010 106) | Tailwind |
| 背景色 | zinc-50 | oklch(0.98 0.002 106) | Tailwind |

**完整 globals.css** → 见 [references/token-output.md](references/token-output.md) 第四节端到端示例。

### 示例 B：珊瑚暖红方向

**输入**：工具 / 效率 / 创意设计师

**诊断输出**：Tailwind · 暖色 · 中高饱和 · AA · 参考方向：珊瑚暖红（Raycast）

| 角色 | 色阶 | oklch | 来源 |
|------|------|-------|------|
| 主色 | rose-500 | oklch(0.64 0.200 15) | Tailwind |
| 辅色 | stone-100 | oklch(0.93 0.005 90) | Tailwind |
| 强调色 | cyan-500 | oklch(0.72 0.130 210) | Tailwind |
| 中性色 | stone-500 | oklch(0.55 0.010 90) | Tailwind |
| 背景色 | stone-50 | oklch(0.98 0.003 90) | Tailwind |

**关键 token（light）**：

```css
--background: oklch(0.98 0.003 90);    /* Tailwind stone-50 */
--foreground: oklch(0.17 0.008 90);    /* Tailwind stone-950 */
--primary: oklch(0.64 0.200 15);       /* Tailwind rose-500 */
--primary-foreground: oklch(1.00 0.000 0);
--accent: oklch(0.72 0.130 210);       /* Tailwind cyan-500 */
--accent-foreground: oklch(0.15 0.040 210);
--destructive: oklch(0.55 0.200 27);   /* Tailwind red-600 */
--destructive-foreground: oklch(0.97 0.013 17); /* Tailwind red-50 */
```

关键对比度：`--foreground` on `--background` = 15.8:1 (AAA)，`--primary` on `--background` = 4.6:1 (AA)

---

### 示例 C：无色相方向

**输入**：SaaS / 后台工具 / 克制高级 / B 端专业用户

**诊断输出**：Tailwind · 中性 · 极低饱和 · AAA · 参考方向：无色相（Vercel/Notion）

| 角色 | 色阶 | oklch | 来源 |
|------|------|-------|------|
| 主色 | zinc-900 | oklch(0.24 0.010 106) | Tailwind |
| 辅色 | zinc-100 | oklch(0.93 0.003 106) | Tailwind |
| 强调色 | blue-600 | oklch(0.55 0.200 245) | Tailwind |
| 中性色 | zinc-500 | oklch(0.55 0.010 106) | Tailwind |
| 背景色 | white | oklch(1.00 0.000 0) | — |

**关键 token（light）**：

```css
--background: oklch(1.00 0.000 0);     /* white */
--foreground: oklch(0.24 0.010 106);   /* Tailwind zinc-900 */
--primary: oklch(0.24 0.010 106);      /* Tailwind zinc-900 */
--primary-foreground: oklch(0.98 0.002 106); /* Tailwind zinc-50 */
--accent: oklch(0.55 0.200 245);       /* Tailwind blue-600 */
--accent-foreground: oklch(1.00 0.000 0);
--destructive: oklch(0.55 0.200 27);   /* Tailwind red-600 */
--destructive-foreground: oklch(0.97 0.013 17); /* Tailwind red-50 */
```

关键对比度：`--foreground` on `--background` = 16.2:1 (AAA)，`--accent` on `--background` = 5.8:1 (AA)

---

## VI. References 读取门禁

### 何时必须读取

1. 只输出配色方向（不落地 token）时：可不读取 [references/token-output.md](references/token-output.md)。
2. 输出 `globals.css`、设计 token、Dark Mode 变量映射时：必须读取 [references/token-output.md](references/token-output.md)。

### 最低读取量

涉及 token 落地时，至少提取以下内容并应用：
1. token 角色映射规则
2. dark mode 变量对位规则
3. 输出模板结构（含 `:root` 与 `.dark`）
