(function(hr) {
class FvcLegacyIdolList extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fList = new gui.SimpleLongListFragment();
    this._fList.setDataSource(this);

    this.setChild("list", this._fList);

    this._fBtnAdd = new gui.ActionButton();
    this._fBtnAdd.setIcon(gui.ActionButton.T_ICON.NEW);
    this._fBtnAdd.setDelegate(this);

    this._userId = null;
  }

  getActionButton() {
    if (dba.Account.getId() == this._userId) {
      return this._fBtnAdd;
    }
    return null;
  }

  setUserId(userId) { this._userId = userId; }

  getUrlForLongListFragment(fGrid, fromId) {
    let url = "api/user/idols?user_id=" + this._userId;
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

  onGuiActionButtonClick(fBtnAction) {
    switch (fBtnAction) {
    case this._fBtnAdd:
      this.#onAddIdol();
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }

  #onAddIdol() {
    let v = new ui.View();
    v.setContentFragment(new hr.FvcAddIdol());
    this._owner.onFragmentRequestShowView(this, v, "Add idol");
  }
};

hr.FvcLegacyIdolList = FvcLegacyIdolList;
}(window.hr = window.hr || {}));
