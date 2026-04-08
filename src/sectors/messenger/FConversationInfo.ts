import { T_DATA } from '../../common/plt/Events.js';
import { FChatThreadInfo, IconInfo } from './FChatThreadInfo.js';
import { Users } from '../../common/dba/Users.js';
import { Account } from '../../common/dba/Account.js';

export interface ConversationInfoDelegate {
  onClickInConversationInfoFragment(f: FConversationInfo, threadId: string): void;
}

export class FConversationInfo extends FChatThreadInfo {
  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
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

  _getIconInfos(): IconInfo[] {
    let infos: IconInfo[] = [];
    let u = Users.get(this._threadId);
    if (u) {
      infos.push({url : u.getIconUrl(), bg : u.getBackgroundColor() ?? ""});
    }
    return infos;
  }

  _renderTitle(): string {
    if (this._threadId) {
      return Account.getUserNickname(this._threadId, "Unknown user");
    }
    return "Unknown user";
  }

  _onClick(): void {
    if (!this._threadId) {
      return;
    }
    const delegate = this.getDelegate<ConversationInfoDelegate>();
    if (delegate) {
      delegate.onClickInConversationInfoFragment(this, this._threadId);
    }
  }
}
