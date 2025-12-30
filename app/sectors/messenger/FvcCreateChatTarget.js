
class FvcCreateChatTarget extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fMembers = new ui.FSimpleFragmentList();
    this._fMembers.setGridMode(true);

    this._fInput = new gui.FSmartInput();
    this._fInput.setHintText("User name");
    this._fInput.setDelegate(this);

    this._fContacts = new gui.SimpleLongListFragment();
    this._fContacts.setGridMode(true);
    this._fContacts.setDataSource(this);

    this._fActions = new ui.ButtonList();
    this._fActions.setDelegate(this);
    this._fActions.addButton("OK", () => this.#onInputOk());
    this._fActions.addButton("Cancel", () => this.#onInputCancelled(), true);

    this.setChild("members", this._fMembers);
    this.setChild("input", this._fInput);
    this.setChild("contacts", this._fContacts);
    this.setChild("actions", this._fActions);

    this._selectedIds = [];
  }

  getFilteredItemsForSmartInputFragment(fSmartInput, filterStr) { return []; }
  getUrlForLongListFragment(fGrid, fromId) {
    let url = "api/user/followers?user_id=" + dba.Account.getId();
    if (fromId) {
      url += "&before_id=" + fromId;
    }
    return url;
  }
  createInfoFragmentForLongListFragment(fGrid, id) {
    return this.#createUserIconFragment(id);
  }

  onIconClickedInUserIconFragment(fUserIcon, userId) {
    if (fUserIcon.isOwnedBy(this._fMembers)) {
      this._selectedIds = this._selectedIds.filter(e => e != userId);
      this.render();
    } else {
      if (!this._selectedIds.includes(userId)) {
        this._selectedIds.push(userId);
        this.render();
      }
    }
  }

  onItemChosenInSmartInputFragment(fSmartInput, userId) {}

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.SectionPanel("Members");
    p.pushPanel(pp);
    this._fMembers.clear();
    for (let uid of this._selectedIds) {
      let f = this.#createUserIconFragment(uid);
      this._fMembers.append(f);
    }
    this._fMembers.attachRender(pp.getContentPanel());
    this._fMembers.render();

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this._fInput.attachRender(pp);
    this._fInput.render();

    pp = new ui.SectionPanel("Browse");
    p.pushPanel(pp);
    this._fContacts.attachRender(pp.getContentPanel());
    this._fContacts.render();

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this._fActions.attachRender(pp);
    this._fActions.render();
  }

  #onInputCancelled() { this._owner.onContentFragmentRequestPopView(this); }

  #onInputOk() {
    let n = this._selectedIds.length;
    if (n < 1) {
      return;
    }
    if (n == 1) {
      let target = new dat.ChatTarget();
      target.setId(this._selectedIds[0]);
      target.setIdType(dat.SocialItem.TYPE.USER);
      this._owner.onContentFragmentRequestPopView(this);
      this._delegate.onTargetCreatedInCreateChatTargetContentFragment(this,
                                                                      target);
    } else {
      this.#asyncCreateGroup(this._selectedIds);
    }
  }

  #createUserIconFragment(userId) {
    let f = new S.hr.FUserIcon();
    f.setUserId(userId);
    f.setDelegate(this);
    return f;
  }

  #asyncCreateGroup(userIds) {
    let url = "/api/messenger/create_group";
    let fd = new FormData();
    for (let uid of userIds) {
      fd.append("member_ids", uid);
    }
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onCreateGroupRRR(d));
  }

  #onCreateGroupRRR(data) {
    let g = new dat.UserGroup(data.group);
    dba.Groups.update(g);
    let target = new dat.ChatTarget();
    target.setId(g.getId());
    target.setIdType(dat.SocialItem.TYPE.GROUP);
    this._owner.onContentFragmentRequestPopView(this);
    this._delegate.onTargetCreatedInCreateChatTargetContentFragment(this,
                                                                    target);
  }
};

msgr.FvcCreateChatTarget = FvcCreateChatTarget;
}(window.msgr = window.msgr || {}));
