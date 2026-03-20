# Component Relationships And Dependency Layers

This document defines the intended component relationships for the People Post frontend and records the current architecture status.

The goal is to make the dependency direction explicit so that future refactors and TypeScript migration work move the codebase toward a stable layering model instead of deepening existing coupling.

## 1. Designed Behavior: Component Relationships

### Runtime composition

The intended runtime flow is:

1. `src/app.ts` is the bootstrap entry point.
2. `src/session/` owns the application shell for each window type (`WcMain`, `WcWeb3`, `WcPortal`, `WcSub`, `WcGadget`).
3. `src/session/Gateway.ts` selects and composes sector gateways.
4. `src/sectors/` implements feature-specific behavior such as blog, frontpage, messenger, workshop, shop, hosting, and auth.
5. `src/common/` provides reusable shared code used by multiple sectors.
6. `src/lib/` provides reusable technical infrastructure that should stay product-agnostic.

That gives the application a top-down ownership model:

- `app.ts` chooses the session container.
- `session/` orchestrates the active experience and owns cross-sector composition.
- `sectors/` provide feature pages, views, and business flows.
- `common/` provides reusable domain models, constants, platform helpers, data access, and shared UI fragments.
- `lib/` provides the low-level controller, rendering, event, and utility primitives.

### Intended dependency order

The correct dependency order is:

1. `src/lib/ext`
2. `src/lib/framework`
3. `src/lib/ui`
4. `src/common/constants`
5. `src/common/datatypes`
6. `src/common/plt`
7. `src/common/dba`
8. other `src/common/*`
9. `src/sectors`
10. `src/session`

The rule is simple: dependencies should point downward only. A layer may depend on itself or on lower layers, but never on a higher layer.

### Responsibilities by layer

| Layer | Responsibility | Allowed dependency direction |
| --- | --- | --- |
| `src/lib/ext` | Lowest-level helpers, generic controllers, logging, xhr, timers, small infrastructure primitives | No application-layer imports |
| `src/lib/framework` | Generic factories, events, framework contracts | `src/lib/ext` only |
| `src/lib/ui` | Generic rendering, panels, fragments, layers, window/page/view controllers | `src/lib/framework`, `src/lib/ext` |
| `src/common/constants` | Product constants, ids, icons, string/resource identifiers | `src/lib/*` and lower only |
| `src/common/datatypes` | Shared domain value objects and model classes | `src/common/constants`, `src/lib/*` and lower only |
| `src/common/plt` | Platform glue, environment, API wrappers, shared contracts used by higher layers | `src/common/datatypes`, `src/common/constants`, `src/lib/*` and lower only |
| `src/common/dba` | Data-access and stateful shared services | `src/common/plt`, `src/common/datatypes`, `src/common/constants`, `src/lib/*` and lower only |
| other `src/common/*` | Shared feature-level code reused across sectors | lower common layers and `src/lib/*` only |
| `src/sectors` | Feature composition, sector gateways, sector-specific UI and flows | any lower layer, never `src/session`; **within `src/sectors`, only the same immediate subfolder** (e.g. `blog`, `shop`)—no imports from sibling sector folders |
| `src/session` | Application shell, top-level composition, cross-sector wiring | any lower layer |

### Intended relationship boundaries

The main relationships should be:

- `session` knows sectors; sectors do not know session.
- **Sector isolation:** each top-level folder under `src/sectors` (e.g. `blog`, `shop`, `cart`) is its own feature island. Code in one such folder must not import from another sector folder. Shared behavior belongs in `src/common` (or lower layers), which all sectors may use; cross-sector wiring stays in `src/session` (gateways/composition).
- sectors know shared code in `common`; `common` does not know sectors.
- `common` knows `lib`; `lib` does not know `common`.
- `lib/ui` may depend on `lib/framework`, but `lib/framework` must not depend on `lib/ui`.
- data models in `common/datatypes` should stay free of runtime service lookups from `common/dba`.

In practice, the architecture should resemble a composition root at the top (`session`) and reusable primitives at the bottom (`lib/ext`).

## 2. Current Status

As of the latest update, `npm run check-deps` reports no **layer** (ordering) violations. It may still report **sector cross-dependency** violations: imports between different immediate child folders of `src/sectors`. Those are architecture debt to eliminate by moving shared code to `src/common` or lifting composition to `src/session`.

Previously documented dependency debts in this file have been resolved, including:

- `lib/ui -> common/*` imports in affected controllers/fragments
- `lib/ui <-> common/plt` `PageConfig` type coupling
- `common/datatypes -> common/dba` direct dependency for `User`
- `sectors -> session` `FHomeBtn` dependency
- `common/* -> sectors/*` direct composition in shared social/search components

This means there are currently no active architecture debt items tracked in this document.

## Guardrails For New Code

New code should follow these rules:

- do not import from a higher layer to solve a local convenience problem
- do not use lazy imports to hide architectural cycles
- do not let `lib/framework/*` reference `lib/ui/*`
- do not let `lib/*` reference product-specific state, resources, or sector contracts
- do not let `sectors/*` import from `session/*`
- do not import across top-level folders under `src/sectors` (e.g. `sectors/shop` must not import `sectors/cart`; use `common` or session composition instead)
- when a lower layer needs information from a higher layer, pass it in as data, callbacks, or small interfaces
