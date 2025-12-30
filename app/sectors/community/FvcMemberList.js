
export class FvcMemberList extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fList = new gui.SimpleLongListFragment();
    this._fList.setDataSource(this);

    this.setChild("list", this._fList);

    this._communityId = null;
  }

  setCommunityId(communityId) { this._communityId = communityId; }

  getUrlForLongListFragment(fGrid, fromId) {
    let url = "api/community/members?community_id=" + this._communityId;
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
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cmut = window.cmut || {};
  window.cmut.FvcMemberList = FvcMemberList;
}
