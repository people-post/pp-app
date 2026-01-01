import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { T_DATA } from '../../common/plt/Events.js';
import { IdolWeb3PostIdLoader } from './IdolWeb3PostIdLoader.js';
import { FPostList } from './FPostList.js';
import { AbWeb3New } from './AbWeb3New.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';

export class FvcWeb3Explorer extends FScrollViewContent {
  #fPosts;
  #fBtnNew;

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
