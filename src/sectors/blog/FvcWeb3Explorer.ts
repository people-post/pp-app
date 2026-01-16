import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { T_DATA } from '../../common/plt/Events.js';
import { IdolWeb3PostIdLoader } from './IdolWeb3PostIdLoader.js';
import { FPostList } from './FPostList.js';
import { AbWeb3New } from './AbWeb3New.js';
import { SocialItem } from '../../common/interface/SocialItem.js';
import type { ActionButton } from '../../common/gui/ActionButton.js';
import type { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcWeb3Explorer extends FScrollViewContent {
  #fPosts: FPostList;
  #fBtnNew: AbWeb3New;

  constructor() {
    super();
    let loader = new IdolWeb3PostIdLoader();
    loader.setDelegate(this);
    this.#fPosts = new FPostList();
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(loader);
    this.setChild("posts", this.#fPosts);

    this.#fBtnNew = new AbWeb3New();
  }

  isReloadable(): boolean { return true; }
  hasHiddenTopBuffer(): boolean { return this.#fPosts.hasBufferOnTop(); }

  reload(): void { this.#fPosts.reset(); }

  scrollToTop(): void { this.#fPosts.scrollToTop(); }

  getActionButton(): ActionButton | null {
    return this.#fBtnNew.isAvailable() ? this.#fBtnNew : null;
  }

  onScrollFinished(): void { this.#fPosts.onScrollFinished(); }

  onIdUpdatedInLongListIdLoader(_loader: LongListIdLoader): void { this.#fPosts.onScrollFinished(); }
  onInfoFragmentCreatedInPostListFragment(_fPosts: FPostList, fInfo: unknown): void {
    const fInfoWithSize = fInfo as { setSizeType?: (size: string) => void };
    if (fInfoWithSize.setSizeType) {
      fInfoWithSize.setSizeType(SocialItem.T_LAYOUT.LARGE);
    }
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.NEW_OWNER_POST:
      this.#fPosts.reset();
      break;
    case T_DATA.USER_PROFILE:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: Render): void {
    this.#fPosts.attachRender(render);
    this.#fPosts.render();
  }
}
