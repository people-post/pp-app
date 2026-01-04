import { ViewStack } from './ViewStack.js';

export class Page extends ViewStack {
  declare _pageId: string | null;

  constructor() {
    super();
    this._pageId = null;
  }

  getPageId(): string | null { return this._pageId; }

  setPageId(id: string | null): void { this._pageId = id; }
}

