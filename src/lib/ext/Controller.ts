export interface ControllerOwner {
  onRemoteErrorInController(c: Controller, e: unknown): void;
}

export class Controller implements ControllerOwner {
  protected _owner: ControllerOwner | null = null;
  protected _dataSource: unknown = null;
  protected _delegate: unknown = null;

  setOwner(owner: ControllerOwner | null): void {
    this._owner = owner;
  }

  setDataSource(s: unknown): void {
    this._dataSource = s;
  }

  setDelegate(d: unknown): void {
    this._delegate = d;
  }

  getDelegate<T>(): T | null {
    return this._delegate as T | null;
  }

  getDataSource<T>(): T | null {
    return this._dataSource as T | null;
  }

  getOwner<T extends ControllerOwner>(): T | null {
    return this._owner as T | null;
  }

  onRemoteErrorInController(_c: ControllerOwner, e: unknown): void {
    if (this._owner) {
      (this._owner as ControllerOwner).onRemoteErrorInController(this, e);
    }
  }
}

export default Controller;