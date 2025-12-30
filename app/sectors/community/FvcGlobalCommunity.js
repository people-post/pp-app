
window.CF_GLOBAL_COMMUNITY_CONTENT = {
  VIEW_USER : "CF_COMMUNITY_CONTENT_1",
}

const _CFT_GLOBAL_COMMUNITY_CONTENT = {
  HOF : `<ol>
    <li>By lifetime credit</li>
    <li>By current year</li>
    <li>By growth</li>
    <li>History by year</li>
  </ol>`,
  PERSONAL : `<ol>
    <li>Total credit & history</li>
    <li>Dividents & history</li>
  </ol>`,
  ORG : `<ol>
    <li>Current graph</li>
    <li>Voted by</li>
    <li>Vote to</li>
  </ol>`,
}

class FvcGlobalCommunity extends ui.FScrollViewContent {
  constructor() {
    super();
    this._userId = null;
    this._fGlobal = new cmut.FGlobalCommunityInfo();
    this.setChild("global", this._fGlobal);
  }

  setUserId(userId) { this._userId = userId; }

  action(type, ...args) {
    switch (type) {
    case CF_GLOBAL_COMMUNITY_CONTENT.VIEW_USER:
      this.#onViewUser(args[0]);
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
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.SectionPanel("Hall Of Fame(HOF)");
    // p.pushPanel(pp);
    // pp.getContentPanel().replaceContent(this.#renderHof());

    pp = new ui.SectionPanel("Global");
    p.pushPanel(pp);
    this._fGlobal.attachRender(pp.getContentPanel());
    this._fGlobal.render();

    pp = new ui.SectionPanel("Personal");
    p.pushPanel(pp);
    pp.getContentPanel().replaceContent(this.#renderPersonal());
  }

  #renderHof() { return ""; }

  #renderPersonal() {
    let user = dba.Users.get(this._userId);
    if (user) {
      let referrerId = user.getReferrerId();
      if (referrerId) {
        let u = dba.Users.get(referrerId);
        if (u) {
          return "Referred by: " +
                 Utilities.renderSmallButton(
                     "CF_GLOBAL_COMMUNITY_CONTENT.VIEW_USER", u.getId(),
                     dba.Account.getUserNickname(u.getId(), u.getNickname()));
        }
      }
    }
    return "";
  }

  #onViewUser(userId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }
};

cmut.FvcGlobalCommunity = FvcGlobalCommunity;
}(window.cmut = window.cmut || {}));
