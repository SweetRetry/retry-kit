# Blueprint Examples

## Example 1: SaaS Landing Page

**User request**: "做一个 AI 写作工具的落地页"

### Output

```
## Page: Landing — AI Writing Tool (Desktop 1440)

- Header [row, space-between]
  - Logo
  - Nav [row] → "功能" "定价" "博客"
  - CTA → "免费试用"

- Hero [col, center]
  - Badge → "🚀 全新上线"
  - H1 → "用 AI 让写作提速 10 倍"
  - Subtitle → "从初稿到终稿，AI 全程协助你完成高质量内容创作"
  - CTA Group [row]
    - Primary Button → "免费开始"
    - Ghost Button → "观看演示"
  - Hero Image [product screenshot]

- Social Proof [row, center]
  - Logo Strip [row] → 5× partner logos
  - Caption → "已被 2000+ 团队信赖"

- Features [col]
  - Section Header
    - Label → "核心功能"
    - H2 → "写作的每一步，AI 都能帮你"
  - Feature Grid [grid:3]
    - Card × 3 [icon + title + desc]
      - "智能续写" / "一键润色" / "多语言翻译"

- How It Works [col]
  - H2 → "三步开始"
  - Steps [row:3]
    - Step × 3 [number + title + desc]
      - "1. 输入主题" / "2. AI 生成初稿" / "3. 编辑发布"

- Testimonials [col]
  - H2 → "用户怎么说"
  - Cards [grid:3]
    - Testimonial × 3 [avatar + quote + name + role]

- Pricing [col]
  - H2 → "简单透明的定价"
  - Cards [row:3]
    - Plan × 3 [name + price + features + CTA]
      - "免费版" / "专业版" / "团队版"

- CTA Banner [col, center]
  - H2 → "准备好提升写作效率了吗？"
  - Button → "免费试用 14 天"

- Footer [col]
  - Links [row:4 columns] → 产品 / 资源 / 公司 / 法律
  - Bottom [row, space-between] → © 2026 / Social Icons
```

---

## Example 2: Dashboard

**User request**: "设计一个数据分析 Dashboard"

### Output

```
## Screen: Analytics Dashboard (Desktop 1440×900)

- Sidebar [col, w:240, fixed-left]
  - Logo [compact]
  - Nav Group "概览"
    - NavItem → icon:home "仪表盘" [active]
    - NavItem → icon:chart "分析"
    - NavItem → icon:users "用户"
  - Nav Group "设置"
    - NavItem → icon:gear "配置"
  - Bottom
    - User Avatar + Name + "设置"

- Main [col, flex:1]
  - Top Bar [row, space-between, h:56]
    - Breadcrumb → "仪表盘"
    - Actions [row]
      - Date Picker → "最近 7 天"
      - Button → "导出"

  - Stats Row [row:4, equal-width]
    - Stat Card × 4 [label + value + trend]
      - "总用户 12,345 ↑12%"
      - "活跃用户 8,901 ↑8%"
      - "收入 ¥234K ↑23%"
      - "转化率 3.2% ↓0.5%"

  - Charts Row [row:2]
    - Line Chart [flex:2]
      - Title → "用户增长趋势"
      - Chart [7-day line]
    - Pie Chart [flex:1]
      - Title → "用户来源分布"
      - Chart [4 segments]

  - Table Section [col]
    - Header [row, space-between]
      - Title → "最近活动"
      - Filter [row] → Search + Dropdown
    - Table [cols: 用户 / 行为 / 时间 / 状态]
      - Row × 5
    - Pagination [row, end]
```

---

## Example 3: Mobile App

**User request**: "设计一个外卖 App 的首页"

### Output

```
## Screen: Home — Food Delivery (Mobile 390×844)

- Status Bar [system]

- Search Bar [row, sticky-top]
  - Location → icon:pin "朝阳区 望京SOHO"
  - Search Input → "搜索餐厅或菜品"

- Banner Carousel [horizontal-scroll]
  - Banner × 3 [image + overlay-text]
    - "新用户首单减 15" / "午间特惠" / "免配送费"

- Category Grid [grid:5×2, scrollable]
  - Category × 10 [icon + label]
    - "美食" "奶茶" "快餐" "火锅" "甜品"
    - "水果" "鲜花" "超市" "药店" "跑腿"

- Section: 限时特惠 [col]
  - Header [row, space-between]
    - Title → "限时特惠 ⏰"
    - Link → "查看全部"
  - Horizontal List [scroll]
    - Deal Card × 4 [image + restaurant + discount + rating]

- Section: 推荐商家 [col]
  - Header → "为你推荐"
  - Restaurant List [col]
    - Restaurant Card × N [image + name + tags + rating + distance + delivery-time]
      - "海底捞 / 火锅 / ⭐4.8 / 2.3km / 35min"
      - "瑞幸咖啡 / 咖啡 / ⭐4.6 / 0.8km / 15min"

- Bottom Tab Bar [row:5, fixed-bottom]
  - Tab × 5 [icon + label]
    - "首页" [active] / "搜索" / "订单" / "消息" / "我的"
```

---

## Example 4: Form Page

**User request**: "设计一个多步骤注册表单"

### Output

```
## Flow: Registration (Desktop 960, centered)

### Screen 1/3: 基本信息
- Progress Bar [step:1/3] → "基本信息" > 公司信息 > 完成
- Form Card [col, max-w:480, center]
  - H2 → "创建你的账户"
  - Subtitle → "只需 3 步，1 分钟完成"
  - Fields [col]
    - Input → "姓名" [required]
    - Input → "邮箱" [required, type:email]
    - Input → "密码" [required, type:password, hint:"至少 8 位"]
  - Checkbox → "我同意服务条款和隐私政策"
  - Button → "下一步" [primary, full-width]
  - Divider → "或"
  - Social Login [row]
    - Button → icon:google "Google 登录"
    - Button → icon:github "GitHub 登录"
  - Footer → "已有账户？登录"

### Screen 2/3: 公司信息
- Progress Bar [step:2/3]
- Form Card [col, max-w:480, center]
  - H2 → "公司信息"
  - Fields [col]
    - Input → "公司名称" [required]
    - Select → "公司规模" [1-10 / 11-50 / 51-200 / 200+]
    - Select → "行业" [科技 / 金融 / 教育 / 其他]
    - Input → "职位" [optional]
  - Actions [row, space-between]
    - Button → "上一步" [ghost]
    - Button → "下一步" [primary]

### Screen 3/3: 完成
- Success Card [col, center, max-w:480]
  - Icon → ✅ (large)
  - H2 → "注册成功！"
  - Subtitle → "欢迎加入，我们已向你的邮箱发送确认信"
  - Button → "进入控制台" [primary]
  - Link → "稍后设置，先看看文档"
```
