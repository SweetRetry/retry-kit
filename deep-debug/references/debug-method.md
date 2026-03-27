# Deep Debug 方法论基线

> 用途：给 `deep-debug` skill 提供外部调试方法论基线。这里写的是“为什么这样调”，不是项目细节。

## 1. 权威来源

- `The Debugging Book`
  - Intro / Scientific Debugging
  - Assertions
  - Delta Debugging

核心页面：

- `https://www.debuggingbook.org/beta/Intro_Debugging.html`
- `https://www.debuggingbook.org/html/Assertions.html`
- `https://www.debuggingbook.org/html/DeltaDebugger.html`

---

## 2. 这些来源真正支持了什么

### 2.1 调试要像做实验，不要像做猜谜

`The Debugging Book` 把 debugging 写成一个科学过程：

- 从症状出发
- 形成可证伪 hypothesis
- 用 observation / experiment 缩小原因空间
- 最后给出 diagnosis

对 skill 的约束：

- 不接受“我感觉是 X”
- 每个 hypothesis 都要带 prediction 和 experiment
- 新证据一旦冲突，就重排 hypotheses，而不是硬解释

### 2.2 合格 diagnosis 需要同时解释 `incorrectness` 和 `causality`

只找到“哪行代码看起来可疑”还不够。方法论要求 diagnosis 同时说明：

- 为什么该状态 / 行为本身是不正确的
- 为什么它会导致当前故障

对 skill 的约束：

- root cause 不能只写“这里 stale / 这里 nil / 这里 race”
- 必须把“错误状态 -> 症状”的因果链写清楚

### 2.3 失败样本要主动缩小

Delta Debugging 的关键价值不是一个具体算法名字，而是 failure reduction：

- 把复杂失败压缩成最小仍然失败的 case
- 减少变量数量
- 提高观察和验证效率

对 skill 的约束：

- 大页面、大输入、长链路 bug，默认先缩最小 repro
- 没有必要把全量场景抱着一起调

### 2.4 Assertion 是把隐含假设变成可执行检查

Assertions 章节的核心不是“多写 assert”这么简单，而是：

- 把关键不变量前置
- 让错误在更接近源头的位置暴露
- 缩短 symptom 与 cause 的距离

对 skill 的约束：

- 修完后优先补能守住根因的 test / assertion / invariant check
- 如果根因本质上是不变量被破坏，单纯改 UI 或兜底返回值通常不够

---

## 3. 转译成 `deep-debug` 的执行动作

### 3.1 先冻结 symptom contract

因为 scientific debugging 的前提是：你知道自己在解释什么现象。

最低限度要能说清：

- 什么时候发生
- 期望与实际分别是什么
- 在哪里发生
- 如何验证它存在 / 不存在

### 3.2 hypothesis 必须落成实验台账

推荐记录格式：

```text
Hypothesis:
Prediction:
Experiment:
Observed:
Status:
```

这样做的目的不是增加文书工作，而是避免 agent 在多轮思考里偷偷改口。

### 3.3 fix 前必须有 root cause declaration

推荐最小结构：

```text
Repro:
Root cause:
Evidence:
Why alternatives are ruled out:
Fix:
```

没有这份声明时，默认视为还在诊断阶段。

### 3.4 verification 回到原始症状，不是只看编译通过

真正需要证明的是：

- 原始症状消失
- 最接近的回归面没有坏
- 根因附近的 invariant 被更早地保护起来

---

## 4. 不要过度宣称的地方

- 这些资料支持“systematic debugging”，不支持“每个 bug 都必须按同样长流程”
- failure reduction 是高价值默认动作，不代表所有问题都要实现完整 delta-debugger
- assertion 很重要，但不是要求所有项目都大规模引入 debug-only 基础设施

更准确的表述是：

- “优先”
- “默认”
- “当问题复杂或不稳定时”

而不是：

- “必须永远”
- “只有这一种方法”

---

## 5. 维护时先复核的点

1. `deep-debug` 是否还保留了 hypothesis → experiment → evidence 结构
2. 是否还明确要求 root cause 解释 `incorrectness + causality`
3. 是否仍然强调 failure reduction，而不是直接在大场景里乱改
4. 是否仍然把 assertion / test 当作根因防线，而不是可有可无
