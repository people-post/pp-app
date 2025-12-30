import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class FvcChatGroupList extends FScrollViewContent {
  constructor() {
    super();
    this._fList = new FSimpleFragmentList();
    this.setChild("list", this._fList);
  }

  onClickInChatGroupInfoFragment(fInfo, groupId) {
    let t = new dat.ChatTarget();
    t.setId(groupId);
    t.setIdType(dat.SocialItem.TYPE.GROUP);
    this.#startChatWith(t);
  }

  _renderContentOnRender(render) {
    this._fList.clear();
    for (let id of dba.Account.getGroupIds()) {
      let f = new msgr.FChatGroupInfo();
      f.setDelegate(this);
      f.setThreadId(id);
      this._fList.append(f);
    }
    this._fList.attachRender(render);
    this._fList.render();
  }

  #startChatWith(target) {
    let v = new View();
    let f = new msgr.FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Chat");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.FvcChatGroupList = FvcChatGroupList;
}
