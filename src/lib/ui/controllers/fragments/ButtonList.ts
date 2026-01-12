import { Fragment } from './Fragment.js';

export const CF_BUTTON_LIST = {
  ONCLICK : "CF_BUTTON_LIST_1",
} as const;

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

export interface ButtonListDelegate {
  onButtonClickedInButtonList(f: ButtonList, id: number): void;
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

    const delegate = this.getDelegate<ButtonListDelegate>();
    if (delegate) {
      delegate.onButtonClickedInButtonList(this, id);
    }
  }
}

