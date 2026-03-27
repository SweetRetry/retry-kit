---
name: deep-debug
description: >
  系统化 root cause debugging 技能。用于 non-obvious bug、间歇性问题、间接症状、
  已经修过但没修对、或用户明确要求 debug 的场景。基于 scientific debugging、
  failure minimization、assertion/test-backed verification 与当前 agentic coding
  best practices，要求先复现、再证据化定位、最后最小修复，而不是 guess-and-patch。

  Triggers: /debug, deep debug, root cause, intermittent bug, flaky, visual glitch,
  stale closure, race condition, reproduce bug, why this broke, 调试, 排查根因, 复现问题.
---

# Deep Debug 证据驱动调试技能

> 如果用户问题明显是 bug / regression / flaky 行为，且根因并不直接可见，就用这个 skill。
> 目标不是“尽快改点代码”，而是把问题压缩成一个有证据支撑的 root cause，再做最小修复。

配套参考：

- 调试方法论：`references/debug-method.md`
- Agent 调试实践：`references/agent-debugging-playbook.md`
- 对齐清单：`references/official-alignment.md`

## 1) 这个 skill 的职责

触发后，默认执行的是一个受约束的调试协议：

1. 先建立 `symptom contract`
2. 再做复现与 failure reduction
3. 再做 hypothesis ranking + experiment
4. 只有拿到足够证据后才声明 root cause
5. 最后做最小修复与 symptom-based verification

输出必须能回答六件事：

- 现在的症状是什么
- 复现路径是什么
- 我优先怀疑哪几个原因，为什么
- 我做了哪些观察 / 实验
- 根因是什么，证据是什么
- 修复后如何确认原始症状真的消失

---

## 2) 触发边界

### 必须触发

- 用户明确说 `/debug`、`调试`、`排查根因`
- 症状是间接的：
  - 视觉异常
  - 值不对但没报错
  - 时好时坏
  - 只有特定顺序才出问题
- 同一路径已经修过一次但没修对
- 看起来可能涉及：
  - stale closure
  - race condition
  - async ordering
  - shared mutable state
  - config / environment drift
  - build / bundling / cache 差异

### 不要强行触发

- 用户只是要实现新功能，不是排 bug
- 错误已经直接给出明确修法，且几乎没有诊断空间
- 任务本质是重构 / 设计，不是故障定位

---

## 3) 外部依据优先级

优先按下面顺序校准调试动作：

1. 当前仓库里可执行的 repro、tests、logs、runtime output
2. `The Debugging Book` 的 scientific debugging / assertions / delta debugging 方法
3. 官方 agentic coding 文档里的 task scoping、focused sessions、log review、verification/eval 约束
4. 本 skill 的工程化归纳

取舍规则：

- 根因判定，以仓库内可观察证据为准
- 调试顺序，以外部方法论为准
- agent 工作方式，以当前官方 agent 文档为准
- 如果没有证据，只能写成“当前假设”，不能写成“已确认根因”

---

## 4) 启动时先冻结 `symptom contract`

在读代码之前，先把问题压缩成一份最小症状描述。至少补齐：

1. `When`
   - 什么时候发生
   - 是否稳定复现
2. `What`
   - 期望行为
   - 实际行为
3. `Where`
   - 哪个页面 / 接口 / 命令 / 环境
4. `Delta`
   - 最近什么变化后开始坏
5. `Proof path`
   - 准备用什么命令、点击路径、日志或断言验证

如果用户信息不够，不要撒网式提问。只问一个最能提高诊断价值的问题，优先级通常是：

1. 最小复现路径
2. 最近 change delta
3. 指定观察点的值 / 日志 / stack trace

---

## 5) 执行循环

### 5.1 先复现，再缩小失败面

优先拿到稳定 repro。顺序通常是：

1. 现有 test / script / command
2. 最短手工路径
3. 加最小 instrumentation 获取观察点

如果问题只在大输入、长链路或复杂页面出现，主动做 failure reduction：

- 缩小输入
- 缩短操作序列
- 缩小环境差异
- 缩到最小仍能失败的 case

没有稳定 repro 时，不要直接改代码。

### 5.2 按因果距离排序 hypothesis

默认从离症状最近的层开始查：

```text
Presentation / IO
→ Value / Config
→ Build / Module boundary
→ Data / State mutation
→ Temporal / Async ordering
→ External dependency / environment
→ Design / invariant violation
```

不要跳层。若跳过，必须说明为什么这一层已被证据排除。

### 5.3 每个 hypothesis 都要带 prediction

不要只写“怀疑是 X”。必须写成：

- Hypothesis：我怀疑什么
- Prediction：如果它为真，我应该看到什么
- Experiment：我要怎么验证
- Result：实际看到了什么
- Status：保留 / 排除

如果实验结果和当前理论冲突，先作废理论，再重排 hypotheses。

### 5.4 根因声明必须同时回答 `incorrectness + causality`

在动手修之前，至少给出：

```text
Symptom:
Repro:
Root cause:
Evidence:
Why alternatives are ruled out:
Fix:
```

合格的 root cause 不是“这里有问题”，而是：

- 为什么这里错了
- 为什么它会产生当前症状
- 为什么其他候选原因不成立

### 5.5 修复只改根因所需的最小面

默认优先：

- 最小 patch
- 最小 blast radius
- 最直接恢复正确性的改动

如果排查发现根因是 design assumption 被打破，要明确告诉用户这不是局部补丁能稳住的问题。

### 5.6 验证必须回到原始症状

修完后，至少做三类确认：

1. 原始 repro 路径已经恢复
2. 受影响最近邻路径没有明显回归
3. 能补 test / assertion / log guard 时尽量补

验证不是“代码能跑就算过”，而是“最初那个症状被证据证明消失了”。

---

## 6) 卡住时怎么扩边界

### 没找到 divergence

优先检查：

- 症状是在当前模块产生，还是从 caller / dependency 传入
- 是否还有第二条代码路径改同一份 state / resource
- 是否依赖顺序、时机、缓存或首屏初始化

### 没法稳定复现

先不要 patch。改做：

- 加 observation point
- 比对成功与失败路径
- 缩小变量数量
- 找最近 change delta

### 问题是间歇性的

优先怀疑：

- race condition
- stale data / stale closure
- async completion order
- cache / env / feature flag 差异

### 连 mental model 都不稳

要明确写出来：

> 我当前认为系统在做 X，但症状表明它实际更像在做 Y。下一步要找的是 X→Y 偏离发生的具体位置。

---

## 7) Hard Rules

- 没有 repro 或 observation plan，不要直接 patch
- 没有 root cause + evidence，不要宣称“修好了”
- 不要同时改多个互相竞争的 hypothesis
- 不要把“多打日志 / 多重试 / 多包一层 try-catch”伪装成根因修复
- 同一路径连续两次修复失败后，必须停下并向用户说明现状、证据和替代方向
- 如果新证据推翻旧理论，必须显式作废旧理论，而不是在其上继续补丁

---

## 8) 默认输出格式

做调试任务时，优先按这个结构汇报：

1. `Symptom`
2. `Repro / Verification path`
3. `Ranked hypotheses`
4. `Experiments and observations`
5. `Root cause`
6. `Fix`
7. `Verification`
8. `Residual risk / open question`

如果还没到 root cause，就停在前四项，不要伪造结论。

---

## 9) 维护约束

更新这个 skill 时，优先检查：

- 是否还把“经验口号”写成不可执行的泛化建议
- 是否还缺少 failure reduction / assertion / eval 这一层
- 是否把 agent 调试建议写成了 vendor-specific 细节
- 是否把工程化归纳误写成外部权威原话

维护时先看 `references/official-alignment.md`。
