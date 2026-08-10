---
name: future-proof-design
description: Strong target 设计：针对一个已选定的结构性问题，基于真实代码与业务不变量收敛长期架构和迁移终点。仅供用户显式调用。
disable-model-invocation: true
---

# Future-Proof Design

本 skill 位于机会发现之后：输入是一个已选定的需求、候选改造点或结构性缺口，输出是在当前已知约束下解决根因且可长期演进的唯一 **strong target**。

Strong 的判断标准是更低的 **change amplification**：下一次已证实的同轴变化收敛在明确 owner 及其邻接 contract，核心模型不随外部实现漂移。它不等于更多抽象；每个 seam 都必须承载真实不变量、变化轴或隔离边界，其余逻辑保持直接。

## 硬约束

- 保持用户指定的动作边界：审查只报告，设计完成方案，修改完成实现与验证。
- 先从实际代码、runtime path、数据和现有 contract 建立事实，再作架构判断。
- 所有分析、迁移与实现收敛到一个明确的 strong target。
- 直接修正错误的模型、authority 和 boundary，不沿错误结构继续扩展。
- 以现有可观察行为和运行语义为 baseline；新增 state、storage、async path 或一致性机制必须指向已验证的 requirement 或 failure mode。
- 迁移完成且不存在已验证的兼容 obligation 时，删除被替代的路径、flag、adapter 和兼容 surface；确有 obligation 时，把兼容建模为有 owner、期限和退出条件的 contract。
- 真实约束阻止 strong target 时，报告阻塞条件与必须解除的前置条件。

## 工作流

### 1. 还原真实系统

沿受影响的端到端路径确认：

- 入口、核心调用链、状态转换与副作用；
- 业务规则、状态和数据的当前 owner；
- API、event、storage 与 provider contract；
- 写入、读取、失败、重试、并发和生命周期语义；
- 受影响的调用方、测试、迁移与发布边界。

把事实、推断和未知项分开。只有会改变 strong target 的未知项才向用户澄清。

完成标准：从输入到最终状态的实际路径闭合；每个受影响的模型、contract、调用方和持久化面均已计入，关键结论可指向代码、运行结果或业务约束。

### 2. 建立问题模型

从需求本质回答：

1. 系统必须维护哪些业务不变量和可观察行为？
2. 谁拥有决策，谁写入事实，冲突时谁有解释权？
3. 哪些变化轴已由需求、代码历史或明确业务方向证实？
4. 哪些性能、一致性、安全、可用性和运维属性构成真实约束？
5. 当前模型、ownership、contract 或 boundary 为什么无法自然表达这些要求？

用一句因果链定位根因：`因为 <模型/authority/boundary 错误>，<业务变化> 被迫扩散到 <位置>，导致 <可验证后果>`。

完成标准：每个结构性结论都有事实证据；症状与根因已分开；仅有局部实现问题时，结论保持局部，不升级为架构重构。

### 3. 收敛 strong target

围绕稳定职责设计终态：

- **Ownership**：不变量与能够执行它的 authority 共置；跨 owner 的应用层只编排用例，不复制业务判断。
- **Authority**：每份事实都有唯一写入 authority，或明确的合并、冲突与一致性规则。cache、replica、derived view 和 local state 各有显式角色与失效语义。
- **Contract**：输入、输出、错误和状态转换由类型或 schema 表达；边界在状态进入核心前判定是否合法。
- **Evidence-backed seam**：只隔离已证实的变化轴、外部契约或运行边界；接口必须能说明它保护核心免受哪种变化。
- **Locality**：同一业务变化收敛在一个 owner 及其邻接 contract，不借助跨层 flag、隐式 context 或复制判断传播。
- **Lifecycle**：保持受影响路径中已存在的运行语义；只为已验证的 failure mode 或 requirement 补齐缺口。
- **Small surface**：只暴露完成用例所需的 API；内部表示、临时状态和 provider 细节留在 owner 内。
- **Operability**：需要运行决策的失败与状态转换可观测；每个 log、metric、trace 或告警都对应明确的处置动作。

优先使用 owner 内的直接代码。只有新抽象能降低已证实的 change amplification 时，才引入 Strategy、Factory、event bus、plugin、repository 或 adapter。

完成标准：每个新增抽象、状态与运行机制都能指向它承载的不变量、变化轴或 failure mode；对一个已证实变化轴做 counterfactual change test 后，改动只落在目标 owner 与邻接 contract；冲突、失败和删除路径均有唯一解释。

### 4. 设计迁移终点

当当前系统偏离 strong target 时，规划直接迁移：

1. 建立目标 owner、contract 和行为测试边界。
2. 迁移数据与全部调用方到目标 contract 和正式运行路径。
3. 切换读写 authority，并验证运行与失败语义。
4. 删除旧模型、旧入口、重复状态、兼容分支和失效测试。
5. 用现有类型、schema、lint 或 architecture test 中最小可执行的约束阻止旧路径回流。

中间态只控制交付风险；临时双写、adapter 或兼容层必须标明 owner、验证方式和删除条件。

完成标准：每个阶段都有验证标准和失败恢复方式；最终状态只有一套 authority 规则与正式 contract；所有临时结构都有可检查的退出条件。

### 5. 按请求交付

- **审查**：按影响排序报告结构性问题，给出位置、证据、根因和 strong target；没有结构性问题时明确说明。
- **设计**：给出目标模型、模块边界、contract、数据流、失败语义和迁移终点。
- **实现**：完成目标架构、调用方、数据迁移、旧路径删除、测试与必要文档的闭环改动。

完成标准：指定动作类型已完成；交付物只描述或实现选定的 strong target，不夹带未经授权的下一阶段动作。

### 6. 验证 strong target

按交付类型验证：实现后运行仓库定义的 focused tests 和静态检查；审查或设计则用 source、runtime evidence 和 counterfactual change test 验证结论。只覆盖步骤 1–3 已识别的风险：

- 当前需求、既有不变量与关键失败路径成立；
- 非法状态无法越过 contract；
- 涉及副本时，authority 不可达、数据陈旧和副本清空均按设计呈现；
- 涉及异步或共享状态时，重复请求、并发、取消和部分失败均有确定语义；
- counterfactual change test 的修改范围收敛在目标 owner 与邻接 contract；
- 搜索不到应删除的旧入口、flag、双写、fallback 和兼容 surface；
- 新增抽象均通过步骤 3 的 evidence-backed seam 标准。

完成标准：行为、架构、迁移和删除有可复现证据；未适用项、跳过项和无关失败均明确报告。

## 输出

先给唯一推荐结论，再给根因证据、目标架构、迁移方式和验证结果。只展开会改变目标架构的 trade-off；所有收益都必须能由模型、contract、counterfactual change test 或运行证据证明。
