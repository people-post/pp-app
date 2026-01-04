import { FViewContentContainer } from './FViewContentContainer.js';
import { Fragment } from './Fragment.js';

export class FViewContentWrapper extends FViewContentContainer {
  #fContent: Fragment | null = null;

  getPreferredWidth(): number | null {
    let f = this._getContentFragment();
    if (f) {
      return f.getPreferredWidth();
    }
    return super.getPreferredWidth();
  }

  getMaxWidthClassName(): string {
    let f = this._getContentFragment();
    if (f) {
      return f.getMaxWidthClassName();
    }
    return super.getMaxWidthClassName();
  }

  wrapContentFragment(fContent: Fragment): void {
    this.#fContent = fContent;
    this.setChild("wrappedcontent", fContent);
  }

  resetContentFragment(fContent: Fragment): void {
    this.wrapContentFragment(fContent);
    this.render();
    this.onContentFragmentRequestUpdateHeader(this);
  }

  _getContentFragment(): Fragment | null { return this.#fContent; }
}

