(function(ui) {
ui.CF_OPTION_CONTEXT_BUTTON = {
  ONCLICK : Symbol(),
};

const _CFT_OPTION_CONTEXT_BUTTON = {
  BTN :
      `<span class="clickable" onclick="javascript:G.action(ui.CF_OPTION_CONTEXT_BUTTON.ONCLICK)">__ICON__</span>`,
};

class OptionContextButton extends ui.Fragment {
  #lc;
  #icon;

  constructor() {
    super();
    this.#lc = new ui.LContext();
    this.#lc.setDelegate(this);
    this.#icon =
        `<span class="bd1px bdsolid s-cprimebd option-context-default-icon-wrapper inline-block s-icon6">__ICON__</span>`
            .replace("__ICON__", ui.ICONS.MORE);
  }

  setIcon(icon) { this.#icon = icon; }
  setTargetName(name) { this.#lc.setTargetName(name); }

  addOption(name, value, icon = null, themeType = null) {
    this.#lc.addOption(name, value, icon, themeType);
  }
  clearOptions() { this.#lc.clearOptions(); }

  onOptionClickedInContextLayer(lContext, value) {
    this._delegate.onOptionClickedInContextButtonFragment(this, value);
  }

  action(type, ...args) {
    switch (type) {
    case ui.CF_OPTION_CONTEXT_BUTTON.ONCLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    render.replaceContent(this.#renderIcon(this.#icon));
  }

  #renderIcon(icon) {
    let s = _CFT_OPTION_CONTEXT_BUTTON.BTN;
    let ss = Utilities.renderSvgFuncIcon(icon);
    s = s.replace("__ICON__", ss);
    return s;
  }

  #onClick() {
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }
};

ui.OptionContextButton = OptionContextButton;
}(window.ui = window.ui || {}));
