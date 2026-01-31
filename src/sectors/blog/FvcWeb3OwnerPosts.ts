import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { OwnerWeb3PostIdLoader } from './OwnerWeb3PostIdLoader.js';
import { FPostList } from './FPostList.js';
import { AbWeb3New } from './AbWeb3New.js';
import type { ActionButton } from '../../common/gui/ActionButton.js';
import type { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import type Render from '../../lib/ui/renders/Render.js';
import { Account } from '../../common/dba/Account.js';

export class FvcWeb3OwnerPosts extends FScrollViewContent {
  #loader: OwnerWeb3PostIdLoader;
  #fPosts: FPostList;
  #fBtnNew: AbWeb3New;

  constructor() {
    super();
    this.#loader = new OwnerWeb3PostIdLoader();
    this.#loader.setDelegate(this);
    this.#fPosts = new FPostList();
    this.#fPosts.setDataSource(this);
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(this.#loader);
    this.setChild("posts", this.#fPosts);

    this.setPreferredWidth({"min" : 320, "best" : 2048, "max" : 0});

    this.#fBtnNew = new AbWeb3New();
  }

  isReloadable(): boolean { return true; }
  hasHiddenTopBuffer(): boolean { return this.#fPosts.hasBufferOnTop(); }

  setOwnerId(id: string | null): void { this.#loader.setOwnerId(id); }

  getActionButton(): ActionButton | null {
    return this.#fBtnNew.isAvailable() ? this.#fBtnNew : null;
  }

  onIdUpdatedInLongListIdLoader(_loader: LongListIdLoader): void { this.#fPosts.onScrollFinished(); }
  onInfoFragmentCreatedInPostListFragment(_fPosts: FPostList, fInfo: unknown): void {
    const fInfoWithSize = fInfo as { setSizeType?: (size: string) => void };
    if (fInfoWithSize.setSizeType) {
      fInfoWithSize.setSizeType(SocialItem.T_LAYOUT.EXT_BRIEF);
    }
  }

  reload(): void { this.#fPosts.reset(); }

  scrollToTop(): void { this.#fPosts.scrollToTop(); }
  onScrollFinished(): void { this.#fPosts.onScrollFinished(); }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.NEW_OWNER_POST:
      if (Account && this.#loader.getOwnerId() == Account.getId()) {
        this.#fPosts.reset();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    let panel = new PanelWrapper();
    panel.setClassName("h100");
    render.wrapPanel(panel);

    this.#fPosts.attachRender(panel);
    this.#fPosts.render();
  }
}
