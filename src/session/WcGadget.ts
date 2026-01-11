import { WcSession } from './WcSession.js';
import { LvGadget } from './LvGadget.js';
import { AbClose } from './AbClose.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { FvcCountdownAction } from '../common/gui/FvcCountdownAction.js';
import { T_ACTION } from '../common/plt/Events.js';
import { ID } from '../common/constants/Constants.js';
import { Account } from '../common/dba/Account.js';

export class WcGadget extends WcSession {
  onCountdownCancelledInCountdownContentFragment(_fvcCountdown: FvcCountdownAction): void {
    this._reload();
  }
  onCountdownFinishedInCountdownContentFragment(_fvcCountdown: FvcCountdownAction): void {
    this.#closeWindow();
  }
  onClickInCloseActionButtonFragment(_fAbClose: AbClose): void { this.#closeWindow(); }

  topAction(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case T_ACTION.PROXY_LOGIN_SUCCESS:
      this.#onProxyLoginSuccess(args[0]);
      break;
    case T_ACTION.LOGIN_SUCCESS:
      this.#onLoginSuccess(args[0]);
      break;
    default:
      super.topAction(type, ...args);
      break;
    }
  }

  _shouldClearInitialUrl(): boolean { return true; }

  _reload(): void {
    let lc = this._getBottomLayerFragment();
    lc.switchToDefaultPage();
    lc.init();
    lc.render();
  }

  _createLayerFragment(): LvGadget {
    let lc = new LvGadget();
    lc.setDefaultPageId(ID.SECTOR.EXTRAS);

    let fAb = new AbClose();
    fAb.setDelegate(this);
    lc.setDefaultActionButton(fAb);
    return lc;
  }

  #closeWindow(): void { window.close(); }

  #onProxyLoginSuccess(profile: any): void {
    Account.reset(profile);
    if (Account.hasDomain()) {
      // Auto close for any domain owners
      let v = new View();
      let f = new FvcCountdownAction(
          {message : "Closing window", actionTitle : "Close"}, 3000);
      f.setDelegate(this);
      v.setContentFragment(f);
      this._showCustomDialog(v, "Close countdown", false);
    } else {
      this._reload();
    }
  }

  #onLoginSuccess(profile: any): void {
    Account.reset(profile);
    this._initLanguage();
    let f = this._getTopLayerFragment();
    f.init();
    f.render();
  }
}
