
class FTaggedCommentList extends ui.Fragment {
  #idLoader;
  #fComments;
  #tagId;
  #isAdmin = false;

  constructor() {
    super();
    this.#idLoader = new plt.ConstListIdLoader();
    this.#fComments = new blog.FPostList();
    this.#fComments.setEnableTopBuffer(false);
    this.#fComments.setLoader(this.#idLoader);
    this.#fComments.setDataSource(this);
    this.#fComments.setDelegate(this);
    this.setChild("comments", this.#fComments);
  }

  getTagId() { return this.#tagId; }

  setIsAdmin(b) { this.#isAdmin = b; }
  setTagId(id) { this.#tagId = id; }
  setCommentIds(sids) {
    this.#idLoader.setIds(sids.map(sid => sid.toEncodedStr()));
  }

  getContextOptionsForArticleInPostListFragment(fPostList, article) {
    if (this.#isAdmin) {
      return [ {name : "Untag", value : ""} ];
    }
    return null;
  }

  onInfoFragmentCreatedInPostListFragment(fPostList, fInfo) {
    fInfo.setSizeType(dat.SocialItem.T_LAYOUT.EXT_COMMENT);
  }

  onArticleContextOptionClickedInPostListFragment(fPostList, value, articleId) {
    this._delegate.onTaggedCommentListFragmentRequestUntagCommentArticle(
        this, articleId);
  }

  _renderOnRender(render) {
    this.#fComments.attachRender(render);
    this.#fComments.render();
  }
};

blog.FTaggedCommentList = FTaggedCommentList;
}(window.blog = window.blog || {}));
