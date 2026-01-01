import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { T_DATA } from '../../common/plt/Events.js';

const _CPT_POST_NAVIGATOR = {
  MAIN : `<div id="__ID_POST__"></div>
  <div class="pad5px flex space-between">
    <div id="__ID_BTN_PREV__"></div>
    <div id="__ID_BTN_NEXT__"></div>
  </div>
  <div id="__ID_COMMENT__" class="post-comment"></div>`,
};

export class PPostNavigator extends Panel {
  #pPost;
  #pBtnPrev;
  #pBtnNext;
  #pComment;

  constructor() {
    super();
    this.#pPost = new PanelWrapper();
    this.#pBtnPrev = new PanelWrapper();
    this.#pBtnNext = new PanelWrapper();
    this.#pComment = new PanelWrapper();
  }

  getPostPanel() { return this.#pPost; }
  getBtnPrevPanel() { return this.#pBtnPrev; }
  getBtnNextPanel() { return this.#pBtnNext; }
  getCommentPanel() { return this.#pComment; }

  _renderFramework() {
    let s = _CPT_POST_NAVIGATOR.MAIN;
    s = s.replace("__ID_POST__", this._getSubElementId("T"));
    s = s.replace("__ID_BTN_PREV__", this._getSubElementId("P"));
    s = s.replace("__ID_BTN_NEXT__", this._getSubElementId("N"));
    s = s.replace("__ID_COMMENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pPost.attach(this._getSubElementId("T"));
    this.#pBtnPrev.attach(this._getSubElementId("P"));
    this.#pBtnNext.attach(this._getSubElementId("N"));
    this.#pComment.attach(this._getSubElementId("C"));
  }
};

class FPostNavigator extends Fragment {
  #fPost;
  #btnPrev;
  #btnNext;
  #fComments;
  #postId = new SocialItemId(); // Notice: Id from datasource has
                                    // priority if datasource is set.

  constructor() {
    super();
    this.#fPost = new blog.FPost();
    this.#fPost.setDelegate(this);
    this.setChild("post", this.#fPost);

    this.#btnNext = new Button();
    this.#btnNext.setName("Next->");
    this.#btnNext.setValue("NEXT");
    this.#btnNext.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnNext.setDelegate(this);
    this.setChild("btnNext", this.#btnNext);

    this.#btnPrev = new Button();
    this.#btnPrev.setName("<-Prev");
    this.#btnPrev.setValue("PREV");
    this.#btnPrev.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnPrev.setDelegate(this);
    this.setChild("btnPrev", this.#btnPrev);

    this.#fComments = new socl.FRealTimeComments();
    this.setChild("comment", this.#fComments);
  }

  getPostId() { return this.#postId; }

  setPostId(id) { this.#postId = id; }

  onSimpleButtonClicked(fBtn) { this.#onNavToPost(fBtn.getValue()); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.POST_IDS:
      // For nav
      this.render();
      break;
    case T_DATA.POST:
      this.#onPostUpdate(data);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let panel = new PPostNavigator();
    render.wrapPanel(panel);

    let p = panel.getPostPanel();
    this.#fPost.setPostId(this.#postId);
    this.#fPost.attachRender(p);
    this.#fPost.render();

    p = panel.getBtnPrevPanel();
    let id = this.#getPrevPostId();
    this.#btnPrev.setEnabled(!!id);
    this.#btnPrev.setValue(id);
    this.#btnPrev.attachRender(p);
    this.#btnPrev.render();

    p = panel.getBtnNextPanel();
    id = this.#getNextPostId();
    this.#btnNext.setEnabled(!!id);
    this.#btnNext.setValue(id);
    this.#btnNext.attachRender(p);
    this.#btnNext.render();

    this.#renderComments(panel.getCommentPanel());
  }

  #isUserPostAdmin(userId, post) {
    if (!userId || !post) {
      return false;
    }
    return userId == post.getOwnerId() && userId == post.getAuthorId();
  }

  #getPrevPostId() {
    return this._dataSource.getPrevPostIdForPostFragment(this);
  }

  #getNextPostId() {
    return this._dataSource.getNextPostIdForPostFragment(this);
  }

  #onNavToPost(id) {
    this.setPostId(id);
    this._delegate.onPostIdChangedInPostFragment(this, id);
    this.render();
  }

  #onPostUpdate(updatePost) {
    let post = dba.Blog.getPost(this.#postId);
    if (blog.Utilities.isPostRelated(updatePost, post)) {
      this.render();
    }
  }

  #renderComments(panel) {
    let post = dba.Blog.getPost(this.#postId);
    if (!post) {
      return;
    }
    let realPost =
        post.isRepost() ? dba.Blog.getPost(post.getLinkToSocialId()) : post;
    if (!realPost) {
      return;
    }

    if (!realPost.isSocialable()) {
      return;
    }
    this.#fComments.setThreadId(realPost.getId(), realPost.getSocialItemType());
    this.#fComments.setIsAdmin(
        this.#isUserPostAdmin(dba.Account.getId(), realPost));
    this.#fComments.attachRender(panel);
    this.#fComments.render();
  }
};

blog.FPostNavigator = FPostNavigator;


// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PPostNavigator = PPostNavigator;
}
