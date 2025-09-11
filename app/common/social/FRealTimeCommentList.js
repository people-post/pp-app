(function(socl) {
class FRealTimeCommentList extends ui.Fragment {
  #fList;
  #comments = [];

  constructor() {
    super();
    this.#fList = new ui.FSimpleFragmentList();
  }

  setComments(cs) { this.#comments = cs; }

  shouldShowAdminOptionsInCommentFragment(fComment) {
    return this._dataSource.shouldShowAdminOptionsInCommentListFragment(this);
  }

  _renderOnRender(render) {
    this.#fList.clear();
    for (let c of this.#comments) {
      let f = new socl.FRealTimeComment();
      f.setComment(c);
      f.setDataSource(this);
      f.setDelegate(this);
      this.#fList.append(f);
    }

    this.#fList.attachRender(render);
    this.#fList.render();
  }
};

socl.FRealTimeCommentList = FRealTimeCommentList;
}(window.socl = window.socl || {}));
