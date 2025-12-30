import { WcSession } from './WcSession.js';

export class WcPortal extends WcSession {
  _createLayerFragment() { return new main.LvPortal(); }

  _initEventHandlers() {
    super._initEventHandlers();
    dba.Notifications.init();
  }

  _main(dConfig) {
    super._main(dConfig);
    glb.env.checkLoadAddonScript(glb.env.SCRIPT.SIGNAL);
    glb.env.checkLoadAddonScript(glb.env.SCRIPT.QR_CODE);
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.main = window.main || {};
  window.main.WcPortal = WcPortal;
}
