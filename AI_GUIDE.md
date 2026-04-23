# AI Guide (Repo Conventions)

This repo is a **frontend-only** TypeScript SPA (People Post). It contains legacy patterns and multiple ways to accomplish similar goals; this guide documents the **preferred** conventions to keep new changes consistent.

## Fast validation (what to run)

- **Install**: `npm install`
- **Primary check (required for code changes)**: `npm run build`
- **Build web2 only**: `npm run build:2`
- **Build web3 only**: `npm run build:3`
- **Dependency layering guardrail**: `npm run check-deps`
- **Type-check (known noisy)**: `npm run type-check` (strict, but the repo is mid-migration; some errors may be expected)
- **Clean**: `npm run clean`

## Directory layout (high level)

See `README.md` for build details and `doc/ComponentRelationships.md` for the intended architecture.

- `src/session/`: application shell + top-level composition (owns cross-sector wiring)
- `src/sectors/`: feature “islands” (blog, messenger, shop, …)
- `src/common/`: shared product/domain code used by multiple sectors
- `src/lib/`: low-level infrastructure & UI primitives (product-agnostic)
- `src/types/`: **declaration-only** shared TypeScript contracts

## Dependency rules (hard requirements)

`npm run check-deps` enforces these. If you violate them, the build fails.

### Layer direction (only downward)

Intended order (top imports bottom, never the reverse) is:

1. `src/lib/ext`
2. `src/lib/framework`
3. `src/lib/ui`
4. `src/common/constants`
5. `src/common/datatypes`
6. `src/common/plt`
7. `src/common/dba`
8. other `src/common/*`
9. `src/misc`, `src/sectors/*`
10. `src/session`

If you need something “from above”, pass it down as data/callbacks or define a small interface in a lower layer.

### Sector isolation (no cross-sector imports)

Files under `src/sectors/<sector>/` **must not import** from `src/sectors/<other-sector>/`.

Preferred fixes:
- Move reusable code into `src/common/*` (or lower).
- Lift wiring/composition up into `src/session/*`.

### `src/types` independence

Files under `src/types/*` may only import from:
- other `src/types/*`, or
- external package typings

They must **not** import runtime code from `src/session`, `src/sectors`, `src/common`, `src/lib`, etc.

## Naming conventions (what to follow for new code)

This codebase has established naming patterns. Prefer consistency over inventing a new scheme.

- **Files**: `PascalCase.ts` for UI/controller-ish things (common in this repo), otherwise match the surrounding folder’s convention.
- **UI/controller classes**:
  - `F*` prefix is commonly used for fragments/views (example: `FInputConsole`, `FTagsEditor`).
  - `Wc*` is used for window controllers/containers (example: `WcWeb3`).
  - `Lv*` is used for “layer” style controllers (dialogs/overlays) (example: `LvDialog`).
- **TypeScript types**:
  - Prefer `type` for unions/simple object shapes and `interface` for extensible contracts—pick one style and stay consistent within a module.
  - Use `import type { ... }` when importing types only.

## Dependency & module patterns (recommended)

### Prefer local, explicit imports

This repo does not rely on path aliases; use relative imports within a layer/feature. If a relative import gets unwieldy, it’s often a hint the code belongs in a different folder/layer.

### Where shared code should live

- **Truly generic utilities / UI primitives**: `src/lib/*`
- **Product-wide shared UI pieces**: `src/common/gui/*`
- **Domain/value objects** (no service lookups): `src/common/datatypes/*`
- **Platform glue / external integration surfaces**: `src/common/plt/*`
- **Shared stateful services & data access**: `src/common/dba/*`

If two sectors need the same thing, don’t “just import” across sectors—promote it into `src/common/*` (or lower) and keep sector folders isolated.

### Legacy co-existence (how to choose)

You will often find multiple older patterns for the same job. When adding or extending behavior:

- **Prefer extending the nearest existing pattern in that folder** (minimize churn).
- **Prefer the lowest appropriate layer** (avoid pulling higher-layer concepts downward).
- If you must introduce a new shared abstraction, put it in `src/common/*` or `src/lib/*` based on whether it is product-specific.

## Styling guidance (Tailwind v4)

Tailwind is integrated via `src/css/tailwind.css` and **utility classes use the `tw-` prefix** to avoid conflicts with legacy CSS.

- Prefer `tw-*` utilities for new UI when feasible.
- Avoid re-enabling preflight globally; it’s intentionally disabled to avoid legacy style conflicts (see `README.md`).

## Build artifacts & generated entry points

The build produces `dist/web2/` and `dist/web3/` outputs (see `README.md`). Some entry points are generated during the build process; avoid editing generated outputs in `dist/`.

### Non-obvious caveats

- **No lint command exists**: `npm run type-check` is the closest equivalent.
- **No automated tests**: `npm test` is a placeholder that exits with code 1.
- **Web3 is self-contained**: `dist/web3/index.html` can be served as static files; web2 outputs JS/CSS bundles under `dist/web2/static/` intended to be served by the separate People Post backend.
- **`pp-api` installs from GitHub**: `github:people-post/pp-api#release/v0.1.8` and may build from source during `postinstall` when `dist/` is missing (first install can be slow).
- **Local serving limitations**: serving `dist/web3/` locally can load the page, but full initialization typically requires backend P2P infrastructure; related console errors (e.g. missing PeerID / websocket failures) are expected in that environment.

## When in doubt

- Read `doc/ComponentRelationships.md` first for architectural intent.
- If a change breaks `npm run check-deps`, treat it as an architecture bug and fix the dependency direction rather than “working around” it.

