import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SimpleLongListFragment } from '../../common/gui/SimpleLongListFragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Account } from '../../common/dba/Account.js';
import { FUserInfo } from '../../sectors/hr/FUserInfo.js';
import { FvcChat } from './FvcChat.js';

export class FvcContactList extends FScrollViewContent {
  constructor() {
    super();
    this._fList = new SimpleLongListFragment();
    this._fList.setDataSource(this);
    this.setChild("list", this._fList);
  }

  getUrlForLongListFragment(fGrid, fromId) {
    let url = "api/user/followers?user_id=" + Account.getId();
    if (fromId) {
      url += "&before_id=" + fromId;
    }
    return url;
  }

  createInfoFragmentForLongListFragment(fGrid, id) {
    let f = new FUserInfo();
    f.setDelegate(this);
    f.setUserId(id);
    return f;
  }

  onClickInUserInfoFragment(fUserInfo, userId) {
    let target = new ChatTarget();
    target.setId(userId);
    target.setIdType(SocialItem.TYPE.USER);
    let v = new View();
    let f = new FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Chat");
  }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }
};
