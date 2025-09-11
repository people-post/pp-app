(function(msgr) {
class FvcChatThreadList extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fThreads = new ui.FSimpleFragmentList();
    this.setChild("threads", this._fThreads);

    this._fBtnNew = new gui.ActionButton();
    this._fBtnNew.setIcon(gui.ActionButton.T_ICON.NEW);
    this._fBtnNew.setDelegate(this);
  }

  getActionButton() { return this._fBtnNew; }

  onGuiActionButtonClick(fActionBtn) {
    let v = new ui.View();
    let f = new msgr.FvcCreateChatTarget();
    f.setDelegate(this);
    v.setContentFragment(f);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                "Guest comment", false);
  }

  onTargetCreatedInCreateChatTargetContentFragment(fvcCreate, target) {
    this.#startChatWith(target);
  }

  onClickInChatGroupInfoFragment(fInfo, groupId) {
    let t = new dat.ChatTarget();
    t.setId(groupId);
    t.setIdType(dat.SocialItem.TYPE.GROUP);
    this.#startChatWith(t);
  }

  onClickInConversationInfoFragment(fInfo, targetId) {
    let t = new dat.ChatTarget();
    t.setId(targetId);
    t.setIdType(dat.SocialItem.TYPE.USER);
    let u = dba.Users.get(targetId);
    if (!u) {
      return;
    }
    if (!u.isFollowingUser()) {
      t.setIsReadOnly(true);
    }
    this.#startChatWith(t);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case fwk.T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    this._fThreads.clear();
    let f;
    for (let info of dba.Notifications.getMessageThreadInfos()) {
      if (info.isFromUser()) {
        f = new msgr.FConversationInfo();
      } else {
        f = new msgr.FChatGroupInfo();
      }
      f.setThreadId(info.getFromId());
      f.setDelegate(this);
      this._fThreads.append(f);
    }

    this._fThreads.attachRender(render);
    this._fThreads.render();
  }

  #startChatWith(target) {
    let v = new ui.View();
    let f = new msgr.FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Chat");
  }
};

msgr.FvcChatThreadList = FvcChatThreadList;
}(window.msgr = window.msgr || {}));
