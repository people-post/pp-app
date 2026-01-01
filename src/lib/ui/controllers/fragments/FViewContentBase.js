import { Fragment } from './Fragment.js';

export class FViewContentBase extends Fragment {
  #preferredWidth = null;
  #maxWidthClassName = "wmax800px";

  initFromUrl(urlParam) {}
  getUrlParamString() { return ""; }

  getActionButton() { return null; }
  getMenuFragments() { return []; }
  getHeaderDefaultNavFragment() { return null; }
  getHeaderLayoutType() { return null; }
  getCustomTheme() { return null; }
  getPreferredWidth() { return this.#preferredWidth; }
  getMaxWidthClassName() { return this.#maxWidthClassName; }

  onMenuFragmentRequestCloseMenu(fMainMenu) {
    if (this._owner) {
      this._owner.onContentFragmentRequestCloseMenu(this);
    }
  }

  setPreferredWidth(pw) { this.#preferredWidth = pw; }
  setMaxWidthClassName(name) { this.#maxWidthClassName = name; }

  knockKnock() {}
};
