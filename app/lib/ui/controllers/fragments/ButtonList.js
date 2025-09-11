(function(ui) {
ui.CF_BUTTON_LIST = {
  ONCLICK : "CF_BUTTON_LIST_1",
}

const _CVT_BUTTON_LIST = {
  BTN :
      `<a class="button-bar __STYLE__" href="javascript:void(0)" onclick="javascript:G.action(ui.CF_BUTTON_LIST.ONCLICK, __ID__)">__TEXT__</a>
  <br>`,
}

class ButtonList extends ui.Fragment {
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

  action(type, ...args) {
    switch (type) {
    case ui.CF_BUTTON_LIST.ONCLICK:
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

ui.ButtonList = ButtonList;
}(window.ui = window.ui || {}));
