import { WcSession } from './WcSession.js';
import { LvPortal } from './LvPortal.js';
import { Notifications } from '../common/dba/Notifications.js';
import { Env } from '../common/plt/Env.js';

export class WcPortal extends WcSession {
  _createLayerFragment(): LvPortal { return new LvPortal(); }

  _initEventHandlers(): void {
    super._initEventHandlers();
    Notifications.init();
  }

  _main(dConfig: unknown): void {
    super._main(dConfig);
    Env.checkLoadAddonScript(Env.SCRIPT.SIGNAL);
    Env.checkLoadAddonScript(Env.SCRIPT.QR_CODE);
  }
}

export default WcPortal;
