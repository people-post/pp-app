(function(auth) {
class FvcWeb3Login extends auth.FvcLoginBase {
  #fMnemonic;
  #btnSubmit;
  #btnCreate;
  #newMnemonic;

  constructor() {
    super();
    this.#fMnemonic = new ui.TextArea();
    this.#fMnemonic.setClassName("w100 h120px");
    this.#fMnemonic.setConfig({
      title : "Mnemonic",
      hint : "24 mnemonic words",
      value : "",
      isRequired : true
    });
    this.setChild("mnemonic", this.#fMnemonic);

    this.#btnCreate = new ui.Button();
    this.#btnCreate.setDelegate(this);
    this.#btnCreate.setValue("CREATE");
    this.#btnCreate.setName("Create");
    this.#btnCreate.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this.#btnCreate.setThemeType(ui.Button.T_THEME.PALE);
    this.setChild("btnCreate", this.#btnCreate);

    this.#btnSubmit = new ui.Button();
    this.#btnSubmit.setDelegate(this);
    this.#btnSubmit.setValue("SUBMIT");
    this.#btnSubmit.setName("Submit");
    this.setChild("btnSubmit", this.#btnSubmit);
  }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn.getValue()) {
    case "CREATE":
      this.#onCreate();
      break;
    case "SUBMIT":
      this.#onSubmit();
      break;
    default:
      break;
    }
  }

  onRequestCancelInProgressViewContentFragment(fvcProgress) {
    this.#skipAccountSearch();
  }

  _renderContentOnRender(render) {
    let pList = new ui.ListPanel();
    pList.setClassName("h100");
    render.wrapPanel(pList);

    let p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#fMnemonic.attachRender(p);
    this.#fMnemonic.render();

    pList.pushSpace(1);

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#btnSubmit.attachRender(p);
    this.#btnSubmit.render();

    pList.pushSpace(1);

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#btnCreate.attachRender(p);
    this.#btnCreate.render();
  }

  #onCreate() {
    this.#newMnemonic = bip39.generateMnemonic(256);
    this.#fMnemonic.setValue(this.#newMnemonic);
  }

  #onSubmit() {
    let w = this.#fMnemonic.getValue();
    if (!bip39.validateMnemonic(w.trim())) {
      this.onLocalErrorInFragment(this, R.get("EL_INVALID_MNEMONIC"));
      return;
    }

    this.#btnSubmit.setEnabled(false);
    let v = new ui.View();
    let f = new ui.FvcProgress();
    f.setDelegate(this);
    v.setContentFragment(f);

    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Progress");

    f.addProgress("Initializing account...");
    dba.Keys.setMnemonic(w);
    dba.Keys.asyncGetAccount()
        .then(k => this.#onAccountKeyReady(f, k, w == this.#newMnemonic))
        .catch(e => this.#btnSubmit.setEnabled(true));
  }

  #onAccountKeyReady(fvcProgress, key, isNew) {
    let peerId = Libp2PPeerId.peerIdFromPublicKey(key);
    let userId = peerId.toString();
    if (isNew) {
      // TODO: Default profile should share the same code as the one inside
      // NameServer
      this.#onAccountProfileReady(fvcProgress, {uuid : userId});
    } else {
      fvcProgress.addProgress("Searching account data...");
      this.#asInitAccount(userId)
          .then(d => this.#onAccountProfileReady(fvcProgress, d))
          .catch(e => this.#onAccountInitError(e));
    }
  }

  async #asInitAccount(userId) {
    await glb.web3Publisher.asInitForUser(userId);
    return await glb.web3Resolver.asyncResolve(userId);
  }

  #skipAccountSearch() {
    // TODO:
    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
  }

  #onAccountProfileReady(fvcProgress, profile) {
    fvcProgress.addProgress("Account ready");
    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
    fwk.Events.triggerTopAction(plt.T_ACTION.LOGIN_SUCCESS, profile);
  }

  #onAccountInitError(e) {
    console.log(e);
    this.#btnSubmit.setEnabled(true);
  }
};

auth.FvcWeb3Login = FvcWeb3Login;
}(window.auth = window.auth || {}));
