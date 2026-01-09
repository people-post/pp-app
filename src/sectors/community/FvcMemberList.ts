import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SimpleLongListFragment } from '../../common/gui/SimpleLongListFragment.js';
import { T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcMemberList extends FScrollViewContent {
  protected _fList: SimpleLongListFragment;
  protected _communityId: string | null = null;

  constructor() {
    super();
    this._fList = new SimpleLongListFragment();
    this._fList.setDataSource(this);

    this.setChild("list", this._fList);
  }

  setCommunityId(communityId: string | null): void { this._communityId = communityId; }

  getUrlForLongListFragment(_fGrid: unknown, fromId: string | null): string {
    let url = "api/community/members?community_id=" + this._communityId;
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
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }

  _renderContentOnRender(render: Render): void {
    this._fList.attachRender(render);
    this._fList.render();
  }
}
