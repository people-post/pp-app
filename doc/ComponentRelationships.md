# Component Relationships And Dependency Layers

This document defines the intended component relationships for the People Post frontend and records the main dependency debt that currently violates that design.

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
| `src/sectors` | Feature composition, sector gateways, sector-specific UI and flows | any lower layer, never `src/session` |
| `src/session` | Application shell, top-level composition, cross-sector wiring | any lower layer |

### Intended relationship boundaries

The main relationships should be:

- `session` knows sectors; sectors do not know session.
- sectors know shared code in `common`; `common` does not know sectors.
- `common` knows `lib`; `lib` does not know `common`.
- `lib/ui` may depend on `lib/framework`, but `lib/framework` must not depend on `lib/ui`.
- data models in `common/datatypes` should stay free of runtime service lookups from `common/dba`.

In practice, the architecture should resemble a composition root at the top (`session`) and reusable primitives at the bottom (`lib/ext`).

## 2. Tech Debt: Circular Or Unintended Library Dependencies

The current tree does not fully follow the intended order. The issues below are the main places where the architecture is currently inverted or circular.

### A. `lib/ui` depends on higher application layers

Representative examples:

- `src/lib/ui/controllers/fragments/FNavigation.ts` imports `src/common/dba/Account.js`
- `src/lib/ui/controllers/PageViewController.ts` imports `src/common/dba/WebConfig.js`
- `src/lib/ui/controllers/PageViewController.ts` imports `src/common/plt/SectorGateway.js`
- `src/lib/ui/controllers/RenderController.ts` imports `src/common/constants/R.js`
- `src/lib/ui/controllers/fragments/Button.ts` imports `src/common/Utilities.js`

Why this is debt:

- `lib/ui` is supposed to be reusable infrastructure.
- Imports from `common/*` pull product-specific state, resources, and platform contracts into the UI library.
- Once `lib/ui` knows `common`, it becomes difficult to reuse or refactor either layer independently.

Preferred direction:

- move product-specific logic out of `lib/ui`
- pass data and callbacks into `lib/ui` from higher layers
- extract neutral interfaces or DTOs if `lib/ui` needs configuration metadata

### B. `lib/ui` and `common/plt` already form a circular boundary

Concrete example:

- `src/lib/ui/controllers/PageViewController.ts` imports `PageConfig` from `src/common/plt/SectorGateway.ts`
- `src/common/plt/SectorGateway.ts` imports `Fragment` and `View` from `src/lib/ui`

Why this is debt:

- this is not just an upward dependency; it creates a bidirectional dependency boundary between `lib/ui` and `common/plt`
- once both sides name each other directly, page/view contracts become hard to move without touching both library and application code

Preferred direction:

- move pure page metadata types such as `PageConfig` into a lower neutral package
- keep `lib/ui` independent from sector-specific gateway contracts
- keep `common/plt` contracts independent from concrete UI library classes where possible

### C. `common/datatypes` reaches upward into `common/dba`

Concrete example:

- `src/common/datatypes/User.ts` contains an explicit lazy import of `../dba/WebConfig.js`
- the file already documents the reason with the comment `Lazy import to avoid circular dependency`

Why this is debt:

- `common/datatypes` should represent stable domain objects
- `common/dba` is a higher, stateful service layer
- when a datatype needs a lazy import to avoid a cycle, the model boundary is already inverted

Preferred direction:

- remove service lookups from datatype classes
- move `WebConfig`-dependent behavior into `common/dba`, `common/plt`, or a higher adapter/presenter layer
- keep datatype classes as pure data and domain logic objects

### D. `sectors` reach upward into `session`

Concrete examples:

- `src/sectors/frontpage/FvcBrief.ts` imports `src/session/FHomeBtn.js`
- `src/sectors/frontpage/FvcJournal.ts` imports `src/session/FHomeBtn.js`

This is especially problematic because `src/session/Gateway.ts` also imports the frontpage sector, so the boundary is effectively bidirectional.

Why this is debt:

- `session` is the composition root and should sit above sectors
- a sector importing session code makes the feature layer depend on the shell that is supposed to compose it
- this makes the frontpage sector less reusable and harder to test in isolation

Preferred direction:

- move `FHomeBtn` into `src/common/gui` or another lower shared layer if it is sector-reusable
- or have `session` inject the home button fragment into the sector instead of the sector importing it directly

## Refactoring Priorities

The clean-up should happen in this order:

1. Remove `sectors -> session` imports, because they break the composition-root boundary directly.
2. Remove `common/datatypes -> common/dba` imports, because datatype purity affects many higher layers.
3. Break `lib/ui -> common/*` imports, starting with `PageViewController`, `FNavigation`, `RenderController`, and shared fragment classes.
4. Break the `lib/ui <-> common/plt` cycle by moving shared contracts into a lower neutral package.
5. Keep `lib/framework -> lib/ui` imports disallowed so the dependency direction stays one-way.

## Guardrails For New Code

New code should follow these rules:

- do not import from a higher layer to solve a local convenience problem
- do not use lazy imports to hide architectural cycles
- do not let `lib/framework/*` reference `lib/ui/*`
- do not let `lib/*` reference product-specific state, resources, or sector contracts
- do not let `sectors/*` import from `session/*`
- when a lower layer needs information from a higher layer, pass it in as data, callbacks, or small interfaces
