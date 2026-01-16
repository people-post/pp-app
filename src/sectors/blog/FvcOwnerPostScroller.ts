import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import type { SocialItem } from '../../types/basic.js';
import { OwnerPostIdLoader } from './OwnerPostIdLoader.js';
import { FPostList } from './FPostList.js';
import type { ActionButton } from '../../common/gui/ActionButton.js';
import type { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcOwnerPostScroller extends FScrollViewContent {
  // Note: For brief display only
  #fPosts: FPostList;
  #loader: OwnerPostIdLoader;

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

  isReloadable(): boolean { return true; }
  hasHiddenTopBuffer(): boolean { return this.#fPosts.hasBufferOnTop(); }

  setOwnerId(id: string | null): void { this.#loader.setOwnerId(id); }
  setAnchorPostId(id: unknown): void { this.#loader.setAnchorPostId(id); }

  reload(): void { this.#fPosts.reset(); }

  scrollToTop(): void { this.#fPosts.scrollToTop(); }
  onScrollFinished(): void { this.#fPosts.onScrollFinished(); }

  onIdUpdatedInLongListIdLoader(_loader: LongListIdLoader): void { this.#fPosts.onScrollFinished(); }

  onInfoFragmentCreatedInPostListFragment(_fPosts: FPostList, fInfo: unknown): void {
    const fInfoWithSize = fInfo as { setSizeType?: (size: string) => void };
    if (fInfoWithSize.setSizeType) {
      fInfoWithSize.setSizeType(SocialItem.T_LAYOUT.EXT_BRIEF);
    }
  }

  _renderContentOnRender(render: Render): void {
    this.#fPosts.attachRender(render);
    this.#fPosts.render();
  }
}
