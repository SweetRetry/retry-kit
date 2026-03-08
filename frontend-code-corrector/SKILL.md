---
name: frontend-code-corrector
description: >
  前端代码规范矫正与统一修复技能。用于把不规范的 React/Next.js + Tailwind CSS v4 + shadcn/ui 代码修正为可维护、可复用、可扩展的实现。
  当用户提到“规范化 className”、“Tailwind v4 写法不对”、“text 样式硬编码”、“text-xs/text-sm 没按标准类名”、“inline style 太多”、“先复用现有组件”、“shadcn token 不一致”、“design token 对齐”、“UI 代码审查/重构”、“组件被过度 override”时必须触发。
  即使用户只说“帮我清理这段前端代码”，只要涉及样式一致性与组件复用，也应优先使用本技能；若项目不满足 Tailwind v4 / shadcn 前提，必须降级执行而非强套规则。
---

# Frontend Code Corrector

用于“先审查、再修复、最后验证”的前端代码矫正流程。

## 0) 目标

把页面从“能跑”提升到“可长期维护”：

1. 统一 Tailwind CSS v4 写法
2. 消除 text/spacing/color 的硬编码
3. 优先复用现有组件（existing component first）
4. 优先使用 shadcn/ui design token（token base first）
5. 避免无意义的自定义实现和样式分叉

---

## 1) 触发边界

### 必须触发

- 用户要你修前端代码风格、样式规范、组件复用问题
- 出现 `style={{ ... }}`、硬编码 `fontSize`/`color`/`lineHeight`/`padding`
- 看到 Tailwind 任意值滥用（如 `text-[13px]`, `leading-[19px]`, `rounded-[7px]`）
- 看到文本样式没有使用标准类（如没用 `text-xs` / `text-sm` / `text-base`）
- 用户明确提到 shadcn/ui、design token、tw4、规范化 className

### 不适用

- 纯后端逻辑修复
- 与 UI 无关的数据处理脚本
- 用户明确要求“保留当前非规范写法，不要重构”

### 1.1 执行门禁（必须先做）

先检查目标项目是否满足技能前提，并在输出中记录结论：

1. **Tailwind v4 检测**：存在任一证据即可视为通过
   - 依赖为 `tailwindcss@^4`
   - 样式入口使用 Tailwind v4 方式（如 `@import "tailwindcss"`）
2. **shadcn 检测**：存在任一证据即可视为通过
   - `components/ui/*`（或团队约定的 shadcn 源组件目录）
   - 项目已使用 `shadcn/ui` 语义 token（如 `bg-background`, `text-foreground`）
3. **执行模式判定**
   - `strict`：Tailwind v4 + shadcn 均通过，执行全部规则
   - `tw-only`：仅 Tailwind v4 通过，跳过 shadcn 源冻结规则
   - `generic`：均不通过，仅执行通用前端清理，不应用本技能的强约束条目

---

## 2) 核心原则

### A. Existing Component First

1. 先查现有组件库（项目内 `components/`、`ui/`、feature components）
2. 能复用则复用，禁止同功能重复造轮子
3. 仅当现有组件确实无法满足需求时再扩展

### B. shadcn Token Base First

1. 优先使用语义 token：`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-primary` 等
2. 禁止直接写裸色值（hex/rgb/hsl）
3. 颜色、边框、阴影、圆角优先遵循 token 和设计系统映射

### C. Tailwind v4 Native First

1. 优先标准 utility，减少任意值
2. 文本优先标准字号：`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`
3. 行高、字重、字距使用体系化类：`leading-*`, `font-*`, `tracking-*`
4. 条件类名统一走 `cn()`，避免字符串拼接失控

### D. Readability and Maintenance

1. className 按“布局 -> 盒模型 -> 排版 -> 视觉 -> 状态”组织
2. 重复 3 次以上的样式片段应抽成组件或变体
3. 小改动不制造大抽象；大重复才抽象

### E. No Override First

1. 对“本身已有完整样式契约”的组件，优先使用 `variant` / `size` / `tone` / `asChild` 等官方 API
2. 非必要不要在使用点叠加大段 `className` 覆盖；优先封装业务 Wrapper，而不是改组件内部实现
3. 禁止用 `!important`、高优先级选择器或长串 utility 去对抗组件默认样式
4. 必须覆盖时遵守 **覆盖预算**：优先只改布局和间距，避免改 token 语义和核心视觉

### F. Component Contract First

1. 组件若存在 `cva` / `variants` / `size` / `intent` 等契约，优先走契约，不直接 class 覆盖
2. 禁止出现“props 和 className 打架”：
   - 例如 `size=\"sm\"` 同时写 `h-10 px-6`
   - 例如 `variant=\"outline\"` 同时覆盖 `bg-* text-* border-*`
3. 单次需求如果已触发第二处类似覆盖，立即回收到业务 Wrapper，避免扩散

### G. shadcn Source Immutable（团队变更半径控制）

1. `components/ui/*`（或项目中 shadcn 源组件目录）视为冻结层，禁止修改源码
2. 禁止通过覆盖 `className` 改写 shadcn 组件核心视觉（颜色、圆角、边框、阴影、状态）
3. 需要语义化扩展时，在业务层新建 Wrapper 组件（如 `components/app/*` 或 feature 目录）
4. Wrapper 负责语义 props 映射，shadcn 源组件保持原样可升级
5. 该策略目标是避免“改一处源组件，牵连全局大面积回归”

---

## 3) 审查清单（按优先级）

### P0（必须修）

1. 非法/失效的 Tailwind 写法（版本不兼容或拼写错误）
2. 文本关键样式硬编码：`fontSize`, `lineHeight`, `fontWeight`
3. 色彩硬编码且绕开 token
4. 影响可访问性：对比度过低、缺失 `focus-visible`
5. 对已有样式契约组件进行大量覆盖，导致变体失效或视觉分叉
6. 修改 shadcn 源组件或在调用处覆盖其核心视觉样式

### P1（强烈建议修）

1. 任意值可被标准类替代但未替代
2. 同类 UI 在不同文件样式不一致
3. 可复用组件未复用
4. shadcn 组件可替代原生实现但未替代：若项目未安装该组件，必须通过 `npx shadcn@latest add <name>` 安装，禁止手写同功能实现
5. 为了单点需求在调用处覆写组件，而不是封装业务 Wrapper
6. 组件对外 props 已能表达语义，但调用处仍硬改字号/色彩/状态

### P2（机会性优化）

1. className 顺序混乱导致可读性差
2. 轻度重复但未到抽象阈值
3. 注释噪音、无效变量、死代码

---

## 3.1 文本语义映射标准

当代码缺少排版语义时，按以下映射回收：

1. 元信息/辅助说明：`text-xs text-muted-foreground`
2. 正文内容：`text-sm` 或 `text-base`
3. 表单标签/按钮小号：`text-sm font-medium`
4. 区块标题：`text-lg font-semibold`（必要时 `tracking-tight`）
5. 页面主标题：`text-2xl` 及以上，避免用任意值拼接

禁止仅为“看起来差不多”使用 `text-[13px]`、`text-[15px]` 这类碎片字号。

---

## 3.2 组件覆盖决策矩阵

1. 已有目标变体（`variant/size` 可满足）：
   - 直接使用组件 API，不加视觉覆盖类
2. 无目标变体，但需求会复用（>=2 处）：
   - 在业务层新增 Wrapper 语义 props，再替换使用点
3. 一次性页面布局调整：
   - 允许少量布局类覆盖（`mt-*`, `w-*`, `self-*`）
4. 需要强行改组件核心视觉（颜色、圆角、阴影、状态）：
   - 视为设计系统问题，在业务层 Wrapper 处理，不改 shadcn 源组件
5. 变更请求指向 `components/ui/*`：
   - 拒绝直接修改，改为在业务层封装 Wrapper 承接需求

---

## 3.3 量化覆盖判定（防止“覆盖失控”）

对“已样式化组件”（如 Button/Card/Badge/Input）在调用处进行量化判定：

1. **视觉覆盖类集合**（计入覆盖数）：
   - `bg-*`, `text-*`, `border-*`, `rounded-*`, `shadow-*`, `ring-*`
   - `hover:*`, `active:*`, `focus:*`, `data-[state=*]:*`
2. **不计入覆盖数**（布局类）：
   - `w-*`, `h-*`, `flex-*`, `grid-*`, `m*`, `p*`, `gap-*`, `order-*`, `self-*`, `justify-*`, `items-*`
3. **分级阈值**：
   - 视觉覆盖数 `0`：合规
   - 视觉覆盖数 `1-2`：P1（需在输出说明业务理由）
   - 视觉覆盖数 `>=3`：P0（必须回收为 Wrapper 或组件 API）
4. **一票否决**：
   - 出现 `!important`
   - 通过调用处覆盖核心状态色（如直接改 `hover:bg-*` 与设计系统冲突）
   - 直接修改 `components/ui/*`

---

## 4) 标准修复策略

按这个顺序执行，避免返工：

1. **执行门禁**：先判定 `strict / tw-only / generic` 模式
2. **语义对齐**：确认组件职责和设计意图（正文、说明、标签、按钮文本）
3. **组件契约检查**：先确认是否已有 `variant/size` 可以满足，避免直接 override
4. **文本归一**：把硬编码字号替换为标准 `text-*` 阶梯
5. **token 归一**：把裸色值替换为 design token
6. **组件归一**：用现有组件或 shadcn 组件替换重复结构；`components/ui/*` 缺失目标组件时，先执行 `npx shadcn@latest add <name>` 安装，再替换
7. **状态补齐**：补充 `hover` / `active` / `focus-visible` / `disabled`
8. **响应式校准**：必要时加 `sm:`/`md:` 分层，而非单一硬编码值
9. **量化复检**：按 §3.3 重新统计覆盖数，超阈值必须回收

---

## 5) 常见反模式与替换

### 文本硬编码

- Bad: `style={{ fontSize: 12, lineHeight: '16px' }}`
- Good: `className="text-xs leading-4"`

### 颜色硬编码

- Bad: `className="text-[#666] bg-[#fff]"`
- Good: `className="text-muted-foreground bg-background"`

### 任意值滥用

- Bad: `text-[13px] leading-[18px] rounded-[6px]`
- Good: `text-sm leading-5 rounded-md`

### 重复结构

- Bad: 多处复制同一段 button/card 样式
- Good: 抽为共享组件或用 `cva`/variant 模式统一

### 原生替代组件库

- Bad: 手写弹窗、下拉、tooltip（已存在 shadcn 对应组件）
- Good: 直接复用现有 `Dialog` / `Select` / `Tooltip`

### 手写实现 shadcn 有对应组件的 UI

- Bad: 自行实现 Checkbox、Switch、Tabs、Accordion、Toast 等已有 shadcn 对应组件
- Good: 先检查 `components/ui/*` 是否已安装；若未安装，使用 shadcn CLI 添加

  ```bash
  # shadcn v2（推荐，自动适配 Next.js / Vite / React）
  npx shadcn@latest add <component-name>

  # 示例
  npx shadcn@latest add checkbox
  npx shadcn@latest add tabs
  npx shadcn@latest add toast
  ```

  安装后直接从 `@/components/ui/<component-name>` 导入，禁止手写同功能实现。

### 过度覆盖现有组件

- Bad: `<Button className="h-9 rounded-sm px-[11px] text-[13px] font-medium tracking-[0.01em] bg-[#111] text-white hover:bg-black/90 ..." />`
- Good: 新建 `AppButton` Wrapper 封装语义样式，使用点仅保留少量布局类

### props 与 class 冲突覆盖

- Bad: `<Button size="sm" className="h-10 px-6 bg-primary text-white" />`
- Good: `<AppButton tone="primary" size="compact" />`（由 Wrapper 映射到底层组件）

---

## 6) 输出契约

每次执行此技能时，输出必须包含：

```md
[frontend-code-corrector 执行]

问题分级：
- P0: ...
- P1: ...
- P2: ...

修复摘要：
1. 文本体系修正（含 text-* 映射）
2. token 对齐（列出替换前后）
3. 组件复用/替换说明
4. override 治理（哪些覆盖被删除，哪些被保留及原因）
5. 可访问性修复

变更文件：
- path/to/file

执行门禁：
- Tailwind v4: pass/fail（证据）
- shadcn: pass/fail（证据）
- mode: strict/tw-only/generic

验证结果：
- lint（必须）
- typecheck/test（可选但推荐）
- 若无法执行命令：必须给出静态检查清单与未验证风险
- 视觉回归风险点
```

---

## 7) 质量门槛（交付前自检）

1. 不再出现可直接替换的 `text-[xxpx]`/`leading-[xxpx]`
2. 文本层级可解释：caption/body/label/title 对应清晰
3. 颜色来源可追溯到 token
4. 有交互的元素都具备 `focus-visible` 反馈
5. 无新增重复组件（若新增需解释理由）
6. 对已有样式组件，调用处覆盖符合覆盖预算：
   - 允许：布局/定位/间距（如 `w-*`, `flex-*`, `mt-*`）
   - 谨慎：排版类（需说明业务理由）
   - 禁止：大规模改颜色、圆角、阴影、状态色，绕过组件变体体系
7. 对“已样式化组件”的调用处覆盖数量受控：
   - 默认上限：不超过 3 个 utility，且主要是布局类
   - 超过上限：必须改为业务 Wrapper 或在输出中给出充分理由
8. 验证硬约束：
   - `lint` 必须执行并报告结果
   - 若环境阻塞无法执行，必须明确原因、列出替代静态检查项、标注残余风险

---

## 8) 默认假设

若用户未指定设计系统，默认按以下顺序执行：

1. 项目现有组件约定
2. shadcn/ui 语义 token 体系
3. Tailwind CSS v4 标准 utility

若三者冲突：优先“项目既有约定”，并在输出中标注冲突与取舍。
