import { T_DATA } from '../../common/plt/Events.js';
import { FChatThreadInfo } from './FChatThreadInfo.js';
import { Users } from '../../common/dba/Users.js';

interface ConversationInfoDelegate {
  onClickInConversationInfoFragment(f: FConversationInfo, threadId: string): void;
}

export class FConversationInfo extends FChatThreadInfo {
  protected _delegate!: ConversationInfoDelegate;

  handleSessionDataUpdate(dataType: string, data: unknown): void {
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

  _getIconInfos(): Array<{ url: string; bg: string }> {
    let infos: Array<{ url: string; bg: string }> = [];
    let u = Users.get(this._threadId);
    if (u) {
      infos.push({url : u.getIconUrl(), bg : u.getBackgroundColor()});
    }
    return infos;
  }

  _renderTitle(): string {
    if (window.dba?.Account) {
      return window.dba.Account.getUserNickname(this._threadId, "Unknown user");
    }
    return "Unknown user";
  }

  _onClick(): void {
    this._delegate.onClickInConversationInfoFragment(this, this._threadId);
  }
}
