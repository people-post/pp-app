import { T_DATA } from '../../common/plt/Events.js';
import { Groups } from '../../common/dba/Groups.js';
import { Users } from '../../common/dba/Users.js';
import { FChatThreadInfo, IconInfo } from './FChatThreadInfo.js';
import { Utilities as MessengerUtilities } from './Utilities.js';

export interface ChatGroupInfoDelegate {
  onClickInChatGroupInfoFragment(f: FChatGroupInfo, threadId: string): void;
}

export class FChatGroupInfo extends FChatThreadInfo {
  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
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

  _getIconInfos(): IconInfo[] {
    let infos: IconInfo[] = [];
    let g = Groups.get(this._threadId);
    if (g) {
      for (let id of g.getMemberIds()) {
        let u = Users.get(id);
        if (u) {
          infos.push({url : u.getIconUrl(), bg : u.getBackgroundColor() ?? ""});
        }
      }
    }
    return infos;
  }

  _renderTitle(): string {
    if (!this._threadId) {
      return "Unknown group";
    }
    return MessengerUtilities.getGroupName(this._threadId);
  }

  _onClick(): void {
    if (!this._threadId) {
      return;
    }
    const delegate = this.getDelegate<ChatGroupInfoDelegate>();
    if (delegate) {
      delegate.onClickInChatGroupInfoFragment(this, this._threadId);
    }
  }
}
