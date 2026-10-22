# design.md 结构模板

结构遵循 Google 的 [DESIGN.md 规范](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)（alpha）：YAML 文件头承载 Token，正文解释如何使用。另从 [Vercel design.md](https://vercel.com/design.md) 借用三项做法：冲突优先级、点名封杀、封闭词表。

新建文件命名为 `DESIGN.md`；项目已有同类文件时沿用其名称。已知章节按下列顺序出现，标题不重复；访谈未涉及的章节省略并记入 `omitted`。

## 文件头

```yaml
---
version: alpha
name: <产品名>
description: <这份文件治理哪些界面>
colors:
  primary: "#..."
  surface: "#..."
typography:
  body: { fontFamily: ..., fontSize: ..., lineHeight: ... }
rounded:
  md: 8px
spacing:
  md: 16px
components:
  button-primary: { backgroundColor: "{colors.primary}", rounded: "{rounded.md}" }
omitted:
  - section: colors
    reason: Token 定义在 packages/ui/src/styles/globals.css
---
```

项目已有 Token 来源时，按 SKILL.md 省略对应分组，示例中的 `omitted` 即此写法。

## 品牌层

### `## Overview`

- 品牌性格、目标受众、期望的情绪。每个形容词配一条否定排除，例如“克制”配“不靠装饰、夸张或虚假确定性制造信心”。
- 不能像谁：访谈中点名的反例与理由。
- **底线**：列出任何界面都不能覆盖的规则；规范层的其余取值都是默认值。
- **冲突优先级**：需求互相竞争时按序保护。默认顺序为：事实与用户约束 > 宿主项目的框架与既有组件 > 用户任务清晰 > 品牌辨识 > 细节打磨。按访谈结果调整。规则与 Token 都没覆盖的情况，agent 按本节判断。

## 规范层

### `## Colors`

写颜色角色而非色值：哪个角色承担主操作、状态、分类，焦点色面积上限，亮暗主题的关系。

### `## Typography`

字阶与阅读角色的对应、字重用法、数字字形；何时允许扩展字阶。

### `## Layout`

栅格、间距档位、内容宽度、密度取向。

### `## Elevation & Depth`

层级靠阴影、边框还是明度差表达；浮层如何与下层区分。

### `## Shapes`

圆角语言与嵌套规则；控件形态是圆角矩形还是胶囊。

### `## Components`

组件原子的外观约定。**封闭词表**：列出 agent 可用的已发布组件、变体、类名或 Token，规定只用这些名字、不自造别名；写明不够用时的扩展口。

### 自定义章节（按需）

规范只固定上面的核心章节。动效等访谈中确定的系统级规则可作为自定义章节，放在 `## Components` 之后。

## 应用层

### `## Surfaces`（自定义章节）

- 产品有哪几类界面（营销页、控制台、编辑器、文档等），每类的首要任务、密度与用色预算。
- 只写跨页面成立的判断；具体流程和页面留在 PRD 与原型。

## `## Do's and Don'ts`

- **点名封杀**：写入访谈确认的封杀条目，每条用一句可观测描述命名，并给出本产品的正向替代。清单宁短勿全。
- 平衡防线：去掉套路不等于退化为贫瘠的“反设计”，写明本产品的克制靠什么建立张力。
