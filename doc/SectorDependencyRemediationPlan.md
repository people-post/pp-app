# Plan: Fix Cross-Sector Dependency Violations

This document tracks remediation of `npm run check-deps` sector cross-import violations (`src/sectors/<a>` importing `src/sectors/<b>`).

It follows [ComponentRelationships.md](./ComponentRelationships.md):

- Sector folders are islands: no sibling-sector imports.
- Shared code belongs in `src/common` (or lower layers).
- Cross-sector composition belongs in `src/session`.
- No lazy/dynamic-import tricks to hide architecture issues.

Before closing any change batch, run:

- `npm run check-deps`
- `npm run build` (required per `AGENTS.md`)

---

## Current Status (latest)

From latest `npm run check-deps`:

- Layering violations: **0**
- Sector cross-dependency violations: **15** (down from 38)

Remaining violations:

1. `account/FvcBasic.ts` -> `auth/FvcChangePassword.ts`
2. `blog/AbWeb3New.ts` -> `hosting/FvcWeb3ServerRegistration.ts`
3. `blog/FQuoteElement.ts` -> `workshop/FProjectInfo.ts`
4. `blog/FQuoteElement.ts` -> `shop/FProduct.ts`
5. `blog/FQuoteElement.ts` -> `workshop/FvcProject.ts`
6. `blog/FQuoteElement.ts` -> `shop/FvcProduct.ts`
7. `frontpage/FvcBrief.ts` -> `blog/OwnerPostIdLoader.ts`
8. `frontpage/FvcBrief.ts` -> `blog/FPostList.ts`
9. `frontpage/FvcBrief.ts` -> `blog/FPostInfo.ts`
10. `frontpage/FvcBrief.ts` -> `blog/FvcOwnerPostScroller.ts`
11. `frontpage/FvcJournal.ts` -> `blog/OwnerJournalIssueIdLoader.ts`
12. `frontpage/FvcJournal.ts` -> `blog/FPostInfo.ts`
13. `frontpage/FvcJournal.ts` -> `blog/FTaggedCommentList.ts`
14. `shop/FBranch.ts` -> `account/FvcAddressEditor.ts`
15. `shop/FvcCounterMain.ts` -> `auth/Gateway.ts`

---

## Completed Workstreams

### Workstream 1 - Sector gateways moved out of sector-level composition

Status: **Done**

- Session-side composition replaced cross-sector wiring in sector gateways.
- `hr/Gateway.ts` / `pseudo/Gateway.ts` cross-sector coupling has been removed from violation list.

### Workstream 2 - Career triangle (`hr` <-> `blog`/`shop`/`workshop`)

Status: **Done**

- Career-related cross-sector edges were eliminated and do not appear in current violations.

### Workstream 3 - Cart <-> Shop

Status: **Done**

- Auth/cart/product/pre-checkout wiring was moved to session/common facades.
- `shop` no longer directly imports `cart` for composition flows addressed in this stream.
- Related violations are no longer present.

### Workstream 4 - HR profile hub (`FvcUserInfo`, `FvcWeb3UserInfo`)

Status: **Done**

- HR profile fragments are now shell-style hosts.
- Profile tab entries are registered through session-facing contracts (`ProfileHubFacade`) rather than direct HR imports from sibling sectors.
- Chat view creation is also session-registered.
- Naming was aligned to avoid confusion with render `Panel` classes:
  - `ProfileHubTabEntry`
  - `createTabContent(...)`
  - `registerWeb2Tab(...)`, `registerWeb3Tab(...)`

---

## Remaining Workstreams (active)

## Workstream 5 - Frontpage <-> Blog (7 edges)

Violations:

- `frontpage/FvcBrief.ts` -> blog loaders/list/scroller/info
- `frontpage/FvcJournal.ts` -> blog loaders/list/info

Approach:

1. Keep `frontpage` as layout/shell only.
2. Move reusable list/loader primitives to `src/common` **only if truly generic**.
3. Otherwise, move frontpage+blog composition into `src/session` (session-owned widgets/fragments).
4. Ensure `src/sectors/frontpage` has no direct imports from `src/sectors/blog`.

Acceptance:

- `rg "from '../blog|from \"../blog" src/sectors/frontpage` returns no cross-sector imports.
- `npm run check-deps` removes all `frontpage -> blog` edges.
- `npm run build` passes.

---

## Workstream 6 - Blog leaf violations (5 edges)

Violations:

- `blog/AbWeb3New.ts` -> `hosting/FvcWeb3ServerRegistration.ts`
- `blog/FQuoteElement.ts` -> workshop/shop (`FProjectInfo`, `FvcProject`, `FProduct`, `FvcProduct`)

Approach:

1. For `AbWeb3New`:
   - Use session-owned composition for "new content + server registration", or
   - Extract minimal shared contracts/components into `src/common`.
2. For `FQuoteElement`:
   - Replace direct shop/workshop imports with session-provided render callbacks/factories, or
   - Extract neutral quote target presentation contracts into `src/common`.
3. Keep blog leaf components free of sibling-sector imports.

Acceptance:

- `src/sectors/blog/AbWeb3New.ts` has no `hosting` sector import.
- `src/sectors/blog/FQuoteElement.ts` has no `shop`/`workshop` sector import.
- `npm run check-deps` removes these 5 edges.
- `npm run build` passes.

---

## Workstream 7 - Smaller one-offs (3 edges currently open)

Violations:

- `account/FvcBasic.ts` -> `auth/FvcChangePassword.ts`
- `shop/FBranch.ts` -> `account/FvcAddressEditor.ts`
- `shop/FvcCounterMain.ts` -> `auth/Gateway.ts`

Approach:

1. `account` <- `auth`:
   - Move password-change UI into `account`, or expose session/common contract for password flow.
2. `shop` <- `account`:
   - Move shared address editor to `src/common`, or use session-provided editor factory.
3. `shop` <- `auth`:
   - Follow established facade pattern (same style as auth/cart/product facades).

Acceptance:

- `npm run check-deps` reports 0 violations for these paths.
- `npm run build` passes.

---

## Suggested Execution Order (updated)

1. Workstream 5 (largest remaining fan-out)
2. Workstream 6 (blog leaves)
3. Workstream 7 (small one-offs)
4. Final verification + docs update

---

## Finalization Checklist

When all workstreams are complete:

- `npm run check-deps` exits 0 with no sector violations.
- `npm run build` succeeds.
- Update section 2 ("Current Status") in `ComponentRelationships.md` to reflect zero sector cross-dependencies.
