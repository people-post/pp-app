(function(gui) {
gui.CF_ACTION_BUTTON = {
  ONCLICK : "CF_GUI_ACTION_BUTTON_1",
};

// TODO: Relative is for badge, needs improvement
const _CFT_ACTION_BUTTON = {
  MAIN : `<div class="menu-slot-icon-wrapper pad5px relative">
      <a class="menu" href="javascript:void(0)" onclick="G.action(gui.CF_ACTION_BUTTON.ONCLICK)">__ICON__</a>
  </div>`,
};

class ActionButton extends ui.Fragment {
  static T_ICON = {
    NONE : ``,
    INFO: C.ICON.INFO,
    NEW: ui.ICONS.NEW,
    EDIT: C.ICON.EDIT,
    ORDER: C.ICON.CART,
    MORE: ui.ICONS.MORE,
    LOG_OUT: C.ICON.LOG_OUT,
    CLOSE: `Close`,
    CHECKOUT: `Checkout`,
    LOGIN: C.ICON.ACCOUNT,
    DONATE: C.ICON.COFFEE_MUG,
  };

  constructor() {
    super();
    this._icon = null;
  }

  setIcon(icon) { this._icon = icon; }

  action(type, ...args) {
    switch (type) {
    case gui.CF_ACTION_BUTTON.ONCLICK:
      this._delegate.onGuiActionButtonClick(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContent() {
    let icon = this._getIcon();
    if (!icon) {
      return "";
    }
    let s = _CFT_ACTION_BUTTON.MAIN;
    s = s.replace("__ICON__", Utilities.renderSvgMenuIcon(icon));
    return s;
  }

  _getIcon() { return this._icon; }
};

gui.ActionButton = ActionButton;
}(window.gui = window.gui || {}));
