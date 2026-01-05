import { Fragment } from './Fragment.js';

export interface PreferredWidth {
  min: number;
  best: number;
  max: number;
}

export interface ViewContentFragmentOwner {
  onContentFragmentRequestUpdateHeader(fContent: Fragment): void;
  onContentFragmentRequestCloseMenu(fContent: Fragment): void;
  onContentFragmentRequestReplaceView(fContent: Fragment, view: any, title: string): void;
  onContentFragmentRequestPopView(fContent: Fragment): void;
  onFragmentRequestShowView(f: Fragment, view: any, title: string): void;
  onRemoteErrorInFragment(f: Fragment, e: unknown): void;
  onLocalErrorInFragment(f: Fragment, msg: string): void;
}

export class FViewContentBase extends Fragment {
  #preferredWidth: PreferredWidth | null = null;
  #maxWidthClassName: string = "wmax800px";

  initFromUrl(_urlParam: any): void {}
  getUrlParamString(): string { return ""; }

  getActionButton(): Fragment | null { return null; }
  getMenuFragments(): Fragment[] { return []; }
  getHeaderDefaultNavFragment(): Fragment | null { return null; }
  getHeaderLayoutType(): symbol | null { return null; }
  getCustomTheme(): any { return null; }
  getPreferredWidth(): PreferredWidth | null { return this.#preferredWidth; }
  getMaxWidthClassName(): string { return this.#maxWidthClassName; }

  onMenuFragmentRequestCloseMenu(_fMainMenu: Fragment): void {
    if (this._owner) {
      (this._owner as any).onContentFragmentRequestCloseMenu(this);
    }
  }

  setPreferredWidth(pw: PreferredWidth | null): void { this.#preferredWidth = pw; }
  setMaxWidthClassName(name: string): void { this.#maxWidthClassName = name; }

  knockKnock(): void {}
}

