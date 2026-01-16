import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SimpleLongListFragment } from '../../common/gui/SimpleLongListFragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { SocialItem } from '../../common/interface/SocialItem.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FvcChat } from './FvcChat.js';
import type Render from '../../lib/ui/renders/Render.js';
import { Account } from '../../common/dba/Account.js';

export class FvcContactList extends FScrollViewContent {
  protected _fList: SimpleLongListFragment;

  constructor() {
    super();
    this._fList = new SimpleLongListFragment();
    this._fList.setDataSource(this);
    this.setChild("list", this._fList);
  }

  getUrlForLongListFragment(_fGrid: unknown, fromId: string | null): string {
    let url = "api/user/followers?user_id=";
    if (Account) {
      url += Account.getId();
    }
    if (fromId) {
      url += "&before_id=" + fromId;
    }
    return url;
  }

  createInfoFragmentForLongListFragment(_fGrid: unknown, id: string): FUserInfo {
    let f = new FUserInfo();
    f.setDelegate(this);
    f.setUserId(id);
    return f;
  }

  onClickInUserInfoFragment(_fUserInfo: FUserInfo, userId: string): void {
    let target = new ChatTarget();
    target.setId(userId);
    target.setIdType(SocialItem.TYPE.USER);
    let v = new View();
    let f = new FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Chat");
  }

  _renderContentOnRender(render: Render): void {
    this._fList.attachRender(render);
    this._fList.render();
  }
}
