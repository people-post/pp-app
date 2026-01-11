import { WcSession } from './WcSession.js';
import { AbAccount } from './AbAccount.js';
import { Gateway as AuthGateway } from '../sectors/auth/Gateway.js';
import { LvMain } from './LvMain.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { Wallet } from '../common/datatypes/Wallet.js';
import { T_DATA, T_ACTION } from '../common/plt/Events.js';
import { Events } from '../lib/framework/Events.js';
import UtilitiesExt from '../lib/ext/Utilities.js';
import { Keys } from '../common/dba/Keys.js';
import { Web3Config } from '../common/dba/Web3Config.js';
import { WebConfig } from '../common/dba/WebConfig.js';
import { STORAGE } from '../common/constants/Constants.js';
import { FvcWeb3UserInfo } from '../sectors/hr/FvcWeb3UserInfo.js';
import { Web3Resolver } from '../common/pdb/Web3Resolver.js';
import { Web3Publisher } from '../common/pdb/Web3Publisher.js';
import { Web3Ledger } from '../common/pdb/Web3Ledger.js';
import { Web3Storage } from '../common/pdb/Web3Storage.js';
import { asInit, Owner } from 'pp-api';
import { Account } from '../common/dba/Account.js';

interface Web3ConfigData {
  default_theme: {
    primary_color: string;
    secondary_color: string;
  };
  [key: string]: unknown;
}

interface NetworkConfig {
  resolvers?: string[] | null;
  publishers?: string[] | null;
  blockchains?: string[] | null;
  storages?: string[] | null;
}

declare global {
  interface Window {
    C?: {
      WEB3?: unknown;
    };
    glb?: {
      web3Resolver?: Web3Resolver;
      web3Publisher?: Web3Publisher;
      web3Ledger?: Web3Ledger;
      web3Storage?: Web3Storage;
      [key: string]: unknown;
    };
  }
}

export class WcWeb3 extends WcSession {
  #postingKeyPath: number[] =
      [ Wallet.T_PURPOSE.NFSC001, Wallet.T_COIN.NFSC001, 0, 0, 0 ];

  onWeb3UserIdolsLoaded(user: { getId(): string }): void {
    Events.trigger(T_DATA.USER_IDOLS, user.getId())
  }

  onWeb3UserProfileLoaded(user: { getId(): string }): void {
    Events.trigger(T_DATA.USER_PUBLIC_PROFILE, user.getId());
  }

  onWeb3OwnerRequestGetPublicKey(_owner: unknown): string {
    return UtilitiesExt.uint8ArrayToHex(
        Keys.getMlDsa44(this.#postingKeyPath));
  }

  onWeb3OwnerRequestLoadCheckPoint(_owner: unknown): string | null {
    return sessionStorage.getItem(STORAGE.KEY.PROFILE);
  }

  onWeb3OwnerRequestSaveCheckPoint(_owner: unknown, data: string): void {
    sessionStorage.setItem(STORAGE.KEY.PROFILE, data);
  }

  async asOnWeb3OwnerRequestSign(_owner: unknown, msg: string): Promise<string> {
    return await Keys.sign(this.#postingKeyPath, msg);
  }

  onWeb3OwnerProfileUpdated(_owner: unknown): void {
    Events.trigger(T_DATA.USER_PROFILE);
  }

  onLoginClickInAccountActionButtonFragment(_fAbAccount: AbAccount): void {
    let gw = new AuthGateway();
    let v = gw.createWeb3LoginView();
    this._pushView(v, "Login");
  }

  onLogoutClickInActionButtonFragment(_fAbAccount: AbAccount): void {
    sessionStorage.clear();
    Account.reset();
    Keys.reset();
    location.reload();
  }

  topAction(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case T_ACTION.LOGIN_SUCCESS:
      this.#onLoginSuccess(args[0] as unknown);
      break;
    case T_ACTION.SHOW_USER_INFO:
      this.#showUserInfoView(args[0] as string | null);
      break;
    default:
      super.topAction(type, ...args);
      break;
    }
  }

  main(dConfig: Web3ConfigData): void { this.#asMain(dConfig); }

  _createLayerFragment(): LvMain { return new LvMain(); }

  _initLayer(lc: LvMain): void {
    let fAb = new AbAccount();
    fAb.setDelegate(this);
    lc.setDefaultActionButton(fAb);
    lc.setDefaultPageId(WebConfig.getHomeSector());
    super._initLayer(lc);
  }

  async #asMain(dConfig: Web3ConfigData): Promise<void> {
    console.info("Init global...");
    await asInit();

    console.info("Load local data...");
    let sData = sessionStorage.getItem(STORAGE.KEY.KEYS);
    if (sData) {
      Keys.fromEncodedStr(sData);
    }
    // Set Web3 Owner as the Account implementation
    const owner = new Owner();
    Account.setImplementation(owner, true);
    Account.setDataSource(this);
    Account.setDelegate(this);
    Account.loadCheckPoint();

    console.info("Load config...");
    // C.WEB3 is set by configs/web3_config.js
    Web3Config.load(typeof window !== 'undefined' && window.C && window.C.WEB3 ? window.C.WEB3 : null);
    const c = Web3Config.getNetworkConfig() as NetworkConfig | null;

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
    await window.glb.web3Publisher.asInitForUser(Account.getId() || "");

    console.info("Init ledger...");
    window.glb.web3Ledger = new Web3Ledger();
    await window.glb.web3Ledger.asInit(c ? c.blockchains : null);

    console.info("Init storage...");
    window.glb.web3Storage = new Web3Storage();
    await window.glb.web3Storage.asInit(c ? c.storages : null);
    await window.glb.web3Storage.asInitForUser(Account.getId() || "");

    console.info("Init layout...");
    this.init(null, dConfig.default_theme.primary_color,
              dConfig.default_theme.secondary_color);

    console.info("Starting up...");
    this._main({"web_config" : dConfig});
  }

  #onLoginSuccess(profile: unknown): void {
    let urlParam = new URLSearchParams(window.location.search);
    Account.reset(profile);
    Account.saveCheckPoint();
    sessionStorage.setItem(STORAGE.KEY.KEYS, Keys.toEncodedStr());

    this._clearDbAgents();

    this._initLanguage();
    this._getTopLayerFragment().init();
    this.initFromUrl(urlParam);
  }

  #showUserInfoView(userId: string | null): void {
    let v = new View();
    let f = new FvcWeb3UserInfo();
    f.setUserId(userId);
    v.setContentFragment(f);
    this._pushDialog(v, "User info");
  }
}

export default WcWeb3;
