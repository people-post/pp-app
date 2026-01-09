import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FAllEmailList } from './FAllEmailList.js';

export class FvcInbox extends FScrollViewContent {
  private _fEmails: FAllEmailList;

  constructor() {
    super();
    this._fEmails = new FAllEmailList();
    this._fEmails.setDelegate(this);
    this.setChild("emails", this._fEmails);
  }

  initFromUrl(urlParam: URLSearchParams): void {
    super.initFromUrl(urlParam);
    this._fEmails.initFromUrl(urlParam);
  }

  isReloadable(): boolean { return true; }
  hasHiddenTopBuffer(): boolean { return this._fEmails.hasBufferOnTop(); }

  getUrlParamString(): string { return this._fEmails.getUrlParamString(); }

  reload(): void { this._fEmails.reload(); }

  scrollToTop(): void { this._fEmails.scrollToItemIndex(0); }

  onScrollFinished(): void { this._fEmails.onScrollFinished(); }

  _renderContentOnRender(render: Panel): void {
    this._fEmails.attachRender(render);
    this._fEmails.render();
  }
};
