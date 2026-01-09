const _CFT_CAREER_CONTENT = {
  MEMBER : `<img class="user-info-icon s-icon2" src="__ICON_URL__"></img>
    <div class="user-info-name">__NAME__</div>`,
} as const;

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { GridFragment } from '../../lib/ui/controllers/fragments/GridFragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { UserRole } from '../../common/datatypes/UserRole.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Users } from '../../common/dba/Users.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { R } from '../../common/constants/R.js';
import { Api } from '../../common/plt/Api.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcCareer extends FScrollViewContent {
  protected _fMembers: GridFragment;
  protected _fBtnApply: Button;
  protected _fBtnLeave: Button;
  protected _roleId: string | null = null;

  constructor() {
    super();
    this._fMembers = new GridFragment();
    this._fMembers.setDataSource(this);
    this._fMembers.setDelegate(this);
    this.setChild("members", this._fMembers);

    this._fBtnApply = new Button();
    this._fBtnApply.setName("Apply");
    this._fBtnApply.setDelegate(this);
    this.setChild("btnApply", this._fBtnApply);

    this._fBtnLeave = new Button();
    this._fBtnLeave.setName("Leave...");
    this._fBtnLeave.setThemeType(Button.T_THEME.DANGER);
    this._fBtnLeave.setDelegate(this);
    this.setChild("btnLeave", this._fBtnLeave);
  }

  setRoleId(id: string | null): void { this._roleId = id; }

  getItemsForGridFragment(_fragment: GridFragment): string[] {
    let role = this.#getRole();
    return role ? role.getMemberIds() : [];
  }

  onSimpleButtonClicked(fBtn: Button): void {
    switch (fBtn) {
    case this._fBtnApply:
      this.#onApply();
      break;
    case this._fBtnLeave:
      this.#onLeave();
      break;
    default:
      break;
    }
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  renderItemForGrid(item: string): string {
    let user = Users.get(item);
    if (user) {
      let s = _CFT_CAREER_CONTENT.MEMBER;
      s = s.replace("__NAME__", user.getNickname());
      s = s.replace("__ICON_URL__", user.getIconUrl());
      return s;
    } else {
      return "loading...";
    }
  }

  _renderContentOnRender(render: Render): void {
    let role = this.#getRole();
    if (!role) {
      return;
    }
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new SectionPanel("Name");
    p.pushPanel(pp);
    pp.getContentPanel().replaceContent(role.getName());
    pp = new SectionPanel("Description");
    p.pushPanel(pp);

    pp = new SectionPanel("Members");
    p.pushPanel(pp);
    this._fMembers.attachRender(pp.getContentPanel());
    this._fMembers.render();

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this.#renderActions(role, pp);
    Users.loadMissing(role.getMemberIds());
  }

  #getRole(): UserRole | null {
    if (!this._roleId) {
      return null;
    }
    let d = WebConfig.getRoleData(this._roleId);
    return d ? new UserRole(d) : null;
  }
  #onApply(): void {
    if (this._roleId) {
      this.#asyncApplyRole(this._roleId);
    }
  }
  #onLeave(): void {
    if (this._roleId) {
      this._confirmDangerousOperation(R.get("CONFIRM_RESIGN_ROLE"),
                                      () => this.#asyncResignRole(this._roleId));
    }
  }

  #renderActions(role: UserRole, panel: PanelWrapper): void {
    if (window.dba.Account.isRoleApplicationPending(role.getId())) {
      panel.replaceContent("Your application is pending approval.");
    } else if (window.dba.Account.isInGroup(role.getId())) {
      this._fBtnLeave.attachRender(panel);
      this._fBtnLeave.render();
    } else {
      this._fBtnApply.attachRender(panel);
      this._fBtnApply.render();
    }
  }

  #asyncApplyRole(roleId: string): void {
    let fd = new FormData();
    fd.append("id", roleId);
    let url = "api/career/apply_role";
    Api.asFragmentPost(this, url, fd).then(d => this.#onApplyRoleRRR(d));
  }

  #onApplyRoleRRR(data: unknown): void {
    let dataObj = data as { profile: unknown };
    window.dba.Account.reset(dataObj.profile);
    Events.triggerTopAction(T_ACTION.SHOW_NOTICE, this,
                                R.get("ROLE_APPLICATION_SENT"));
  }

  #asyncResignRole(roleId: string): void {
    let fd = new FormData();
    fd.append("id", roleId);
    let url = "api/career/resign_role";
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onResignRoleRRR(d));
  }

  #onResignRoleRRR(data: unknown): void {
    let dataObj = data as { profile: unknown; web_config: unknown };
    window.dba.Account.reset(dataObj.profile);
    WebConfig.reset(dataObj.web_config);
    this._owner.onContentFragmentRequestPopView(this);
  }
}
