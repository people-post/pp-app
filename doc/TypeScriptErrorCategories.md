# TypeScript Compile Error Categories

Snapshot date: 2026-03-16

Command used:

```bash
npm run type-check -- --pretty false
```

Current compiler state:

- 2008 primary TypeScript errors
- 327 files with at least one error
- Error concentration is uneven; a small set of codes and sectors account for most of the backlog

## Executive Summary

The error set is dominated by a few migration patterns rather than hundreds of unrelated bugs.

| Category | Count | Share | Main TS codes |
| --- | ---: | ---: | --- |
| Type mismatch and unknown flow | 993 | 49.5% | TS2322, TS2345, TS2362, TS2366, TS2352, TS2556 |
| Missing properties, methods, and exports | 346 | 17.2% | TS2339, TS2551, TS2552, TS2724, TS2304, TS2305, TS2307, TS2459 |
| Null and undefined handling | 188 | 9.4% | TS2531, TS2532, TS18047, TS18048, TS18046 |
| Unused code and strictness hygiene | 184 | 9.2% | TS6133, TS6196, TS7029, TS2571 |
| Inheritance and override incompatibilities | 140 | 7.0% | TS2416, TS2415, TS2510, TS2612, TS2545, TS2341, TS2344, TS2739, TS2740, TS2741 |
| Literal and symbol discrimination issues | 85 | 4.2% | TS2678, TS2367 |
| API arity and overload mismatches | 70 | 3.5% | TS2554, TS2769 |
| Outliers | 2 | 0.1% | TS2774, TS7053 |

The first three categories account for 1527 of 2008 errors, or 76.0% of the total. That means the migration effort should focus on shared typing contracts, not file-by-file cosmetic cleanup.

## Hotspots

### Highest-error source areas

| Area | Errors |
| --- | ---: |
| `src/sectors/blog` | 423 |
| `src/sectors/shop` | 333 |
| `src/sectors/workshop` | 247 |
| `src/sectors/community` | 120 |
| `src/sectors/cart` | 111 |
| `src/sectors/messenger` | 91 |
| `src/sectors/hosting` | 81 |
| `src/sectors/exchange` | 76 |
| `src/sectors/frontpage` | 75 |
| `src/sectors/email` | 57 |
| `src/sectors/auth` | 52 |
| `src/sectors/hr` | 52 |

### Highest-error files

| File | Errors |
| --- | ---: |
| `src/sectors/exchange/FvcWeb3Wallet.ts` | 47 |
| `src/sectors/frontpage/FvcBrief.ts` | 43 |
| `src/sectors/workshop/FvcProject.ts` | 34 |
| `src/sectors/workshop/FProjectStage.ts` | 33 |
| `src/sectors/community/FProposal.ts` | 31 |
| `src/sectors/blog/FJournalIssueEditor.ts` | 26 |
| `src/sectors/blog/FvcPost.ts` | 26 |
| `src/sectors/blog/FPost.ts` | 22 |
| `src/sectors/cart/FOrder.ts` | 21 |
| `src/sectors/email/FEmail.ts` | 21 |
| `src/sectors/hosting/FvcBasicWebConfig.ts` | 21 |
| `src/sectors/shop/FSupplierOrder.ts` | 21 |

These hotspots are useful for planning, but the dominant issue is still shared typing debt. Fixing base types and contracts should remove large numbers of downstream errors.

## Category Breakdown

### 1. Type mismatch and unknown flow

Codes: `TS2322`, `TS2345`, `TS2362`, `TS2366`, `TS2352`, `TS2556`

This is the largest bucket by a wide margin. It mainly comes from values flowing through the app as `unknown`, `string | undefined`, `string | null`, or incorrectly inferred literal types.

Representative examples:

- `src/common/dba/Account.ts`: `unknown` passed into strongly typed constructors and helpers
- `src/common/menu/MainMenu.ts`: collection types inferred incorrectly across menu model layers
- `src/sectors/workshop/FvcProjectStageConnection.ts`: `FormData.append()` receives `string | undefined`
- `src/session/WcSession.ts`: spread forwarding uses `unknown[]` where a typed tuple or rest signature is required
- `src/sectors/workshop/TimelineVerticalNodePanel.ts`: HTML template strings are inferred as narrow string literals, then mutated with `.replace()`

Typical root causes:

- API responses are parsed but not narrowed before use
- Legacy model getters return nullable or optional values, but callers assume concrete values
- Generic helpers and base classes were migrated without preserving useful type parameters
- Template string variables are declared in a way that preserves a literal type instead of widening to `string`

Recommended fixes:

1. Add narrow response interfaces and parser helpers at API boundaries
2. Widen mutable HTML template locals to `string`
3. Convert `unknown[]` forwarding to explicit tuple signatures or typed rest parameters
4. Normalize nullable getters with guards before calling strongly typed APIs

### 2. Missing properties, methods, and exports

Codes: `TS2339`, `TS2551`, `TS2552`, `TS2724`, `TS2304`, `TS2305`, `TS2307`, `TS2459`

This bucket reflects drift between runtime behavior and the current TypeScript surface area.

Representative examples:

- `src/common/menu/MenuConfig.ts`: `T_DATA` members referenced in code but absent from the typed constant object
- `src/sectors/auth/*`: `Render` imported from `RenderController`, but `RenderController.ts` does not export it
- `src/sectors/workshop/FvcProjectStage.ts`: controller owner methods are called even though the base owner type does not declare them
- `src/sectors/workshop/FTeam.ts` and similar files: imports reference modules or symbols that no longer exist under the TS migration layout
- `src/sectors/blog/Gateway.ts`: methods like `setOwnerId` are called on types that only expose `setOwner`

Typical root causes:

- Constants objects and discriminated event maps were partially typed
- Base interfaces were not expanded to match legacy dynamic usage
- Imports still reflect pre-migration names or exports
- Some files depend on ambient globals that were never declared in TypeScript

Recommended fixes:

1. Audit exported symbols in shared controller, constants, and datatype modules
2. Promote commonly used dynamic methods onto explicit interfaces
3. Fix broken import paths and symbol names before deeper file-level work
4. Add or tighten ambient declarations only when the runtime contract is real and stable

### 3. Null and undefined handling

Codes: `TS2531`, `TS2532`, `TS18047`, `TS18048`, `TS18046`

These errors show where the legacy code assumes DOM lookups, optional getters, or parsed data are always present.

Representative examples:

- `src/common/search/FWeb3Search.ts`: nullable values are dereferenced immediately
- `src/common/social/CommentIdLoader.ts`: object access happens before null checks
- `src/session/LvPortal.ts`: a possibly null panel is mutated directly
- `src/session/WcGadget.ts`: a maybe-undefined layer controller is used without narrowing
- `src/sectors/blog/FPost.ts`: values from loosely typed response objects remain `unknown`

Recommended fixes:

1. Guard or early-return at DOM and data lookup sites
2. Prefer local narrowed variables over repeated optional access
3. Tighten return types on getter APIs when null is not a real runtime state
4. Introduce small assertion helpers for repeated invariant checks

### 4. Unused code and strictness hygiene

Codes: `TS6133`, `TS6196`, `TS7029`, `TS2571`, `TS2774`, `TS7053`

This category is lower risk, but it adds noise and hides more meaningful errors.

Representative examples:

- Unused callback parameters in auth, workshop, and social fragments
- Unused interfaces in shop sector files
- Switch fallthrough in cart flows
- `unknown` object access in menu and social loaders
- String indexing without an index-safe key in messenger message templates

Recommended fixes:

1. Remove or prefix intentionally unused parameters
2. Add missing `break` or explicit fallthrough comments where logic is intentional
3. Replace raw string indexing with `keyof`-based accessors
4. Do this cleanup after contract fixes, not before

### 5. Inheritance and override incompatibilities

Codes: `TS2416`, `TS2415`, `TS2510`, `TS2612`, `TS2545`, `TS2341`, `TS2344`, `TS2739`, `TS2740`, `TS2741`

This bucket comes from subclass signatures drifting away from base classes and from structural typing between unrelated fragment classes.

Representative examples:

- `src/common/datatypes/DraftArticle.ts`: overrides no longer match `Article`
- `src/common/pay/FPaymentTerminal.ts`: subclass fields redeclare inherited fields without `declare` or an initializer
- `src/sectors/email/PEmail.ts`: subclasses access fields that are `private` in the base class
- `src/sectors/account/Gateway.ts` and multiple gateway files: fragments are stored in slots typed as a different concrete fragment class
- `src/common/pdb/Web3PeerServerMixin.ts`: mixin constructor shape does not follow TS mixin rules

Recommended fixes:

1. Use interface or abstract-base types for fragment slots instead of concrete subclasses
2. Change base members from `private` to `protected` only when subclass access is required
3. Align override signatures exactly, especially nullable return types
4. Replace duplicate field declarations with `declare` where the runtime field already exists in the base class

### 6. Literal and symbol discrimination issues

Codes: `TS2678`, `TS2367`

These errors indicate control flow built around string comparisons while the typed constants are actually `symbol` values.

Representative examples:

- `src/common/menu/MainMenu.ts`
- `src/common/pay/FBraintree.ts`
- `src/session/WcSession.ts`
- `src/sectors/shop/FServiceTimeslot.ts`
- `src/sectors/workshop/FProjectInfo.ts`

Recommended fixes:

1. Decide whether each discriminant should be `string` or `symbol`
2. Make the constants object and all switch statements agree on that choice
3. Avoid mixed `symbol | null | string` state unless the UI genuinely needs it

### 7. API arity and overload mismatches

Codes: `TS2554`, `TS2769`

These are concentrated and mechanical. Most cases come from helper APIs whose signatures changed during migration.

Representative examples:

- `Api.asyncRawPost()` now expects an `onErr` argument in several social and workshop callers
- `FormData.append()` rejects nullable and optional values across editor flows
- `Keys.reset()` is called without the now-required argument in `src/session/WcWeb3.ts`

Recommended fixes:

1. Update all call sites to match the current helper signatures
2. Add small wrapper helpers if the new signatures are too repetitive
3. Do this early because it removes noise cheaply

## Suggested Remediation Order

1. Fix shared contracts first.
   - `T_DATA`, controller owner interfaces, common model types, API response types, and export surfaces
2. Fix helper signatures next.
   - `Api.asyncRawPost`, `FormData` call patterns, `Keys.reset`, shared constructors and mixins
3. Resolve nullability at boundaries.
   - DOM lookup helpers, URL param access, getter return types, optional config fields
4. Clean up inheritance issues.
   - Base fragment types, override signatures, `private` vs `protected`, `declare` redeclarations
5. Remove strictness noise last.
   - unused locals, unused interfaces, fallthrough, index typing

This order should collapse large numbers of secondary errors before time is spent cleaning individual leaf files.

## Practical Starting Set

If the goal is to reduce the error count quickly, start with these files and modules because they represent reusable contracts rather than isolated leaf errors:

- `src/common/constants/Constants.ts`
- `src/common/dba/Account.ts`
- `src/common/dba/WebConfig.ts`
- `src/common/menu/MenuConfig.ts`
- `src/lib/ui/controllers/RenderController.ts`
- `src/lib/ui/controllers/fragments/Fragment.ts`
- `src/session/WcSession.ts`
- `src/common/pdb/*`

After that, move into the three most error-dense sector areas:

1. `src/sectors/blog`
2. `src/sectors/shop`
3. `src/sectors/workshop`

## Notes

- This audit is based on `tsc --noEmit`; the repository build may still succeed because bundling is done with esbuild.
- The error list is a migration backlog, not evidence that every file is broken at runtime.
- A follow-up document could track remediation progress by category and file cluster if the migration is going to be done incrementally.