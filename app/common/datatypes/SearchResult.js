(function(dat) {
class SearchResult {
  constructor(items) { this._items = items; }
  size() { return this._items.length; }
  getItems() { return this._items; }
};

dat.SearchResult = SearchResult;
}(window.dat = window.dat || {}));
