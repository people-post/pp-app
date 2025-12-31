
export class FChatGroupInfo extends msgr.FChatThreadInfo {
  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PROFILE:
    case plt.T_DATA.USER_PUBLIC_PROFILES:
    case plt.T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _getIconInfos() {
    let infos = [];
    let g = dba.Groups.get(this._threadId);
    if (g) {
      for (let id of g.getMemberIds()) {
        let u = dba.Users.get(id);
        if (u) {
          infos.push({url : u.getIconUrl(), bg : u.getBackgroundColor()});
        }
      }
    }
    return infos;
  }

  _renderTitle() { return msgr.Utilities.getGroupName(this._threadId); }

  _onClick() {
    this._delegate.onClickInChatGroupInfoFragment(this, this._threadId);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.FChatGroupInfo = FChatGroupInfo;
}
