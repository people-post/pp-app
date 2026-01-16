import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { SocialItem } from '../../common/interface/SocialItem.js';
import { FChatGroupInfo } from './FChatGroupInfo.js';
import { FvcChat } from './FvcChat.js';
import type Render from '../../lib/ui/renders/Render.js';
import { Account } from '../../common/dba/Account.js';

export class FvcChatGroupList extends FScrollViewContent {
  protected _fList: FSimpleFragmentList;

  constructor() {
    super();
    this._fList = new FSimpleFragmentList();
    this.setChild("list", this._fList);
  }

  onClickInChatGroupInfoFragment(_fInfo: FChatGroupInfo, groupId: string): void {
    let t = new ChatTarget();
    t.setId(groupId);
    t.setIdType(SocialItem.TYPE.GROUP);
    this.#startChatWith(t);
  }

  _renderContentOnRender(render: Render): void {
    this._fList.clear();
    if (Account) {
      for (let id of Account.getGroupIds()) {
        let f = new FChatGroupInfo();
        f.setDelegate(this);
        f.setThreadId(id);
        this._fList.append(f);
      }
    }
    this._fList.attachRender(render);
    this._fList.render();
  }

  #startChatWith(target: ChatTarget): void {
    let v = new View();
    let f = new FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Chat");
  }
}
