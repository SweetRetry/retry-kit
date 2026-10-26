# 界面韧性

任何数据极值、异步切换与状态退场，都不撑破布局、不发生位移、不闪空内容。

## 1. 加载

- **首次加载（冷加载）**：结构固定的内容（卡片、表格、媒体）用 `aspect-*` 或 1:1 骨架屏占位；动态长流（文章、评论）只留 `min-h-[1lh]`，避免空数据时二次坍塌。
- **翻页、筛选、刷新**：keep previous data（TanStack Query 的 `placeholderData: keepPreviousData`），旧数据留在原处 `opacity-60`，新数据返回后原地替换，不退回骨架屏；加载反馈放在触发控件（按钮内 Spinner、Tab、边缘细进度条）。骨架屏只用于没有旧数据的冷加载；清空搜索或重置视图时直接清空。
- **控件**：按钮进入加载或禁用态时锁定宽高。

## 2. 卡片网格等高

同排卡片根节点 `h-full flex flex-col`；标题 `line-clamp-2` 或设最小高度，正文 `flex-1`，底部操作 `mt-auto`；媒体显式声明比例（`aspect-video w-full object-cover`）。

## 3. 空值

- **空态体量随容器**：主工作区为空时渲染完整空状态（标题、一句说明、主按钮）；卡片、侧栏或弹窗内的子列表为空时只留一行 `text-sm text-muted-foreground`，或隐藏该区块。空状态不套 `border-dashed` 虚线框。
- **缺失**：缺失文本留 `min-h-[1lh]` 或 `"—"`。占位区分未加载、空、缺失与失败，不用默认值掩盖。
- **报错**：有校验的字段底部只留一个 `min-h-5` 辅助槽，报错出现时不推挤下方控件；字段带静态说明（`FieldDescription`）时，报错在该槽位内原地替换说明，不把说明与空报错槽上下叠放；无校验的字段不预留空槽。

## 4. 溢出（Defensive CSS）

- 含动态文本的 Flex/Grid 子项加 `min-w-0`，长文本 `truncate` 或 `line-clamp-*`；被截断的业务名称用 Tooltip 或详情承接全文。
- 无空格长串（UUID、密钥、URL、哈希、文件路径）按所处结构分流：与按钮水平并排或需整段选中的单值容器保持单行（`<Input readOnly>` 或 `whitespace-nowrap overflow-x-auto`），不用 `break-all` 折行撑高；只需识别的列表项用 `truncate` 或保留首尾的中段省略；独立占块的多行流（日志、堆栈）才用 `break-all`。
- 裁切容器（`overflow-hidden`、`overflow-x-auto`）内贴边的 Input 与 Button 至少留 `p-0.5`，focus ring 不被边缘切掉。

## 5. 退出过渡

退出过渡期间内容停在退出前的状态：触发退出的回调只负责退出，不改写即将消失的视图层级、选择、草稿、文案或计数；需要重置的状态在下次进入时重置。浮层关闭、toast 消失、折叠收起与列表项移除同理。

从菜单项打开 Dialog / AlertDialog 时，弹窗用受控 `open` 状态挂在菜单外、与菜单平级；嵌在菜单项里会随菜单关闭卸载，弹窗闪退或残留指针锁定。
