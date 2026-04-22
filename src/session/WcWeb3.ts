import { WcSession } from './WcSession.js';
import { AbAccount } from './AbAccount.js';
import { Gateway as AuthGateway } from '../sectors/auth/Gateway.js';
import { LvMain } from './LvMain.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { Wallet } from '../common/datatypes/Wallet.js';
import { T_DATA, T_ACTION } from '../common/plt/Events.js';
import { Events } from '../lib/framework/Events.js';
import { Keys } from '../common/dba/Keys.js';
import { WebConfig } from '../common/dba/WebConfig.js';
import { Web3Config } from '../common/dba/Web3Config.js';
import { STORAGE } from '../common/constants/Constants.js';
import { FvcWeb3UserInfo } from '../sectors/hr/FvcWeb3UserInfo.js';
import { Owner as Web3Owner } from '../common/plt/PpApiTypes.js';
import { Account } from '../common/dba/Account.js';
import { Users } from '../common/dba/Users.js';
import { ProfileHubFacade } from '../common/hr/ProfileHubFacade.js';
import { FvcWeb3OwnerPosts } from '../sectors/blog/FvcWeb3OwnerPosts.js';
import { FvcChat } from '../sectors/messenger/FvcChat.js';
import { WebConfigData } from '../types/backend2.js';
import { PpApiServices } from '../common/pdb/PpApiServices.js';

ProfileHubFacade.registerWeb3Tab({
  id: "BLOG",
  name: "Blog",
  createTabContent: (userId: string | null) => {
    let f = new FvcWeb3OwnerPosts();
    f.setOwnerId(userId);
    return f;
  }
});
ProfileHubFacade.registerChatViewFactory((target) => {
  let v = new View();
  let f = new FvcChat();
  f.setTarget(target);
  v.setContentFragment(f);
  return v;
});

export interface Web3MainConfig extends WebConfigData {
  default_theme: {
    primary_color: string;
    secondary_color: string;
  };
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

  onWeb3OwnerRequestLoadCheckPoint(_owner: Web3Owner): string | null {
    return sessionStorage.getItem(STORAGE.KEY.PROFILE);
  }

  onWeb3OwnerRequestSaveCheckPoint(_owner: Web3Owner, data: string): void {
    sessionStorage.setItem(STORAGE.KEY.PROFILE, data);
  }

  async asOnWeb3OwnerRequestSign(_owner: Web3Owner, msg: string): Promise<string> {
    return await Keys.sign(this.#postingKeyPath, msg);
  }

  onWeb3OwnerProfileUpdated(_owner: unknown): void {
    Events.trigger(T_DATA.USER_PROFILE, null);
  }

  onLoginClickInAccountActionButtonFragment(_fAbAccount: AbAccount): void {
    let gw = new AuthGateway();
    let v = gw.createWeb3LoginView();
    this._pushView(v, "Login");
  }

  onLogoutClickInActionButtonFragment(_fAbAccount: AbAccount): void {
    sessionStorage.clear();
    Account.reset();
    Keys.reset(null);
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

  main(dConfig: Web3MainConfig): void { this.#asMain(dConfig); }

  _createLayerFragment(): LvMain { return new LvMain(); }

  _initLayer(lc: LvMain): void {
    let fAb = new AbAccount();
    fAb.setDelegate(this);
    lc.setDefaultActionButton(fAb);
    lc.setDefaultPageId(WebConfig.getHomeSector());
    super._initLayer(lc);
  }

  async #asMain(dConfig: Web3MainConfig): Promise<void> {
    console.info("Init global...");
    await PpApiServices.asInit();

    console.info("Load local data...");
    let sData = sessionStorage.getItem(STORAGE.KEY.KEYS);
    if (sData) {
      Keys.fromEncodedStr(sData);
    }
    // Set Web3 Owner as the Account implementation
    const owner = new Web3Owner(null);
    Account.setImplementation(owner, true);
    const kPub = Keys.getMlDsa44(this.#postingKeyPath);
    if (!kPub) {
      throw new Error("Failed to generate posting key pair");
    }
    const web3 = Account.web3;
    if (!web3) {
      throw new Error('Account.web3 unavailable after Web3Owner initialization');
    }
    web3.setProps({
      callbacks: {
        onWeb3UserIdolsLoaded: (u) => this.onWeb3UserIdolsLoaded(u),
        onWeb3UserProfileLoaded: (u) => this.onWeb3UserProfileLoaded(u),
      },
      ownerCallbacks: {
        onWeb3OwnerProfileUpdated: (o) => this.onWeb3OwnerProfileUpdated(o),
        onWeb3OwnerRequestLoadCheckPoint: (o) => this.onWeb3OwnerRequestLoadCheckPoint(o),
        onWeb3OwnerRequestGetPublicKey: (_o) => kPub,
        onWeb3OwnerRequestSign: (o, msg) => this.asOnWeb3OwnerRequestSign(o, msg),
        onWeb3OwnerRequestSaveCheckPoint: (o, data) => this.onWeb3OwnerRequestSaveCheckPoint(o, data),
      },
    });
    web3.loadCheckPoint();

    console.info("Load config...");
    // C.WEB3 is set by configs/web3_config.js
    Web3Config.load(typeof window !== 'undefined' && window.C && window.C.WEB3 ? window.C.WEB3 : null);
    const c = Web3Config.getNetworkConfig();

    console.info("Init network services...");
    await PpApiServices.asInitNetwork(c, Account.getId() || "");
    Users.setWeb3Resolver(PpApiServices.getResolverOrNull());

    console.info("Init layout...");
    this.init(null, dConfig.default_theme.primary_color,
              dConfig.default_theme.secondary_color);

    console.info("Starting up...");
    this._main({"web_config" : dConfig});
  }

  #onLoginSuccess(profile: unknown): void {
    let urlParam = new URLSearchParams(window.location.search);
    Account.reset(profile);
    Account.web3?.saveCheckPoint();
    sessionStorage.setItem(STORAGE.KEY.KEYS, Keys.toEncodedStr());

    this._clearDbAgents();

    this._initLanguage();
    let topLayerFragment = this._getTopLayerFragment();
    if (topLayerFragment) {
      topLayerFragment.init();
    }
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
