import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { SearchIconOperator } from '../../lib/ui/animators/SearchIconOperator.js';
import { FSearchMenu } from '../../common/search/FSearchMenu.js';
import { IdolPostIdLoader } from './IdolPostIdLoader.js';
import { FPostList } from './FPostList.js';
import { AbNew } from './AbNew.js';
import type { ActionButton } from '../../common/gui/ActionButton.js';
import type { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcExplorer extends FScrollViewContent {
  #fmSearch: FHeaderMenu;
  #fPosts: FPostList;
  #fBtnNew: AbNew;

  constructor() {
    super();
    this.#fmSearch = new FHeaderMenu();
    this.#fmSearch.setIcon(ICON.M_SEARCH, new SearchIconOperator());
    let f = new FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);

    let loader = new IdolPostIdLoader();
    loader.setDelegate(this);
    this.#fPosts = new FPostList();
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(loader);
    this.setChild("posts", this.#fPosts);

    this.#fBtnNew = new AbNew();
  }

  initFromUrl(urlParam: URLSearchParams): void {
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      this.#fPosts.switchToItem(id);
    }
  }

  getUrlParamString(): string {
    let id = this.#fPosts.getCurrentId();
    return id ? URL_PARAM.ID + "=" + id : "";
  }

  isReloadable(): boolean { return true; }
  hasHiddenTopBuffer(): boolean { return this.#fPosts.hasBufferOnTop(); }

  reload(): void { this.#fPosts.reset(); }

  scrollToTop(): void { this.#fPosts.scrollToTop(); }

  getActionButton(): ActionButton | null {
    return this.#fBtnNew.isAvailable() ? this.#fBtnNew : null;
  }

  getMenuFragments(): Fragment[] { return [ this.#fmSearch ]; }

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
