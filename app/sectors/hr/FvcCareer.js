
const _CFT_CAREER_CONTENT = {
  MEMBER : `<img class="user-info-icon s-icon2" src="__ICON_URL__"></img>
    <div class="user-info-name">__NAME__</div>`,
}

class FvcCareer extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fMembers = new ui.GridFragment();
    this._fMembers.setDataSource(this);
    this._fMembers.setDelegate(this);
    this.setChild("members", this._fMembers);

    this._fBtnApply = new ui.Button();
    this._fBtnApply.setName("Apply");
    this._fBtnApply.setDelegate(this);
    this.setChild("btnApply", this._fBtnApply);

    this._fBtnLeave = new ui.Button();
    this._fBtnLeave.setName("Leave...");
    this._fBtnLeave.setThemeType(ui.Button.T_THEME.DANGER);
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
    case plt.T_DATA.USER_PROFILE:
    case plt.T_DATA.USER_PUBLIC_PROFILES:
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
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.SectionPanel("Name");
    p.pushPanel(pp);
    pp.getContentPanel().replaceContent(role.getName());
    pp = new ui.SectionPanel("Description");
    p.pushPanel(pp);

    pp = new ui.SectionPanel("Members");
    p.pushPanel(pp);
    this._fMembers.attachRender(pp.getContentPanel());
    this._fMembers.render();

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this.#renderActions(role, pp);
    dba.Users.loadMissing(role.getMemberIds());
  }

  #getRole() {
    let d = dba.WebConfig.getRoleData(this._roleId);
    return d ? new dat.UserRole(d) : null;
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
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onApplyRoleRRR(d));
  }

  #onApplyRoleRRR(data) {
    dba.Account.reset(data.profile);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_NOTICE, this,
                                R.get("ROLE_APPLICATION_SENT"));
  }

  #asyncResignRole(roleId) {
    let fd = new FormData();
    fd.append("id", roleId);
    let url = "api/career/resign_role";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onResignRoleRRR(d));
  }

  #onResignRoleRRR(data) {
    dba.Account.reset(data.profile);
    dba.WebConfig.reset(data.web_config);
    this._owner.onContentFragmentRequestPopView(this)
  }
};

hr.FvcCareer = FvcCareer;
}(window.hr = window.hr || {}));
