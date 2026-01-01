import { FvcLoginBase } from './FvcLoginBase.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcProgress } from '../../lib/ui/controllers/views/FvcProgress.js';
import * as bip39 from '../../lib/3rd/bip39.js';

export class FvcWeb3Login extends FvcLoginBase {
  #fMnemonic;
  #btnSubmit;
  #btnCreate;
  #newMnemonic;

  constructor() {
    super();
    this.#fMnemonic = new TextArea();
    this.#fMnemonic.setClassName("w100 h120px");
    this.#fMnemonic.setConfig({
      title : "Mnemonic",
      hint : "24 mnemonic words",
      value : "",
      isRequired : true
    });
    this.setChild("mnemonic", this.#fMnemonic);

    this.#btnCreate = new Button();
    this.#btnCreate.setDelegate(this);
    this.#btnCreate.setValue("CREATE");
    this.#btnCreate.setName("Create");
    this.#btnCreate.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnCreate.setThemeType(Button.T_THEME.PALE);
    this.setChild("btnCreate", this.#btnCreate);

    this.#btnSubmit = new Button();
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
    let pList = new ListPanel();
    pList.setClassName("h100");
    render.wrapPanel(pList);

    let p = new PanelWrapper();
    pList.pushPanel(p);
    this.#fMnemonic.attachRender(p);
    this.#fMnemonic.render();

    pList.pushSpace(1);

    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#btnSubmit.attachRender(p);
    this.#btnSubmit.render();

    pList.pushSpace(1);

    p = new PanelWrapper();
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
    let v = new View();
    let f = new FvcProgress();
    f.setDelegate(this);
    v.setContentFragment(f);

    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Progress");

    f.addProgress("Initializing account...");
    dba.Keys.setMnemonic(w);
    dba.Keys.asyncGetAccount()
        .then(k => this.#onAccountKeyReady(f, k, w == this.#newMnemonic))
        .catch(e => this.#onGetAccountError(e));
  }

  #onGetAccountError(e) {
    console.error(e);
    this.#btnSubmit.setEnabled(true)
  }

  #onAccountKeyReady(fvcProgress, key, isNew) {
    let peerId = pp.sys.utl.peerIdFromPublicKey(key);
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
    let cid = glb.web3Publisher.getInitUserRootCid();
    let d;
    if (cid) {
      d = await glb.web3Resolver.asResolveFromCid(cid);
    }
    if (!d) {
      d = await glb.web3Resolver.asResolve(userId);
    }
    return d;
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
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.auth = window.auth || {};
  window.auth.FvcWeb3Login = FvcWeb3Login;
}
