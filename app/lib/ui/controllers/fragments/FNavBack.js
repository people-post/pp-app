(function(ui) {
ui.CF_UI_NAV_BACK = {
  ON_CLICK : Symbol(),
};

const _CFT_UI_NAV_BACK = {
  MAIN :
      `<a href="javascript:void(0)" onclick="javascript:G.action(ui.CF_UI_NAV_BACK.ON_CLICK)">__ICON__</a>`,
};

class FNavBack extends ui.Fragment {
  action(type, ...args) {
    switch (type) {
    case ui.CF_UI_NAV_BACK.ON_CLICK:
      this._delegate.onNavBackFragmentClick(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContent() {
    let s = _CFT_UI_NAV_BACK.MAIN;
    s = s.replace("__ICON__", ui.ICONS.BACK);
    return s;
  }
};

ui.FNavBack = FNavBack;
}(window.ui = window.ui || {}));
