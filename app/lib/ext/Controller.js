(function(ext) {
class Controller {
  constructor() {
    this._owner = null;
    this._dataSource = null;
    this._delegate = null;
  }

  setOwner(owner) { this._owner = owner; }
  setDataSource(s) { this._dataSource = s; }
  setDelegate(d) { this._delegate = d; }

  onRemoteErrorInController(c, e) {
    if (this._owner) {
      this._owner.onRemoteErrorInController(this, e);
    }
  }
};

ext.Controller = Controller;
}(window.ext = window.ext || {}));
