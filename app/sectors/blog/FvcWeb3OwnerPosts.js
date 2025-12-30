import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';

export class FvcWeb3OwnerPosts extends FScrollViewContent {
  #loader;
  #fPosts;
  #fBtnNew;

  constructor() {
    super();
    this.#loader = new blog.OwnerWeb3PostIdLoader();
    this.#loader.setDelegate(this);
    this.#fPosts = new blog.FPostList();
    this.#fPosts.setDataSource(this);
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(this.#loader);
    this.setChild("posts", this.#fPosts);

    this.setPreferredWidth({"min" : 320, "best" : 2048, "max" : 0});

    this.#fBtnNew = new blog.AbWeb3New();
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
    case plt.T_DATA.NEW_OWNER_POST:
      if (this.#loader.getOwnerId() == dba.Account.getId()) {
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcWeb3OwnerPosts = FvcWeb3OwnerPosts;
}
