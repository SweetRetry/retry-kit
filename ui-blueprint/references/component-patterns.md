# Component-Level Blueprint Patterns

High-frequency UI patterns with standardized Blueprint notation. Use these as building blocks when assembling screen-level blueprints.

---

## Empty State

Use when a list, table, or data view has no content to display.

### Variants

**First-use empty state** (user hasn't created anything yet)
```
- Empty State [col, center]
  - Illustration → icon or image placeholder
  - Title → "还没有项目"
  - Body → "创建你的第一个项目，开始协作"
  - Button [primary] → "新建项目"
```

**No-results empty state** (search/filter returned nothing)
```
- Empty State [col, center]
  - Icon → icon:search-off
  - Title → "没有找到匹配结果"
  - Body → "试试调整筛选条件或关键词"
  - Link → "清除所有筛选"
```

**Error empty state** (data failed to load)
```
- Empty State [col, center]
  - Icon → icon:alert-circle
  - Title → "加载失败"
  - Body → "网络异常，请稍后重试"
  - Button [ghost] → "重新加载"
```

---

## Skeleton / Loading Placeholder

Use when async data is being fetched. Mirror the **shape** of the actual content — not the exact dimensions.

**When to use Skeleton vs Spinner vs no placeholder:**

| Scenario | Recommendation |
|----------|---------------|
| Known layout shape (list, table, card) | Skeleton — preserves layout, prevents shift |
| Unknown layout or short wait (< 300ms) | Spinner or nothing |
| Full-page transition | Spinner centered in main area |

**Card skeleton**
```
- Skeleton Card [col] [loading]
  - Skeleton Bar [w:60%] ← title placeholder
  - Skeleton Bar        ← line 1
  - Skeleton Bar [w:80%] ← line 2
  - Skeleton Row [row]
    - Skeleton Circle   ← avatar
    - Skeleton Bar      ← name
```

**Table skeleton**
```
- Table Skeleton [col]
  - Header Row [row] → 4× Skeleton Bar [equal-width]
  - Data Row × 5 [row]
    - Skeleton Bar × 4 [equal-width]
```

**List skeleton**
```
- List Skeleton [col]
  - List Item Skeleton × 4 [row]
    - Skeleton Circle
    - Skeleton Lines [col, flex:1]
      - Skeleton Bar [w:70%]
      - Skeleton Bar [w:50%]
```

---

## Modal

Use for actions requiring user confirmation, focused input, or detail views that don't warrant a page navigation.

**Modal width is a structural decision** — it determines how much content fits. Use `[w:400]` for simple confirmations, `[w:560]` for forms, `[w:900]` for previews. Omit height — let content determine it.

**Confirmation modal**
```
- Overlay [fixed, inset:0]
  - Modal [col, w:400, center]
    - Header [row, space-between]
      - Title → "确认删除"
      - Close Button → icon:x
    - Body
      - Body Text → "删除后无法恢复，确定要删除「项目名称」吗？"
    - Footer [row, end]
      - Button [ghost] → "取消"
      - Button [destructive] → "确认删除"
```

**Form modal**
```
- Overlay [fixed, inset:0]
  - Modal [col, w:560, center]
    - Header [row, space-between]
      - Title → "新建团队成员"
      - Close Button → icon:x
    - Body [col]
      - Input → "姓名" [required]
      - Input → "邮箱" [required, type:email]
      - Select → "权限角色" → "管理员 / 编辑 / 只读"
    - Footer [row, end]
      - Button [ghost] → "取消"
      - Button [primary] → "发送邀请"
```

**Detail / Preview modal**
```
- Overlay [fixed, inset:0]
  - Modal [row, w:900, center]
    - Preview Panel [flex:2]
      - Preview Content ← image / document / video
    - Info Panel [col, w:280]
      - Title → "文件名称.png"
      - Meta List [col]
        - "大小: 2.4 MB"
        - "上传时间: 2026-02-01"
        - "上传者: 张三"
      - Actions [col]
        - Button [primary, full-width] → "下载"
        - Button [ghost, full-width] → "分享链接"
```

---

## Drawer / Side Panel

Use for contextual details, settings, or secondary flows that shouldn't interrupt the main view.

**Drawer width is a structural decision** — it determines how much main content is pushed/overlaid.

**Right drawer (contextual detail)**
```
- Drawer [col, w:400, fixed-right, h:full] [slide-in-right]
  - Drawer Header [row, space-between, h:fixed]
    - Title → "订单详情"
    - Close Button → icon:x
  - Drawer Body [col, flex:1, scroll]
    - Section: "基本信息" [col]
      - Field × N [row, space-between]
        - Label → "订单号" / Value → "#20240201-001"
    - Section: "商品列表" [col]
      - Item × N [row]
        - Thumbnail [w:48, h:48]
        - Item Info [col]
          - Name → "商品名称"
          - Price → "¥99.00 × 2"
  - Drawer Footer [row]
    - Button [ghost, flex:1] → "关闭"
    - Button [primary, flex:1] → "处理订单"
```

**Filter drawer (mobile / compact)**
```
- Drawer [col, w:320, fixed-right, h:full] [slide-in-right]
  - Header [row, space-between]
    - Title → "筛选"
    - Link → "清除全部"
  - Body [col, flex:1, scroll]
    - Filter Group: "分类" [col]
      - Checkbox × 4 → "全部 / 电子 / 服装 / 食品"
    - Filter Group: "价格区间" [col]
      - Range Slider [min:0, max:1000]
      - Row [row]
        - Input → "¥0"
        - Divider → "—"
        - Input → "¥1000"
    - Filter Group: "评分" [col]
      - Radio × 4 → "4星以上 / 3星以上 / 2星以上 / 全部"
  - Footer
    - Button [primary, full-width] → "应用筛选（23）"
```

---

## Toast / Notification

Use for transient feedback. Toasts are non-blocking and auto-dismiss.

**Toast stack (top-right)**
```
- Toast Container [col, fixed]
  - Toast [row] [animate:slide-in]
    - Icon → icon:check-circle [success] / icon:alert [warning] / icon:x-circle [error]
    - Content [col, flex:1]
      - Title → "保存成功"
      - Body → "更改已自动同步到云端" [optional]
    - Close → icon:x [optional, for persistent toasts]
```

**Toast variants**
```
- Toast [success] → icon:check-circle + "操作成功"
- Toast [error]   → icon:x-circle   + "操作失败，请重试"
- Toast [warning] → icon:alert      + "即将到期，请续费"
- Toast [info]    → icon:info       + "新版本可用，点击更新"
- Toast [loading] → icon:spinner    + "正在处理..." [persistent, no-dismiss]
```

---

## Inspector Panel (Sidebar Detail)

Use in design tools, CMS, data editors — where a list/canvas on the left drives a detail panel on the right.

```
- App Layout [row, h:full]
  - List Panel [col, w:280, fixed-left]
    - Panel Header [row, space-between, h:fixed]
      - Title → "所有图层"
      - Button → icon:plus
    - List [col, scroll]
      - List Item × N [row]
        - icon:layer
        - Name → "图层名称" [active on first]
        - Actions [row, visible-on-hover]
          - icon:eye / icon:more

  - Canvas / Preview [flex:1]
    - ← main content area

  - Inspector Panel [col, w:320, fixed-right]
    - Panel Tabs [row]
      - Tab → "属性" [active]
      - Tab → "样式"
      - Tab → "原型"
    - Panel Body [col, scroll]
      - Property Group: "位置与尺寸" [col]
        - Row [row]
          - Field → "X" + "0"
          - Field → "Y" + "0"
        - Row [row]
          - Field → "W" + "240"
          - Field → "H" + "160"
      - Property Group: "填充" [col]
        - Color Swatch Row [row, space-between]
          - Color Swatch + "#FFFFFF"
          - Opacity → "100%"
```

---

## List Pagination vs Infinite Scroll

Choose based on use case, then use the corresponding blueprint notation.

| 场景 | 推荐方案 |
|---|---|
| 有明确"去第 N 页"需求（后台管理、搜索结果） | Pagination |
| 内容消费流（Feed、评论、社交） | Infinite Scroll |
| 数据量可预期且较小（< 200 条） | Pagination |
| 移动端 Feed 类 | Infinite Scroll |

**Pagination**
```
- List Section [col]
  - Table / List [col]
    - Item × 20
  - Pagination [row, center]
    - Button → icon:chevron-left [disabled on page 1]
    - Page Button × 5 → "1" [active] "2" "3" "..." "12"
    - Button → icon:chevron-right
    - Page Info [optional] → "第 1 页，共 12 页（234 条）"
```

**Infinite Scroll**
```
- Feed [col, scroll]
  - Item × N [col]
    ← items load progressively
  - Load More Trigger [observer-target]
    - Loading Indicator [center] → icon:spinner + "加载更多" [visible while fetching]
  - End State [center] → "已经到底了 🎉" [visible when no more data]
```

**Load More Button** (explicit, between pagination and infinite scroll)
```
- List [col]
  - Item × 10
  - Load More [center]
    - Button [ghost] → "加载更多（剩余 48 条）"
    - Loading State → icon:spinner [replaces button while fetching]
```

---

## Form Field States

Use when blueprinting forms that require explicit validation state documentation.

```
- Field Group [col]
  - Label → "邮箱地址" [required marker: *]
  - Input [type:email]
    - [default]  → placeholder "you@example.com"
    - [focus]    → focused
    - [valid]    → icon:check [right], [valid]
    - [invalid]  → icon:alert [right], [invalid]
    - [disabled] → [disabled]
    - [loading]  → icon:spinner [right]
  - Helper Text
    - [default]  → "我们不会向你发送垃圾邮件"
    - [invalid]  → "请输入有效的邮箱地址" [error]
    - [valid]    → hidden or "邮箱可用" [success]
```

**Form submission states**
```
- Form [col]
  - Fields...
  - Submit Button
    - [default]  → "提交"
    - [loading]  → icon:spinner + "提交中..." [disabled]
    - [success]  → icon:check + "已提交" [disabled, success]
    - [error]    → "提交失败，重试" [error]
  - Form-level Error [optional]
    - Alert [error] → "提交失败：服务器错误，请稍后重试"
```
