# 视觉结构模式库（执行版）

用于在 `Elevate` / `Forge` 中快速选择页面构图。`Elevate` 默认做结构重排，不输出模板化保守布局。

---

## 选择矩阵

| 页面类型 | Preserve | Elevate | Forge |
|---------|--------|---------|---------|
| Dashboard / Workbench | 保持现有壳层 | 优先 `Dashboard Shell` + `Data Hero` + `Zig-Zag` 信息区 | 可加局部品牌区，但主工作区不重排 |
| Landing / Marketing | 保持已有骨架 | `Split Hero` + 1 个差异化 Feature 结构 | 可用 `Immersive Hero` + 节奏化 Section |
| Settings / Form | 维持单栏可读性 | 优化分组和层级 | 不建议重技法 |
| Empty State / Onboarding | 保守引导 | 允许轻品牌语气 | 可增强首屏记忆点 |

---

## 风格签名到构图映射

| 风格签名 | Hero 首选 | Feature 首选 | 禁止项 |
|---------|----------|--------------|-------|
| `Precision Editorial` | `Split Hero` / `Data Hero` | `Zig-Zag` | 大面积炫光与重材质叠加 |
| `Cinematic Minimal` | `Immersive Hero` | `Single Visual` + 节奏段落 | 多焦点并列 CTA |
| `Neo-Modern Brutal` | `Split Hero`（硬分割） | `Bento`（硬边界） | 软糯圆角与弱对比 |
| `Soft Tech Luxury` | `Split Hero`（柔层次） | `Bento` + 局部沉浸区 | 全页纯平无材质变化 |

---

## Hero 模式

### 1) Split Hero（默认推荐）

```txt
[左侧] 标题 + 描述 + 主 CTA
[右侧] 产品图/示意图
```

适用：大多数产品介绍页、功能介绍页  
回退：移动端改单列，媒体内容下沉

### 2) Data Hero（Tool）

```txt
[标题/筛选]
[3-4 个核心指标卡]
```

适用：仪表盘首页、运营看板  
回退：指标卡过多时拆为两行，保持可读性

### 3) Immersive Hero（Brand）

```txt
[强视觉背景]
[单一主叙事 + 单一主 CTA]
```

适用：品牌页、发布页  
风险：信息密度过低导致转化弱  
回退：增加辅助描述和次级证据区

---

## Feature Section 模式

### 1) Zig-Zag（交替左右）

```txt
Section1: 文左图右
Section2: 图左文右
Section3: 统一收束（居中或单栏）
```

适用：连续介绍 3+ 功能点  
回退：内容过短时直接改单栏列表

### 2) Bento（主次分明）

```txt
[主卡(2x)] [副卡]
[副卡]     [副卡]
```

适用：功能信息密度不均  
回退：改为两列网格，移除跨行主卡

### 3) Single Visual（单视觉焦点）

```txt
标题 + 描述
单张主视觉/演示区
```

适用：一个核心卖点需要被放大  
回退：缩小视觉区，补充要点列表

---

## 应用页模式

### Dashboard Shell

```txt
[Sidebar] [Main]
Main: Topbar + Content
```

建议：边界层次用一种主方法（边框或底色差）

### Settings Stack

```txt
标题
分组1（字段）
分组2（字段）
底部操作区
```

建议：优先可读性与操作稳定，不引入重动效

### Empty State

```txt
图标/插图
标题
说明
唯一主 CTA
```

建议：视觉弱化，动作清晰化

---

## 输出模板（选型时使用）

```md
结构选型：<Hero/Feature/App pattern>
原因：<该结构解决的问题>
变更：
1. <before layout/class> -> <after layout/class>
2. <before layout/class> -> <after layout/class>

回退：
- 条件：...
- 方案：...
```

---

## 反保守检查

若是新页面或用户要求“高级感/重做”，输出前必须满足：

1. 至少 1 处明显构图变化
2. 至少 1 处清晰视觉焦点
3. 移动端有可读性回退
