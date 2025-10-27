(function(main) {
class WcWeb3 extends main.WcSession {
  #postingKeyPath =
      [ dat.Wallet.T_PURPOSE.NFSC001, dat.Wallet.T_COIN.NFSC001, 0, 0, 0 ];

  async asOnWeb3UserRequestFetchCidJson(user, cid) {
    return await plt.Api.asyncFetchCidJson(cid);
  }

  async asOnWeb3UserRequestFetchCidImage(user, cid) {
    return await plt.Api.asyncFetchCidImage(cid);
  }
  onWeb3UserIdolsLoaded(user) {
    fwk.Events.trigger(plt.T_DATA.USER_IDOLS, user.getId())
  }

  onWeb3UserProfileLoaded(user) {
    fwk.Events.trigger(plt.T_DATA.USER_PUBLIC_PROFILE, user.getId());
  }

  onWeb3OwnerRequestGetPublicKey(owner) {
    return ext.Utilities.uint8ArrayToHex(
        dba.Keys.getMlDsa44(this.#postingKeyPath));
  }

  onWeb3OwnerRequestLoadCheckPoint(owner) {
    return sessionStorage.getItem(C.STORAGE.KEY.PROFILE);
  }

  onWeb3OwnerRequestSaveCheckPoint(owner, data) {
    sessionStorage.setItem(C.STORAGE.KEY.PROFILE, data);
  }

  async asOnWeb3OwnerRequestSign(owner, msg) {
    return await dba.Keys.sign(this.#postingKeyPath, msg);
  }

  onWeb3OwnerProfileUpdated(owner) {
    fwk.Events.trigger(plt.T_DATA.USER_PROFILE);
  }

  onLoginClickInAccountActionButtonFragment(fAbAccount) {
    let gw = new auth.Gateway();
    let v = gw.createWeb3LoginView();
    this._pushView(v, "Login");
  }

  onLogoutClickInActionButtonFragment(fAbAccount) {
    sessionStorage.clear();
    dba.Account.reset();
    dba.Keys.reset();
    location.reload();
  }

  topAction(type, ...args) {
    switch (type) {
    case plt.T_ACTION.LOGIN_SUCCESS:
      this.#onLoginSuccess(args[0]);
      break;
    case plt.T_ACTION.SHOW_USER_INFO:
      this.#showUserInfoView(args[0]);
      break;
    default:
      super.topAction.apply(this, arguments);
      break;
    }
  }

  main(dConfig) { this.#asMain(dConfig); }

  _createLayerFragment() { return new main.LvMain(); }

  _initLayer(lc) {
    let fAb = new main.AbAccount();
    fAb.setDelegate(this);
    lc.setDefaultActionButton(fAb);
    lc.setDefaultPageId(dba.WebConfig.getHomeSector());
    super._initLayer(lc);
  }

  async #asMain(dConfig) {
    console.info("Starting helia...");
    await plt.Helia.init();

    console.info("Load local data...");
    let sData = sessionStorage.getItem(C.STORAGE.KEY.KEYS);
    if (sData) {
      dba.Keys.fromEncodedStr(sData);
    }
    dba.Account = new pdb.Web3Owner();
    dba.Account.setDataSource(this);
    dba.Account.setDelegate(this);
    dba.Account.loadCheckPoint();

    console.info("Load config...");
    dba.Web3Config.load(C.WEB3);
    const c = dba.Web3Config.getNetworkConfig();

    console.info("Init resolver...");
    glb.web3Resolver = new pdb.Web3Resolver();
    await glb.web3Resolver.asInit(c ? c.resolvers : null);

    console.info("Init publisher...");
    glb.web3Publisher = new pdb.Web3Publisher();
    await glb.web3Publisher.asInit(c ? c.publishers : null);
    await glb.web3Publisher.asInitForUser(dba.Account.getId());

    console.info("Init ledger...");
    glb.web3Ledger = new pdb.Web3Ledger();
    await glb.web3Ledger.asInit(c ? c.blockchains : null);

    console.info("Init storage...");
    glb.web3Storage = new pdb.Web3Storage();
    await glb.web3Storage.asInit(c ? c.storages : null);
    await glb.web3Storage.asInitForUser(dba.Account.getId());

    console.info("Init layout...");
    this.init(null, dConfig.default_theme.primary_color,
              dConfig.default_theme.secondary_color);

    console.info("Starting up...");
    this._main({"web_config" : dConfig});
  }

  #onLoginSuccess(profile) {
    let urlParam = new URLSearchParams(window.location.search);
    dba.Account.reset(profile);
    dba.Account.saveCheckPoint();
    sessionStorage.setItem(C.STORAGE.KEY.KEYS, dba.Keys.toEncodedStr());

    this._clearDbAgents();

    this._initLanguage();
    this._getTopLayerFragment().init();
    this.initFromUrl(urlParam);
  }

  #showUserInfoView(userId) {
    let v = new ui.View();
    let f = new hr.FvcWeb3UserInfo();
    f.setUserId(userId);
    v.setContentFragment(f);
    this._pushDialog(v, "User info");
  }
};

main.WcWeb3 = WcWeb3;
}(window.main = window.main || {}));
