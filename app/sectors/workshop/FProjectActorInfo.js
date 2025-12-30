
window.CF_PROJECT_ACTOR_INFO = {
  ON_CLICK : "CF_PROJECT_ACTOR_INFO_1",
};
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class FProjectActorInfo extends Fragment {
  static T_LAYOUT = {
    CARD : Symbol("CARD"),
  };

  constructor() {
    super();
    this._fIcon = new S.hr.FUserIcon();
    this._fIcon.setDelegate(this);
    this.setChild("icon", this._fIcon);

    this._actor = null;
    this._layoutType = null;
  }

  getActor() { return this._actor; }

  setActor(actor) {
    this._actor = actor;
    this._fIcon.setUserId(actor.getUserId());
  }
  setLayoutType(layoutType) { this._layoutType = layoutType; }

  onIconClickedInUserIconFragment(fIcon, userId) { this.#onClick(); }

  action(type, ...args) {
    switch (type) {
    case CF_PROJECT_ACTOR_INFO.ON_CLICK:
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
                   "javascript:G.action(CF_PROJECT_ACTOR_INFO.ON_CLICK)");
    render.wrapPanel(p);
    p.setThemeClassNames(this.#getThemeClassNames());

    let pp = p.getIconPanel();
    if (pp) {
      this._fIcon.attachRender(pp);
      this._fIcon.render();
    }

    pp = p.getTitlePanel();
    if (pp) {
      pp.setClassName("user-title");
      pp.replaceContent(this._actor.getRoleName());
    }

    pp = p.getNamePanel();
    pp.replaceContent(this.#renderName(u));
  }

  #createPanel() {
    let p = null;
    switch (this._layoutType) {
    default:
      p = new wksp.PProjectActorInfo();
      break;
    }
    return p;
  }

  #getThemeClassNames() {
    let names = [];
    let name = this.#getColorClassName();
    if (name && name.length) {
      names.push(name);
    }
    if (this._actor.isPending()) {
      names.push("bddashed");
    }

    return names;
  }

  #getColorClassName() {
    let name = "";
    switch (this._actor.getRoleId()) {
    case dat.ProjectActor.T_ROLE.CLIENT:
      name = "bgpalegoldenrod";
      break;
    case dat.ProjectActor.T_ROLE.FACILITATOR:
      name = "bglightblue";
      break;
    case dat.ProjectActor.T_ROLE.AGENT:
      name = "bgwhite";
      break;
    default:
      break;
    }
    return name;
  }

  #renderName(user) { return user ? user.getNickname() : "..."; }

  #onClick() {
    if (this._delegate) {
      this._delegate.onClickInProjectActorInfoFragment(this, this._actor);
    } else {
      fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO,
                               this._actor.getUserId());
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.FProjectActorInfo = FProjectActorInfo;
}
