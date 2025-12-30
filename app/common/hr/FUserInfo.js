export const CF_USER_INFO = {
  ON_CLICK : Symbol(),
};

export class FUserInfo extends ui.Fragment {
  static T_LAYOUT = {
    SMALL_ROW : Symbol(),
    COMPACT: Symbol(),
    MID_SQUARE: Symbol(),
  }

  constructor() {
    super();
    this._fIcon = new S.hr.FUserIcon();
    this._fIcon.setDelegate(this);
    this.setChild("icon", this._fIcon);

    this._layoutType = null;
  }

  setUserId(userId) { this._fIcon.setUserId(userId); }
  setLayoutType(layoutType) {
    this._layoutType = layoutType;
    switch (this._layoutType) {
    case this.constructor.T_LAYOUT.SMALL_ROW:
    case this.constructor.T_LAYOUT.MID_SQUARE:
      this._fIcon.setSizeType(S.hr.FUserIcon.ST_SMALL);
      break;
    default:
      break;
    }
  }

  onIconClickedInUserIconFragment(fIcon, userId) { this.#onClick(); }

  action(type, ...args) {
    switch (type) {
    case CF_USER_INFO.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let u = dba.Users.get(this._fIcon.getUserId());
    let p = this.#createPanel();
    p.setAttribute("onclick",
                   "javascript:G.action(S.hr.CF_USER_INFO.ON_CLICK)");
    render.wrapPanel(p);

    let pp = p.getIconPanel();
    if (pp) {
      this._fIcon.attachRender(pp);
      this._fIcon.render();
    }

    pp = p.getNamePanel();
    pp.replaceContent(this.#renderName(u));

    pp = p.getTypeIconPanel();
    if (pp) {
      pp.replaceContent(this.#renderTypeIcon(u));
    }
    pp = p.getUserIdPanel();
    if (pp) {
      pp.replaceContent(this.#renderId(u));
    }
  }

  #createPanel() {
    let p = null;
    switch (this._layoutType) {
    case this.constructor.T_LAYOUT.COMPACT:
      p = new S.hr.PUserInfoCompactCell();
      p.setClassName("inline-block");
      break;
    case this.constructor.T_LAYOUT.MID_SQUARE:
      p = new S.hr.PUserInfoMidsizeCell();
      break;
    case this.constructor.T_LAYOUT.SMALL_ROW:
      p = new S.hr.PUserInfoSmallRow();
      break;
    default:
      p = new S.hr.PUserInfoMidsizeRow();
      break;
    }
    return p;
  }

  #renderName(user) { return user ? user.getNickname() : "..."; }
  #renderId(user) {
    let id = user ? user.getUsername() : null;
    return id ? "@" + id : "";
  }

  #renderTypeIcon(user) {
    if (user && user.isFeed()) {
      let s = `<span class="inline-block s-icon7">__ICON__</span>`;
      return s.replace("__ICON__", C.ICON.FEED);
    }
    return "";
  }

  #onClick() {
    let userId = this._fIcon.getUserId();
    if (this._delegate) {
      this._delegate.onClickInUserInfoFragment(this, userId);
    } else {
      fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
    }
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.S = window.S || {};
  window.S.hr = window.S.hr || {};
  window.S.hr.CF_USER_INFO = CF_USER_INFO;
  window.S.hr.FUserInfo = FUserInfo;
}
