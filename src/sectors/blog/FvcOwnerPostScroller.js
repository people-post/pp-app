import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { OwnerPostIdLoader } from './OwnerPostIdLoader.js';
import { FPostList } from './FPostList.js';

export class FvcOwnerPostScroller extends FScrollViewContent {
  // Note: For brief display only
  #fPosts;
  #loader;

  constructor() {
    super();
    this.#loader = new OwnerPostIdLoader();
    this.#loader.setDelegate(this);
    this.#fPosts = new FPostList();
    this.#fPosts.setDataSource(this);
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(this.#loader);
    this.setChild("posts", this.#fPosts);
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fPosts.hasBufferOnTop(); }

  setOwnerId(id) { this.#loader.setOwnerId(id); }
  setAnchorPostId(id) { this.#loader.setAnchorPostId(id); }

  reload() { this.#fPosts.reset(); }

  scrollToTop() { this.#fPosts.scrollToTop(); }
  onScrollFinished() { this.#fPosts.onScrollFinished(); }

  onIdUpdatedInLongListIdLoader(loader) { this.#fPosts.onScrollFinished(); }

  onInfoFragmentCreatedInPostListFragment(fPosts, fInfo) {
    fInfo.setSizeType(SocialItem.T_LAYOUT.EXT_BRIEF);
  }

  _renderContentOnRender(render) {
    this.#fPosts.attachRender(render);
    this.#fPosts.render();
  }
}
