export const CF_PROJECT_ACTOR_INFO = {
  ON_CLICK : "CF_PROJECT_ACTOR_INFO_1",
} as const;

// Export to window for HTML string templates
declare global {
  interface Window {
    CF_PROJECT_ACTOR_INFO?: typeof CF_PROJECT_ACTOR_INFO;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_PROJECT_ACTOR_INFO = CF_PROJECT_ACTOR_INFO;
}

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FUserIcon } from '../../common/hr/FUserIcon.js';
import { Users } from '../../common/dba/Users.js';
import { ProjectActor } from '../../common/datatypes/ProjectActor.js';
import { T_DATA } from '../../common/plt/Events.js';
import { T_ACTION as PltT_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { PProjectActorInfo } from './PProjectActorInfo.js';
import type { User } from '../../common/datatypes/User.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

interface ProjectActorInfoDelegate {
  onClickInProjectActorInfoFragment(f: FProjectActorInfo, actor: ProjectActor): void;
}

export class FProjectActorInfo extends Fragment {
  static T_LAYOUT = {
    CARD : Symbol("CARD"),
  } as const;

  protected _fIcon: FUserIcon;
  protected _actor: ProjectActor | null = null;
  protected _layoutType: symbol | null = null;
  protected _delegate!: ProjectActorInfoDelegate;

  constructor() {
    super();
    this._fIcon = new FUserIcon();
    this._fIcon.setDelegate(this);
    this.setChild("icon", this._fIcon);
  }

  getActor(): ProjectActor | null { return this._actor; }

  setActor(actor: ProjectActor): void {
    this._actor = actor;
    this._fIcon.setUserId(actor.getUserId());
  }
  setLayoutType(layoutType: symbol | null): void { this._layoutType = layoutType; }

  onIconClickedInUserIconFragment(_fIcon: FUserIcon, _userId: string | null): void { this.#onClick(); }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_PROJECT_ACTOR_INFO.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Panel): void {
    if (!this._actor) {
      return;
    }

    let u = Users.get(this._fIcon.getUserId());
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

  #createPanel(): PProjectActorInfo {
    let p: PProjectActorInfo;
    switch (this._layoutType) {
    default:
      p = new PProjectActorInfo();
      break;
    }
    return p;
  }

  #getThemeClassNames(): string[] {
    let names: string[] = [];
    let name = this.#getColorClassName();
    if (name && name.length) {
      names.push(name);
    }
    if (this._actor && this._actor.isPending()) {
      names.push("bddashed");
    }

    return names;
  }

  #getColorClassName(): string {
    if (!this._actor) {
      return "";
    }

    let name = "";
    switch (this._actor.getRoleId()) {
    case ProjectActor.T_ROLE.CLIENT:
      name = "bgpalegoldenrod";
      break;
    case ProjectActor.T_ROLE.FACILITATOR:
      name = "bglightblue";
      break;
    case ProjectActor.T_ROLE.AGENT:
      name = "bgwhite";
      break;
    default:
      break;
    }
    return name;
  }

  #renderName(user: User | null): string { return user ? user.getNickname() : "..."; }

  #onClick(): void {
    if (!this._actor) {
      return;
    }

    if (this._delegate) {
      this._delegate.onClickInProjectActorInfoFragment(this, this._actor);
    } else {
      Events.triggerTopAction(PltT_ACTION.SHOW_USER_INFO,
                               this._actor.getUserId());
    }
  }
}
