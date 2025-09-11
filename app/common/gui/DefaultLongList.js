(function(gui) {
class DefaultLongList extends ui.FLongListLegacy {
  constructor() {
    super();
    this._isBatchLoading = false;
    this._ids = [];
    this._isIdsComplete = false;
  }

  initFromUrl(urlParam) {
    let id = urlParam.get(ui.C.URL_PARAM.ID);
    if (id) {
      this.switchToItem(id);
    }
  }

  getUrlParamString() {
    if (this._currentId) {
      return ui.C.URL_PARAM.ID + "=" + this._currentId;
    }
    return "";
  }

  _isFullListLoaded() { return this._isIdsComplete; }

  _createItemFragment(itemIndex) {
    if (itemIndex < 0) {
      return null;
    }
    let id = this._ids[itemIndex];
    if (id) {
      return this._createInfoFragment(id);
    } else {
      if (!this._isIdsComplete) {
        this._asyncLoadItems();
      }
      return null;
    }
  }

  _resetList() {
    this._ids = [];
    this._isIdsComplete = false;
  }

  _createInfoFragment(id) { throw "_createInfoFragment is not implemented"; }

  _asyncLoadItems() {}
};

gui.DefaultLongList = DefaultLongList;
}(window.gui = window.gui || {}));
