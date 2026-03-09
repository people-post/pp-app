# Migration Plan: From Delegates/Data Sources to Props-Based Pattern

## Overview

This is a phased refactor to replace delegate patterns, data sources, and data updates with a
unified props-based system in the `people-post/pp-app` repository. The goal is to enable 1:1
relationships, support reactive data updates, and ensure long-term maintainability. Agents
should be able to "pickup from leftovers" by reading this plan and marking progress.

## Key Changes

- Replace `setDelegate` with callback props (e.g., `onClickInCareerFragment`).
- Replace `setDataSource` with a `data` prop.
- Enhance `handleSessionDataUpdate` with an `onDataUpdate` reactive callback prop.
- Unify into a `setProps` method per component.

## Instructions for Agents

- Always read this file (`MIGRATION_PLAN.md`) to understand the current phase and progress.
- For "continue the plan on next phase", read the plan, identify the next incomplete phase, and implement it.
- After completing a phase, update this file with progress (e.g., check off the phase and add notes on changes).
- Ensure changes are backward-compatible during transition.

---

## Progress Tracker

- [x] **Phase 1**: Setup Base Infrastructure and Plan Tracker *(completed)*
- [x] **Phase 2**: Refactor Simple Components (e.g., FCareer, FArticle) *(completed)*
- [ ] **Phase 3**: Enhance Data Updates and Reactive Props
- [ ] **Phase 4**: Refactor Complex Components and Chains
- [ ] **Phase 5**: Integration Testing and Cleanup

---

## Phase 1: Setup Base Infrastructure and Plan Tracker ✅

**Status**: Complete

**Goals**:
- Create this `MIGRATION_PLAN.md` file in the repo root with the full plan, phases, and a
  progress tracker.
- Add comments in `Controller.ts` linking to this file.
- Child classes define and manage their own `AgentProps` interface (with `data`, `callbacks`,
  and `onDataUpdate`) and their own `setProps`/`getProps` methods independently, without
  requiring changes to the `Controller` base class.

**Concrete Usage Example** (replacing the old FCareer delegate/dataSource wiring):

```ts
// Before (legacy pattern):
const career = new FCareer();
career.setDataSource(myDataSource);   // implements FCareerDataSource
career.setDelegate(myDelegate);        // implements FCareerDelegate

// After (props-based pattern, Phase 1 foundation):
// FCareer defines its own props interface and setProps/getProps methods:
interface FCareerProps {
  data?: { roleId: string };
  callbacks?: { onClickInCareerFragment?: (f: unknown) => void };
  onDataUpdate?: (data: unknown) => void;
}

// class FCareer extends Controller {
//   private _props: FCareerProps | null = null;
//   setProps(props: FCareerProps): void { this._props = props; }
//   getProps(): FCareerProps | null { return this._props; }
// }

const career = new FCareer();
career.setProps({
  data: { roleId: "engineer" },
  callbacks: {
    onClickInCareerFragment: (f: unknown) => handleCareerClick(f as FCareer),
  },
  onDataUpdate: (data) => career.reload(data),
});
```

**Files Changed**:
- `MIGRATION_PLAN.md` (created — this file)
- `src/lib/ext/Controller.ts` (updated — added comment linking to this file)

---

## Phase 2: Refactor Simple Components (e.g., FCareer, FArticle)

**Status**: Complete ✅

**Goals**:
- Assuming Phase 1 is done, refactor `FCareer.ts` and `FArticle.ts` to use `setProps` instead
  of delegates/data sources.
- Remove interfaces like `FCareerDelegate` and `FArticleDelegate`.
- Update usages in parent components.

**Changes Made**:
- `src/common/hr/FCareer.ts`: Replaced `FCareerDelegate`/`FCareerDataSource` interfaces with
  `FCareerProps` interface. Added `setProps`/`getProps` methods. Updated `action()` and
  `_renderOnRender()` to use props callbacks. Kept `setRoleId`/`getRoleId` as convenience
  methods (delegating to `_props.data.roleId`).
- `src/sectors/blog/FArticle.ts`: Replaced `FArticleDelegate`/`FArticleDataSource` interfaces
  with `FArticleProps` interface. Added `setProps`/`getProps` methods. Updated
  `onSimpleButtonClicked()` to use `_props.callbacks.onTagClickedInArticleFragment`.
- `src/sectors/blog/FCareerList.ts`: Updated `FCareer` instantiation to use `setProps`.
- `src/sectors/workshop/FvcCareerList.ts`: Updated `FCareer` instantiation to use `setProps`.
- `src/sectors/shop/FvcCareerList.ts`: Updated `FCareer` instantiation to use `setProps`.
- `src/sectors/blog/FPost.ts`: Updated `FArticle` instantiation to use `setProps` instead of
  `setDelegate`.

---

## Phase 3: Enhance Data Updates and Reactive Props

**Status**: Pending

**Goals**:
- Refactor `handleSessionDataUpdate` to use props (e.g., pass `onDataUpdate` callback).
- Integrate with observables or `DataManager` for reactive updates.
- Update `Account.ts` to support props-based agents.

---

## Phase 4: Refactor Complex Components and Chains

**Status**: Pending

**Goals**:
- Update components like `FCart.ts`, `FvcUserInfo.ts` with props and agent chains.
- Add `AgentChain` class for sequential handoff.

---

## Phase 5: Integration Testing and Cleanup

**Status**: Pending

**Goals**:
- Add tests for props and handoff.
- Remove old delegate code.
