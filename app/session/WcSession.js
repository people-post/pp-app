(function(main) {
const _CRCT_SESSION = {
  // Prime, secondary: User defined
  // Menu: Has good contrast with prime, black/white
  // Text: Has good contrast with secondary, black/white
  // Func: Has good contrast with secondary, prime/black/white

  STYLE :
      `.s-primary { background-color: __FUNC_COLOR__; color: __SECONDARY__; }
    .s-cprime { color: __PRIME__; }
    .s-cprimestk { stroke: __PRIME__; }
    .s-cprimefill { fill: __PRIME__; }
    .s-cprimebg { background-color: __PRIME__; }
    .s-cprimebd { border-color: __PRIME__; }
    .s-cprimedecorbd { border-color: __PRIME_DECOR_COLOR__; }
    .s-csecondary { color: __SECONDARY__; }
    .s-csecondarystk { stroke: __SECONDARY__; }
    .s-csecondaryfill { fill: __SECONDARY__; }
    .s-csecondarybg { background-color: __SECONDARY__; }
    .s-csecondarydecorbg { background-color: __SECONDARY_DECOR_COLOR__; }
    .s-csecondarydecorbd { border-color: __SECONDARY_DECOR_COLOR__; }
    .s-cseparationbd { border-color: __SEPARATION_COLOR__; }
    .s-cmenu { color: __MENU_COLOR__; }
    .s-cmenubd { border-color: __MENU_COLOR__; }
    .s-cmenubg { background-color: __MENU_COLOR__; }
    .s-cmenustk { stroke: __MENU_COLOR__; }
    .s-cmenufill { fill: __MENU_COLOR__; }
    .s-ctext { color: __TEXT_COLOR__; }
    .s-cinfotext { color: __INFO_TEXT_COLOR__; }
    .s-cfunc { color: __FUNC_COLOR__; }
    .s-cfuncbg { background-color: __FUNC_COLOR__; }
    .s-cfuncbd { border-color: __FUNC_COLOR__; }
    .s-cfuncbd-b { border-bottom-color: __FUNC_COLOR__; }
    .s-cfuncstk { stroke: __FUNC_COLOR__; }
    .s-cfuncfill { fill: __FUNC_COLOR__; }
    `,
};

class WcSession extends ui.WindowController {
  #fBanner;
  #logger;

  constructor() {
    super();
    this.#fBanner = new gui.FBanner();
    this.setChild("banner", this.#fBanner);

    this.#logger = new ext.Logger("WcSession");
  }

  init(userId, primaryColor, secondaryColor) {
    // Grand entry for the whole program
    fwk.Factory.registerClass(fwk.T_CATEGORY.UI, fwk.T_OBJ.BANNER_FRAGMENT,
                              gui.FBanner);
    fwk.Factory.registerClass(fwk.T_CATEGORY.UI,
                              fwk.T_OBJ.SEARCH_RESULT_VIEW_CONTENT_FRAGMENT,
                              srch.FvcSearchResult);
    if (glb.env.isWeb3()) {
      fwk.Factory.registerClass(fwk.T_CATEGORY.UI, fwk.T_OBJ.FILE_UPLOADER,
                                dba.Web3FileUploader);
    } else {
      fwk.Factory.registerClass(fwk.T_CATEGORY.UI, fwk.T_OBJ.FILE_UPLOADER,
                                plt.Web2FileUploader);
    }

    dba.WebConfig.setBootTheme(
        {primary_color : primaryColor, secondary_color : secondaryColor});
    if (userId && userId.length > 0) {
      dba.Account.setUserId(userId);
    }
    let w = new main.PWindow();
    // ID value is synced with backend
    w.attach("ID_R");
    this.attachRender(w);
    this.#fBanner.attachRender(w.getBannerPanel());
    let p = new ui.PanelWrapper();
    p.setClassName("layer");
    w.pushLayer(p);

    let f = this._createLayerFragment();
    f.setOwner(this);
    f.attachRender(p);
    f.render();
    this._childStack = [ f ];

    this.#asyncLoadWebConfig();
    this.#asyncMarkDomainVisit();
  }

  initFromUrl(urlParam) {
    // TODO: This is hack to clear all dialogs, should restore layers from url
    this.#closeDialog();

    this._getTopLayerFragment().initFromUrl(urlParam);
  }

  // From fwk.Events
  onSessionDataChange() { this.applyDataUpdate.apply(this, arguments); }
  onTopActionTrigger() { this.topAction.apply(this, arguments); }
  onLayerFragmentRequestSetBannerFragment(lc, f) {
    this.#fBanner.setContentFragment(f);
    this.#fBanner.render();
  }

  onLayerFragmentRequestPopView(lc) {
    if (lc == this._childStack[0]) {
      history.back();
    }
  }

  onFragmentRequestShowView(f, view, title) { this._pushView(view, title); }
  onRemoteErrorInFragment(f, e) { this.#fBanner.showRemoteError(e); }
  onLocalErrorInFragment(f, msg) { this.#fBanner.showLocalError(msg); }
  onContentTopResizeBeginInFragment(f) {}
  onContentTopResizeEndInFragment(f) {}

  topAction(type, ...args) {
    switch (type) {
    case plt.T_ACTION.LOGIN:
      this.#showLoginView(args[0]);
      break;
    case plt.T_ACTION.SHOW_USER_INFO:
      this.#showUserInfoView(args[0]);
      break;
    case plt.T_ACTION.SHOW_GROUP_INFO:
      this.#showUserGroupView(args[0]);
      break;
    case fwk.T_ACTION.RELOAD_URL:
      this.#onReloadUrl();
      break;
    case fwk.T_ACTION.PUSH_STATE:
      this._onPushState(args[0], args[1]);
      break;
    case fwk.T_ACTION.REPLACE_STATE:
      this.#onReplaceState(args[0], args[1]);
      break;
    case fwk.T_ACTION.SHOW_NOTICE:
      this.#showNotice(args[1]);
      break;
    case fwk.T_ACTION.SHOW_DIALOG:
      this._showCustomDialog(args[1], args[2], args[3]);
      break;
    case fwk.T_ACTION.CLOSE_DIALOG:
      this.#closeDialog();
      break;
    case fwk.T_ACTION.SHOW_LAYER:
      this._pushLayer(args[1], args[2]);
      break;
    default:
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case fwk.T_DATA.WEB_CONFIG:
      this.#applyTheme();
      break;
    case fwk.T_DATA.REMOTE_ERROR:
      this.#fBanner.showRemoteError(data);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _shouldClearInitialUrl() { return false; }

  _main(dConfig) {
    this._clearDbAgents();
    dba.WebConfig.reset(dConfig.web_config);
    if (dConfig.blog_config) {
      dba.Blog.resetConfig(dConfig.blog_config);
    }
    ext.Logger.setEnable(dba.WebConfig.isDevSite());
    this._initEventHandlers();
    this.#applyTheme();

    this._initLanguage();
    this._initLayer(this._childStack[0]);
    fwk.Events.setDelegate(this);

    let urlParam = new URLSearchParams(window.location.search);
    if (this._shouldClearInitialUrl()) {
      history.replaceState({}, "", "?");
    }
    this.initFromUrl(urlParam);

    this.#registerServiceWorker();
  }

  _initLayer(lc) { lc.init(); }

  _initLanguage() {
    let urlParam = new URLSearchParams(window.location.search);
    if (urlParam.has(C.URL_PARAM.LANGUAGE)) {
      glb.env.setPreferredLanguage(urlParam.get(C.URL_PARAM.LANGUAGE));
    }
    let lang = dba.Account.getPreferredLanguage();
    if (!lang) {
      lang = glb.env.getLanguage();
    }
    R.setLanguage(lang);
  }

  _initEventHandlers() {
    fwk.Events.setOnResizeHandler("default", () => this.#onResize());
    window.onpopstate = evt => this.#onPopState(evt);
  }

  _onPushState(stateData, title) {
    let state = this.#getState(stateData, title);
    history.pushState(state, state.title, state.url);
  }

  _showCustomDialog(view, title, enableCloseButton) {
    this.#pushDialog(view, title, enableCloseButton);
  }

  _pushView(view, title) {
    for (let lc of this._childStack) {
      if (lc instanceof ui.ViewLayer) {
        lc.pushView(view, title);
        break;
      }
    }
  }

  _pushDialog(view, title) { this.#pushDialog(view, title, true); }

  _clearDbAgents() {
    dba.Blog.clear();
    dba.Users.clear();
    dba.Cart.clear();
    dba.Notifications.reload();
    dba.Social.clear();
  }

  #getState(data, title) {
    let items = [];
    let s = this._childStack[this._childStack.length - 1].getUrlParamString();
    if (s && s.length) {
      items.push(s);
    }
    items.push(C.URL_PARAM.USER + "=" + dba.WebConfig.getOwnerId());
    if (glb.env.getPreferredLanguage()) {
      items.push("lang=" + glb.env.getPreferredLanguage());
    }
    let url = "?" + items.join("&");
    return {
      "data" : data,
      "title" : title,
      "url" : url,
    };
  }

  #onResize() {
    for (let lc of this._childStack) {
      lc.onResize();
    }
  }

  #onPopState(evt) {
    if (evt.state) {
      if (evt.state.obsolete) {
        history.back();
      } else {
        history.replaceState({"obsolete" : true}, "");
        history.pushState(evt.state, evt.state.title, evt.state.url);
        this._childStack[0].popState(evt.state.data);
      }
    } else {
      history.replaceState({"obsolete" : true}, "");
      history.pushState(evt.state, "");
      this._childStack[0].popState({});
    }
  }

  #onReplaceState(stateData, title) {
    let state = this.#getState(stateData, title);
    history.replaceState(state, state.title, state.url);
  }

  #applyTheme() {
    let t = dba.WebConfig.getCurrentTheme();
    let e = document.getElementById("ID_STYLE_THEME");
    if (t && e) {
      let eTest = document.getElementById("ID_COLOR_TEST");
      eTest.className = "inline-block";
      let s = _CRCT_SESSION.STYLE;
      s = s.replace(/__PRIME__/g, t.getPrimaryColor());
      s = s.replace(/__PRIME_DECOR_COLOR__/g, t.getPrimeDecorColor(eTest));
      s = s.replace(/__TEXT_COLOR__/g, t.getTextColor(eTest));
      s = s.replace(/__INFO_TEXT_COLOR__/g, t.getInfoTextColor(eTest));
      s = s.replace(/__MENU_COLOR__/g, t.getMenuColor(eTest));
      s = s.replace(/__FUNC_COLOR__/g, t.getFuncColor(eTest));
      s = s.replace(/__SECONDARY__/g, t.getSecondaryColor());
      s = s.replace(/__SECONDARY_DECOR_COLOR__/g,
                    t.getSecondaryDecorColor(eTest));
      let c = t.getSeparationColor(eTest);
      s = s.replace(/__SEPARATION_COLOR__/g, c ? c : "transparent");
      eTest.className = "no-display";
      e.innerHTML = s;
    }
  }

  #asyncLoadWebConfig() {
    let url = "api/user/web_config";
    plt.Api.asyncRawCall(url, r => this.#onWebConfigRRR(r));
  }

  #onWebConfigRRR(responseText) {
    let response = JSON.parse(responseText);
    if (!response.error) {
      this._main(response.data);
    }
  }

  #onReloadUrl() { location.reload(); }

  #asyncMarkDomainVisit() {
    let url = "api/stat/mark_visit";
    plt.Api.asyncRawCall(url);
  }

  #closeDialog() {
    if (this._childStack[0] instanceof ui.LvDialog) {
      this.onRequestPopLayer(this._childStack[0]);
    }
  }

  #showNotice(msg) {
    let v = new ui.View();
    let f = new ui.FvcNotice();
    f.setMessage(msg);
    v.setContentFragment(f);
    this._showCustomDialog(v, "Notice", false);
  }

  #showLoginView(nextView) {
    let gw = new auth.Gateway();
    let v = gw.createLoginView(nextView);
    this._pushView(v, "Login");
  }

  #showUserInfoView(userId) {
    let v = new ui.View();
    let f = new hr.FvcUserInfo();
    f.setUserId(userId);
    v.setContentFragment(f);
    this._pushDialog(v, "User info");
  }

  #showUserGroupView(groupId) {
    let v = new ui.View();
    let f = new S.hr.FvcUserGroup();
    f.setGroupId(groupId);
    v.setContentFragment(f);
    this._pushDialog(v, "Group info");
  }

  #pushDialog(view, title, enableCloseButton) {
    if (!(this._childStack[0] instanceof ui.LvDialog)) {
      let lc = new ui.LvDialog();
      lc.setEnableCloseButton(enableCloseButton);
      this._pushLayer(lc, "Dialog");
    }
    this._pushView(view, title);
  }

  async #registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration =
            await navigator.serviceWorker.register("/static/js/sw-min.js", {
              scope : "/",
            });
        if (registration.installing) {
          this.#logger.debug("Service worker installing");
        } else if (registration.waiting) {
          this.#logger.debug("Service worker installed");
        } else if (registration.active) {
          this.#logger.debug("Service worker active");
        }
      } catch (error) {
        this.#logger.error(`Registration failed with ${error}`);
      }
    }
  }
};

main.WcSession = WcSession;
}(window.main = window.main || {}));
