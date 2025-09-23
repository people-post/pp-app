(function(main) {
class WcPortal extends main.WcSession {
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

main.WcPortal = WcPortal;
}(window.main = window.main || {}));
