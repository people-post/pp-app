import { WcSession } from './WcSession.js';

export class WcGadget extends WcSession {
  onCountdownCancelledInCountdownContentFragment(fvcCountdown) {
    this._reload();
  }
  onCountdownFinishedInCountdownContentFragment(fvcCountdown) {
    this.#closeWindow();
  }
  onClickInCloseActionButtonFragment(fAbClose) { this.#closeWindow(); }

  topAction(type, ...args) {
    switch (type) {
    case plt.T_ACTION.PROXY_LOGIN_SUCCESS:
      this.#onProxyLoginSuccess(args[0]);
      break;
    case plt.T_ACTION.LOGIN_SUCCESS:
      this.#onLoginSuccess(args[0]);
      break;
    default:
      super.topAction.apply(this, arguments);
      break;
    }
  }

  _shouldClearInitialUrl() { return true; }

  _reload() {
    let lc = this._getBottomLayerFragment();
    lc.switchToDefaultPage();
    lc.init();
    lc.render();
  }

  _createLayerFragment() {
    let lc = new main.LvGadget();
    lc.setDefaultPageId(C.ID.SECTOR.EXTRAS);

    let fAb = new main.AbClose();
    fAb.setDelegate(this);
    lc.setDefaultActionButton(fAb);
    return lc;
  }

  #closeWindow() { window.close(); }

  #onProxyLoginSuccess(profile) {
    dba.Account.reset(profile);
    if (dba.Account.hasDomain()) {
      // Auto close for any domain owners
      let v = new ui.View();
      let f = new gui.FvcCountdownAction(
          {message : "Closing window", actionTitle : "Close"}, 3000);
      f.setDelegate(this);
      v.setContentFragment(f);
      this._showCustomDialog(v, "Close countdown", false);
    } else {
      this._reload();
    }
  }

  #onLoginSuccess(profile) {
    dba.Account.reset(profile);
    this._initLanguage();
    let f = this._getTopLayerFragment();
    f.init();
    f.render();
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.main = window.main || {};
  window.main.WcGadget = WcGadget;
}
