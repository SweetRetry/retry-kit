---
name: python-web-api-best-practices
description: >
  Python Web API 项目结构与工程最佳实践规范。基于 Sentry、Superset、Zulip、NetBox 等
  高星生产项目的实际架构分析，以及 FastAPI 社区共识，指导 Python Web API 项目的
  目录布局、模块组织、分层架构、配置管理、依赖管理和常见反模式规避。
  触发场景：(1) 初始化新的 Python Web API 项目，(2) 为 Python 项目添加新领域模块/路由/服务，
  (3) Python 项目结构审查或重构，(4) 讨论 Python 项目的 app/src/models/routes 等目录该怎么组织，
  (5) 用户提到 Python 项目布局、Python 目录结构、Python 模块设计，
  (6) 用户在写 Python 代码时出现 utils/helpers/common 等反模式包名，
  (7) 用户在决定 Python 代码放哪个目录、怎么拆模块、怎么分层时。
  即使用户没有明确提到"项目结构"，只要是在创建 Python 模块或包时需要做目录/命名决策，也应使用此 skill。
  注意：本 skill 专注于 Web API 业务项目（非 library/SDK），框架以 FastAPI 为主。
---

# Python Web API Project Best Practices

基于对 8 个高星生产项目（Sentry 43k⭐、Superset 71k⭐、Zulip 25k⭐、NetBox 20k⭐、Paperless-ngx 37k⭐、Plane 46k⭐、Label Studio 27k⭐、Airflow 45k⭐）的实际架构分析，结合 [FastAPI best practices](https://github.com/zhanymkanov/fastapi-best-practices)、[Cosmic Python](https://www.cosmicpython.com/) 和 PyPA 官方指南的综合规范。

> **核心原则**：业务项目不是 library。不需要分发到 PyPI，不需要 `src/` layout 防误导入，结构应该从业务领域中自然生长。

---

## 1. 按项目规模选择结构

### 小型项目（PoC、单文件 API、内部工具）

一个 `main.py` + `pyproject.toml` 就够了。

```
myapi/
├── pyproject.toml
├── main.py              # FastAPI app
├── config.py
├── models.py
└── .env
```

当文件超过 7-8 个、或开始有多个领域模块时，再引入目录结构。

### 中型项目（单服务、有一定复杂度）

```
myapi/
├── pyproject.toml
├── uv.lock
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app 实例 + lifespan
│   ├── config.py            # Pydantic BaseSettings
│   ├── database.py          # Engine + SessionLocal
│   ├── dependencies.py      # 公共依赖（get_db, get_current_user）
│   │
│   ├── user/                # 按领域组织，不按技术层
│   │   ├── __init__.py
│   │   ├── router.py        # APIRouter + 路由定义
│   │   ├── schemas.py       # Pydantic request/response models
│   │   ├── models.py        # SQLAlchemy ORM models
│   │   ├── service.py       # 业务逻辑
│   │   └── repository.py    # 数据访问
│   ├── auth/
│   └── order/
│
├── alembic/                 # 数据库迁移
│   ├── alembic.ini
│   └── versions/
├── tests/
│   ├── conftest.py
│   ├── test_user/
│   └── test_auth/
├── Dockerfile
└── docker-compose.yml
```

### 大型项目（多入口、团队协作）

```
myapi/
├── pyproject.toml
├── uv.lock
├── app/                         # 应用代码
│   ├── __init__.py
│   ├── main.py                  # API 入口
│   ├── worker.py                # Celery/后台任务入口
│   ├── config.py
│   ├── database.py
│   ├── dependencies.py
│   │
│   ├── # --- 领域模块 ---
│   ├── user/
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   ├── service.py
│   │   ├── repository.py
│   │   └── tasks.py             # 该领域的后台任务
│   ├── order/
│   ├── payment/
│   ├── notification/
│   │
│   ├── # --- 基础设施 ---
│   ├── infra/
│   │   ├── cache.py             # Redis 封装
│   │   ├── storage.py           # 对象存储
│   │   ├── email.py             # 邮件服务
│   │   └── aigc/                # AI 生成服务
│   │       ├── provider.py      # 接口定义
│   │       └── ark.py           # 具体实现
│   │
│   ├── # --- 横切关注点 ---
│   ├── middleware/
│   └── core/                    # 共享基类、异常定义、权限
│       ├── exceptions.py
│       ├── pagination.py
│       └── permissions.py
│
├── alembic/
├── tests/
│   ├── conftest.py
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/                     # 运维/数据脚本
├── docs/
├── Dockerfile
├── docker-compose.yml
└── Makefile
```

---

## 2. 核心目录详解

### `app/` — 应用代码根目录

业务项目用 `app/`（或项目名如 `myapi/`），不用 `src/`。

**为什么不用 `src/` layout？**
- `src/` layout 的价值是防止开发时意外导入本地代码覆盖已安装版本——这是 **library** 的问题
- 业务项目通过 Docker 部署，不会 `pip install` 自己，没有这个风险
- FastAPI 官方模板（28k⭐）、Superset、NetBox、Zulip 都不用 `src/`
- Sentry 和 Paperless 用 `src/`，但它们也有 library 组件需要分发

**例外**：如果项目同时包含可分发的 SDK/CLI 工具（如 Sentry），`src/` 是合理的。

### 领域模块 — 项目的核心组织单元

**每个领域模块是一个自包含的 Python 包**，内部文件按职责命名：

| 文件 | 职责 | 对应 FastAPI 组件 |
|---|---|---|
| `router.py` | HTTP 入口，参数校验，调用 service | `APIRouter` |
| `schemas.py` | 请求/响应数据结构 | Pydantic model |
| `models.py` | ORM 模型（数据库表映射） | SQLAlchemy model |
| `service.py` | 业务逻辑（纯 Python，不依赖框架） | 普通类/函数 |
| `repository.py` | 数据访问封装（可选，小项目直接在 service 中查询） | 普通类 |
| `tasks.py` | 后台/异步任务 | Celery task |
| `dependencies.py` | 该领域的依赖注入 | `Depends()` 工厂 |
| `exceptions.py` | 该领域的自定义异常 | 按需 |

**按领域组织，不按技术层组织：**

```
# 正确 — 按领域
app/
├── user/            # 用户相关的 router + service + model 都在这
├── order/
└── payment/

# 错误 — 按技术层
app/
├── routers/         # 所有路由混在一起
├── services/        # 所有 service 混在一起
├── models/          # 所有 model 混在一起
└── schemas/         # 所有 schema 混在一起
```

**来自生产项目的证据**：
- zhanymkanov/fastapi-best-practices（9k⭐）明确表示按技术层组织"didn't scale well for our monolith with many domains"
- NetBox（20k⭐）所有领域 app 内部结构完全一致，是最有纪律性的范例
- Zulip（25k⭐）虽然是单 app，但 `models/`、`views/`、`actions/` 内部都按领域实体拆分文件

### 配置管理

**Pydantic BaseSettings 是事实标准：**

```python
# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    # 数据库
    database_url: str
    db_pool_size: int = 5

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # 安全
    secret_key: str
    access_token_expire_minutes: int = 30

    # 外部服务
    aigc_api_key: str = ""

settings = Settings()
```

**原则**：
- 敏感值（密钥、密码）只走环境变量，不入代码库
- `.env` 文件加入 `.gitignore`，提供 `.env.example` 作为模板
- 配置在应用启动时一次性加载，不在业务代码中直接 `os.environ`
- 多环境切换：通过不同的 `.env` 文件或环境变量覆盖，不在代码里 if-else 判断环境

### 测试组织

**两种主流方式，都被生产项目验证过：**

| 方式 | 采用者 | 适用场景 |
|---|---|---|
| 独立 `tests/` 目录 | Sentry、Superset、FastAPI 模板 | 测试有独立的 fixtures/工厂，或需要 e2e 测试 |
| 随领域模块 `user/tests/` | NetBox、Paperless、Zulip | 测试与代码紧密耦合，改功能时测试显眼 |

**推荐**：中小项目用独立 `tests/`（结构简单），大型项目按领域放测试（改哪测哪）。

**测试按类型分级**（大型项目）：

```
tests/
├── conftest.py          # 共享 fixtures（db session, test client, factory）
├── unit/                # 纯逻辑，不依赖数据库/网络
│   ├── test_user_service.py
│   └── test_order_service.py
├── integration/         # 依赖数据库，测试 repo/service 协作
│   ├── test_user_repo.py
│   └── test_order_flow.py
└── e2e/                 # 完整 HTTP 请求，测试路由到数据库全链路
    ├── test_user_api.py
    └── test_auth_api.py
```

---

## 3. 模块命名规则

### 包/目录命名

1. **全小写、下划线分隔**：`user_profile`、`order_item`（PEP 8）
2. **单数形式优先**：`user` 不是 `users`，`order` 不是 `orders`
3. **用领域语言命名**：`payment`、`notification`、`inventory`（不是 `pay_module`、`notify_service`）

### 文件命名

```
# 正确 — 文件名反映职责
user/
├── router.py          # 路由定义
├── service.py         # 业务逻辑
├── repository.py      # 数据访问
├── schemas.py         # 数据结构
└── models.py          # ORM 模型

# 错误 — 文件名含冗余前缀
user/
├── user_router.py     # 已经在 user/ 下了，不需要再加 user_ 前缀
├── user_service.py
└── user_model.py
```

### 类/函数命名

```python
# 正确 — 包名提供上下文
# 调用方写 from app.user.service import UserService
class UserService:
    def create(self, data: CreateUserRequest) -> User: ...
    def find_by_id(self, user_id: int) -> User | None: ...

# 错误 — 冗余命名
class UserUserService:  # 包名已经是 user 了
    def create_user(self, ...): ...  # service 已经是 UserService 了
```

---

## 4. 反模式清单

### 绝对禁止

| 反模式 | 问题 | 替代 |
|---|---|---|
| `utils.py` / `helpers.py` / `common.py` 超过 200 行 | 语义空洞的垃圾抽屉，什么都往里塞 | 按功能命名：`hashing.py`、`pagination.py`、`time_utils.py` |
| 路由函数里写业务逻辑 | 无法复用、无法单测、handler 膨胀 | 提取到 `service.py`，路由只做：校验 → 调 service → 返回 |
| 一个 Model 贯穿请求/数据库/响应 | 层间强耦合，改 API 影响数据库 | 请求用 Schema，存储用 ORM Model，响应用 Response Schema |
| `from app.* import *` | 命名空间污染，隐式依赖 | 显式导入具体名称 |
| 在业务代码中直接 `os.environ["KEY"]` | 散弹式配置，无默认值，无类型 | 集中到 `config.py`，用 Pydantic BaseSettings |
| 循环导入 | ImportError | 提取共享类型到 `core/`，或延迟导入（`TYPE_CHECKING`） |

### 应当避免

| 反模式 | 问题 | 替代 |
|---|---|---|
| 过深嵌套 `app/modules/user/api/v1/endpoints/` | 导航噩梦 | 扁平化：`app/user/router.py` |
| 每个领域模块都有 `__init__.py` 做大量 re-export | 隐藏真实依赖关系 | `__init__.py` 保持为空或极简 |
| 在 `models.py` 里写业务逻辑（Fat Model） | ORM 模型承担过多职责 | 业务逻辑放 `service.py`，模型只管数据映射 |
| 过早引入 Repository 模式 | 小项目增加不必要的间接层 | 文件数 < 20 时，service 直接查询数据库即可 |
| 为每个异常写自定义 Exception 类 | 异常类爆炸 | 用少量通用异常 + 错误码/消息区分 |
| `requirements.txt` 手动维护版本 | 依赖冲突、无 lock file | 用 `uv`（推荐）或 `poetry` 管理 |

---

## 5. 分层架构实践

### 业务逻辑层是关键

**生产项目中最重要的架构发现**：成熟项目都有显式的业务逻辑层，把逻辑从 handler 和 model 中抽出来。

| 项目 | 业务逻辑层名称 | 位置 |
|---|---|---|
| Zulip (25k⭐) | `actions/` | `zerver/actions/message_send.py` |
| Superset (71k⭐) | `commands/` | `superset/commands/chart/create.py` |
| Sentry (43k⭐) | 领域模块内 | `sentry/incidents/logic.py` |
| NetBox (20k⭐) | views 内聚 | 简单 CRUD 不需要额外层 |

**薄路由 + 厚 service 示例：**

```python
# app/user/router.py — 薄路由，只做 HTTP 关注点
@router.post("/users", response_model=UserResponse, status_code=201)
async def create_user(
    data: CreateUserRequest,
    service: UserService = Depends(get_user_service),
):
    user = await service.create(data)
    return UserResponse.model_validate(user)


# app/user/service.py — 业务逻辑，纯 Python
class UserService:
    def __init__(self, db: AsyncSession, cache: Redis):
        self.db = db
        self.cache = cache

    async def create(self, data: CreateUserRequest) -> User:
        # 业务规则校验
        existing = await self.db.scalar(
            select(User).where(User.email == data.email)
        )
        if existing:
            raise DuplicateEmailError(data.email)

        user = User(name=data.name, email=data.email)
        self.db.add(user)
        await self.db.flush()
        return user
```

### 模型分离

```python
# app/user/models.py — ORM 模型（数据库关注点）
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(default=func.now())


# app/user/schemas.py — API 关注点（请求/响应）
class CreateUserRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    created_at: datetime
    # 注意：不暴露 hashed_password
```

### 依赖注入

FastAPI 的 `Depends()` 是组装 service 依赖的核心机制：

```python
# app/dependencies.py — 公共依赖
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    payload = verify_token(token)
    user = await db.get(User, payload.sub)
    if not user:
        raise HTTPException(status_code=401)
    return user


# app/user/dependencies.py — 领域专属依赖
def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db=db)
```

### 事务边界

```python
# 正确 — 事务在 service 层，一个业务操作一个事务
async def transfer_order(self, from_id: int, to_id: int, amount: Decimal):
    async with self.db.begin():  # 事务范围 = 业务操作范围
        from_account = await self.db.get(Account, from_id, with_for_update=True)
        to_account = await self.db.get(Account, to_id, with_for_update=True)
        from_account.balance -= amount
        to_account.balance += amount

# 错误 — 路由里手动管事务
@router.post("/transfer")
async def transfer(data: TransferRequest, db: AsyncSession = Depends(get_db)):
    async with db.begin():  # 路由不应该知道事务
        ...
```

---

## 6. 依赖管理

### 工具选择（2025+ 推荐顺序）

| 工具 | 推荐度 | 理由 |
|---|---|---|
| **uv** | 首选 | Rust 实现，速度极快，替代 pip/pip-tools/venv，Sentry/Zulip/Paperless 已采用 |
| **poetry** | 可选 | 成熟稳定，Label Studio 在用，但比 uv 慢 |
| pip + requirements.txt | 遗留 | 手动维护痛苦，无 lock file 保证 |

### 关键实践

- `pyproject.toml` 作为**唯一**的项目元数据和工具配置文件
- `uv.lock` / `poetry.lock` 必须提交到版本控制
- **业务项目锁定精确版本**（与 library 的宽松范围不同）
- 区分运行依赖和开发依赖：

```toml
# pyproject.toml
[project]
dependencies = [
    "fastapi>=0.115",
    "sqlalchemy>=2.0",
    "pydantic-settings>=2.0",
]

[dependency-groups]
dev = [
    "pytest>=8.0",
    "ruff>=0.8",
    "mypy>=1.0",
]
```

- **不需要 `[build-system]`**（业务项目通过 Docker 部署，不需要构建 wheel）
  - 例外：如果需要 `pip install -e .` 做开发环境导入，则需要声明 build backend

### uv 的 app vs lib 区分

`uv` 是第一个显式区分应用和库的工具：

```bash
uv init --app myapi      # 应用：flat layout，省略 [build-system]
uv init --lib mylib       # 库：src/ layout，包含 [build-system]
```

---

## 7. 数据库迁移

### Alembic（FastAPI + SQLAlchemy 的标配）

```
alembic/
├── alembic.ini
├── env.py               # 导入所有 models，配置 target_metadata
├── script.py.mako
└── versions/
    ├── 001_create_users.py
    └── 002_add_orders.py
```

**关键**：`env.py` 中必须导入所有 ORM 模型，否则 `--autogenerate` 检测不到变更。

**常见做法**：在 `app/models/__init__.py` 或 `app/database.py` 中统一导入所有领域的 model，Alembic 的 `env.py` 只需导入这一个入口。

```python
# alembic/env.py
from app.database import Base  # Base.metadata 包含所有已注册的 model
target_metadata = Base.metadata
```

---

## 8. 反模式清单（生产项目验证）

### 来自真实项目的教训

| 反模式 | 在哪里见过问题 | 正确做法 |
|---|---|---|
| 按技术层组织目录 | fastapi-best-practices（9k⭐）明确否定 | 按业务领域组织 |
| Fat View/Router（路由里写一切） | FastAPI 新手最常见的问题 | 路由只做：校验 → 调 service → 返回 |
| 单个巨大的 `main.py` | 超过 200 行就难以维护 | 拆分为领域模块，main.py 只做 app 实例 + router 注册 |
| 所有配置散落在各处 `os.environ` | 无法追踪哪些环境变量被使用 | 集中到 `config.py`，Pydantic BaseSettings 自动校验 |
| 在 router 中直接操作 ORM session | 路由与数据库耦合，无法测试业务逻辑 | 通过 `Depends()` 注入 service |
| Pydantic model 与 ORM model 混用 | 改 API 字段就改了数据库 schema | 分开：`schemas.py`（API）vs `models.py`（DB） |

---

## 9. 决策速查

### 代码放哪里？

```
这段代码属于哪一类？
│
├── HTTP 路由定义、请求/响应处理？
│   → router.py
│
├── 请求/响应的数据结构？
│   → schemas.py
│
├── 数据库表映射？
│   → models.py
│
├── 业务规则、流程编排？
│   → service.py
│
├── 数据库查询封装？
│   → repository.py（大项目）或直接写在 service.py（小项目）
│
├── 后台/异步任务？
│   → tasks.py
│
├── 该领域的依赖注入工厂？
│   → dependencies.py（领域级）或 app/dependencies.py（全局级）
│
├── 多个领域共享的基础能力（分页、权限、异常）？
│   → core/ 目录
│
├── 外部服务集成（Redis、S3、第三方 API）？
│   → infra/ 目录
│
└── 项目还很小（< 8 个文件）？
    → 全部平铺在根目录，别急着建结构
```

### 要不要引入 Repository 层？

```
你的项目满足以下任一条件吗？
│
├── 同一份数据需要从多个来源获取（DB + Cache + 外部 API）？ → 是，用 Repository
├── 需要对数据访问层做单元测试 mock？ → 是，用 Repository
├── 领域模块超过 10 个，团队超过 3 人？ → 是，用 Repository
│
└── 以上都不是？ → 不用，service 直接查数据库
```

---

## 10. 代码风格速查

| 主题 | 规则 |
|---|---|
| 格式化 + Lint | `ruff`（替代 black + isort + flake8，一个工具搞定） |
| 类型检查 | `mypy --strict` 或 `pyright`（新代码必须有 type hints） |
| 命名 | `snake_case`（变量/函数/模块），`PascalCase`（类），`UPPER_CASE`（常量） |
| 导入排序 | 标准库 → 第三方 → 本项目（ruff 自动处理） |
| docstring | 公共 API 写，内部函数只在逻辑不显而易见时写 |
| 异步 | FastAPI 项目优先 `async def`；I/O 密集用 async，CPU 密集用同步 + 线程池 |
| 类型标注 | 用 `X | None` 不用 `Optional[X]`（Python 3.10+）；用 `list[int]` 不用 `List[int]` |

### pyproject.toml 工具配置示例

```toml
[tool.ruff]
target-version = "py312"
line-length = 120

[tool.ruff.lint]
select = ["E", "F", "I", "N", "UP", "B", "SIM", "RUF"]

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]

[tool.mypy]
python_version = "3.12"
strict = true
plugins = ["pydantic.mypy"]
```
