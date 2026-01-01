import { T_DATA } from '../../common/plt/Events.js';
import { Groups } from '../../common/dba/Groups.js';
import { Users } from '../../common/dba/Users.js';
import { FChatThreadInfo } from './FChatThreadInfo.js';
import { Utilities as MessengerUtilities } from './Utilities.js';

export class FChatGroupInfo extends FChatThreadInfo {
  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _getIconInfos() {
    let infos = [];
    let g = Groups.get(this._threadId);
    if (g) {
      for (let id of g.getMemberIds()) {
        let u = Users.get(id);
        if (u) {
          infos.push({url : u.getIconUrl(), bg : u.getBackgroundColor()});
        }
      }
    }
    return infos;
  }

  _renderTitle() { return MessengerUtilities.getGroupName(this._threadId); }

  _onClick() {
    this._delegate.onClickInChatGroupInfoFragment(this, this._threadId);
  }
};
