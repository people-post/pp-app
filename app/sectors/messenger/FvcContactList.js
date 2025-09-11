(function(msgr) {
class FvcContactList extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fList = new gui.SimpleLongListFragment();
    this._fList.setDataSource(this);
    this.setChild("list", this._fList);
  }

  getUrlForLongListFragment(fGrid, fromId) {
    let url = "api/user/followers?user_id=" + dba.Account.getId();
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
    let target = new dat.ChatTarget();
    target.setId(userId);
    target.setIdType(dat.SocialItem.TYPE.USER);
    let v = new ui.View();
    let f = new msgr.FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Chat");
  }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }
};

msgr.FvcContactList = FvcContactList;
}(window.msgr = window.msgr || {}));
