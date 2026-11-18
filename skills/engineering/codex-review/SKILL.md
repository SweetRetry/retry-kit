---
name: codex-review
description: 调用本机 Codex CLI 只读审查当前改动、分支或某个提交，追问续接同一会话，并逐条核实 Codex 的发现。
disable-model-invocation: true
---

# Codex Review

每次新开的 Codex review 都会从头读 diff、项目规则和相关文件，消耗额度。所以每一次调用都要换来新的信息：对象准确、只跑一次、追问复用同一会话。Codex 的结论是待核实的主张，交给用户前由 Claude 对照代码逐条验证。

## 1. 定范围

把用户的说法映射到唯一的审查对象，并用对应命令确认对象非空：

| 用户说的 | 范围参数 | 提示里的写法 | 非空检查 |
| --- | --- | --- | --- |
| 当前改动、没提交的 | `--uncommitted` | 当前未提交的改动（`git diff HEAD` 与未跟踪文件） | `git status --short --untracked-files=normal` |
| 这个分支、PR、相对 main | `--base <分支>` | 相对 `<分支>` 的改动（`git diff <分支>...HEAD`） | `git diff --stat <分支>...HEAD` |
| 某个提交 | `--commit <sha>` | 提交 `<sha>` 引入的改动（`git show <sha>`） | `git show --stat --format= <sha>` |

检查结果为空就告诉用户并停止，不调用 Codex。对象无法判断时再问。

**完成标准：**选定一个对象，且已确认它的改动非空。

## 2. 选调用形式

范围参数与自定义提示互斥，同时传入时 CLI 以退出码 2 拒绝启动。

- **范围参数**：没有额外信息要交代时使用。
- **自定义提示**：有下面任一项时使用，提示第一句用上表“提示里的写法”点明对象。

提示只写 Codex 看不到的东西：

- 这次改动的意图与约束，例如“只改文案，不应改变行为”。
- 用户最担心的地方。
- Claude 在本对话里已核实或已排除的点，让 Codex 把额度花在别处。

Codex 会自己读 diff、`AGENTS.md` 和相关文件，提示里不贴 diff，也不复述项目规则。

**完成标准：**选定一种形式；用提示时，第一句写明了审查对象。

## 3. 运行

```sh
out=$(mktemp -d)

# 范围参数
codex exec review --uncommitted -c sandbox_mode='"read-only"' \
  -o "$out/review.md" > "$out/run.log" 2>&1 < /dev/null
echo "exit=$?"

# 自定义提示：经引号定界的 heredoc 从 stdin 传入，提示里的反引号与 $ 保持原样
codex exec review -c sandbox_mode='"read-only"' \
  -o "$out/review.md" - > "$out/run.log" 2>&1 <<'EOF'
<提示>
EOF
echo "exit=$?"

echo "$out"; grep -m1 'session id' "$out/run.log"
```

- `codex exec review` 才有 `-o`；`codex review` 没有。
- `sandbox_mode` 强制只读。受信任项目默认是 `workspace-write`，审查不该改文件。
- 模型与推理强度沿用用户的 Codex 配置；用户指定时才加 `-m` 或 `-c model_reasoning_effort=...`。
- stdout 是几万字的执行记录，只写进 log，不读进上下文。
- 一次 review 可能持续数分钟。给足超时并等它结束；看起来慢时继续等，重新发起会重复扣额度。
- 非零退出时，读 log 末尾判断原因。登录失效或额度用尽就如实告诉用户并停止，Claude 自己的审查不能顶替 Codex 的结论。

**完成标准：**退出码为 0，`review.md` 非空，并记下输出目录的绝对路径与 `session id`。后续 shell 调用拿不到 `$out`，一律写这个绝对路径。

## 4. 核实与汇报

只读输出目录里的 `review.md`。对每条发现，回到代码确认它描述的路径真实可达：

- **成立**：给出 `文件:行号` 与触发条件。
- **不成立**：说明哪段代码或哪条约束否定了它。
- **无法判断**：写明缺什么证据。

汇报时把 Codex 原话与 Claude 的核实结论分开写。Codex 未发现问题时，照实转述它检查过什么。用户没要求时不改代码，也不再跑一轮 review。

## 5. 追问与复查

追问某条发现，或修复后请 Codex 确认，都续接同一会话。会话里已有仓库上下文，比新开一次 review 省额度：

```sh
codex exec resume <session id> -c sandbox_mode='"read-only"' \
  -o <输出目录>/followup.md - > <输出目录>/followup.log 2>&1 <<'EOF'
<问题或已做的修复>
EOF
echo "exit=$?"
```

退出码为 0 且 `followup.md` 非空才算拿到回答，失败时按第 3 步的规则处理。

改动范围已明显变化，或用户要求完整复审时，再回到第 1 步新开一次。
