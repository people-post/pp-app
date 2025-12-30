import { FViewContentBase } from './FViewContentBase.js';

export class FViewContentContainer extends FViewContentBase {
  initFromUrl(urlParam) {
    // TODO: This might be wrapper specific
    let f = this._getContentFragment();
    if (f) {
      f.initFromUrl(urlParam);
    }
  }

  getUrlParamString() {
    // TODO: This might be wrapper specific
    let f = this._getContentFragment();
    if (f) {
      return f.getUrlParamString();
    }
    return "";
  }

  onContentFragmentRequestUpdateHeader(fContent) {
    if (this._owner) {
      this._owner.onContentFragmentRequestUpdateHeader(this);
    }
  }
  onContentFragmentRequestCloseMenu(fContent) {
    if (this._owner) {
      this._owner.onContentFragmentRequestCloseMenu(this);
    }
  }
  onContentFragmentRequestReplaceView(fContent, view, title) {
    if (this._owner) {
      this._owner.onContentFragmentRequestReplaceView(this, view, title);
    }
  }
  onContentFragmentRequestPopView(fContent) {
    if (this._owner) {
      this._owner.onContentFragmentRequestPopView(this);
    }
  }

  getActionButton() {
    let f = this._getContentFragment();
    if (f) {
      return f.getActionButton();
    }
    return null;
  }

  getHeaderDefaultNavFragment() {
    let f = this._getContentFragment();
    if (f) {
      return f.getHeaderDefaultNavFragment();
    }
    return null;
  }

  getHeaderLayoutType() {
    let f = this._getContentFragment();
    if (f) {
      return f.getHeaderLayoutType();
    }
    return null;
  }

  getCustomTheme() {
    let f = this._getContentFragment();
    if (f) {
      return f.getCustomTheme();
    }
    return null;
  }

  getMenuFragments() {
    let f = this._getContentFragment();
    if (f) {
      return f.getMenuFragments();
    }
    return [];
  }

  knockKnock() {
    let f = this._getContentFragment();
    if (f) {
      f.knockKnock();
    }
  }

  _getContentFragment() { return null; }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.FViewContentContainer = FViewContentContainer;
}
