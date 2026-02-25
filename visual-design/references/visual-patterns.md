# 视觉模式库

具体的构图模式和参数。当你需要决定一个页面/区域怎么排布时，从这里选。

---

## Hero 变体

每个页面只有一个 Hero。根据产品类型选择变体。

### A. 居中大标题型

```
[宽松留白 py-24~32]
    内容区 max-w-4xl mx-auto
        居中 H1 (text-6xl~7xl tracking-tight)
        副标题 (text-lg~xl text-muted-foreground, max-w-2xl mx-auto)
        CTA 按钮组 (1 primary lg + 1 ghost/outline)
[宽松留白]
```

- 适合：SaaS 落地页、品牌页
- 内容区宽度：`max-w-4xl`（896px）
- H1 和副标题间距 `gap-4~6`，副标题和 CTA 间距 `gap-8~10`
- 背景：纯色 或 极淡渐变（`bg-gradient-to-b from-muted/50`）
- 移动端：H1 降至 `text-3xl~4xl`，CTA 按钮组改为垂直堆叠 `flex-col`

### B. 左文右图型

```
[py-20~24]
    容器 max-w-6xl mx-auto
        grid grid-cols-1 lg:grid-cols-2 gap-12~16
            左: H1 + 副标题 + CTA (左对齐, max-w-lg)
            右: 产品截图/插图 (圆角, 可加极淡 shadow)
```

- 适合：产品展示、功能介绍页
- 容器宽度：`max-w-6xl`（1152px）
- 图片区域 aspect-ratio 约 4:3 或 16:10
- 移动端：改为上下堆叠（`grid-cols-1`），图片在文字下方

### C. 全屏沉浸型

```
[min-h-screen 深色背景]
    居中内容 (max-w-4xl mx-auto)
    H1 (text-7xl~8xl font-light tracking-tight text-white)
    背景: 暗色渐变 / 产品渲染图 / 视频
```

- 适合：品牌宣言、发布页
- 内容区宽度：`max-w-4xl`（896px）
- 文字用 `font-light` 或 `font-extralight`，大+轻 产生张力
- 背景图/视频需要叠加 `bg-black/60` 保证文字对比度
- 移动端：H1 降至 `text-4xl~5xl`，`min-h-[80vh]` 代替 `min-h-screen`

### D. 数据驱动型

```
[py-16~20 bg-muted/30]
    容器 max-w-6xl mx-auto
        H1 (text-4xl~5xl font-bold)
        3~4 个指标卡片 (grid grid-cols-2 md:grid-cols-4 gap-4)
            数字: text-3xl font-mono font-bold
            Label: text-xs uppercase tracking-widest text-muted-foreground
```

- 适合：Dashboard 首页、SaaS 概览页
- 容器宽度：`max-w-6xl`（1152px）；Dashboard 内嵌时用 `flex-1` 无 max-width
- 指标卡片不加 border，用 `bg-card` 区分
- 移动端：`grid-cols-2` 保持，卡片内数字可降至 `text-2xl`

---

## Feature Section 变体

展示产品功能时，**相邻 section 必须用不同构图**。禁止连续 3 个结构相同的 section。

### 交替布局

```
容器 max-w-5xl mx-auto
    Section 1: 左文右图 (图右)
    Section 2: 右文左图 (图左) ← 镜像
    Section 3: 居中图 + 下方描述 ← 换构图
```

- 移动端：所有左右布局变为上下堆叠，镜像消失，统一"文字在上 → 图在下"

### Bento Grid

```
容器 max-w-5xl mx-auto
    grid grid-cols-2 md:grid-cols-3 gap-4~6
        主卡 (col-span-2, 面积 ≥ 2x 其他卡)
        副卡 × 2~4 (等大)
```

- 容器宽度：`max-w-5xl`（1024px）
- 主卡必须有，面积至少是副卡的 2 倍
- 卡片内部：图标/插图 + 标题(H3) + 1~2 行描述
- 容器：`bg-card rounded-{全局值}` 或 `bg-muted`，不加 `shadow`
- 移动端：`grid-cols-1`，主卡和副卡等宽垂直堆叠

### 单栏大图

```
[py-20~24]
    居中 H2 + 描述 (max-w-2xl mx-auto text-center)
    [mt-12~16]
    全宽截图/Demo (max-w-5xl mx-auto, rounded-{全局值}, border)
```

- 截图/Demo 是视觉焦点，文字是引导
- 截图下方可加 `bg-gradient-to-t from-background` 渐隐效果
- 移动端：截图保持 `max-w-full`，自然缩放

---

## Dashboard Shell

SaaS 应用的基础布局结构。

```
[全屏]
    sidebar (w-60~64, border-r, bg-card)
        Logo (h-14~16, border-b, px-4)
        Nav items (py-1.5 px-3, text-sm, rounded-{全局值})
        底部: User menu
    main (flex-1)
        topbar (h-14~16, border-b, px-6)
            Breadcrumb / 页面标题
            右: Actions / User avatar
        content (p-6~8)
            页面内容
```

- Sidebar 和 Topbar 用 `border` 分隔（方案 A）或 `bg-card` vs `bg-background`（方案 C）
- Active nav item: `bg-muted` + `font-medium`，不要加品牌色背景
- Sidebar 可折叠：折叠时 `w-14~16`，只显示图标
- 移动端：Sidebar 隐藏，用 bottom tab bar 或 hamburger 菜单替代（见 [layout-and-responsive.md](layout-and-responsive.md)）

---

## 数据展示

### 指标卡片组

```
grid grid-cols-2 md:grid-cols-4 gap-4
    卡片:
        Label (text-xs uppercase tracking-widest text-muted-foreground)
        数字 (text-2xl~3xl font-mono font-bold mt-1)
        趋势 (text-xs text-green-* 或 text-red-*, mt-1)
```

- 卡片用 `bg-card rounded-{全局值}`
- 不加 `shadow`，可加 `border` 如果深度方案是 A

### 数据表格

- 表头：`text-xs uppercase tracking-wider text-muted-foreground font-medium`
- 行高：`h-12~14`（紧凑）或 `h-14~16`（标准）
- 斑马纹用 `bg-muted/50`，不用 `border-b`（二选一，不叠加）
- 数字列：`font-mono text-right`

---

## 设置页

```
max-w-2xl mx-auto py-8~12
    页面标题 (H2)
    Section 分组:
        Section 标题 (H3 + text-muted-foreground 描述)
        [mt-4~6]
        表单字段 (flex flex-col gap-4~6)
            Label (text-sm font-medium) + Input
        [mt-6~8]
        Divider (border-t) 或 留白
    底部: Save 按钮 (sticky 或 固定在底部)
```

- 设置页是高密度场景，用紧凑间距
- 每个 Section 用 `border-t` 或 `gap-8+` 分隔
- 输入框宽度统一，不要有 3 种不同宽度

---

## 空状态

```
[py-16~24 flex items-center justify-center]
    居中容器 (max-w-sm text-center)
        插图/图标 (w-16~20 h-16~20 text-muted-foreground/50)
        标题 (text-lg font-medium mt-4)
        描述 (text-sm text-muted-foreground mt-2)
        CTA 按钮 (mt-6)
```

- 图标用 `text-muted-foreground` 降低存在感
- 整体视觉权重要低——空状态不是焦点，引导用户操作才是

---

## 模式选择规则

1. **先看产品类型**：SaaS Dashboard → Dashboard Shell + 数据展示；落地页 → Hero + Feature Section
2. **相邻区域用不同构图**：禁止连续 3 个相同结构的 section
3. **一个页面一个视觉高潮**：通常是 Hero 或主 CTA 区域
4. **密度交替**：密集区后跟低密度区（参考 SKILL.md §IV）
