export class Controller {
  protected _owner: Controller | null = null;
  protected _dataSource: unknown = null;
  protected _delegate: {
    onRemoteErrorInController?(c: Controller, e: unknown): void;
    [key: string]: unknown;
  } | null = null;

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

  setDelegate(d: {
    onRemoteErrorInController?(c: Controller, e: unknown): void;
    [key: string]: unknown;
  } | null): void {
    this._delegate = d;
  }

  onRemoteErrorInController(_c: Controller, e: unknown): void {
    if (this._owner) {
      this._owner.onRemoteErrorInController(this, e);
    }
  }
}

export default Controller;

