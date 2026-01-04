import { Fragment } from './Fragment.js';

export class FViewContentBase extends Fragment {
  #preferredWidth: number | null = null;
  #maxWidthClassName: string = "wmax800px";

  initFromUrl(_urlParam: any): void {}
  getUrlParamString(): string { return ""; }

  getActionButton(): Fragment | null { return null; }
  getMenuFragments(): Fragment[] { return []; }
  getHeaderDefaultNavFragment(): Fragment | null { return null; }
  getHeaderLayoutType(): symbol | null { return null; }
  getCustomTheme(): any { return null; }
  getPreferredWidth(): number | null { return this.#preferredWidth; }
  getMaxWidthClassName(): string { return this.#maxWidthClassName; }

  onMenuFragmentRequestCloseMenu(fMainMenu: Fragment): void {
    if (this._owner) {
      (this._owner as any).onContentFragmentRequestCloseMenu(this);
    }
  }

  setPreferredWidth(pw: number | null): void { this.#preferredWidth = pw; }
  setMaxWidthClassName(name: string): void { this.#maxWidthClassName = name; }

  knockKnock(): void {}
}

