# React Starter

A modern React starter template with best-in-class tooling.

## Tech Stack

- **React 19** with React Compiler
- **TypeScript** with strict mode
- **Vite** (rolldown-vite) for blazing fast builds
- **Tailwind CSS v4** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **Biome** for linting and formatting
- **Knip** for dead code detection

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Check code with Biome |
| `pnpm lint:fix` | Fix lint issues |
| `pnpm format` | Format code with Biome |
| `pnpm knip` | Find unused code |

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
# ... add more components as needed
```

## Project Structure

```
src/
├── lib/
│   └── utils.ts      # Utility functions (cn helper)
├── components/
│   └── ui/           # shadcn/ui components
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles & Tailwind config
```

## Path Aliases

The `@/` alias is configured to point to `./src/`:

```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```
