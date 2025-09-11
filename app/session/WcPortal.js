(function(main) {
class WcPortal extends main.WcSession {
  _createLayerFragment() { return new main.LvPortal(); }

  _initEventHandlers() {
    super._initEventHandlers();
    dba.Notifications.init();
  }

  _main(dConfig) {
    super._main(dConfig);
    plt.Env.checkLoadAddonScript(plt.Env.SCRIPT.SIGNAL);
    plt.Env.checkLoadAddonScript(plt.Env.SCRIPT.QR_CODE);
  }
};

main.WcPortal = WcPortal;
}(window.main = window.main || {}));
