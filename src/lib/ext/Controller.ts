export class Controller {
  protected _owner: Controller | null = null;
  protected _dataSource: unknown = null;
  protected _delegate: unknown = null;

  constructor() {
    this._owner = null;
    this._dataSource = null;
    this._delegate = null;
  }

  setOwner(owner: Controller | null): void {
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

  getOwner<T extends Controller = Controller>(): T | null {
    return this._owner as T | null;
  }

  onRemoteErrorInController(_c: Controller, e: unknown): void {
    if (this._owner) {
      this._owner.onRemoteErrorInController(this, e);
    }
  }
}

export default Controller;

