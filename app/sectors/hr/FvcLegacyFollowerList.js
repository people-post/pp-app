
class FvcLegacyFollowerList extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fList = new gui.SimpleLongListFragment();
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
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }
};

hr.FvcLegacyFollowerList = FvcLegacyFollowerList;
}(window.hr = window.hr || {}));
