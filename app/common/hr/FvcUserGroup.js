const _CF_USER_GROUP_CONTENT = {
  HEAD : `<div>
    <br>
    <div class="center-align group-info-name">
      <span>__NAME__</span>
    </div>
    <br>
    <div class="center-align">
      <span>Members: __N_MEMBERS__</span>
    </div>
  </div>`,
}

export class FvcUserGroup extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fMembers = new ui.FSimpleFragmentList();
    this._fMembers.setGridMode(true);
    this._fLeave = new ui.Button();
    this._fLeave.setName("Leave...");
    this._fLeave.setThemeType(ui.Button.T_THEME.DANGER);
    this._fLeave.setLayoutType(ui.Button.LAYOUT_TYPE.BAR);
    this._fLeave.setDelegate(this);

    this.setChild("members", this._fMembers);
    this.setChild("btnLeave", this._fLeave);

    this._groupId = null;
  }

  setGroupId(id) { this._groupId = id; }

  onSimpleButtonClicked(fButton) {
    let group = dba.Groups.get(this._groupId);
    if (group) {
      this._confirmDangerousOperation(R.get("CONFIRM_LEAVE_GROUP"),
                                      () =>
                                          this.#asyncLeaveGroup(group.getId()));
    }
  }

  onIconClickedInUserIconFragment(fUserIcon, userId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }

  action(type, ...args) {
    switch (type) {
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    let group = dba.Groups.get(this._groupId);
    if (!group) {
      return;
    }

    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderHead(group));

    pp = new ui.SectionPanel("Members");
    p.pushPanel(pp);
    this._fMembers.clear();
    for (let id of group.getMemberIds()) {
      let f = new S.hr.FUserIcon();
      f.setUserId(id);
      f.setDelegate(this);
      this._fMembers.append(f);
    }
    this._fMembers.attachRender(pp.getContentPanel());
    this._fMembers.render();

    if (dba.Account.isInGroup(group.getId()) &&
        dba.Account.getId() != group.getOwnerId()) {
      p.pushSpace(1);
      pp = new ui.PanelWrapper();
      p.pushPanel(pp);
      this._fLeave.attachRender(pp);
      this._fLeave.render();
    }

    p.pushSpace(2);
  }

  #renderHead(group) {
    let s = _CF_USER_GROUP_CONTENT.HEAD;
    s = s.replace("__NAME__", group.getName());
    s = s.replace("__N_MEMBERS__", group.getNMembers());
    return s;
  }

  #asyncLeaveGroup(groupId) {
    let fd = new FormData();
    fd.append("id", groupId);
    let url = "api/career/resign_role";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onLeaveGroupRRR(d));
  }

  #onLeaveGroupRRR(data) {
    dba.Account.reset(data.profile);
    dba.WebConfig.reset(data.web_config);
    this._owner.onContentFragmentRequestPopView(this);
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.S = window.S || {};
  window.S.hr = window.S.hr || {};
  window.S.hr.FvcUserGroup = FvcUserGroup;
}
