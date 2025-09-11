(function(ui) {
ui.CF_UI_NAV_MAGIC = {
  ON_CLICK : Symbol(),
};

const _CFT_UI_NAV_MAGIC = {
  MAIN :
      `<span class="w100 h40px inline-block cursornresize" onclick="javascript:G.action(ui.CF_UI_NAV_MAGIC.ON_CLICK)"></span>`,
};

class FNavMagic extends ui.Fragment {
  action(type, ...args) {
    switch (type) {
    case ui.CF_UI_NAV_MAGIC.ON_CLICK:
      this._delegate.onNavMagicFragmentClick(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContent() { return _CFT_UI_NAV_MAGIC.MAIN; }
};

ui.FNavMagic = FNavMagic;
}(window.ui = window.ui || {}));
