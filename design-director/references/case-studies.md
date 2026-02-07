# 案例分析

**Design Director 参考文档 — 真实产品的多风格编排拆解**

---

## Spotify 模型分析 (Expressive + Swiss)

**风格配比：** Expressive 70% + Swiss 30%

### 区域策略

| 区域 | 风格 | 特征 |
|------|------|------|
| Now Playing 全屏 | Expressive | 专辑封面作为英雄内容、暗色画布、氛围渐变从封面主色提取、进度条有弹性动效 |
| 曲库浏览 / 搜索 | Swiss | 网格化的专辑/播放列表卡片、高信息密度、快速功能性交互 |
| 播放列表详情 | Expressive → Swiss | 顶部有模糊渐变的 Hero 区域（Expressive），下方是精确的曲目列表（Swiss） |

### 接缝处理

- Now Playing ↔ Library 通过**路由/Tab 切换**实现硬截断（不在同一滚动流中）
- 播放列表详情页的 Hero → 曲目列表使用**渐变过渡**（背景渐变从封面色→中性暗色）

### 关键启示

- 同一应用中的两种风格通过**导航结构**（而非滚动流）分隔，降低了接缝设计难度
- Expressive 区域使用从内容（封面）提取的色彩，而非固定品牌色——这是 Expressive 风格的高级用法

---

## Linear 模型分析 (Minimal + Swiss)

**风格配比：** Swiss 60% (App) + Minimal 40% (Marketing)

### 区域策略

| 区域 | 风格 | 特征 |
|------|------|------|
| 营销站首页 | Minimal | 大排版 Hero、克制的渐隐揭示动效、40%+ 留白、单一紫色品牌色 |
| 应用 Dashboard | Swiss | Sidebar Shell、Issue 列表高密度表格、Keyboard-first 交互、<200ms 响应 |
| 应用设置 | Minimal-Swiss 混合 | 表单布局偏 Minimal（留白大），但组件风格跟 Swiss（直角、精密） |

### 接缝处理

- 营销站 → 应用通过**登录/注册流程**实现自然截断（上下文完全切换）
- 应用内部的 Dashboard → Settings 通过**路由切换**，无需视觉接缝

### 关键启示

- 营销站和应用**共享同一个品牌色和字体族**（Inter），确保品牌一致性
- Swiss 风格在应用中几乎是 100%——Settings 区域虽然留白更多，但仍使用 Swiss 的直角和精密排版
- 这是"两种风格通过产品架构天然分隔"的典型案例

---

## Apple 模型分析 (Expressive + Minimal)

**风格配比：** 按页面动态切换

- 产品页面（iPhone、Mac）：Expressive 90% + Minimal 10%
- 支持/文档页面：Minimal 100%
- Apple Store：Minimal 70% + Swiss 30%（产品对比区）

### 区域策略

| 页面类型 | 风格 | 特征 |
|----------|------|------|
| 产品 Hero | Expressive | 全屏视差滚动、产品 3D 渲染、影院级的 scroll-driven 动效、极暗背景 |
| 产品 Specs | Minimal → Swiss | 从大排版的功能介绍（Minimal）渐进到规格对比表格（Swiss） |
| Support | Minimal | 纯排版驱动、高留白、搜索优先 |

### 接缝处理

- 产品页内部：从影院级 Hero → 功能介绍使用**全屏截断 + 渐变过渡**的组合
- 产品页 → 支持页：通过**导航切换**，不在同一滚动流中
- Specs 区域的 Minimal → Swiss 数据对比：使用**内容换框**（表格有明确的边框容器）

### 关键启示

- Apple 的产品页是 Expressive 风格的巅峰——scroll-driven 动效、视差、3D 渲染
- 但同一个网站的支持页是完全的 Minimal——证明同一品牌下可以有极大的风格跨度
- 关键在于：**不同页面类型** = 不同上下文 = 用户自然接受风格变化

---

## 跨案例总结

| 维度 | Spotify | Linear | Apple |
|------|---------|--------|-------|
| 风格组合 | Expressive + Swiss | Minimal + Swiss | Expressive + Minimal (+ Swiss) |
| 分隔方式 | 路由/Tab 切换 | 产品架构（登录墙） | 页面类型 + 滚动流 |
| 接缝难度 | 低（导航分隔） | 低（架构分隔） | 高（同一页面内混合） |
| 共享基底 | 暗色主题、品牌色 | 字体族、品牌色 | 品牌色、设计语言 |
| Director 参考价值 | 应用内路由分区 | 营销/应用分离 | 同一页面多区域编排 |
