# Migration Plan: From Delegates/Data Sources to Props-Based Pattern

## Overview

This is a phased refactor to replace delegate patterns, data sources, and data updates with a
unified props-based system in the `people-post/pp-app` repository. The goal is to enable 1:1
relationships, support agent state handoff (for Web3 agents to resume from checkpoints), and
ensure long-term maintainability. Agents should be able to "pickup from leftovers" by reading
this plan and marking progress.

## Key Changes

- Replace `setDelegate` with callback props (e.g., `setOnClick`).
- Replace `setDataSource` with data/function props (e.g., `setData` or `setDataFetcher`).
- Enhance `handleSessionDataUpdate` with reactive props and observables.
- Add state handoff: `previousState` and `onSaveState` for agents to chain and persist via checkpoints.
- Unify into a `setProps` method per component.

## Instructions for Agents

- Always read this file (`MIGRATION_PLAN.md`) to understand the current phase and progress.
- For "continue the plan on next phase", read the plan, identify the next incomplete phase, and implement it.
- After completing a phase, update this file with progress (e.g., check off the phase and add notes on changes).
- Use checkpoints for state: Load `previousState` from prior phases' saves, save current state for next.
- Ensure changes are backward-compatible during transition.

---

## Progress Tracker

- [x] **Phase 1**: Setup Base Infrastructure and Plan Tracker *(completed)*
- [ ] **Phase 2**: Refactor Simple Components (e.g., FCareer, FArticle)
- [ ] **Phase 3**: Enhance Data Updates and Reactive Props
- [ ] **Phase 4**: Refactor Complex Components and Chains
- [ ] **Phase 5**: Integration Testing and Cleanup

---

## Phase 1: Setup Base Infrastructure and Plan Tracker ✅

**Status**: Complete

**Goals**:
- Create this `MIGRATION_PLAN.md` file in the repo root with the full plan, phases, and a
  progress tracker.
- Update `Controller.ts` to support props: Add `AgentProps<TState>` interface with `data`,
  `callbacks`, `previousState`, `onSaveState`, and `onDataUpdate`.
- Add `setProps(props: AgentProps)` method to `Controller`.
- Integrate state loading/saving with `Account.loadCheckPoint` and `saveCheckPoint` for Web3
  persistence.
- Add comments in `Controller.ts` linking to this file.

**Files Changed**:
- `MIGRATION_PLAN.md` (created — this file)
- `src/lib/ext/Controller.ts` (updated — added `AgentProps<TState>` interface and `setProps` method)

---

## Phase 2: Refactor Simple Components (e.g., FCareer, FArticle)

**Status**: Pending

**Goals**:
- Assuming Phase 1 is done, refactor `FCareer.ts` and `FArticle.ts` to use `setProps` instead
  of delegates/data sources.
- Remove interfaces like `FCareerDelegate` and `FArticleDelegate`.
- Implement state handoff (load from `previousState`, save via `onSaveState`).
- Update usages in parent components.

**Files to Change**:
- `src/common/hr/FCareer.ts`
- Any file containing `FArticle` (search for `FArticleDelegate`)
- Parent components that wire up delegates/data sources for the above

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
