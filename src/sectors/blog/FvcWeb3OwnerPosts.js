import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { OwnerWeb3PostIdLoader } from './OwnerWeb3PostIdLoader.js';
import { FPostList } from './FPostList.js';
import { AbWeb3New } from './AbWeb3New.js';

export class FvcWeb3OwnerPosts extends FScrollViewContent {
  #loader;
  #fPosts;
  #fBtnNew;

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

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fPosts.hasBufferOnTop(); }

  setOwnerId(id) { this.#loader.setOwnerId(id); }

  getActionButton() {
    return this.#fBtnNew.isAvailable() ? this.#fBtnNew : null;
  }

  onIdUpdatedInLongListIdLoader(loader) { this.#fPosts.onScrollFinished(); }
  onInfoFragmentCreatedInPostListFragment(fPosts, fInfo) {
    fInfo.setSizeType(SocialItem.T_LAYOUT.EXT_BRIEF);
  }

  reload() { this.#fPosts.reset(); }

  scrollToTop() { this.#fPosts.scrollToTop(); }
  onScrollFinished() { this.#fPosts.onScrollFinished(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.NEW_OWNER_POST:
      if (this.#loader.getOwnerId() == window.dba.Account.getId()) {
        this.#fPosts.reset();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let panel = new PanelWrapper();
    panel.setClassName("h100");
    render.wrapPanel(panel);

    this.#fPosts.attachRender(panel);
    this.#fPosts.render();
  }
};
