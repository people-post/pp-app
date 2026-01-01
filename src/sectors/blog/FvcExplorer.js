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

export class FvcExplorer extends FScrollViewContent {
  #fmSearch;
  #fPosts;
  #fBtnNew;

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

  initFromUrl(urlParam) {
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      this.#fPosts.switchToItem(id);
    }
  }

  getUrlParamString() {
    let id = this.#fPosts.getCurrentId();
    return id ? URL_PARAM.ID + "=" + id : "";
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
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    this.#fPosts.attachRender(render);
    this.#fPosts.render();
  }
};
