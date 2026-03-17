# Delegate Pattern

This document explains the standard delegate pattern used across controllers and fragments in this codebase. It uses `FvcProgress` as a concrete example.

## Background

All controllers and fragments ultimately extend `Controller` (defined in `src/lib/ext/Controller.ts`). The base class holds a `_delegate` field of type `unknown` and exposes three typed accessor methods:

```typescript
getDelegate<T>(): T | null
getDataSource<T>(): T | null
getOwner<T>(): T | null
```

Components that need to notify a caller about events use the delegate slot. The type-safe accessor removes the need for a component to re-declare or override `_delegate` with a specific type.

## The Four-Step Pattern

### Step 1 – Export the delegate interface

Define the delegate interface at the top of the component file and **export it** so consumers can reference it directly.

```typescript
// src/lib/ui/controllers/views/FvcProgress.ts
export interface IFvcProgressDelegate {
  onRequestCancelInProgressViewContentFragment(f: FvcProgress): void;
}
```

**Naming convention:** `I<ComponentName>Delegate`.

### Step 2 – Remove the `_delegate` field re-declaration

Do **not** redeclare `_delegate` inside the component class. The base class already declares it; re-declaring it with a narrower type only creates a shadow that can mask the base-class implementation.

```typescript
// ❌ Before
export class FvcProgress extends FScrollViewContent {
  protected declare _delegate: FvcProgressDelegate; // remove this line
  ...
}

// ✅ After
export class FvcProgress extends FScrollViewContent {
  // _delegate is inherited from Controller; no re-declaration needed
  ...
}
```

### Step 3 – Use `getDelegate<T>()` to call the delegate

Replace direct `this._delegate` accesses with `this.getDelegate<IFvcProgressDelegate>()`.

```typescript
// ❌ Before
#onCancel(): void {
  if (this._delegate) {
    this._delegate.onRequestCancelInProgressViewContentFragment(this);
  }
}

// ✅ After
#onCancel(): void {
  this.getDelegate<IFvcProgressDelegate>()?.onRequestCancelInProgressViewContentFragment(this);
}
```

The optional-chaining operator (`?.`) is the idiomatic null-guard when a delegate may be absent.

### Step 4 – Implement the interface on the consumer side

The class that calls `setDelegate(this)` on the component must declare that it implements the exported interface.

```typescript
// src/sectors/auth/FvcWeb3Login.ts
import { FvcProgress, IFvcProgressDelegate } from '../../lib/ui/controllers/views/FvcProgress.js';

export class FvcWeb3Login extends FvcLoginBase implements IFvcProgressDelegate {

  // Called by FvcProgress when the user taps Cancel
  onRequestCancelInProgressViewContentFragment(_fvcProgress: FvcProgress): void {
    this.#skipAccountSearch();
  }

  #onSubmit(): void {
    const f = new FvcProgress();
    f.setDelegate(this);   // type-safe because FvcWeb3Login implements IFvcProgressDelegate
    ...
  }
}
```

## Complete Before / After: `FvcProgress.ts`

### Before

```typescript
interface FvcProgressDelegate {                             // not exported
  onRequestCancelInProgressViewContentFragment(f: FvcProgress): void;
}

export class FvcProgress extends FScrollViewContent {
  protected declare _delegate: FvcProgressDelegate;       // redundant field

  #onCancel(): void {
    if (this._delegate) {                                  // direct field access
      this._delegate.onRequestCancelInProgressViewContentFragment(this);
    }
  }
}
```

### After

```typescript
export interface IFvcProgressDelegate {                    // exported
  onRequestCancelInProgressViewContentFragment(f: FvcProgress): void;
}

export class FvcProgress extends FScrollViewContent {
  // no _delegate re-declaration

  #onCancel(): void {
    this.getDelegate<IFvcProgressDelegate>()               // typed accessor
      ?.onRequestCancelInProgressViewContentFragment(this);
  }
}
```

## Checklist For New Or Migrated Components

- [ ] Delegate interface is **exported** from the component file.
- [ ] Interface name follows the `I<ComponentName>Delegate` convention.
- [ ] `protected declare _delegate` is **not** present in the component class.
- [ ] Delegate callbacks are invoked via `this.getDelegate<IXxxDelegate>()?.method(...)`.
- [ ] Every consumer class that calls `setDelegate(this)` declares `implements IXxxDelegate`.

## Related Patterns

| Accessor | Purpose |
|---|---|
| `getDelegate<T>()` | Receive event callbacks from the component |
| `getDataSource<T>()` | Query data from a provider without tight coupling |
| `getOwner<T>()` | Propagate events up to an owning controller |
