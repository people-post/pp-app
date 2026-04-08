# Migration: inline `G.action(...)` → delegated `data-pp-action` (and Symbols → strings)

This document describes the migration performed to remove inline JS event handlers like:

- `onclick="javascript:G.action(...)"`
- `onclick="G.action(...)"`

and replace them with a single delegated click handler using `data-pp-action` (plus optional `data-pp-args`).

It also documents the follow-up cleanup: removing unnecessary `window.*` exports / `declare global Window` blocks for action constants, and converting `Symbol()` action IDs that were referenced from templates into **string** action IDs.

The intent is that another AI agent can pick up this plan and continue the remaining rollout across the repo.

---

## Why this migration exists

### Inline handlers cause problems
- **Security/maintainability**: inline JS (`onclick="javascript:..."`) is hard to audit and easy to regress.
- **TypeScript friction**: inline handlers often required `window.CF_*` globals, `declare global`, or `(window as any)` shims.

### Delegation is required in this UI framework
`Render.replaceContent()` sets `innerHTML`, so any per-element event listeners would be destroyed on re-render. Delegation is stable across rerenders.

Key reference:
- `src/lib/ui/renders/Render.ts` `replaceContent()` uses `innerHTML`.

### Keep existing action routing behavior
The repo routes UI actions through `window.G.action(...)`, which ultimately drives session/controller dispatch. The delegator preserves that behavior rather than introducing new routing.

Key reference:
- `src/app.ts` contains `G.action(...)` and the session `userAction` plumbing.

---

## Core design

### Attributes
- **`data-pp-action="ACTION_ID"`**
  - `ACTION_ID` is a string action identifier.
- **`data-pp-args='[...]'`** (optional)
  - JSON array of arguments passed to `G.action(actionId, ...args)`.

### Delegated click handler
Implemented in:
- `src/lib/framework/DomActionDelegator.ts`

Installed from:
- `src/app.ts` (after `window.G = G`)

Behavior:
- Finds closest ancestor matching `[data-pp-action]`.
- Reads `data-pp-action` and optional `data-pp-args`.
- Calls:
  - `evt.stopPropagation()`
  - `evt.preventDefault()` for anchor (`<a>`) targets
  - `window.G.action(actionId, ...args)`

#### Argument materialization tokens (supported)
Within `data-pp-args`, these special string values are supported:
- `"$this"` → the clicked element (the element with `data-pp-action`)
- `"$checked"` → `HTMLInputElement.checked` (checkbox)
- `"$value"` → `value` for `input` / `textarea` / `select`

---

## Migration phases

### Phase 1: add the delegator + wire it once
1) Create `src/lib/framework/DomActionDelegator.ts` with the delegated listener.
2) Import and call `installDomActionDelegator()` from `src/app.ts` after `window.G = G`.

✅ Completed.

### Phase 2: migrate click handlers (click-only first pass)
Replace templates like:

```html
<span onclick="javascript:G.action('CF_X_1')">...</span>
```

with:

```html
<span data-pp-action="CF_X_1">...</span>
```

If there are args:

```html
<span onclick="javascript:G.action('CF_X_1', '__ID__')">...</span>
```

becomes:

```html
<span data-pp-action="CF_X_1" data-pp-args='["__ID__"]'>...</span>
```

If the handler used `this` or `this.checked`, use tokens:
- `data-pp-args='["$this"]'`
- `data-pp-args='["$checked"]'`

✅ In-progress / partially completed across many files.

### Phase 3: clean up action constants (string action IDs)
Once templates no longer require `window.*` paths for those constants:

- Prefer **module-local** constants:

```ts
const CF_FOO = { CLICK: "CF_FOO_1" } as const;
```

- Remove unnecessary global plumbing:
  - `declare global { interface Window { ... } }`
  - `if (typeof window !== 'undefined') window.CF_FOO = CF_FOO;`

- Remove unnecessary `export` if the constant is file-local and not imported elsewhere.

✅ Completed for the touched files’ string constants.

### Phase 4: convert Symbol actions used from templates → strings (Option 1)
**Rule**: anything triggered from templates (`data-pp-action="..."`) should be a **string** action ID.

If an action constant used `Symbol()` and was being referenced through `window.*` in templates, convert it:

```ts
// before
const CF_NOTICE = { CLOSE: Symbol() } as const;
// after
const CF_NOTICE = { CLOSE: "CF_NOTICE_1" } as const;
```

Update:
- templates: use `${CF_NOTICE.CLOSE}` instead of `window.CF_NOTICE.CLOSE`
- handlers: broaden action signature to accept `string | symbol` during transition:

```ts
action(type: symbol | string, ...args: unknown[]): void
```

✅ Completed for key touched symbol-based flows (notice close, search, cart item actions, hero banner actions).

---

## Files touched during this migration (examples)

This list is not exhaustive, but highlights the key areas:

### Delegator + wiring
- `src/lib/framework/DomActionDelegator.ts`
- `src/app.ts`

### Symbol → string conversions (template boundary)
- `src/lib/ui/controllers/views/View.ts` (`CR_VIEW_FRAME.ON_SEARCH`)
- `src/common/Utilities.ts` (hashtag links now use `${CR_VIEW_FRAME.ON_SEARCH}`)
- `src/lib/ui/controllers/views/FvcNotice.ts` (`CF_NOTICE.CLOSE`)
- `src/sectors/cart/FCartItem.ts` (`CF_CART_ITEM.*`)
- `src/sectors/hr/FUserInfoHeroBanner.ts` (`CF_USER_INFO_HERO_BANNER.*`)

### Click migrations / template updates (examples)
- `src/sectors/exchange/FCashierInfo.ts`
- `src/sectors/exchange/FExchangeItemInfo.ts`
- `src/sectors/exchange/FVoucherInfo.ts`
- `src/common/gui/ActionButton.ts`
- `src/sectors/hosting/FDsSetup.ts`
- `src/common/gui/FGallery.ts` (click-only; scroll left for later)
- `src/common/gui/TagsEditorFragment.ts`

---

## Verification

Primary verification command for this repo:

```bash
npm run build
```

Run it after each migration batch (e.g. every 5–15 files) to keep regressions localized.

Note: `npm run type-check` is noisy in this repo due to an ongoing migration; the build is the main gate.

---

## Remaining work / how to continue

### 1) Continue click-only sweep
Search for remaining inline click handlers:
- `onclick="javascript:G.action`
- `onclick="G.action`

Convert them to `data-pp-action` and optional `data-pp-args`.

### 2) Defer non-click events to later
These were intentionally left for later phases:
- `onchange="..."`
- `onkeydown="..."`
- `onscroll="..."`
- `oninput="..."`

When migrating those, either:
- add delegated handlers for those event types as separate installers, or
- migrate those particular components to fragment/controller-driven listeners (larger refactor).

### 3) Simplify global resolution logic after rollout
If the repo fully stops using `data-pp-action="window...."` paths, the `resolveAction()` capability in `DomActionDelegator.ts` can be simplified or removed.

---

## Conventions for new work (to avoid regressions)

- Do **not** add new `onclick="javascript:..."` handlers.
- Prefer `data-pp-action="..."` + `data-pp-args='[...]'`.
- Prefer string action IDs for anything triggered from templates.
- Keep action constants module-local unless there is a clear cross-module need.

