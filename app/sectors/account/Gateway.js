
class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() {
    if (glb.env.isWeb3()) {
      return this.#createWeb3MainViewContentFragment();
    } else {
      return this.#createWeb2MainViewContentFragment();
    }
  }

  #createWeb3MainViewContentFragment() { return new acnt.FvcWeb3Basic(); }

  #createWeb2MainViewContentFragment() {
    let f = new ui.FViewContentMux();

    let ff = new acnt.FvcStatistics();
    f.addTab({name : R.t("Statistics"), value : "REPORT", icon : C.ICON.REPORT},
             ff);

    ff = new acnt.FvcAddressList();
    f.addTab({name : R.t("Addresses"), value : "ADDRESSES", icon : C.ICON.TAG},
             ff);

    ff = new acnt.FvcBasic();
    f.addTab({name : R.t("Settings"), value : "CONFIG", icon : C.ICON.CONFIG},
             ff);

    ff = new acnt.FvcCloudFiles();
    f.addTab({name : R.t("Files"), value : "FILES", icon : C.ICON.FILES}, ff);

    f.switchTo("REPORT");
    return f;
  }
};

acnt.Gateway = Gateway;
}(window.acnt = window.acnt || {}));
