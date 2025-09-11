(function(emal) {
class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() {
    let f = new ui.FViewContentMux();

    let ff = new emal.FvcInbox();
    f.addTab({name : R.t("Inbox"), value : "INBOX", icon : C.ICON.EMAIL}, ff);

    ff = new emal.FvcConfig();
    f.addTab({name : R.t("Config"), value : "CONFIG", icon : C.ICON.CONFIG},
             ff);

    f.switchTo("INBOX");
    return f;
  }
};

emal.Gateway = Gateway;
}(window.emal = window.emal || {}));
