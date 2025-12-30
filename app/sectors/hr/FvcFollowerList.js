
export class FvcFollowerList extends ui.FScrollViewContent {
  #fUsers;
  #idLoader;

  constructor() {
    super();
    this.#idLoader = new hr.Web3UserFollowerIdListLoader();
    this.#idLoader.setDelegate(this);

    this.#fUsers = new hr.FUserList();
    this.#fUsers.setIdLoader(this.#idLoader);
    this.#fUsers.setDataSource(this);
    this.setChild("users", this.#fUsers);
  }

  setUserId(userId) { this.#idLoader.setUserId(userId); }

  onIdUpdatedInLongListIdLoader(loader) { this.#fUsers.onScrollFinished(); }

  _renderContentOnRender(render) {
    this.#fUsers.attachRender(render);
    this.#fUsers.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hr = window.hr || {};
  window.hr.FvcFollowerList = FvcFollowerList;
}
