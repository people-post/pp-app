import { WcSession } from './WcSession.js';
import { Gateway as AuthGateway } from '../sectors/auth/Gateway.js';
import { LvMain } from './LvMain.js';
import { AbAccount } from './AbAccount.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { Wallet } from '../common/datatypes/Wallet.js';
import { T_DATA, T_ACTION } from '../common/plt/Events.js';
import { Events } from '../lib/framework/Events.js';
import UtilitiesExt from '../lib/ext/Utilities.js';
import { Keys } from '../common/dba/Keys.js';
import { WebConfig } from '../common/dba/WebConfig.js';
import { Web3Config } from '../common/dba/Web3Config.js';
import { Account } from '../common/dba/Account.js';
import { STORAGE } from '../common/constants/Constants.js';
import { FvcWeb3UserInfo } from '../sectors/hr/FvcWeb3UserInfo.js';
import { Web3Resolver } from '../common/pdb/Web3Resolver.js';
import { Web3Publisher } from '../common/pdb/Web3Publisher.js';
import { Web3Ledger } from '../common/pdb/Web3Ledger.js';
import { Web3Storage } from '../common/pdb/Web3Storage.js';
import { env } from '../common/plt/Env.js';
import { asInit, Owner } from 'pp-api';

export class WcWeb3 extends WcSession {
  #postingKeyPath =
      [ Wallet.T_PURPOSE.NFSC001, Wallet.T_COIN.NFSC001, 0, 0, 0 ];

  onWeb3UserIdolsLoaded(user) {
    Events.trigger(T_DATA.USER_IDOLS, user.getId())
  }

  onWeb3UserProfileLoaded(user) {
    Events.trigger(T_DATA.USER_PUBLIC_PROFILE, user.getId());
  }

  onWeb3OwnerRequestGetPublicKey(owner) {
    return UtilitiesExt.uint8ArrayToHex(
        Keys.getMlDsa44(this.#postingKeyPath));
  }

  onWeb3OwnerRequestLoadCheckPoint(owner) {
    return sessionStorage.getItem(STORAGE.KEY.PROFILE);
  }

  onWeb3OwnerRequestSaveCheckPoint(owner, data) {
    sessionStorage.setItem(STORAGE.KEY.PROFILE, data);
  }

  async asOnWeb3OwnerRequestSign(owner, msg) {
    return await Keys.sign(this.#postingKeyPath, msg);
  }

  onWeb3OwnerProfileUpdated(owner) {
    Events.trigger(T_DATA.USER_PROFILE);
  }

  onLoginClickInAccountActionButtonFragment(fAbAccount) {
    let gw = new AuthGateway();
    let v = gw.createWeb3LoginView();
    this._pushView(v, "Login");
  }

  onLogoutClickInActionButtonFragment(fAbAccount) {
    sessionStorage.clear();
    if (window.dba && window.dba.Account) {
      window.dba.Account.reset();
    } else {
      Account.reset();
    }
    Keys.reset();
    location.reload();
  }

  topAction(type, ...args) {
    switch (type) {
    case T_ACTION.LOGIN_SUCCESS:
      this.#onLoginSuccess(args[0]);
      break;
    case T_ACTION.SHOW_USER_INFO:
      this.#showUserInfoView(args[0]);
      break;
    default:
      super.topAction.apply(this, arguments);
      break;
    }
  }

  main(dConfig) { this.#asMain(dConfig); }

  _createLayerFragment() { return new LvMain(); }

  _initLayer(lc) {
    let fAb = new AbAccount();
    fAb.setDelegate(this);
    lc.setDefaultActionButton(fAb);
    lc.setDefaultPageId(WebConfig.getHomeSector());
    super._initLayer(lc);
  }

  async #asMain(dConfig) {
    console.info("Init global...");
    await asInit();

    console.info("Load local data...");
    let sData = sessionStorage.getItem(STORAGE.KEY.KEYS);
    if (sData) {
      Keys.fromEncodedStr(sData);
    }
    // Special case: Replace Account instance for Web3 mode
    // Account is exported as const, so we use window.dba for this replacement
    if (!window.dba) {
      window.dba = {};
    }
    window.dba.Account = new Owner();
    window.dba.Account.setDataSource(this);
    window.dba.Account.setDelegate(this);
    window.dba.Account.loadCheckPoint();

    console.info("Load config...");
    // glb.env.WEB3 is set by backend HTML, keep global access for now
    Web3Config.load(typeof window !== 'undefined' && window.glb && window.glb.env ? window.glb.env.WEB3 : null);
    const c = Web3Config.getNetworkConfig();

    console.info("Init resolver...");
    // Store in window.glb for runtime access by other modules
    if (!window.glb) {
      window.glb = {};
    }
    window.glb.web3Resolver = new Web3Resolver();
    await window.glb.web3Resolver.asInit(c ? c.resolvers : null);

    console.info("Init publisher...");
    window.glb.web3Publisher = new Web3Publisher();
    await window.glb.web3Publisher.asInit(c ? c.publishers : null);
    await window.glb.web3Publisher.asInitForUser(window.dba.Account.getId());

    console.info("Init ledger...");
    window.glb.web3Ledger = new Web3Ledger();
    await window.glb.web3Ledger.asInit(c ? c.blockchains : null);

    console.info("Init storage...");
    window.glb.web3Storage = new Web3Storage();
    await window.glb.web3Storage.asInit(c ? c.storages : null);
    await window.glb.web3Storage.asInitForUser(window.dba.Account.getId());

    console.info("Init layout...");
    this.init(null, dConfig.default_theme.primary_color,
              dConfig.default_theme.secondary_color);

    console.info("Starting up...");
    this._main({"web_config" : dConfig});
  }

  #onLoginSuccess(profile) {
    let urlParam = new URLSearchParams(window.location.search);
    window.dba.Account.reset(profile);
    window.dba.Account.saveCheckPoint();
    sessionStorage.setItem(STORAGE.KEY.KEYS, Keys.toEncodedStr());

    this._clearDbAgents();

    this._initLanguage();
    this._getTopLayerFragment().init();
    this.initFromUrl(urlParam);
  }

  #showUserInfoView(userId) {
    let v = new View();
    let f = new FvcWeb3UserInfo();
    f.setUserId(userId);
    v.setContentFragment(f);
    this._pushDialog(v, "User info");
  }
};
