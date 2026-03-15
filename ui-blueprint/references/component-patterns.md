# Component-Level Blueprint Patterns

High-frequency UI patterns with standardized ASCII notation. Use these as building blocks when assembling screen-level blueprints.

---

## Empty State

Use when a list, table, or data view has no content to display.

**First-use empty state**
```
┌─────────────────────────────┐
│                             │
│         🎨 插图              │
│      还没有项目              │
│  创建你的第一个项目，开始协作  │
│                             │
│       [新建项目]             │
└─────────────────────────────┘
```

**No-results empty state**
```
┌─────────────────────────────┐
│                             │
│         🔍                   │
│     没有找到匹配结果          │
│   试试调整筛选条件或关键词     │
│                             │
│       清除所有筛选            │
└─────────────────────────────┘
```

**Error empty state**
```
┌─────────────────────────────┐
│                             │
│         ⚠                   │
│       加载失败               │
│   网络异常，请稍后重试        │
│                             │
│       [重新加载]             │
└─────────────────────────────┘
```

---

## Skeleton / Loading Placeholder

Mirror the **shape** of the actual content. Use skeleton for known layout shapes, spinner for unknown layouts or full-page transitions.

**Card skeleton**
```
┌─────────────────────┐
│ ▓▓▓▓▓▓▓▓░░░░░░      │  ← title
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  ← line 1
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░   │  ← line 2
│ ◯ ▓▓▓▓▓▓             │  ← avatar + name
└─────────────────────┘
```

**Table skeleton**
```
┌──────┬──────┬──────┬──────┐
│ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │ ▓▓▓▓ │  ← header
├──────┼──────┼──────┼──────┤
│ ░░░░ │ ░░░░ │ ░░░░ │ ░░░░ │  ×5 rows
└──────┴──────┴──────┴──────┘
```

---

## Modal

Modal width determines content capacity: narrow (~400) for confirmations, medium (~560) for forms, wide (~900) for previews.

**Confirmation modal**
```
┌──────────────────────────────┐
│ 确认删除                    ✕ │
├──────────────────────────────┤
│                              │
│ 删除后无法恢复，确定要删除    │
│ 「项目名称」吗？             │
│                              │
├──────────────────────────────┤
│            [取消]  [确认删除] │
└──────────────────────────────┘
```

**Form modal**
```
┌──────────────────────────────┐
│ 新建团队成员                ✕ │
├──────────────────────────────┤
│                              │
│  姓名 *                     │
│  ┌────────────────────────┐  │
│  └────────────────────────┘  │
│  邮箱 *                     │
│  ┌────────────────────────┐  │
│  └────────────────────────┘  │
│  权限角色                    │
│  ┌─ 管理员/编辑/只读 ▾ ───┐  │
│  └────────────────────────┘  │
│                              │
├──────────────────────────────┤
│          [取消]  [发送邀请]   │
└──────────────────────────────┘
```

**Detail / Preview modal**
```
┌─────────────────────────────────────────┐
│ 文件预览                              ✕ │
├──────────────────────┬──────────────────┤
│                      │ 文件名称.png      │
│                      │                  │
│    预览内容           │ 大小: 2.4 MB     │
│    (图片/文档/视频)    │ 上传: 2026-02-01 │
│                      │ 上传者: 张三      │
│                      │                  │
│                      │ [    下载    ]    │
│                      │ [  分享链接  ]    │
└──────────────────────┴──────────────────┘
```

---

## Drawer / Side Panel

Use for contextual details or secondary flows that shouldn't interrupt the main view.

**Right drawer (contextual detail)**
```
                          ┌──────────────────┐
                          │ 订单详情        ✕ │
                          ├──────────────────┤
                          │ 订单号  #202401  │
  ┌────────────────┐      │ 状态    已完成   │
  │                │      │ 时间    10:23    │
  │  Main Content  │      │                  │
  │  (underneath)  │      │ 商品列表          │
  │                │      │ ┌──┐ 商品A ¥99×2 │
  │                │      │ └──┘             │
  │                │      │ ┌──┐ 商品B ¥49×1 │
  └────────────────┘      │ └──┘             │
                          ├──────────────────┤
                          │ [关闭]  [处理订单]│
                          └──────────────────┘
```

---

## List Pagination vs Infinite Scroll

| 场景 | 推荐方案 |
|---|---|
| 有明确"去第 N 页"需求（后台管理、搜索结果） | Pagination |
| 内容消费流（Feed、评论、社交） | Infinite Scroll |
| 移动端 Feed 类 | Infinite Scroll |

**Pagination**
```
┌─────┬──────┬──────┬──────┐
│ ... │ ...  │ ...  │ ...  │  ×20 rows
└─────┴──────┴──────┴──────┘
     < 1 [2] 3 ... 12 >
     第 2 页，共 12 页（234 条）
```

**Infinite Scroll**
```
│  Item ×N (progressive load)  │
│  ...                         │
│  ...                         │
│       ⟳ 加载更多              │  ← observer trigger
│                              │
│     已经到底了 🎉             │  ← end state
```

---

## Form Field States

```
  邮箱地址 *
  ┌────────────────────────┐
  │ you@example.com        │  [default] placeholder
  └────────────────────────┘
  我们不会向你发送垃圾邮件

  ┌────────────────────────┐
  │ alice@example.com    ✓ │  [valid]
  └────────────────────────┘

  ┌────────────────────────┐
  │ invalid              ⚠ │  [invalid]
  └────────────────────────┘
  请输入有效的邮箱地址

  Submit Button states:
  [提交]  →  [⟳ 提交中…]  →  [✓ 已提交]
                           →  [✕ 提交失败，重试]
```
