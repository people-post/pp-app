# Shared Contract Cleanup Plan

## Goal

Reduce cascading TypeScript errors by normalizing the shared constants and event-contract layer before working through sector-specific leaf files.

## Scope

- Keep `src/common/constants/Constants.ts` as the stable source for ids, URL params, state, visibility, and other string literal constants unless a concrete compiler error proves otherwise.
- Treat `src/common/plt/Events.ts` as the authoritative app-level event contract.
- Treat `src/lib/framework/Events.ts` as the framework-only event contract.
- Standardize the session update callback shape only after the event-map split is correct.

## Phase 1

1. Normalize mixed event imports.
   - Fix files that import framework `T_DATA` but consume app-level keys.
   - Fix files that rely on `any` casts because they mix framework and app event maps.

2. Normalize shared event names.
   - Fix producer/consumer drift where a symbol name differs between the source map and its listeners.
   - Prioritize events with multiple consumers such as global community profile updates.

3. Limit this pass to contract-level changes.
   - Do not broaden into nullability cleanup, helper arity fixes, or sector-specific domain model changes unless required by the contract fix.

## Phase 2

1. Standardize `handleSessionDataUpdate` in `src/lib/ui/controllers/RenderController.ts`.
2. Propagate that signature through `src/lib/ui/controllers/PageViewController.ts`, `src/session/WcSession.ts`, and high-fanout fragments.
3. Remove residual `string`, `symbol | string`, and `any` callback variants once the event namespace split is stable.

## Phase 3

1. Add narrow shared capability interfaces where callers already assume dynamic methods exist.
2. Expose missing shared exports from controller modules when many sector files depend on them.

## Verification

1. Run `npm run type-check -- --pretty false` before and after each phase.
2. Run `npm run build` after each implementation batch because the build is the primary repo validator.
3. Spot-check navigation badges, config refresh, login flow, and global community profile rendering after Phase 1.

## Initial File Set

- `src/common/constants/Constants.ts`
- `src/common/plt/Events.ts`
- `src/lib/framework/Events.ts`
- `src/common/menu/MenuConfig.ts`
- `src/common/gui/FvcExtras.ts`
- `src/common/dba/Communities.ts`
- `src/sectors/community/FGlobalCommunityInfo.ts`
- `src/sectors/exchange/FvcExchange.ts`
- `src/sectors/auth/FvcLogin.ts`
- `src/lib/ui/controllers/RenderController.ts`
- `src/lib/ui/controllers/PageViewController.ts`
- `src/session/WcSession.ts`

## Sequencing Rule

Fix wrong imports and shared event names before standardizing override signatures. Otherwise the override errors are noisy and partially misleading.