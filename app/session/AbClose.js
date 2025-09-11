(function(main) {
// ActionButton needs some redesign
class AbClose extends ui.Fragment {
  constructor() {
    super();
    this._fClose = new gui.ActionButton();
    this._fClose.setIcon(gui.ActionButton.T_ICON.CLOSE);
    this._fClose.setDelegate(this);
  }

  onGuiActionButtonClick(fButton) {
    switch (fButton) {
    case this._fClose:
      this._delegate.onClickInCloseActionButtonFragment(this);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render) {
    let f = null;
    if (dba.Account.isAuthenticated()) {
      f = this._fClose;
    } else {
      return null;
    }
    this.setChild('current', f);
    if (f) {
      f.attachRender(render);
      f.render();
    }
  }
};

main.AbClose = AbClose;
}(window.main = window.main || {}));
