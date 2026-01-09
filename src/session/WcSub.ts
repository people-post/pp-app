import { WcSession } from './WcSession.js';
import { LvSub } from './LvSub.js';
import { T_ACTION } from '../common/plt/Events.js';
import { Notifications } from '../common/dba/Notifications.js';
import { Env } from '../common/plt/Env.js';
import { View } from '../lib/ui/controllers/views/View.js';

export class WcSub extends WcSession {
  topAction(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case T_ACTION.LOGIN_SUCCESS:
      this.#onLoginSuccess(args[0] as unknown, args[1] as View | undefined);
      break;
    default:
      super.topAction(type, ...args);
      break;
    }
  }

  _createLayerFragment(): LvSub { return new LvSub(); }

  _initEventHandlers(): void {
    super._initEventHandlers();
    Notifications.init();
  }

  _main(dConfig: unknown): void {
    super._main(dConfig);
    Env.checkLoadAddonScript(Env.SCRIPT.SIGNAL);
  }

  #onLoginSuccess(profile: unknown, nextView: View | undefined): void {
    let urlParam = new URLSearchParams(window.location.search);

    window.dba.Account?.reset?.(profile);
    this._clearDbAgents();

    this._initLanguage();
    this._getTopLayerFragment().init();
    this.initFromUrl(urlParam);
    if (nextView) {
      this._pushView(nextView, "Auto next");
    }
  }
}

export default WcSub;
