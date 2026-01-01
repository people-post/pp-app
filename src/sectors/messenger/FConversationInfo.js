import { T_DATA } from '../../common/plt/Events.js';
import { FChatThreadInfo } from './FChatThreadInfo.js';
import { Users } from '../../common/dba/Users.js';
import { Account } from '../../common/dba/Account.js';

export class FConversationInfo extends FChatThreadInfo {
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

  _getIconInfos() {
    let infos = [];
    let u = Users.get(this._threadId);
    if (u) {
      infos.push({url : u.getIconUrl(), bg : u.getBackgroundColor()});
    }
    return infos;
  }

  _renderTitle() {
    return Account.getUserNickname(this._threadId, "Unknown user");
  }

  _onClick() {
    this._delegate.onClickInConversationInfoFragment(this, this._threadId);
  }
};
