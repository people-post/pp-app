// See MIGRATION_PLAN.md for the full props-based refactor plan and progress tracker.

export interface ControllerOwner {
  onRemoteErrorInController(c: Controller, e: unknown): void;
}

/**
 * Props interface for props-based controllers.
 *
 * Replaces the legacy `setDelegate` / `setDataSource` pattern with a single
 * `setProps` call, enabling 1:1 relationships and reactive data updates.
 *
 * See MIGRATION_PLAN.md — Phase 1.
 *
 * @example
 * ```ts
 * // Parent wiring up FCareer via props instead of separate delegate/dataSource calls:
 * const career = new FCareer();
 * career.setProps({
 *   data: { roleId: "engineer" },
 *   callbacks: {
 *     onClickInCareerFragment: (f: unknown) => handleCareerClick(f as FCareer),
 *   },
 *   onDataUpdate: (data) => career.reload(data),
 * });
 * ```
 */
export interface AgentProps {
  /** Arbitrary data passed into the component/controller (replaces `setDataSource`). */
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
  protected _props: AgentProps | null = null;

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
   * Pass `data` (replaces `setDataSource`), `callbacks` (replaces `setDelegate`),
   * and/or `onDataUpdate` (replaces `handleSessionDataUpdate`) in a single call.
   *
   * See MIGRATION_PLAN.md — Phase 1.
   */
  setProps(props: AgentProps): void {
    this._props = props;
  }

  /** Return the currently stored props, or `null` if none have been set. */
  getProps(): AgentProps | null {
    return this._props;
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