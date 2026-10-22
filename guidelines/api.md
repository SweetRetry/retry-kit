# API

约束应用控制的 HTTP API 出口。`/api/auth/*` 由 Better Auth 接管，代理或网关生成的响应不在保证范围内。HTTP 语义以 RFC 9110 为准，错误体以 RFC 9457 为准。

## 契约

1. **单一真源**：`/api/openapi.json` 由 Zod schema 经 `@hono/zod-openapi` 派生，`/api/docs` 是同源文档页。不手写 spec，不提交静态副本。
2. **成功直接表达结果**：使用符合操作语义的 2xx，JSON 直接返回资源或结果。不加 `{ success, code, message, data }` 包装。
3. **错误统一格式**：应用控制的 4xx 与 5xx 使用 RFC 9457 Problem Details，媒体类型 `application/problem+json`。
4. **构建集中在一处**：错误只经一个 `problemResponse(c, input)` 构造，`input` 为 `{ status, title, code?, detail?, type?, invalidParams? }`。
5. **`status` 同时决定 HTTP 状态码**，body 与状态码严格一致。`instance` 默认取请求路径。部署在 Cloudflare 时改用 `urn:cf-ray:<id>`，用户的错误报告凭它就能在 Workers Logs 里找到那次请求。
6. **不泄漏内部信息**：`detail` 面向调用方说明问题与纠正方式，不含堆栈、SQL、内部主机名或原始 Zod 错误。
7. **公开错误类型用绝对 URI**：`https://<域名>/problems/<slug>`，`slug` 一般是 `code` 的小写连字符形式。不对外承诺的类别省略 `type`，落到 `about:blank`，此时状态码承载语义，`title` 就是状态短语。

## 成功响应

| 状态 | 使用场景 |
| --- | --- |
| `200 OK` | 读取成功，或操作完成并返回结果 |
| `201 Created` | 已创建资源，用 `Location` 标识主要新资源 |
| `202 Accepted` | 已接受但未完成，说明处理状态与结果获取方式 |
| `204 No Content` | 操作完成且无响应体，不发送 JSON、`null` 或空对象 |

- 失败用 4xx 与 5xx，不以 `200` 加 `success: false` 表达。
- 集合查询无匹配项返回 `200` 与空集合，不返回 `404`。
- 业务状态字段属于资源数据，不替代 HTTP 状态码。
- 成功响应只含公开 schema 的字段，不暴露数据库内部字段。

## 路径与方法

- 统一前缀 `/api`。早期不引入版本段，破坏性变更优先以新增字段、新资源路径或新错误 code 的兼容方式演进。出现无法兼容的变更时，由新的 ADR 决定版本化方案。
- 资源路径加 HTTP 方法。非 CRUD 操作用子资源路径，如 `POST /orders/{id}/cancel`，不建动词式顶层路径。
- 部分更新用 `PATCH`，全量替换用 `PUT`。
- `GET`、`PUT`、`PATCH`、`DELETE` 保持幂等。`POST` 不承诺幂等，可重试的写操作由调用方带幂等键或由唯一约束兜底。
- 不追求 HATEOAS 或统一资源发现入口，API 由 `openapi.json` 与 SDK 类型描述。

## 错误选择

| code | 语义 |
| --- | --- |
| `VALIDATION_ERROR` | 输入不符合 schema，字段错误放进 `invalidParams` |
| `UNAUTHORIZED` | 凭据缺失、无效或过期 |
| `FORBIDDEN` | 资源可见，但当前身份无权执行该操作 |
| `NOT_FOUND` | 资源不存在，或已认证身份无权知道其存在 |
| `CONFLICT` | 与当前资源状态冲突 |
| `TOO_MANY_REQUESTS` | 超过限流阈值，配合 `Retry-After` |
| `SERVICE_UNAVAILABLE` | 依赖未配置或暂时不可用 |
| `INTERNAL_SERVER_ERROR` | 未预期的服务端失败，带 `traceId` |

- 无权知道资源是否存在时返回 `404`，用 `403` 会泄漏存在性。
- 认证缺失或无效一律 `401`，即使资源不存在。资源存在性只在认证后判断。
- 保留协议要求的响应头，如 `401` 的 `WWW-Authenticate`、`405` 的 `Allow`。
- 校验失败要并入 problem 响应。`@hono/zod-openapi` 在没有 `defaultHook` 时返回带 Zod 原始错误的 JSON，在创建 `OpenAPIHono` 实例时统一配置 `defaultHook`，把失败交给 problem 构造函数。

## 新增错误类型

1. 状态码已经自解释吗，比如普通的 `403` 与 `404`？是，则复用，不为具体资源另加 `code`。
2. 是新的语义类别，还是同一类的多个实例？多个字段校验失败属于后者，用 `invalidParams` 承载。一次响应只描述一个问题。
3. 通过后，在产出错误的同一处同时给出 `status`、`title`、`type`、`code`，并在路由的响应声明里登记该状态。
4. 改名或删除已发布的 `type` 与 `code` 是破坏性变更。
5. 扩展成员名以字母开头、三位以上、只含字母数字与 `_`。

## 客户端消费

- 共享 request 包是唯一解析点。`type`、`title`、`status` 都命中才视为 problem，包装为带 `code`、`status`、`problem` 的错误类，否则退回原始 HTTP 错误。
- 业务分支只看 `code` 与 `status`，展示用 `detail` 与 `title`。不解析字符串内容做逻辑分支。
- 必须完整匹配 `type` URI、`code` 与状态，不能只匹配 URI 最后一段。客户端忽略不认识的扩展成员。

## 验收

- [ ] 非 2xx 响应的媒体类型是 `application/problem+json`，body 的 `status` 与状态码一致。
- [ ] 错误经统一构造函数产出，没有手写错误 JSON。
- [ ] 新增对外错误类型有绝对 URI 与同名 `code`，并在路由声明里登记。
- [ ] 不可见资源返回 `404`，认证缺失返回 `401`。
- [ ] 错误体没有堆栈、SQL、内部主机名和 Zod 原始错误。

验证靠 HTTP 测试断言状态码、`content-type` 与 body，加类型约束和 OpenAPI 快照。不做源码正则扫描，因为状态码与媒体类型在运行期决定。
