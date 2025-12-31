import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { FSocialItemList } from '../../common/gui/FSocialItemList.js';

export class FPostList extends FSocialItemList {
  #loader;

  isPostSelectedInPostInfoFragment(fPostInfo, postId) {
    return this.getCurrentId() == postId.toEncodedStr();
  }

  getPreviousPostIdForPostContentFragment(fvcPost) {
    let sid = this._getIdRecord().findIdBefore(this.getCurrentId());
    return sid ? SocialItemId.fromEncodedStr(sid) : null;
  }
  getNextPostIdForPostContentFragment(fvcPost) {
    let sid = this._getIdRecord().findIdAfter(this.getCurrentId());
    return sid ? SocialItemId.fromEncodedStr(sid) : null;
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
    let sid = SocialItemId.fromEncodedStr(id);
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

    let sid = SocialItemId.fromEncodedStr(id);
    if (!sid) {
      return null;
    }

    let v = new View();
    let f = new blog.FvcPost();
    f.setPostId(sid);
    f.setDataSource(this);
    f.setDelegate(this);
    v.setContentFragment(f);
    return v;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FPostList = FPostList;
}
