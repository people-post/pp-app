import { T_DATA } from '../../common/plt/Events.js';
import { Users } from '../../common/dba/Users.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { User } from '../../common/datatypes/User.js';
import { PUserOverview } from './PUserOverview.js';
import { FvcFollowerList } from './FvcFollowerList.js';
import { FvcLegacyFollowerList } from './FvcLegacyFollowerList.js';
import { FvcIdolList } from './FvcIdolList.js';
import { FvcLegacyIdolList } from './FvcLegacyIdolList.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Env } from '../../common/plt/Env.js';
import { Api } from '../../common/plt/Api.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { Utilities } from '../../common/Utilities.js';
import { ICON } from '../../common/constants/Icons.js';
import { R } from '../../common/constants/R.js';
import { Account } from '../../common/dba/Account.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export const CF_USER_INFO_HERO_BANNER = {
  FOLLOW : Symbol(),
  UNFOLLOW : Symbol(),
  SEND_MESSAGE : Symbol(),
  SEND_FUND : Symbol(),
  ON_INFO_IMAGE_CHANGE : Symbol(),
  SHOW_FOLLOWERS : Symbol(),
  SHOW_IDOLS : Symbol(),
} as const;

// Make available on window for HTML string templates
declare global {
  interface Window {
    hr?: {
      CF_USER_INFO_HERO_BANNER?: typeof CF_USER_INFO_HERO_BANNER;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  if (!window.hr) {
    window.hr = {};
  }
  window.hr.CF_USER_INFO_HERO_BANNER = CF_USER_INFO_HERO_BANNER;
}

const _CFT_USER_INFO_HERO_BANNER = {
  BG_IMAGE : `<img class="overview-header" src="__BG_URL__" alt=""></img>`,
  USER_ICON : `<img class="user-info-icon s-icon2" src="__ICON_URL__"></img>`,
  INFO_IMAGE_UPLOAD :
      `<span onclick="javascript:this.nextElementSibling.click()">Upload</span>
    <input type="file" accept="image/*" style="display:none" onchange="javascript:G.action(hr.CF_USER_INFO_HERO_BANNER.ON_INFO_IMAGE_CHANGE, this.files[0])">`,
  NAME :
      `<span class="inline-block s-icon7">__ICON__</span>&nbsp;<span>__NAME__</span> __ACTION_BTN__ __MSG_BTN__ __SEND_FUND_BTN__</div>`,
  MESSAGE_BTN :
      `<span class="inline-block s-icon6 clickable" onclick="javascript:G.action(hr.CF_USER_INFO_HERO_BANNER.SEND_MESSAGE, '__USER_ID__')">__ICON__</span>`,
  SEND_FUND_BTN :
      `<span class="inline-block s-icon6 clickable" onclick="javascript:G.action(hr.CF_USER_INFO_HERO_BANNER.SEND_FUND, '__USER_ID__')">__ICON__</span>`,
  FOLLOW_BTN :
      `<span class="button-like small s-primary" onclick="javascript:G.action(hr.CF_USER_INFO_HERO_BANNER.FOLLOW, '__USER_ID__')">follow</span>`,
  UNFOLLOW_BTN :
      `<span class="button-like small pale" onclick="javascript:G.action(hr.CF_USER_INFO_HERO_BANNER.UNFOLLOW, '__USER_ID__')">unfollow...</span>`,
  DOMAIN :
      `<span>Website: </span><a href="__URL__" target="_blank">__TEXT__&#x1f517;</a>`,
  SOCIAL_CONNECTIONS :
      `<span class="button-like small low-profile s-cinfotext bold" onclick="javascript:G.action(hr.CF_USER_INFO_HERO_BANNER.SHOW_FOLLOWERS, '__USER_ID__')">__N_FOLLOWERS__ followers</span>
  <span class="button-like small low-profile s-cinfotext bold" onclick="javascript:G.action(hr.CF_USER_INFO_HERO_BANNER.SHOW_IDOLS, '__USER_ID__')">Following __N_IDOLS__</span>`,
  OWNER_PRIVATE_INFO : `<table class="w100">
    <tbody>
      <tr>
        <td class="center-align num-font s-cprime">
          <span class="inline-block s-icon5 v-middle-align">__COIN_ICON__</span>
          __N_COIN__
        </td>
        <td class="center-align num-font s-cprime">
          <span class="inline-block s-icon5 v-middle-align">__CREDIT_ICON__</span>
          __N_CREDIT__
        </td>
        <td class="center-align num-font s-cprime">
          $__N_CASH__
        </td>
      </tr>
    </tbody>
  </table>`,
} as const;

export interface FUserInfoHeroBannerDataSource {
  getUserId(): string | null;
}

export interface FUserInfoHeroBannerDelegate {
  onUserInfoHeroBannerFragmentRequestStartChat(f: FUserInfoHeroBanner, target: ChatTarget): void;
  onUserInfoHeroBannerFragmentRequestShowView(f: FUserInfoHeroBanner, view: View, title: string): void;
}

export class FUserInfoHeroBanner extends Fragment {
  protected _fBioEditor: TextArea;

  constructor() {
    super();
    this._fBioEditor = new TextArea();
    this._fBioEditor.setClassName(
        "small-info-text w100 implicit center-align s-csecondarybg");
    this._fBioEditor.setDelegate(this);
    this.setChild("bio", this._fBioEditor);
  }

  onInputChangeInTextArea(_fTextArea: TextArea, text: string): void { this.#onUpdateBriefBio(text); }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_USER_INFO_HERO_BANNER.FOLLOW:
      Account.asyncFollow(args[0] as string);
      break;
    case CF_USER_INFO_HERO_BANNER.UNFOLLOW:
      this.#onUnfollow(args[0] as string);
      break;
    case CF_USER_INFO_HERO_BANNER.SEND_MESSAGE:
      this.#onSendMessage(args[0] as string);
      break;
    case CF_USER_INFO_HERO_BANNER.SEND_FUND:
      this.#onSendFund(args[0] as string);
      break;
    case CF_USER_INFO_HERO_BANNER.ON_INFO_IMAGE_CHANGE:
      this.#onUpdateInfoImage((args[0] as FileList)[0]);
      break;
    case CF_USER_INFO_HERO_BANNER.SHOW_FOLLOWERS:
      this.#onShowFollowers(args[0] as string);
      break;
    case CF_USER_INFO_HERO_BANNER.SHOW_IDOLS:
      this.#onShowIdols(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: string | symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.USER_PROFILE:
      this.render();
      break;
    case T_DATA.USER_IDOLS:
    case T_DATA.USER_PUBLIC_PROFILE:
      this.#onUserIdUpdate(data);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    let pList = new ListPanel();
    pList.setClassName("sticky-bottom-header");
    render.wrapPanel(pList);

    const dataSource = this.getDataSource<FUserInfoHeroBannerDataSource>();
    const userId = dataSource?.getUserId();
    let user = Users.get(userId ?? null);

    // Top
    let pOverview = new PUserOverview();
    pList.pushPanel(pOverview);
    let ppp = pOverview.getBackgroundImagePanel();
    ppp.replaceContent(this.#renderBackgroundImage(user));
    ppp = pOverview.getUserIconPanel();
    ppp.replaceContent(this.#renderUserIcon(user));
    this.#renderUploadButton(pOverview.getUploadButtonPanel(), user);

    // Name
    let pName = new Panel();
    pName.setClassName("user-info-name center-align");
    pList.pushPanel(pName);
    if (user) {
      pName.replaceContent(this.#renderName(user));
    } else {
      pName.replaceContent("...");
    }

    // Social connections
    let pSocialConnections = new Panel();
    pSocialConnections.setClassName("small-info-text center-align");
    pList.pushPanel(pSocialConnections);
    pSocialConnections.replaceContent(this.#renderSocialConnections(user));

    // Domain
    if (user) {
      let pDomain = new Panel();
      pList.pushPanel(pDomain);
      if (Account.getId() == user.getId()) {
        if (WebConfig.getOwnerId() == user.getId()) {
          pDomain.replaceContent(this.#renderOwnerPrivateInfo());
        } else {
          pDomain.setClassName("small-info-text center-align");
          pDomain.replaceContent("Yourself");
        }
      } else {
        pDomain.setClassName("small-info-text center-align");
        if (WebConfig.getOwnerId() == user.getId()) {
          pDomain.replaceContent("Current website");
        } else {
          pDomain.replaceContent(this.#renderDomain(user));
        }
      }
    }

    let pBio = new Panel();
    pList.pushPanel(pBio);
    pBio.setClassName("small-info-text center-align");
    if (user) {
      let bio = user.getBriefBio();
      bio = bio ? bio : "";
      if (user.getId() == Account.getId() &&
          WebConfig.getOwnerId() == user.getId()) {
        this._fBioEditor.setConfig(
            {value : bio, hint : "Your short description"});
        this._fBioEditor.attachRender(pBio);
        this._fBioEditor.render();
      } else {
        pBio.replaceContent(bio);
      }
    } else {
      pBio.replaceContent("...");
    }
  }

  #onUserIdUpdate(data: unknown): void {
    const dataSource = this.getDataSource<FUserInfoHeroBannerDataSource>();
    const userId = dataSource?.getUserId();
    if (data == Account.getId() || data == userId) {
      this.render();
    }
  }

  #renderBackgroundImage(user: User | undefined): string {
    let s: string = _CFT_USER_INFO_HERO_BANNER.BG_IMAGE;
    if (user) {
      s = s.replace("__BG_URL__", user.getInfoImageUrl() || "");
    } else {
      s = s.replace("__BG_URL__", "");
    }
    return s;
  }

  #renderUserIcon(user: User | null): string {
    let s = _CFT_USER_INFO_HERO_BANNER.USER_ICON;
    if (user) {
      s = s.replace("__ICON_URL__", user.getIconUrl());
    } else {
      s = s.replace("__ICON_URL__", "");
    }
    return s;
  }

  #renderUploadButton(panel: Panel, user: User | null): void {
    if (user && WebConfig.getOwnerId() == user.getId() &&
        Account.getId() == user.getId()) {

      panel.replaceContent(_CFT_USER_INFO_HERO_BANNER.INFO_IMAGE_UPLOAD);
    } else {
      panel.setVisible(false);
    }
  }

  #renderName(user: User): string {
    let userId: string = user.getId() || "";
    let s: string = _CFT_USER_INFO_HERO_BANNER.NAME;
    if (user.isFeed()) {
      s = s.replace("__ICON__", ICON.FEED);
    } else {
      s = s.replace("__ICON__", "");
    }
    s = s.replace("__NAME__", Account.getUserNickname(userId,
                                                          user.getNickname()));

    let sMsg = "";
    let sSendFund = "";
    if (Account.isIdolOf(user)) {
      sMsg = this.#renderMessageBtn(userId);
      if (WebConfig.isDevSite()) {
        sSendFund = this.#renderSendFundBtn(userId);
      }
    }
    s = s.replace("__MSG_BTN__", sMsg);
    s = s.replace("__SEND_FUND_BTN__", sSendFund);

    let sAction = "";
    if (Account.isAuthenticated() && Account.getId() != user.getId()) {
      if (Account.isFollowing(userId)) {
        sAction = _CFT_USER_INFO_HERO_BANNER.UNFOLLOW_BTN;
      } else {
        sAction = _CFT_USER_INFO_HERO_BANNER.FOLLOW_BTN;
      }
      sAction = sAction.replace("__USER_ID__", userId);
    }
    s = s.replace("__ACTION_BTN__", sAction);
    return s;
  }

  #renderSocialConnections(user: User | null): string {
    if (!user) {
      return "";
    }
    let s: string = _CFT_USER_INFO_HERO_BANNER.SOCIAL_CONNECTIONS;
    s = s.replace(/__USER_ID__/g, user.getId() || "");
    s = s.replace("__N_IDOLS__", String(user.getNIdols()));
    s = s.replace("__N_FOLLOWERS__", String(user.getNFollowers()));
    return s;
  }

  #renderDomain(user: User): string {
    let s = _CFT_USER_INFO_HERO_BANNER.DOMAIN;
    s = s.replace("__TEXT__", user.getDomainUrl());
    s = s.replace("__URL__", user.getDomainUrl());
    return s;
  }

  #renderOwnerPrivateInfo(): string {
    if (!WebConfig.isDevSite()) {
      return "";
    }
    let s = _CFT_USER_INFO_HERO_BANNER.OWNER_PRIVATE_INFO;
    s = s.replace("__COIN_ICON__", Utilities.renderSvgFuncIcon(ICON.COIN));
    s = s.replace("__CREDIT_ICON__",
                  Utilities.renderSvgFuncIcon(ICON.CREDIT));
    s = s.replace("__N_COIN__", "0");
    s = s.replace("__N_CREDIT__", "0");
    s = s.replace("__N_CASH__", "0");
    return s;
  }

  #onSendMessage(userId: string): void {
    let target = new ChatTarget();
    target.setId(userId);
    target.setIdType(SocialItem.TYPE.USER);
    const delegate = this.getDelegate<FUserInfoHeroBannerDelegate>();
    if (delegate) {
      delegate.onUserInfoHeroBannerFragmentRequestStartChat(this, target);
    }
  }

  #onSendFund(_userId: string): void {}

  #renderMessageBtn(userId: string): string {
    let s = _CFT_USER_INFO_HERO_BANNER.MESSAGE_BTN;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ICON.MESSENGER));
    s = s.replace("__USER_ID__", userId);
    return s;
  }

  #renderSendFundBtn(userId: string): string {
    let s = _CFT_USER_INFO_HERO_BANNER.SEND_FUND_BTN;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ICON.SEND_MONEY));
    s = s.replace("__USER_ID__", userId);
    return s;
  }

  #onUnfollow(userId: string): void {
    let s = R.get("CONFIRM_UNFOLLOW");
    s = s.replace("__NAME__", Account.getUserNickname(userId, userId));
    this._confirmDangerousOperation(s, () => Account.asyncUnfollow(userId));
  }

  #onUpdateInfoImage(file: File): void { this.#asyncUpdateInfoImage(file); }
  #onUpdateBriefBio(text: string): void { this.#asyncUpdateBriefBio(text); }
  #onShowFollowers(userId: string): void {
    let v = new View();
    let f;
    if (Env.isWeb3()) {
      f = new FvcFollowerList();
    } else {
      // TODO: Merge into above version
      f = new FvcLegacyFollowerList();
    }
    f.setUserId(userId);
    v.setContentFragment(f);
    const delegate = this.getDelegate<FUserInfoHeroBannerDelegate>();
    if (delegate) {
      delegate.onUserInfoHeroBannerFragmentRequestShowView(this, v,
                                                               "Followers");
    }
  }

  #onShowIdols(userId: string): void {
    let v = new View();
    let f;
    if (Env.isWeb3()) {
      f = new FvcIdolList();
    } else {
      // TODO: Merge into above version
      f = new FvcLegacyIdolList();
    }
    f.setUserId(userId);
    v.setContentFragment(f);
    const delegate = this.getDelegate<FUserInfoHeroBannerDelegate>();
    if (delegate) {
      delegate.onUserInfoHeroBannerFragmentRequestShowView(this, v,
                                                               "Idols");
    }
  }

  #asyncUpdateInfoImage(file: File): void {
    let url = "/api/user/update_info_image";
    let fd = new FormData();
    fd.append('info_image', file);
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onInfoImageUpdateRRR(d));
  }

  #onInfoImageUpdateRRR(_data: unknown): void { this.render(); }

  #asyncUpdateBriefBio(text: string): void {
    let url = "/api/user/update_brief_biography";
    let fd = new FormData();
    fd.append('text', text);
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onBriefBioUpdateRRR(d));
  }

  #onBriefBioUpdateRRR(data: unknown): void {
    let dataObj = data as { profile: unknown };
    Users.update(new User(dataObj.profile));
    this.render();
  }
}
