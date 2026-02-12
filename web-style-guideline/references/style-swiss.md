# 瑞士风格 (Neo-Swiss) 约束规范

## 设计哲学

1. **全面秩序：** CSS Grid (Subgrid) + Container Queries 实现跨层级绝对对齐。
2. **客观排版：** 字体是结构而非装饰。流体排版适应多设备。
3. **形式追随内容：** 网格适应内容，而非强迫内容适应网格。不承载信息的像素，删除。
4. **非对称动态：** 拒绝死板居中，左对齐 + 右侧留白创造视觉张力。

---

## 网格与间距 (8-Point Grid)

- **原子单位：** 8px (0.5rem)。所有间距必须是 8 的倍数
  - Scale: 8, 16, 24, 32, 40, 48, 64, 80px
  - 严禁非 8 倍数值（如 `p-[11px]`）
- **网格系统：** Desktop 12 Cols / Gap 24px / Margin 80px · Tablet 8 Cols / Gap 16px · Mobile 4 Cols / Gap 16px / Margin 16px
- **Subgrid：** 子组件继承父容器网格轨道，确保任意 DOM 深度下对齐到全局基线
- **Container Queries：** 组件根据自身容器宽度调整布局，非视口宽度
- **左对齐锯齿右边：** 正文一律左对齐，禁止 `text-align: justify`（河流效应）

---

## 几何构造

| 维度 | 规范 |
|------|------|
| **圆角** | `rounded-sm` (2px) 全局默认；高密度区域可 `rounded-none` |
| **边框** | 极细锋利，默认 1px；Modal/Popover 可 2px |
| **深度模型** | 禁用投影。Level 0: `bg-background` → Level 1: `border border-border` → Level 2: `border-2 border-border` 或高对比背景 |

---

## 排版体系

| 角色 | 规范 |
|------|------|
| **UI 字体** | `Inter` / `Geist` / `Roboto Flex`（首选可变字体） |
| **数据字体** | `JetBrains Mono` / `Geist Mono`（所有数字、ID、代码） |
| **Display (H1)** | `clamp(2.5rem, 5vw, 3.8rem)` tracking-tight |
| **Body** | `1rem` (16px) line-height 1.5 |
| **Label** | `0.75rem` (12px) uppercase, tracking-widest (0.05em+) |
| **Scale** | Major Third (1.250) 或 Perfect Fourth (1.333) |
| **图标** | SVG 纯描边或纯填充，无渐变，无 3D |

---

## 色彩原则

- 色彩仅用于关键交互 (Action) 或状态指示 (Status)，禁止装饰性色块
- 品牌色用于 Primary Action，红色仅用于 Error/Destructive
- 暗色模式强调色必须亮度提升以满足 WCAG AA 4.5:1

---

## 暗色模式深度策略

亮色模式下 Swiss 用边框粗细区分层次，但暗色环境下线条的信息承载能力衰减——`oklch(0.269)` 边框在 `oklch(0.145)` 背景上对比度仅约 1.5:1，视觉上几乎消失。这是物理现实：暗色下线条（边框）可辨性下降，面（背景色）的区分能力增强。

因此 Swiss 暗色模式采用**边框 + 亮度层级双轨制**——保留边框维持 Swiss 的结构身份，同时引入背景色差辅助层次感知。这也是 Linear、Vercel Dashboard、GitHub 等暗色 Swiss 产品的共同做法。

| Level | 亮色模式 | 暗色模式 |
|-------|----------|----------|
| Level 0 (Base) | `bg-background` | `bg-background` · `oklch(0.145 0 0)` |
| Level 1 (Group) | `border border-border` | `border border-border` + `bg-card` · `oklch(0.205 0 0)` |
| Level 2 (Overlay) | `border-2 border-border` | `border border-border` + `bg-popover` · `oklch(0.269 0 0)` |

- 亮色下边框是唯一深度手段（纯 Swiss）；暗色下边框 + 背景色差协同工作
- 暗色 Level 2 边框降回 1px——背景色差已提供足够区分，2px 边框在暗色下显得过重
- 严禁 `box-shadow`，暗色模式同样适用

---

## 视觉模式

| 模式 | 核心约束 |
|------|----------|
| **侧边栏 Shell** | 固定宽度 `w-64 border-r`，活跃项 `border-l-2 border-primary`，Mobile 收起为抽屉 |
| **指标卡片网格** | `grid-cols-2 md:grid-cols-4`，指标 `font-mono text-3xl font-bold`，Label `text-xs uppercase tracking-widest` |
| **数据表格** | 表头 `text-xs uppercase tracking-widest`，数值列 `font-mono text-right`，排序用几何三角形 |
| **图表容器** | `border rounded-none p-6`，标题 `font-mono text-sm uppercase tracking-widest` |

---

## 动效常量

```ts
const neoSwiss    = { duration: 0.2, ease: [0.16, 1, 0.3, 1] };  // 微交互
const tableRow    = { duration: 0.15, ease: [0.16, 1, 0.3, 1] }; // 表格行入场
const dataReveal  = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };  // 数据加载揭示
const sectionTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] }; // 区块过渡
```

- 表格/列表 stagger: `0.03s`，卡片网格 stagger: `0.06s`
- 入场位移: `y: 4` — 克制、精确

---

## 质量标杆

好的 Swiss 界面像一份精心排版的报纸——每个元素的位置都有理由，信息层级一眼可辨，数据在网格中呼吸而非被挤压。Linear 的 issue 列表是标杆：Mono 数字创造节奏，`tracking-widest` Label 是安静的锚点，整体克制但不冷漠。

---

## 品味陷阱

- **棋盘格综合症**：8pt Grid 不是要你把界面变成 Excel——网格是约束，不是监狱。有意识地用不等间距创造呼吸感
- **Mono 滥用**：数据字体只用于数字/ID/代码，正文用 Mono 是在惩罚读者
- **大写标签泛滥**：`uppercase tracking-widest` Label 是导航锚点，不是每段文字的帽子
- **零投影 ≠ 零深度**：禁用 `box-shadow` 不意味着界面是平的——边框粗细和背景色层级就是你的深度工具
