
class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() {
    let f = new ui.FViewContentMux();

    let ff = new cart.FvcCurrent();
    f.addTab({name : R.t("Current"), value : "CURRENT", icon : C.ICON.CART},
             ff);

    ff = new cart.FvcHistory();
    f.addTab({name : R.t("History"), value : "HISTORY", icon : C.ICON.ARTICLE},
             ff);

    f.switchTo("CURRENT");
    return f;
  }
};

cart.Gateway = Gateway;
}(window.cart = window.cart || {}));
