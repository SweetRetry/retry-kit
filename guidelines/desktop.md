# Desktop

桌面应用的形态，来源是 deja 与 ncm-lite。界面是 React，原生能力放在很薄的 Rust 层。

## 选型

| 能力 | 选择 | 备注 |
| --- | --- | --- |
| 壳 | Tauri 2 | 需要 Rust 工具链 |
| 构建 | Vite，`@tailwindcss/vite` | |
| 路由 | TanStack Router | 单窗口应用，不用 Next.js |
| 界面 | React 19、Tailwind CSS v4、shadcn/ui on Base UI | 沿用 [frontend.md](frontend.md) |
| 状态 | zustand | |
| 本地存储 | SQLite，经 `rusqlite`（bundled）；向量用 `sqlite-vec` | 数据多时放原生层 |
| 文件系统 | `notify` 监听，`trash` 删除到废纸篓 | |
| 网络 | `reqwest`（rustls） | 需要在原生层发请求时 |
| 窗口与快捷键 | `tauri-plugin-window-state`、`tauri-plugin-global-shortcut`、`tauri-plugin-dialog` | |
| macOS 特性 | `objc2` 系列 crate | 仅在 `cfg(target_os = "macos")` 下依赖 |
| 端到端 | Playwright | |

## 边界

- 原生层保持很薄，只暴露界面做不到的能力。ncm-lite 的原生层只暴露一个命令，其余全在前端。
- 凭据只在原生进程里使用，不进入网页层。网页层只拿到处理后的结果。
- 前端只调用相对路径的 `fetch("/api/...")` 这类稳定接口，协议适配留在原生层。换协议时只改原生层。
- 快捷键清单放在单个文件里，应用内的帮助从同一份清单生成，不分别维护。
- 本地模型作为 sidecar 进程运行，查询与数据不离开本机。sidecar 有自己的冒烟脚本。
- 端到端用一个只在 `e2e` feature 下编译的测试后端，发布包不包含它。

## 工程

- 工作区沿用 [architecture.md](architecture.md)：`apps/desktop` 是 Tauri 应用，`src` 是界面，`src-tauri` 是原生层，`packages/ui` 放 shadcn 组件与主题 token。
- 构建产物打包在 `src-tauri/target/release/bundle`。
- 日志与诊断不使用 [observability.md](observability.md) 的服务端方案，桌面应用目前没有统一约定。
