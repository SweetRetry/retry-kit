---
name: landing-page-design
description: >
  互联网产品落地页 (Landing Page) 设计与实现规范。覆盖转化驱动的页面架构、功能介绍叙事、
  视觉布局、交互动效、社会证明、表单优化与性能基线。强制使用 shadcn/ui + Tailwind CSS + Framer Motion。
  使用场景：(1) 用户要求构建产品落地页、营销页、注册页，(2) 审查落地页代码是否符合转化优化规范，
  (3) 用户提到"Landing Page"、"落地页"、"转化率"、"Hero Section"、"CTA"、"功能介绍"等关键词，
  (4) 需要将产品功能转化为面向用户的利益叙事时。
---

# Landing Page Design — 转化驱动的落地页设计规范

## 快速参考

| 维度 | 规范 |
|------|------|
| **技术栈** | shadcn/ui + Tailwind CSS + Framer Motion |
| **核心目标** | 单一 CTA 转化率最大化 |
| **首屏法则** | 5 秒内回答：这是什么？给谁用？为什么关心？ |
| **视觉扫描** | 短页 Z 模式 / 长页 F 模式 / 功能汇总 Bento Grid |
| **文案策略** | 特性 → 直接利益 → 终极利益（"So what?" 三级跳） |
| **性能基线** | LCP < 2.5s · CLS < 0.1 · INP < 200ms |
| **移动端** | tap target ≥ 44×44px · 吸底 CTA · 数字键盘适配 |

## 核心指令

构建落地页时，遵循以下优先级：

1. **转化优先** — 每个设计决策服务于单一 CTA 的转化目标
2. **认知减负** — 利用视觉层次与留白降低用户认知负荷
3. **利益叙事** — 永远展示用户能得到什么，而非产品拥有什么
4. **信任构建** — 通过社会证明金字塔跨越信任鸿沟
5. **性能即转化** — 加载每延迟 0.1s，转化率下降 8%–10%

---

## 一、页面架构：Section 蓝图

落地页是一条线性叙事通道。每个 Section 承担明确的心理任务，按以下顺序编排：

| # | Section | 心理任务 | 必须包含 |
|---|---------|---------|---------|
| 1 | **Nav Bar** | 品牌锚定 + 导航安全感 | Logo · 极简导航（≤5 项）· 主 CTA 按钮 |
| 2 | **Hero** | 5 秒价值传递 | 结果导向标题 · 副标题（1 句利益承诺）· 主 CTA · 视觉主体（截图/动画/视频） |
| 3 | **Social Proof Bar** | 即时信誉 | Logo 墙（≥5 个知名客户）或关键数据指标（用户数/评分/增长率） |
| 4 | **Pain → Solution** | 痛点共鸣 + 方案呈现 | 2–3 个痛点描述 → 产品如何解决（对比式或叙事式） |
| 5 | **Features / Benefits** | 功能价值传递 | 3–6 个功能卡片，每个遵循「特性 → 利益 → 终极利益」三级跳 |
| 6 | **How It Works** | 降低复杂度认知 | 3–4 步流程图（编号 + 图标 + 简述） |
| 7 | **Testimonials** | 深度信任 | 带头像/公司/职位的具体证言，含量化成效 |
| 8 | **Pricing / CTA** | 决策推动 | 定价卡片或最终 CTA 区块 · 风险消除（免费试用/无需信用卡） |
| 9 | **FAQ** | 异议消除 | 5–8 个高频问题，使用 Accordion 组件 |
| 10 | **Footer** | 信息兜底 | 次要链接 · 法律信息 · 社交媒体 |

> **原则：** 不是每个落地页都需要全部 10 个 Section。根据产品阶段和目标裁剪，但 Hero + CTA 是不可省略的最小集。

## 二、Hero Section：黄金 5 秒

Hero 是整个落地页的成败关键。用户在 5 秒内决定去留。

### 标题公式

| 类型 | 模板 | 示例 |
|------|------|------|
| **结果导向**（首选） | "通过 [产品] 实现 [量化结果]" | "通过 Acme 将部署时间从 3 天缩短到 15 分钟" |
| **痛点唤起** | "不再 [具体痛苦]" | "不再因手动对账浪费每周 10 小时" |
| **利益承诺** | "[动词] + [终极利益]" | "让你的团队专注于创造，而非重复劳动" |

> **禁止：** "最先进的 XX 平台"、"一站式 XX 解决方案" 等空洞陈述。

### 视觉主体选择

| 类型 | 适用场景 | 实现方式 |
|------|---------|---------|
| **产品截图** | UI 型 SaaS，界面即卖点 | 带 `shadow-2xl` + `rounded-xl` 的浮动截图，轻微 3D 透视 |
| **短视频/动画** | 工作流型产品，需展示操作过程 | `<video autoPlay muted loop playsInline>` ≤ 15s，WebM + MP4 双格式 |
| **抽象插画** | 概念型产品，无明确 UI | Framer Motion 动态插画，避免通用素材库图片 |
| **交互演示** | 复杂 SaaS，"先试后买"策略 | 嵌入式 iframe 或 HTML 克隆演示 |

### Hero 布局参考

```tsx
// Z 模式布局：左文右图，视线终点落在 CTA
<section className="relative overflow-hidden py-24 lg:py-32">
  <div className="container mx-auto grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
    {/* 左侧：文案区 */}
    <div className="flex flex-col gap-6">
      <Badge variant="secondary">🚀 刚刚发布 v3.0</Badge>
      <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
        {/* 结果导向标题 */}
      </h1>
      <p className="text-lg text-muted-foreground max-w-[540px]">
        {/* 1 句利益副标题 */}
      </p>
      <div className="flex gap-3">
        <Button size="lg">免费开始</Button>
        <Button size="lg" variant="outline">观看演示</Button>
      </div>
    </div>
    {/* 右侧：视觉主体 */}
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 产品截图 / 视频 / 动画 */}
    </motion.div>
  </div>
</section>
```

## 三、CTA 设计：转化的终点

### CTA 按钮规范

| 属性 | 规范 |
|------|------|
| **主 CTA** | `Button size="lg"` · 高对比色（与背景形成 ≥ 4.5:1 对比度）· 动词开头 |
| **辅助 CTA** | `Button variant="outline" size="lg"` · 低承诺动作（观看演示/了解更多） |
| **文案** | 动词 + 利益，非"提交"/"注册"。如："免费开始"、"获取我的报告"、"立即体验" |
| **风险消除** | CTA 下方添加微文案：`text-xs text-muted-foreground`，如"无需信用卡 · 14 天免费" |
| **悬停反馈** | `scale: 1.02` + `shadow` 提升，过渡 `duration: 0.2s` |

### CTA 放置策略

- **首屏**：Hero 区主 CTA（必须）
- **页面中部**：Features 或 Testimonials 后重复 CTA
- **页面底部**：最终 CTA 区块（全宽背景 + 居中文案 + 按钮）
- **移动端**：吸底悬浮 CTA（`fixed bottom-0` + `backdrop-blur`），滚动超过 Hero 后显示

```tsx
// 吸底 CTA（移动端）
<motion.div
  className="fixed bottom-0 inset-x-0 z-50 p-4 bg-background/80 backdrop-blur-lg border-t lg:hidden"
  initial={{ y: 100 }}
  animate={{ y: showSticky ? 0 : 100 }}
  transition={{ ease: [0.16, 1, 0.3, 1] }}
>
  <Button className="w-full" size="lg">免费开始</Button>
</motion.div>
```

## 四、文案策略：从特性到终极利益

### "So What?" 三级跳

每个功能描述必须完成三次转化：

```
物理特性 → "那又怎样？" → 直接利益 → "那又怎样？" → 终极利益
```

| 层级 | 示例（AI 代码编辑器） | 写法 |
|------|----------------------|------|
| **特性**（禁止停留于此） | "实时上下文感知功能" | 技术描述 |
| **直接利益** | "根据整个代码库生成精准建议" | 用户能做什么 |
| **终极利益**（目标） | "以两倍速交付产品，告别深夜加班" | 用户生活如何改变 |

### 标题层级规范

| 元素 | 字号 | 样式 |
|------|------|------|
| **Hero H1** | `text-4xl lg:text-6xl` | `font-bold tracking-tight` |
| **Section H2** | `text-3xl lg:text-4xl` | `font-bold` · 居中 · 上方可加 Badge 标签 |
| **Feature 标题** | `text-xl` | `font-semibold` |
| **Feature 描述** | `text-base` | `text-muted-foreground` · ≤ 2 行 |

## 五、视觉布局模式

| 模式 | 适用场景 | 要点 |
|------|---------|------|
| **Bento Grid** | 功能汇总（3–6 个） | 卡片尺寸编码优先级，主功能跨 2 列，`gap-4` · `rounded-xl` · `p-6` |
| **Feature Zigzag** | 逐个深入介绍（3–4 个） | 左图右文交替排列，用 `direction:rtl` 实现翻转 |
| **Icon Grid** | 轻量功能列表（6+） | 等宽 3 列网格，图标 + 标题 + 1 句利益描述 |

## 六、社会证明金字塔

分层展示信任信号，应对用户在不同滚动深度的疑虑：

| 层级 | 位置 | 内容 | 组件 |
|------|------|------|------|
| **即时信誉** | Hero 下方 | Logo 墙（≥5 个知名客户）或数据指标 | 灰度 Logo 横排，hover 恢复彩色 |
| **具体成效** | 页面中部 | 带量化数据的客户证言 | `Card` + 头像 + 姓名/职位/公司 |
| **权威认证** | CTA 附近 | 安全证书 / G2 评分 / 媒体评论 | 小图标行 + `text-muted-foreground` |

## 七、动效规范：节制的运动学

动效服务于信息释放节奏，不是装饰。统一缓动 `ease: [0.16, 1, 0.3, 1]`（Expo Out），`duration ≤ 0.8s`。

| 类型 | 用途 | 要点 |
|------|------|------|
| **Fade Up** | Section 入场 | `initial={{ opacity: 0, y: 24 }}` · `whileInView` + `viewport={{ once: true }}` |
| **Stagger** | 列表/卡片组 | `delay: i * 0.1` · 父容器触发 |
| **Scale** | CTA hover | `whileHover={{ scale: 1.02 }}` |
| **Counter** | 数据指标 | `useMotionValue` + `useTransform` · 滚动触发 |

**禁止：** 首屏用 `whileInView`（应直接 `animate`）· 移动端 parallax · 纯装饰动画 · 忽略 `prefers-reduced-motion`

## 八、表单与注册流程：消灭摩擦力

表单是转化的最后关卡，也是摩擦力最集中的地方。核心法则：**减少字段，减少，再减少。**

### 低摩擦注册策略

| 节点 | 高摩擦（禁止） | 低摩擦（目标） |
|------|---------------|---------------|
| **入口文案** | "注册后开始试用" | "免费开始（无需信用卡）" |
| **表单长度** | 11+ 字段 | 1 个邮箱 + SSO 选项 |
| **邮箱验证** | 提交后强制跳出查收邮件 | 允许先登录，异步验证 |
| **信用卡** | 必须绑卡才能试用 | 试用期结束后再绑定 |

### 表单实现规范

- 使用 shadcn/ui `Input` + `Button` 组件，禁止自定义表单控件
- 内联实时验证：输入错误时即时反馈，不等提交后报错
- 移动端：输入电话号码时 `inputMode="numeric"` 呼起数字键盘
- 渐进式分析：长表单拆分为多步，每步 1–2 个字段
- 所有 tap target ≥ 44×44px

## 九、性能与响应式

遵循 Core Web Vitals 基线（LCP < 2.5s · CLS < 0.1 · INP < 200ms）。Hero 主图 `loading="eager"`，其余 `lazy`，格式优先 AVIF > WebP。语义化 HTML（唯一 `<h1>`、`<main>`/`<section>`/`<footer>`），提供 JSON-LD 结构化数据。

Mobile-First 设计：移动端单列堆叠 + 吸底 CTA + 折叠导航。Logo 墙移动端用横向 marquee，Bento Grid 退化为单列。

## 十、审查清单

| 维度 | 检查项 |
|------|--------|
| **转化** | 单一主 CTA 目标 · Hero 5 秒传递价值 · CTA 动词+利益文案 · 风险消除微文案 · ≥3 处 CTA 放置 |
| **文案** | 功能描述完成三级跳 · 无空洞陈述 · 标题用结果导向/痛点唤起公式 |
| **视觉** | shadcn/ui 组件 · Tailwind 语义 Token · H1>H2>H3 递减 · Section 间距 `py-16 lg:py-24` |
| **动效** | 统一 `ease: [0.16,1,0.3,1]` · 首屏 `animate` · `duration ≤ 0.8s` · `viewport={{ once: true }}` · `prefers-reduced-motion` |
| **性能** | Core Web Vitals 达标 · Hero 图 `eager` · 图片预设尺寸 · 唯一 `<h1>` · 语义化 HTML |
| **响应式** | 移动端单列无溢出 · 吸底 CTA · tap target ≥ 44px |

## 十一、反模式检测

| 反模式 | 症状 | 修正 |
|--------|------|------|
| **多 CTA 竞争** | 页面有 2+ 个不同目标的主 CTA | 保留 1 个主 CTA，其余降级为 `variant="outline"` 或移除 |
| **特性堆砌** | 功能描述停留在技术术语层面 | 对每个特性执行"So what?"三级跳 |
| **空洞标题** | "最先进的 XX 平台" | 替换为结果导向或痛点唤起公式 |
| **信任真空** | 无任何社会证明元素 | 至少添加 Logo 墙或数据指标 |
| **表单过长** | 首次注册要求 5+ 字段 | 缩减至邮箱 + SSO，渐进式收集 |
| **动效过度** | 每个元素都有入场动画 | 只保留 Section 级 Fade Up + CTA hover |
| **导航泄露** | Nav 包含大量外链分散注意力 | 落地页导航 ≤ 5 项，移除非必要外链 |
| **硬编码样式** | 内联 `style` 或硬编码 Hex 色值 | 使用 Tailwind 语义 Token |
