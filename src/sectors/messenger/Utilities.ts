import { Groups } from '../../common/dba/Groups.js';
import { Account } from '../../common/dba/Account.js';

export const Utilities = {
  getGroupName(groupId: string): string {
    let g = Groups.get(groupId);
    if (!g) {
      return "Unknown group";
    }

    let name = g.getName();
    if (name && name.length) {
      return name;
    }

    let items: string[] = [];
    for (let id of g.getMemberIds()) {
      if (id == Account.getId()) {
        continue;
      }
      let nn = Account.getUserNickname(id, null);
      if (nn && nn.length) {
        if (items.length > 3) {
          items.push("...");
          break;
        } else {
          items.push(nn);
        }
      }
    }

    if (items.length == 0) {
      return "Empty group";
    }

    return items.join(`<span class="small-info-text">&</span>`);
  },
};
