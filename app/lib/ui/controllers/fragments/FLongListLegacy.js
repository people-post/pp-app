(function(ui) {
class FLongListLegacy extends ui.Fragment {
  constructor() {
    super();
    this._fItems = new ui.BufferedList();
    this._fItems.setDataSource(this);
    this._fItems.setDelegate(this);
    this.setChild("items", this._fItems);

    this._currentId = null;
  }

  // Delegate protocols
  createFragmentForBufferedListItem(fBufferedList, itemIndex) {
    return this._createItemFragment(itemIndex);
  }

  // Accessors
  isBufferedListExpectingMoreHeadItems(fBufferedList) { return false; }
  isBufferedListExpectingMoreTrailingItems(fBufferedList) {
    return !this._isFullListLoaded();
  }
  hasBufferOnTop() { return this._fItems.getFirstId() > 0; }
  shouldBufferedListClearBuffer(fBufferedList) { return false; }

  getCurrentId() { return this._currentId; }

  // Mutators
  setGridMode(b) { this._fItems.setGridMode(b); }

  // Methods
  onScrollFinished() { this._fItems.onScrollFinished(); }

  scrollToItemIndex(idx) { this._fItems.scrollTo(idx); }
  reload() {
    this._resetList();
    this._fItems.reload();
  }
  refreshItems() { this._fItems.refresh(); }

  switchToItem(id) {
    this._currentId = id;
    if (id) {
      let v = this._createItemView(id);
      if (v) {
        this.onFragmentRequestShowView(this, v, "Item" + id);
      }
      this._fItems.refresh();
    }
  }

  // Virtual functions
  _renderOnRender(render) {
    this._fItems.attachRender(render);
    this._fItems.render();
  }

  _isFullListLoaded() { throw "_isFullListLoaded is required"; }
  _createItemFragment(itemIndex) { throw "_createItemFragment is required"; }
  _createItemView(id) { return null; }
  _resetList() { throw "_resetList is required"; }
};

ui.FLongListLegacy = FLongListLegacy;
}(window.ui = window.ui || {}));
