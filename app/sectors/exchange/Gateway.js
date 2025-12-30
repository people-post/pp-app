
export class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() {
    if (glb.env.isWeb3()) {
      return this.#createWeb3MainViewContentFragment();
    } else {
      return this.#createWeb2MainViewContentFragment();
    }
  }

  #createWeb3MainViewContentFragment() { return new xchg.FvcWeb3Wallet(); }

  #createWeb2MainViewContentFragment() {
    let f;
    if (dba.Account.isWebOwner()) {
      f = new ui.FViewContentMux();

      let ff = new xchg.FvcExchange();
      f.addTab({name : R.t("Market"), value : "MARKET", icon : C.ICON.EXPLORER},
               ff);

      ff = new xchg.FvcWallet();
      f.addTab({name : R.t("Wallet"), value : "WALLET", icon : C.ICON.WALLET},
               ff);

      f.switchTo("MARKET");
    } else {
      f = new xchg.FvcExchange();
    }
    return f;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.xchg = window.xchg || {};
  window.xchg.Gateway = Gateway;
}
