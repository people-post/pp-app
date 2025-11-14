(function(hr) {
hr.CF_USER_INFO_HERO_BANNER = {
  FOLLOW : Symbol(),
  UNFOLLOW : Symbol(),
  SEND_MESSAGE : Symbol(),
  SEND_FUND : Symbol(),
  ON_INFO_IMAGE_CHANGE : Symbol(),
  SHOW_FOLLOWERS : Symbol(),
  SHOW_IDOLS : Symbol(),
};

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
};

class FUserInfoHeroBanner extends ui.Fragment {
  constructor() {
    super();
    this._fBioEditor = new ui.TextArea();
    this._fBioEditor.setClassName(
        "small-info-text w100 implicit center-align s-csecondarybg");
    this._fBioEditor.setDelegate(this);
    this.setChild("bio", this._fBioEditor);
  }

  onInputChangeInTextArea(fTextArea, text) { this.#onUpdateBriefBio(text); }

  action(type, ...args) {
    switch (type) {
    case hr.CF_USER_INFO_HERO_BANNER.FOLLOW:
      dba.Account.asyncFollow(args[0]);
      break;
    case hr.CF_USER_INFO_HERO_BANNER.UNFOLLOW:
      this.#onUnfollow(args[0]);
      break;
    case hr.CF_USER_INFO_HERO_BANNER.SEND_MESSAGE:
      this.#onSendMessage(args[0]);
      break;
    case hr.CF_USER_INFO_HERO_BANNER.SEND_FUND:
      this.#onSendFund(args[0]);
      break;
    case hr.CF_USER_INFO_HERO_BANNER.ON_INFO_IMAGE_CHANGE:
      this.#onUpdateInfoImage(args[0]);
      break;
    case hr.CF_USER_INFO_HERO_BANNER.SHOW_FOLLOWERS:
      this.#onShowFollowers(args[0]);
      break;
    case hr.CF_USER_INFO_HERO_BANNER.SHOW_IDOLS:
      this.#onShowIdols(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
    case plt.T_DATA.USER_PROFILE:
      this.render();
      break;
    case plt.T_DATA.USER_IDOLS:
    case plt.T_DATA.USER_PUBLIC_PROFILE:
      if (data == dba.Account.getId() || data == this._dataSource.getUserId()) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    p.setClassName("sticky-bottom-header");
    render.wrapPanel(p);

    let user = dba.Users.get(this._dataSource.getUserId());

    // Top
    let pp = new hr.PUserOverview();
    p.pushPanel(pp);
    let ppp = pp.getBackgroundImagePanel();
    ppp.replaceContent(this.#renderBackgroundImage(user));
    ppp = pp.getUserIconPanel();
    ppp.replaceContent(this.#renderUserIcon(user));
    this.#renderUploadButton(pp.getUploadButtonPanel(), user);

    // Name
    pp = new ui.Panel();
    pp.setClassName("user-info-name center-align");
    p.pushPanel(pp);
    if (user) {
      pp.replaceContent(this.#renderName(user));
    } else {
      pp.replaceContent("...");
    }

    // Social connections
    pp = new ui.Panel();
    pp.setClassName("small-info-text center-align");
    p.pushPanel(pp);
    pp.replaceContent(this.#renderSocialConnections(user));

    // Domain
    if (user) {
      pp = new ui.Panel();
      p.pushPanel(pp);
      if (dba.Account.getId() == user.getId()) {
        if (dba.WebConfig.getOwnerId() == user.getId()) {
          pp.replaceContent(this.#renderOwnerPrivateInfo());
        } else {
          pp.setClassName("small-info-text center-align");
          pp.replaceContent("Yourself");
        }
      } else {
        pp.setClassName("small-info-text center-align");
        if (dba.WebConfig.getOwnerId() == user.getId()) {
          pp.replaceContent("Current website");
        } else {
          pp.replaceContent(this.#renderDomain(user));
        }
      }
    }

    pp = new ui.Panel();
    p.pushPanel(pp);
    pp.setClassName("small-info-text center-align");
    if (user) {
      let bio = user.getBriefBio();
      bio = bio ? bio : "";
      if (user.getId() == dba.Account.getId() &&
          dba.WebConfig.getOwnerId() == user.getId()) {
        this._fBioEditor.setConfig(
            {value : bio, hint : "Your short description"});
        this._fBioEditor.attachRender(pp);
        this._fBioEditor.render();
      } else {
        pp.replaceContent(bio);
      }
    } else {
      pp.replaceContent("...");
    }
  }

  #renderBackgroundImage(user) {
    let s = _CFT_USER_INFO_HERO_BANNER.BG_IMAGE;
    if (user) {
      s = s.replace("__BG_URL__", user.getInfoImageUrl());
    } else {
      s = s.replace("__BG_URL__", "");
    }
    return s;
  }

  #renderUserIcon(user) {
    let s = _CFT_USER_INFO_HERO_BANNER.USER_ICON;
    if (user) {
      s = s.replace("__ICON_URL__", user.getIconUrl());
    } else {
      s = s.replace("__ICON_URL__", "");
    }
    return s;
  }

  #renderUploadButton(panel, user) {
    if (user && dba.WebConfig.getOwnerId() == user.getId() &&
        dba.Account.getId() == user.getId()) {

      panel.replaceContent(_CFT_USER_INFO_HERO_BANNER.INFO_IMAGE_UPLOAD);
    } else {
      panel.setVisible(false);
    }
  }

  #renderName(user) {
    let s = _CFT_USER_INFO_HERO_BANNER.NAME;
    if (user.isFeed()) {
      s = s.replace("__ICON__", C.ICON.FEED);
    } else {
      s = s.replace("__ICON__", "");
    }
    s = s.replace("__NAME__", dba.Account.getUserNickname(user.getId(),
                                                          user.getNickname()));

    let sMsg = "";
    let sSendFund = "";
    if (dba.Account.isIdolOf(user)) {
      sMsg = this.#renderMessageBtn(user.getId());
      if (dba.WebConfig.isDevSite()) {
        sSendFund = this.#renderSendFundBtn(user.getId());
      }
    }
    s = s.replace("__MSG_BTN__", sMsg);
    s = s.replace("__SEND_FUND_BTN__", sSendFund);

    let sAction = "";
    if (dba.Account.isAuthenticated() && dba.Account.getId() != user.getId()) {
      if (dba.Account.isFollowing(user.getId())) {
        sAction = _CFT_USER_INFO_HERO_BANNER.UNFOLLOW_BTN;
      } else {
        sAction = _CFT_USER_INFO_HERO_BANNER.FOLLOW_BTN;
      }
      sAction = sAction.replace("__USER_ID__", user.getId());
    }
    s = s.replace("__ACTION_BTN__", sAction);
    return s;
  }

  #renderSocialConnections(user) {
    if (!user) {
      return "";
    }
    let s = _CFT_USER_INFO_HERO_BANNER.SOCIAL_CONNECTIONS;
    s = s.replace(/__USER_ID__/g, user.getId());
    s = s.replace("__N_IDOLS__", user.getNIdols());
    s = s.replace("__N_FOLLOWERS__", user.getNFollowers());
    return s;
  }

  #renderDomain(user) {
    let s = _CFT_USER_INFO_HERO_BANNER.DOMAIN;
    s = s.replace("__TEXT__", user.getDomainUrl());
    s = s.replace("__URL__", user.getDomainUrl());
    return s;
  }

  #renderOwnerPrivateInfo() {
    if (!dba.WebConfig.isDevSite()) {
      return "";
    }
    let s = _CFT_USER_INFO_HERO_BANNER.OWNER_PRIVATE_INFO;
    s = s.replace("__COIN_ICON__", Utilities.renderSvgFuncIcon(C.ICON.COIN));
    s = s.replace("__CREDIT_ICON__",
                  Utilities.renderSvgFuncIcon(C.ICON.CREDIT));
    s = s.replace("__N_COIN__", 0);
    s = s.replace("__N_CREDIT__", 0);
    s = s.replace("__N_CASH__", 0);
    return s;
  }

  #onSendMessage(userId) {
    let target = new dat.ChatTarget();
    target.setId(userId);
    target.setIdType(dat.SocialItem.TYPE.USER);
    this._delegate.onUserInfoHeroBannerFragmentRequestStartChat(this, target);
  }

  #onSendFund(userId) {}

  #renderMessageBtn(userId) {
    let s = _CFT_USER_INFO_HERO_BANNER.MESSAGE_BTN;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(C.ICON.MESSENGER));
    s = s.replace("__USER_ID__", userId);
    return s;
  }

  #renderSendFundBtn(userId) {
    let s = _CFT_USER_INFO_HERO_BANNER.SEND_FUND_BTN;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(C.ICON.SEND_MONEY));
    s = s.replace("__USER_ID__", userId);
    return s;
  }

  #onUnfollow(userId) {
    let s = R.get("CONFIRM_UNFOLLOW");
    s = s.replace("__NAME__", dba.Account.getUserNickname(userId, userId));
    this._confirmDangerousOperation(s, () => dba.Account.asyncUnfollow(userId));
  }

  #onUpdateInfoImage(file) { this.#asyncUpdateInfoImage(file); }
  #onUpdateBriefBio(text) { this.#asyncUpdateBriefBio(text); }
  #onShowFollowers(userId) {
    let v = new ui.View();
    let f;
    if (glb.env.isWeb3()) {
      f = new hr.FvcFollowerList();
    } else {
      // TODO: Merge into above version
      f = new hr.FvcLegacyFollowerList();
    }
    f.setUserId(userId);
    v.setContentFragment(f);
    this._delegate.onUserInfoHeroBannerFragmentRequestShowView(this, v,
                                                               "Followers");
  }
  #onShowIdols(userId) {
    let v = new ui.View();
    let f;
    if (glb.env.isWeb3()) {
      f = new hr.FvcIdolList();
    } else {
      // TODO: Merge into above version
      f = new hr.FvcLegacyIdolList();
    }
    f.setUserId(userId);
    v.setContentFragment(f);
    this._delegate.onUserInfoHeroBannerFragmentRequestShowView(this, v,
                                                               "Idols");
  }

  #asyncUpdateInfoImage(file) {
    let url = "/api/user/update_info_image";
    let fd = new FormData();
    fd.append('info_image', file)
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onInfoImageUpdateRRR(d));
  }

  #onInfoImageUpdateRRR(data) { this.render(); }

  #asyncUpdateBriefBio(text) {
    let url = "/api/user/update_brief_biography";
    let fd = new FormData();
    fd.append('text', text)
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onBriefBioUpdateRRR(d));
  }

  #onBriefBioUpdateRRR(data) {
    dba.Users.update(new dat.User(data.profile));
    this.render();
  }
};

hr.FUserInfoHeroBanner = FUserInfoHeroBanner;
}(window.hr = window.hr || {}));
