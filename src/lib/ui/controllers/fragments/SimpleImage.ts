import { Fragment } from './Fragment.js';

const _CFT_SIMPLE_IMAGE = {
  MAIN : `<img class="preview-icon s-icon0" src="__URL__">`,
} as const;

export class SimpleImage extends Fragment {
  private _src: string | null;

  constructor() {
    super();
    this._src = null;
  }
  
  setSrc(src: string | null): void { this._src = src; }
  
  _renderContent(): string {
    let s: string = _CFT_SIMPLE_IMAGE.MAIN;
    s = s.replace("__URL__", this._src || "");
    return s;
  }
}

