
const _CFT_CAREER_CONTENT = {
  MEMBER : `<img class="user-info-icon s-icon2" src="__ICON_URL__"></img>
    <div class="user-info-name">__NAME__</div>`,
}

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { GridFragment } from '../../lib/ui/controllers/fragments/GridFragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { UserRole } from '../../common/datatypes/UserRole.js';
import { T_DATA } from '../../common/plt/Events.js';
import { api } from '../../common/plt/Api.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';

export class FvcCareer extends FScrollViewContent {
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

    this._roleId = null;
  }

  setRoleId(id) { this._roleId = id; }

  getItemsForGridFragment(fragment) {
    let role = this.#getRole();
    return role ? role.getMemberIds() : [];
  }

  onSimpleButtonClicked(fBtn) {
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

  handleSessionDataUpdate(dataType, data) {
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

  renderItemForGrid(item) {
    let user = dba.Users.get(item);
    if (user) {
      let s = _CFT_CAREER_CONTENT.MEMBER;
      s = s.replace("__NAME__", user.getNickname());
      s = s.replace("__ICON_URL__", user.getIconUrl());
      return s;
    } else {
      return "loading...";
    }
  }

  _renderContentOnRender(render) {
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
    dba.Users.loadMissing(role.getMemberIds());
  }

  #getRole() {
    let d = dba.WebConfig.getRoleData(this._roleId);
    return d ? new UserRole(d) : null;
  }
  #onApply() { this.#asyncApplyRole(this._roleId); }
  #onLeave() {
    this._confirmDangerousOperation(R.get("CONFIRM_RESIGN_ROLE"),
                                    () => this.#asyncResignRole(this._roleId));
  }

  #renderActions(role, panel) {
    if (dba.Account.isRoleApplicationPending(role.getId())) {
      panel.replaceContent("Your application is pending approval.");
    } else if (dba.Account.isInGroup(role.getId())) {
      this._fBtnLeave.attachRender(panel);
      this._fBtnLeave.render();
    } else {
      this._fBtnApply.attachRender(panel);
      this._fBtnApply.render();
    }
  }

  #asyncApplyRole(roleId) {
    let fd = new FormData();
    fd.append("id", roleId);
    let url = "api/career/apply_role";
    api.asyncFragmentPost(this, url, fd).then(d => this.#onApplyRoleRRR(d));
  }

  #onApplyRoleRRR(data) {
    dba.Account.reset(data.profile);
    Events.triggerTopAction(T_ACTION.SHOW_NOTICE, this,
                                R.get("ROLE_APPLICATION_SENT"));
  }

  #asyncResignRole(roleId) {
    let fd = new FormData();
    fd.append("id", roleId);
    let url = "api/career/resign_role";
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onResignRoleRRR(d));
  }

  #onResignRoleRRR(data) {
    dba.Account.reset(data.profile);
    dba.WebConfig.reset(data.web_config);
    this._owner.onContentFragmentRequestPopView(this)
  }
};
