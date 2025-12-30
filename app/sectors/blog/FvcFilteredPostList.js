
class FvcFilteredPostList extends ui.FScrollViewContent {
  #fPosts;
  #loader;

  constructor() {
    super();
    this.#loader = new blog.FilteredPostIdLoader();
    this.#loader.setDelegate(this);
    this.#fPosts = new blog.FPostList();
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(this.#loader);
    this.setChild("posts", this.#fPosts);
  }

  setTagId(id) { this.#loader.setTagId(id); }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fPosts.hasBufferOnTop(); }
  reload() { this.#fPosts.reload(); }
  scrollToTop() { this.#fPosts.scrollToTop(); }
  onScrollFinished() { this.#fPosts.onScrollFinished(); }

  onIdUpdatedInLongListIdLoader(loader) { this.#fPosts.onScrollFinished(); }
  onInfoFragmentCreatedInPostListFragment(fPosts, fInfo) {
    fInfo.setSizeType(dat.SocialItem.T_LAYOUT.LARGE);
  }

  _renderContentOnRender(render) {
    this.#fPosts.attachRender(render);
    this.#fPosts.render();
  }
};

blog.FvcFilteredPostList = FvcFilteredPostList;
}(window.blog = window.blog || {}));
