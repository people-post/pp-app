import { WcSession } from './WcSession.js';
import { LvPortal } from './LvPortal.js';
import { Notifications } from '../common/dba/Notifications.js';

export class WcPortal extends WcSession {
  _createLayerFragment() { return new LvPortal(); }

  _initEventHandlers() {
    super._initEventHandlers();
    Notifications.init();
  }

  _main(dConfig) {
    super._main(dConfig);
    glb.env.checkLoadAddonScript(glb.env.SCRIPT.SIGNAL);
    glb.env.checkLoadAddonScript(glb.env.SCRIPT.QR_CODE);
  }
};

