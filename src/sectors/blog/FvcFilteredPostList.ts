import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { SocialItem } from '../../types/basic.js';
import { FilteredPostIdLoader } from './FilteredPostIdLoader.js';
import { FPostList } from './FPostList.js';

export class FvcFilteredPostList extends FScrollViewContent {
  #fPosts: FPostList;
  #loader: FilteredPostIdLoader;

  constructor() {
    super();
    this.#loader = new FilteredPostIdLoader();
    this.#loader.setDelegate(this);
    this.#fPosts = new FPostList();
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(this.#loader);
    this.setChild("posts", this.#fPosts);
  }

  setTagId(id: string): void { this.#loader.setTagId(id); }

  isReloadable(): boolean { return true; }
  hasHiddenTopBuffer(): boolean { return this.#fPosts.hasBufferOnTop(); }
  reload(): void { this.#fPosts.reload(); }
  scrollToTop(): void { this.#fPosts.scrollToTop(); }
  onScrollFinished(): void { this.#fPosts.onScrollFinished(); }

  onIdUpdatedInLongListIdLoader(_loader: unknown): void { this.#fPosts.onScrollFinished(); }
  onInfoFragmentCreatedInPostListFragment(_fPosts: FPostList, fInfo: unknown): void {
    (fInfo as {setSizeType(type: string): void}).setSizeType(SocialItem.T_LAYOUT.LARGE);
  }

  _renderContentOnRender(render: Panel): void {
    this.#fPosts.attachRender(render);
    this.#fPosts.render();
  }
};
