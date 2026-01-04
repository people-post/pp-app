import { Fragment } from './Fragment.js';

export const CF_BUTTON_LIST = {
  ONCLICK : "CF_BUTTON_LIST_1",
} as const;

// Export to window for string template access
declare global {
  interface Window {
    CF_BUTTON_LIST?: typeof CF_BUTTON_LIST;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_BUTTON_LIST = CF_BUTTON_LIST;
}

const _CVT_BUTTON_LIST = {
  BTN :
      `<a class="button-bar __STYLE__" href="javascript:void(0)" onclick="javascript:G.action('${CF_BUTTON_LIST.ONCLICK}', __ID__)">__TEXT__</a>
  <br>`,
} as const;

interface ButtonConfig {
  text: string;
  func?: () => void;
  watchful: boolean;
}

export class ButtonList extends Fragment {
  private _configs: ButtonConfig[];

  constructor() {
    super();
    this._configs = [];
  }

  addButton(text: string, func?: () => void, watchful: boolean = false): void {
    this._configs.push({"text" : text, "func" : func, "watchful" : watchful});
  }

  _renderContent(): string {
    let btns: string[] = [];
    for (let [i, c] of this._configs.entries()) {
      let ss = _CVT_BUTTON_LIST.BTN.replace("__ID__", String(i));
      if (c.watchful) {
        ss = ss.replace("__STYLE__", "danger");
      } else {
        ss = ss.replace("__STYLE__", "s-primary");
      }
      ss = ss.replace("__TEXT__", c.text);
      btns.push(ss);
    }
    return btns.join("");
  }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_BUTTON_LIST.ONCLICK:
      this.#onClick(args[0]);
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  #onClick(id: number): void {
    let c = this._configs[id];
    if (c && c.func) {
      c.func();
    }

    if (this._delegate && typeof (this._delegate as any).onButtonClickedInButtonList === "function") {
      (this._delegate as any).onButtonClickedInButtonList(this, id);
    }
  }
}

