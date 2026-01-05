import { FViewContentContainer } from './FViewContentContainer.js';
import { FViewContentBase, PreferredWidth } from './FViewContentBase.js';

export class FViewContentWrapper extends FViewContentContainer {
  #fContent: FViewContentBase | null = null;

  getPreferredWidth(): PreferredWidth | null {
    let f = this._getContentFragment();
    if (f && f instanceof FViewContentBase) {
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

  wrapContentFragment(fContent: FViewContentBase): void {
    this.#fContent = fContent;
    this.setChild("wrappedcontent", fContent);
  }

  resetContentFragment(fContent: FViewContentBase): void {
    this.wrapContentFragment(fContent);
    this.render();
    this.onContentFragmentRequestUpdateHeader(this);
  }

  _getContentFragment(): FViewContentBase | null { return this.#fContent; }
}

