(function(blog) {
class FPostList extends gui.FSocialItemList {
  #loader;

  isPostSelectedInPostInfoFragment(fPostInfo, postId) {
    return this.getCurrentId() == postId.toEncodedStr();
  }

  getPreviousPostIdForPostContentFragment(fvcPost) {
    let sid = this._getIdRecord().findIdBefore(this.getCurrentId());
    return sid ? dat.SocialItemId.fromEncodedStr(sid) : null;
  }
  getNextPostIdForPostContentFragment(fvcPost) {
    let sid = this._getIdRecord().findIdAfter(this.getCurrentId());
    return sid ? dat.SocialItemId.fromEncodedStr(sid) : null;
  }
  getContextOptionsForPostInfoFragment(fPostInfo, article) {
    return ext.Utilities.optCall(
        this._dataSource, "getContextOptionsForArticleInPostListFragment", this,
        article);
  }

  setLoader(loader) {
    this.#loader = loader;
    this.#loader.setOwner(this);
  }

  isUserAdminOfCommentTargetInPostInfoFragment(fPostInfo, targetId) {
    return ext.Utilities.optCall(this._dataSource,
                                 "isUserAdminOfCommentTargetInPostListFragment",
                                 this, targetId);
  }

  onVisibilityChangeInPostInfoFragment(fPostInfo) { this.reset(); }
  onClickInPostInfoFragment(fPostInfo, postId) {
    this.switchToItem(postId.toEncodedStr());
  }

  onPostIdChangedInPostContentFragment(fvcPost, postId) {
    this.switchToItem(postId.toEncodedStr(), false);
  }

  onContextOptionClickedInPostInfoFragment(fvcPost, value, articleId) {
    ext.Utilities.optCall(this._delegate,
                          "onArticleContextOptionClickedInPostListFragment",
                          this, value, articleId);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.POST_IDS:
      this.reload();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _getIdRecord() { return this.#loader.getIdRecord(); }

  _asyncLoadFrontItems() { this.#loader.asyncLoadFrontItems(); }
  _asyncLoadBackItems() { this.#loader.asyncLoadBackItems(); }

  _createInfoFragment(id) {
    let sid = dat.SocialItemId.fromEncodedStr(id);
    let f = new blog.FPostInfo();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setPostId(sid);
    if (this._delegate) {
      this._delegate.onInfoFragmentCreatedInPostListFragment(this, f);
    }
    return f;
  }

  _createItemView(id) {
    // id is SocialItemId encoded str
    if (!id) {
      return null;
    }

    let sid = dat.SocialItemId.fromEncodedStr(id);
    if (!sid) {
      return null;
    }

    let v = new ui.View();
    let f = new blog.FvcPost();
    f.setPostId(sid);
    f.setDataSource(this);
    f.setDelegate(this);
    v.setContentFragment(f);
    return v;
  }
};

blog.FPostList = FPostList;
}(window.blog = window.blog || {}));
