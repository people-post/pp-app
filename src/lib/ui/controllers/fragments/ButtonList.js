import { Fragment } from './Fragment.js';

export const CF_BUTTON_LIST = {
  ONCLICK : "CF_BUTTON_LIST_1",
}

const _CVT_BUTTON_LIST = {
  BTN :
      `<a class="button-bar __STYLE__" href="javascript:void(0)" data-action="ONCLICK" data-action-args="[__ID__]">__TEXT__</a>
  <br>`,
}

export class ButtonList extends Fragment {
  constructor() {
    super();
    this._configs = [];
  }

  addButton(text, func, watchful = false) {
    this._configs.push({"text" : text, "func" : func, "watchful" : watchful});
  }

  _renderContent() {
    let btns = [];
    for (let [i, c] of this._configs.entries()) {
      let ss = _CVT_BUTTON_LIST.BTN.replace("__ID__", i);
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

  _onContentDidAppear() {
    this._attachActionListeners('[data-action]', {
      'ONCLICK': CF_BUTTON_LIST.ONCLICK
    });
  }

  action(type, ...args) {
    switch (type) {
    case CF_BUTTON_LIST.ONCLICK:
      this.#onClick(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  #onClick(id) {
    let c = this._configs[id];
    if (c && c.func) {
      c.func();
    }

    if (typeof this._delegate.onButtonClickedInButtonList === "function") {

      this._delegate.onButtonClickedInButtonList(this, id);
    }
  }
};

// Export to window for string template access (reduced - constants no longer needed for onclick)

