(function(msgr) {
class FConversationInfo extends msgr.FChatThreadInfo {
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

  _getIconInfos() {
    let infos = [];
    let u = dba.Users.get(this._threadId);
    if (u) {
      infos.push({url : u.getIconUrl(), bg : u.getBackgroundColor()});
    }
    return infos;
  }

  _renderTitle() {
    return name = dba.Account.getUserNickname(this._threadId, "Unknown user");
  }

  _onClick() {
    this._delegate.onClickInConversationInfoFragment(this, this._threadId);
  }
};

msgr.FConversationInfo = FConversationInfo;
}(window.msgr = window.msgr || {}));

