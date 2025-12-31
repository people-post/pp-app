import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { ConstListIdLoader } from '../../common/plt/ConstListIdLoader.js';
import { FPostList } from './FPostList.js';

export class FTaggedCommentList extends Fragment {
  #idLoader;
  #fComments;
  #tagId;
  #isAdmin = false;

  constructor() {
    super();
    this.#idLoader = new ConstListIdLoader();
    this.#fComments = new FPostList();
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
    fInfo.setSizeType(SocialItem.T_LAYOUT.EXT_COMMENT);
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FTaggedCommentList = FTaggedCommentList;
}
