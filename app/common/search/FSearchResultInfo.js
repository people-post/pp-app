(function(srch) {
srch.CF_SEARCH_RESULT_INFO = {
  ON_CLICK : Symbol(),
};

const _CPT_SEARCH_RESULT_INFO = {
  TITLE_ONLY_MAIN : `<div class="search-result-info pad5px clickable">
  <div id="__ID_TITLE__"></div>
  </div>`,
  BRIEF_MAIN : `<div class="info-panel brief clickable">
  <div class="pad10px u-font2 line-height32">
    <div id="__ID_CONTENT__"></div>
  </div>
  <div id="__ID_TIME__" class="small-info-text"></div>
  </div>`,
  NORMAL_MAIN : `<div class="search-result-info pad10px clickable">
  <div>
    <span class="u-font3 s-cfunc">
      <span id="__ID_ICON__" class="inline-block s-icon6"></span>
      <span id="__ID_TITLE__"></span>
    </span>
  </div>
  <div id="__ID_CONTENT__" class="u-font4 cdimgray hmax80px hide-overflow"></div>
  <div id="__ID_TIME__" class="small-info-text"></div>
  </div>`,
  KEYWORD : `<span class="search-result-match">__KEYWORD__</span>`,
};

class PSearchResultInfo extends ui.Panel {
  getTimePanel() { return null; }
  getIconPanel() { return null; }
  getTitlePanel() { return null; }
  getContentPanel() { return null; }
};

class PSearchResultInfoTitleOnly extends PSearchResultInfo {
  #pTitle;

  constructor() {
    super();
    this.#pTitle = new ui.Panel();
  }

  getTitlePanel() { return this.#pTitle; }

  _renderFramework() {
    let s = _CPT_SEARCH_RESULT_INFO.TITLE_ONLY_MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
  }
};

class PSearchResultInfoBrief extends PSearchResultInfo {
  #pContent;
  #pTime;

  constructor() {
    super();
    this.#pContent = new ui.Panel();
    this.#pTime = new ui.Panel();
  }

  getContentPanel() { return this.#pContent; }
  getTimePanel() { return this.#pTime; }

  _renderFramework() {
    let s = _CPT_SEARCH_RESULT_INFO.BRIEF_MAIN;
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_TIME__", this._getSubElementId("T"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pTime.attach(this._getSubElementId("T"));
  }
};

class PSearchResultInfoNormal extends PSearchResultInfo {
  #pIcon;
  #pTitle;
  #pContent;
  #pTime;

  constructor() {
    super();
    this.#pIcon = new ui.Panel();
    this.#pTitle = new ui.Panel();
    this.#pContent = new ui.Panel();
    this.#pTime = new ui.Panel();
  }

  getIconPanel() { return this.#pIcon; }
  getTitlePanel() { return this.#pTitle; }
  getContentPanel() { return this.#pContent; }
  getTimePanel() { return this.#pTime; }

  _renderFramework() {
    let s = _CPT_SEARCH_RESULT_INFO.NORMAL_MAIN;
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pIcon.attach(this._getSubElementId("I"));
    this.#pTitle.attach(this._getSubElementId("TT"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pTime.attach(this._getSubElementId("TM"));
  }
};

class FSearchResultInfo extends ui.Fragment {
  static T_LAYOUT = {
    BRIEF : Symbol(),
    TITLE_ONLY: Symbol(),
  };

  #data = null;
  #tLayout = null;

  setData(data) { this.#data = data; }
  setLayoutType(t) { this.#tLayout = t; }

  action(type, ...args) {
    switch (type) {
    case srch.CF_SEARCH_RESULT_INFO.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    this.#renderIcon(panel.getIconPanel(), this.#data.type);
    this.#renderTitle(panel.getTitlePanel(), this.#data.title);
    this.#renderContent(panel.getContentPanel(), this.#data.content);
    this.#renderTime(panel.getTimePanel(), this.#data.timestamp);
  }

  #createPanel() {
    let p;
    switch (this.#tLayout) {
    case this.constructor.T_LAYOUT.TITLE_ONLY:
      p = new PSearchResultInfoTitleOnly();
      break;
    case this.constructor.T_LAYOUT.BRIEF:
      p = new PSearchResultInfoBrief();
      break;
    default:
      p = new PSearchResultInfoNormal();
      break;
    }
    p.setAttribute("onclick",
                   "javascript:G.action(srch.CF_SEARCH_RESULT_INFO.ON_CLICK)");
    return p;
  }

  #renderTitle(panel, matchInfo) {
    if (!panel) {
      return;
    }
    panel.replaceContent(this.#renderMatchInfoElements(matchInfo.elements));
  }

  #renderContent(panel, matchInfo) {
    if (!panel) {
      return;
    }
    panel.replaceContent(this.#renderMatchInfoElements(matchInfo.elements));
  }

  #renderMatchInfoElements(elements) {
    let items = [];
    for (let e of elements) {
      items.push(this.#renderMatchInfoElement(e));
    }
    return items.join("...");
  }

  #renderMatchInfoElement(e) {
    let s = "";
    if (e.prefix) {
      if (e.is_prefix_overflow) {
        s += "...";
      }
      s += e.prefix;
    }

    let t = _CPT_SEARCH_RESULT_INFO.KEYWORD;
    s += t.replace("__KEYWORD__", e.keyword ? e.keyword : "");

    if (e.postfix) {
      s += e.postfix;
      if (e.is_postfix_overflow) {
        s += "...";
      }
    }
    return s;
  }

  #renderIcon(panel, type) {
    if (!panel) {
      return;
    }
    let icon = dat.SocialItem.getIcon(type);
    panel.replaceContent(Utilities.renderSvgFuncIcon(icon));
  }

  #renderTime(panel, timestamp) {
    if (!panel) {
      return;
    }
    if (timestamp) {
      panel.replaceContent(
          Utilities.renderSmartTime(new Date(timestamp * 1000)));
    }
  }

  #onClick() {
    this._delegate.onClickInSearchResultInfoFragment(this, this.#data.type,
                                                     this.#data.id);
  }
};

srch.FSearchResultInfo = FSearchResultInfo;
}(window.srch = window.srch || {}));
