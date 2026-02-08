# Monorepo 详细配置

## 目录

- [Turborepo 配置](#turborepo-配置)
- [根 package.json](#根-packagejson)
- [packages/config-typescript](#packagesconfig-typescript)
- [packages/ui](#packagesui)
- [packages/shared](#packagesshared)
- [packages/database](#packagesdatabase)
- [apps/web (Next.js)](#appsweb)
- [apps/server (Elysia/Hono)](#appsserver)
- [Biome 配置](#biome-配置)
- [Knip 配置](#knip-配置)
- [Husky 配置](#husky-配置)

---

## Turborepo 配置

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "check": {},
    "test": {}
  }
}
```

## 根 package.json

```json
{
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "test": "turbo test",
    "check": "turbo check",
    "prepare": "husky"
  },
  "devDependencies": {
    "@biomejs/biome": "latest",
    "husky": "latest",
    "knip": "latest",
    "turbo": "latest"
  },
  "packageManager": "bun@latest"
}
```

Workspace 始终通过 `pnpm-workspace.yaml` 声明（Turborepo 要求）：

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

## packages/config-typescript

共享 TypeScript 配置，其他 package 通过 `extends` 引用。

```json
// packages/config-typescript/base.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "noUncheckedIndexedAccess": true
  },
  "exclude": ["node_modules"]
}
```

```json
// packages/config-typescript/nextjs.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "module": "ESNext",
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```json
// packages/config-typescript/library.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

```json
// packages/config-typescript/package.json
{
  "name": "@repo/config-typescript",
  "private": true,
  "files": ["base.json", "nextjs.json", "library.json"]
}
```

## packages/ui

共享 shadcn/ui 组件库。不打包，直接通过 TypeScript paths 引用。

```json
// packages/ui/package.json
{
  "name": "@repo/ui",
  "private": true,
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts",
    "./globals.css": "./src/globals.css"
  },
  "devDependencies": {
    "@repo/config-typescript": "workspace:*",
    "typescript": "latest"
  },
  "dependencies": {
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  }
}
```

```
packages/ui/
├── src/
│   ├── components/       # shadcn/ui 组件（通过 CLI 安装）
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts      # cn() 工具函数
│   └── globals.css        # Tailwind v4 + 设计 tokens
├── components.json        # shadcn/ui CLI 配置
├── package.json
└── tsconfig.json
```

```typescript
// packages/ui/src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

在 `apps/web` 中引用：

```typescript
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
```

## packages/shared

跨 app 共享的类型定义、Zod schema、工具函数。

```json
// packages/shared/package.json
{
  "name": "@repo/shared",
  "private": true,
  "exports": {
    "./schemas/*": "./src/schemas/*.ts",
    "./types/*": "./src/types/*.ts",
    "./utils/*": "./src/utils/*.ts"
  },
  "dependencies": {
    "zod": "^4.0.0"
  }
}
```

```
packages/shared/
├── src/
│   ├── schemas/          # Zod v4 验证 schema
│   │   ├── user.ts
│   │   └── ...
│   ├── types/            # 共享 TypeScript 类型
│   │   └── index.ts
│   └── utils/            # 共享工具函数
│       └── index.ts
├── package.json
└── tsconfig.json
```

## packages/database

Drizzle ORM schema 和迁移配置。

```json
// packages/database/package.json
{
  "name": "@repo/database",
  "private": true,
  "exports": {
    ".": "./src/index.ts",
    "./schema": "./src/schema/index.ts"
  },
  "scripts": {
    "generate": "drizzle-kit generate",
    "migrate": "drizzle-kit migrate",
    "studio": "drizzle-kit studio"
  },
  "dependencies": {
    "drizzle-orm": "latest"
  },
  "devDependencies": {
    "drizzle-kit": "latest"
  }
}
```

```
packages/database/
├── src/
│   ├── schema/           # Drizzle table 定义
│   │   ├── user.ts
│   │   └── index.ts      # 统一导出
│   ├── index.ts          # db 实例导出
│   └── migrate.ts        # 迁移入口
├── drizzle.config.ts
├── drizzle/              # 生成的迁移文件
├── package.json
└── tsconfig.json
```

## apps/web

Next.js App Router 应用。

```json
// apps/web/package.json
{
  "name": "@repo/web",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/shared": "workspace:*",
    "@repo/database": "workspace:*",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  }
}
```

```
apps/web/
├── src/
│   ├── app/              # App Router 页面
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── (features)/   # feature-based 路由分组
│   ├── features/         # 功能模块（组件 + hooks + 逻辑）
│   │   ├── auth/
│   │   └── dashboard/
│   ├── lib/              # 项目级工具
│   └── env.ts            # @t3-oss/env-nextjs 配置
├── next.config.ts
├── package.json
└── tsconfig.json          # extends @repo/config-typescript/nextjs.json
```

## apps/server

独立后端服务（按需创建）。

**Elysia (Bun):**

```json
// apps/server/package.json
{
  "name": "@repo/server",
  "private": true,
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts"
  },
  "dependencies": {
    "@repo/shared": "workspace:*",
    "@repo/database": "workspace:*",
    "elysia": "latest",
    "@elysiajs/eden": "latest"
  }
}
```

**Hono (Node，Bun 不兼容时):**

```json
// apps/server/package.json
{
  "name": "@repo/server",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@repo/shared": "workspace:*",
    "@repo/database": "workspace:*",
    "hono": "latest"
  }
}
```

同一 monorepo 可以同时存在多个 server app（如 `apps/elysia-server` + `apps/hono-server`）。

## Biome 配置

```json
// biome.json (根目录)
{
  "$schema": "https://biomejs.dev/schemas/latest/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "useExhaustiveDependencies": "error",
        "noUnusedVariables": "error",
        "noUnusedImports": "error"
      },
      "suspicious": {
        "noExplicitAny": "error"
      },
      "style": {
        "noNonNullAssertion": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "asNeeded"
    }
  }
}
```

## Knip 配置

```json
// knip.json (根目录)
{
  "$schema": "https://unpkg.com/knip@latest/schema.json",
  "workspaces": {
    "apps/web": {
      "entry": ["src/app/**/page.tsx", "src/app/**/layout.tsx", "src/app/**/route.ts"],
      "project": ["src/**/*.{ts,tsx}"]
    },
    "apps/server": {
      "entry": ["src/index.ts"],
      "project": ["src/**/*.ts"]
    },
    "packages/ui": {
      "entry": ["src/components/*.tsx", "src/lib/*.ts"],
      "project": ["src/**/*.{ts,tsx}"]
    },
    "packages/shared": {
      "entry": ["src/**/*.ts"],
      "project": ["src/**/*.ts"]
    },
    "packages/database": {
      "entry": ["src/index.ts", "src/schema/index.ts"],
      "project": ["src/**/*.ts"]
    }
  }
}
```

## Husky 配置

```bash
# 初始化
bunx husky init

# .husky/pre-commit
bunx biome check --staged --no-errors-on-unmatched --files-ignore-unknown=true
```

保持 pre-commit hook 轻量，只运行 Biome check。完整 lint 和测试放在 CI 中。
