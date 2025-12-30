import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { C } from '../../lib/framework/Constants.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';

export class FvcExplorer extends FScrollViewContent {
  #fmSearch;
  #fPosts;
  #fBtnNew;

  constructor() {
    super();
    this.#fmSearch = new FHeaderMenu();
    this.#fmSearch.setIcon(C.ICON.M_SEARCH, new SearchIconOperator());
    let f = new srch.FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);

    let loader = new blog.IdolPostIdLoader();
    loader.setDelegate(this);
    this.#fPosts = new blog.FPostList();
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(loader);
    this.setChild("posts", this.#fPosts);

    this.#fBtnNew = new blog.AbNew();
  }

  initFromUrl(urlParam) {
    let id = urlParam.get(C.URL_PARAM.ID);
    if (id) {
      this.#fPosts.switchToItem(id);
    }
  }

  getUrlParamString() {
    let id = this.#fPosts.getCurrentId();
    return id ? C.URL_PARAM.ID + "=" + id : "";
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fPosts.hasBufferOnTop(); }

  reload() { this.#fPosts.reset(); }

  scrollToTop() { this.#fPosts.scrollToTop(); }

  getActionButton() {
    return this.#fBtnNew.isAvailable() ? this.#fBtnNew : null;
  }

  getMenuFragments() { return [ this.#fmSearch ]; }

  onScrollFinished() { this.#fPosts.onScrollFinished(); }

  onIdUpdatedInLongListIdLoader(loader) { this.#fPosts.onScrollFinished(); }
  onInfoFragmentCreatedInPostListFragment(fPosts, fInfo) {
    fInfo.setSizeType(SocialItem.T_LAYOUT.LARGE);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.NEW_OWNER_POST:
      this.#fPosts.reset();
      break;
    case plt.T_DATA.USER_PROFILE:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    this.#fPosts.attachRender(render);
    this.#fPosts.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcExplorer = FvcExplorer;
}
