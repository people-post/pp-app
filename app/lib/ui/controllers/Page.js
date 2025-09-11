(function(ui) {
class Page extends ui.ViewStack {
  constructor() {
    super();
    this._pageId = null;
  }

  getPageId() { return this._pageId; }

  setPageId(id) { this._pageId = id; }
}

ui.Page = Page;
}(window.ui = window.ui || {}));
