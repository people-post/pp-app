import { Fragment } from './Fragment.js';
import { FViewContentBase } from './FViewContentBase.js';

export class FViewContentContainer extends FViewContentBase {
  initFromUrl(urlParam: any): void {
    // TODO: This might be wrapper specific
    let f = this._getContentFragment();
    if (f) {
      f.initFromUrl(urlParam);
    }
  }

  getUrlParamString(): string {
    // TODO: This might be wrapper specific
    let f = this._getContentFragment();
    if (f) {
      return f.getUrlParamString();
    }
    return "";
  }

  onContentFragmentRequestUpdateHeader(_fContent: FViewContentBase): void {
    if (this._owner) {
      (this._owner as any).onContentFragmentRequestUpdateHeader(this);
    }
  }
  onContentFragmentRequestCloseMenu(_fContent: FViewContentBase): void {
    if (this._owner) {
      (this._owner as any).onContentFragmentRequestCloseMenu(this);
    }
  }
  onContentFragmentRequestReplaceView(_fContent: FViewContentBase, view: any, title: string): void {
    if (this._owner) {
      (this._owner as any).onContentFragmentRequestReplaceView(this, view, title);
    }
  }
  onContentFragmentRequestPopView(_fContent: FViewContentBase): void {
    if (this._owner) {
      (this._owner as any).onContentFragmentRequestPopView(this);
    }
  }

  getActionButton(): Fragment | null {
    let f = this._getContentFragment();
    if (f) {
      return f.getActionButton();
    }
    return null;
  }

  getHeaderDefaultNavFragment(): Fragment | null {
    let f = this._getContentFragment();
    if (f) {
      return f.getHeaderDefaultNavFragment();
    }
    return null;
  }

  getHeaderLayoutType(): symbol | null {
    let f = this._getContentFragment();
    if (f) {
      return f.getHeaderLayoutType();
    }
    return null;
  }

  getCustomTheme(): any {
    let f = this._getContentFragment();
    if (f) {
      return f.getCustomTheme();
    }
    return null;
  }

  getMenuFragments(): Fragment[] {
    let f = this._getContentFragment();
    if (f) {
      return f.getMenuFragments();
    }
    return [];
  }

  knockKnock(): void {
    let f = this._getContentFragment();
    if (f) {
      f.knockKnock();
    }
  }

  _getContentFragment(): FViewContentBase | null { return null; }
}

