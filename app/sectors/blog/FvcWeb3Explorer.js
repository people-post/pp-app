import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcWeb3Explorer extends FScrollViewContent {
  #fPosts;
  #fBtnNew;

  constructor() {
    super();
    let loader = new blog.IdolWeb3PostIdLoader();
    loader.setDelegate(this);
    this.#fPosts = new blog.FPostList();
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(loader);
    this.setChild("posts", this.#fPosts);

    this.#fBtnNew = new blog.AbWeb3New();
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fPosts.hasBufferOnTop(); }

  reload() { this.#fPosts.reset(); }

  scrollToTop() { this.#fPosts.scrollToTop(); }

  getActionButton() {
    return this.#fBtnNew.isAvailable() ? this.#fBtnNew : null;
  }

  onScrollFinished() { this.#fPosts.onScrollFinished(); }

  onIdUpdatedInLongListIdLoader(loader) { this.#fPosts.onScrollFinished(); }
  onInfoFragmentCreatedInPostListFragment(fPosts, fInfo) {
    fInfo.setSizeType(dat.SocialItem.T_LAYOUT.LARGE);
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
  window.blog.FvcWeb3Explorer = FvcWeb3Explorer;
}
