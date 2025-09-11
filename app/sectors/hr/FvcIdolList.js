(function(hr) {
class FvcIdolList extends ui.FScrollViewContent {
  #fUsers;
  #idLoader;
  #fBtnAdd;

  constructor() {
    super();
    if (plt.Env.isWeb3()) {
      this.#idLoader = new hr.Web3UserIdolIdListLoader();
      this.#idLoader.setDelegate(this);
    } else {
      // TODO: Port FvcLegacyIdolList to here
    }

    this.#fUsers = new hr.FUserList();
    this.#fUsers.setIdLoader(this.#idLoader);
    this.#fUsers.setDataSource(this);
    this.setChild("users", this.#fUsers);

    this.#fBtnAdd = new gui.ActionButton();
    this.#fBtnAdd.setIcon(gui.ActionButton.T_ICON.NEW);
    this.#fBtnAdd.setDelegate(this);
  }

  getActionButton() {
    if (dba.Account.getId() == this.#idLoader.getUserId()) {
      return this.#fBtnAdd;
    }
    return null;
  }

  setUserId(userId) { this.#idLoader.setUserId(userId); }

  onIdUpdatedInLongListIdLoader(loader) { this.#fUsers.onScrollFinished(); }

  onGuiActionButtonClick(fBtnAction) {
    switch (fBtnAction) {
    case this.#fBtnAdd:
      this.#onAddIdol();
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render) {
    this.#fUsers.attachRender(render);
    this.#fUsers.render();
  }

  #onAddIdol() {
    let v = new ui.View();
    v.setContentFragment(new hr.FvcAddIdol());
    this._owner.onFragmentRequestShowView(this, v, "Add idol");
  }
};

hr.FvcIdolList = FvcIdolList;
}(window.hr = window.hr || {}));
