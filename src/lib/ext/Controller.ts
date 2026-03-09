// See MIGRATION_PLAN.md for the full props-based refactor plan and progress tracker.

export interface ControllerOwner {
  onRemoteErrorInController(c: Controller, e: unknown): void;
}

/**
 * Props interface for props-based controllers and Web3 agents.
 *
 * The name `AgentProps` reflects its origin in the Web3 agent handoff pattern,
 * but the interface is intentionally generic enough for any controller that
 * wants to adopt the props-based pattern (see MIGRATION_PLAN.md).
 *
 * Supports 1:1 relationships, reactive data updates, and agent state handoff so
 * that Web3 agents can resume work from checkpoints saved via `Account.saveCheckPoint`.
 *
 * See MIGRATION_PLAN.md — Phase 1.
 *
 * @template TState  Shape of the serialisable agent state persisted to checkpoints.
 */
export interface AgentProps<TState = unknown> {
  /** Arbitrary data passed into the component/controller. */
  data?: unknown;

  /**
   * Named callback functions replacing the legacy delegate pattern.
   *
   * The signature is intentionally loose (`unknown` args/return) so that a single
   * `AgentProps` type can carry callbacks for any controller without requiring a
   * separate, narrowly-typed delegate interface for each one.  Concrete controllers
   * should cast individual callbacks to their specific signatures after retrieval.
   */
  callbacks?: Record<string, (...args: unknown[]) => unknown>;

  /**
   * State loaded from a prior agent's checkpoint via `Account.loadCheckPoint`.
   * Allows a new agent to resume exactly where the previous one left off.
   */
  previousState?: TState;

  /**
   * Called by the controller when it wants to persist its current state.
   * The host should forward the value to `Account.saveCheckPoint` so that
   * subsequent agents can read it back via `previousState`.
   */
  onSaveState?: (state: TState) => void;

  /**
   * Called when the underlying data source emits an update.
   * Replaces the legacy `handleSessionDataUpdate` / `setDataSource` approach
   * with a reactive, props-driven callback.
   */
  onDataUpdate?: (data: unknown) => void;
}

export class Controller implements ControllerOwner {
  protected _owner: ControllerOwner | null = null;
  protected _dataSource: unknown = null;
  protected _delegate: unknown = null;

  // Props set via setProps(); see MIGRATION_PLAN.md — Phase 1.
  // Stored as AgentProps<unknown> so the field can hold any concrete TState while
  // still being explicitly typed — callers recover TState via setProps/getProps generics.
  protected _props: AgentProps<unknown> | null = null;

  setOwner(owner: ControllerOwner | null): void {
    this._owner = owner;
  }

  setDataSource(s: unknown): void {
    this._dataSource = s;
  }

  setDelegate(d: unknown): void {
    this._delegate = d;
  }

  /**
   * Set props for this controller, enabling the props-based pattern.
   *
   * When `props.previousState` is provided the controller can restore prior
   * agent state (loaded from `Account.loadCheckPoint`).  When work is complete
   * the controller should call `this.saveState(state)` so the host can persist
   * it via `Account.saveCheckPoint` for the next agent in the chain.
   *
   * See MIGRATION_PLAN.md — Phase 1.
   */
  setProps<TState = unknown>(props: AgentProps<TState>): void {
    this._props = props as AgentProps<unknown>;
  }

  /**
   * Retrieve previously stored props, cast to the requested state type.
   *
   * **Type safety note**: The caller is responsible for requesting the same `TState`
   * that was originally passed to `setProps`.  TypeScript cannot enforce this at
   * compile time because the field erases the concrete generic; use consistent
   * `TState` types within a controller to avoid mismatches.
   */
  getProps<TState = unknown>(): AgentProps<TState> | null {
    return this._props as AgentProps<TState> | null;
  }

  /**
   * Convenience helper: invoke `onSaveState` from the current props (if any).
   *
   * Controllers should call this when they want to persist their state so that
   * the next agent can resume via `previousState`.  The host is responsible for
   * forwarding the value to `Account.saveCheckPoint`.
   *
   * See MIGRATION_PLAN.md — Phase 1.
   */
  protected saveState<TState = unknown>(state: TState): void {
    // Cast to AgentProps<TState>: safe as long as the same TState was used in setProps.
    const props = this._props as AgentProps<TState> | null;
    if (props?.onSaveState) {
      props.onSaveState(state);
    }
  }

  getDelegate<T>(): T | null {
    return this._delegate as T | null;
  }

  getDataSource<T>(): T | null {
    return this._dataSource as T | null;
  }

  getOwner<T>(): T | null {
    return this._owner as T | null;
  }

  onRemoteErrorInController(_c: Controller, e: unknown): void {
    let o = this.getOwner<ControllerOwner>();
    if (o) {
      o.onRemoteErrorInController(this, e);
    }
  }
}

export default Controller;