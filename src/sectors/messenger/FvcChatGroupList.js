import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { FChatGroupInfo } from './FChatGroupInfo.js';
import { FvcChat } from './FvcChat.js';

export class FvcChatGroupList extends FScrollViewContent {
  constructor() {
    super();
    this._fList = new FSimpleFragmentList();
    this.setChild("list", this._fList);
  }

  onClickInChatGroupInfoFragment(fInfo, groupId) {
    let t = new ChatTarget();
    t.setId(groupId);
    t.setIdType(SocialItem.TYPE.GROUP);
    this.#startChatWith(t);
  }

  _renderContentOnRender(render) {
    this._fList.clear();
    for (let id of window.dba.Account.getGroupIds()) {
      let f = new FChatGroupInfo();
      f.setDelegate(this);
      f.setThreadId(id);
      this._fList.append(f);
    }
    this._fList.attachRender(render);
    this._fList.render();
  }

  #startChatWith(target) {
    let v = new View();
    let f = new FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Chat");
  }
};
