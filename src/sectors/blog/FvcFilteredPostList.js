import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { FilteredPostIdLoader } from './FilteredPostIdLoader.js';
import { FPostList } from './FPostList.js';

export class FvcFilteredPostList extends FScrollViewContent {
  #fPosts;
  #loader;

  constructor() {
    super();
    this.#loader = new FilteredPostIdLoader();
    this.#loader.setDelegate(this);
    this.#fPosts = new FPostList();
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
    fInfo.setSizeType(SocialItem.T_LAYOUT.LARGE);
  }

  _renderContentOnRender(render) {
    this.#fPosts.attachRender(render);
    this.#fPosts.render();
  }
};
