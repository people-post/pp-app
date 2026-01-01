import { WcSession } from './WcSession.js';
import { LvSub } from './LvSub.js';
import { T_ACTION } from '../common/plt/Events.js';

export class WcSub extends WcSession {
  topAction(type, ...args) {
    switch (type) {
    case T_ACTION.LOGIN_SUCCESS:
      this.#onLoginSuccess(args[0], args[1]);
      break;
    default:
      super.topAction.apply(this, arguments);
      break;
    }
  }

  _createLayerFragment() { return new LvSub(); }

  _initEventHandlers() {
    super._initEventHandlers();
    dba.Notifications.init();
  }

  _main(dConfig) {
    super._main(dConfig);
    glb.env.checkLoadAddonScript(glb.env.SCRIPT.SIGNAL);
  }

  #onLoginSuccess(profile, nextView) {
    let urlParam = new URLSearchParams(window.location.search);

    dba.Account.reset(profile);
    this._clearDbAgents();

    this._initLanguage();
    this._getTopLayerFragment().init();
    this.initFromUrl(urlParam);
    if (nextView) {
      this._pushView(nextView, "Auto next");
    }
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.main = window.main || {};
  window.main.WcSub = WcSub;
}
