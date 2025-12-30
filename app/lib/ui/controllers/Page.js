import { ViewStack } from './ViewStack.js';

export class Page extends ViewStack {
  constructor() {
    super();
    this._pageId = null;
  }

  getPageId() { return this._pageId; }

  setPageId(id) { this._pageId = id; }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.Page = Page;
}
