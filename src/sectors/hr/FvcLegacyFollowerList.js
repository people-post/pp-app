import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SimpleLongListFragment } from '../../common/gui/SimpleLongListFragment.js';
import { T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';

export class FvcLegacyFollowerList extends FScrollViewContent {
  constructor() {
    super();
    this._fList = new SimpleLongListFragment();
    this._fList.setDataSource(this);
    this.setChild("list", this._fList);

    this._userId = null;
  }

  setUserId(userId) { this._userId = userId; }

  getUrlForLongListFragment(fGrid, fromId) {
    let url = "api/user/followers?user_id=" + this._userId;
    if (fromId) {
      url += "&before_id=" + fromId;
    }
    return url;
  }

  createInfoFragmentForLongListFragment(fGrid, id) {
    let f = new S.hr.FUserInfo();
    f.setDelegate(this);
    f.setUserId(id);
    return f;
  }

  onClickInUserInfoFragment(fUserInfo, userId) {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hr = window.hr || {};
  window.hr.FvcLegacyFollowerList = FvcLegacyFollowerList;
}
