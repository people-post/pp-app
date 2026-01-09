import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FPost } from './FPost.js';
import { Blog } from '../../common/dba/Blog.js';
import { Utilities } from './Utilities.js';
import { FRealTimeComments } from '../../common/social/FRealTimeComments.js';

const _CPT_POST_NAVIGATOR = {
  MAIN : `<div id="__ID_POST__"></div>
  <div class="pad5px flex space-between">
    <div id="__ID_BTN_PREV__"></div>
    <div id="__ID_BTN_NEXT__"></div>
  </div>
  <div id="__ID_COMMENT__" class="post-comment"></div>`,
} as const;

export class PPostNavigator extends Panel {
  #pPost: PanelWrapper;
  #pBtnPrev: PanelWrapper;
  #pBtnNext: PanelWrapper;
  #pComment: PanelWrapper;

  constructor() {
    super();
    this.#pPost = new PanelWrapper();
    this.#pBtnPrev = new PanelWrapper();
    this.#pBtnNext = new PanelWrapper();
    this.#pComment = new PanelWrapper();
  }

  getPostPanel(): PanelWrapper { return this.#pPost; }
  getBtnPrevPanel(): PanelWrapper { return this.#pBtnPrev; }
  getBtnNextPanel(): PanelWrapper { return this.#pBtnNext; }
  getCommentPanel(): PanelWrapper { return this.#pComment; }

  _renderFramework(): string {
    let s = _CPT_POST_NAVIGATOR.MAIN;
    s = s.replace("__ID_POST__", this._getSubElementId("T"));
    s = s.replace("__ID_BTN_PREV__", this._getSubElementId("P"));
    s = s.replace("__ID_BTN_NEXT__", this._getSubElementId("N"));
    s = s.replace("__ID_COMMENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pPost.attach(this._getSubElementId("T"));
    this.#pBtnPrev.attach(this._getSubElementId("P"));
    this.#pBtnNext.attach(this._getSubElementId("N"));
    this.#pComment.attach(this._getSubElementId("C"));
  }
}

interface PostNavigatorDataSource {
  getPrevPostIdForPostFragment(f: FPostNavigator): SocialItemId | null;
  getNextPostIdForPostFragment(f: FPostNavigator): SocialItemId | null;
}

interface PostNavigatorDelegate {
  onPostIdChangedInPostFragment(f: FPostNavigator, id: SocialItemId): void;
}

class FPostNavigator extends Fragment {
  #fPost: FPost;
  #btnPrev: Button;
  #btnNext: Button;
  #fComments: FRealTimeComments;
  #postId: SocialItemId = new SocialItemId(); // Notice: Id from datasource has
                                    // priority if datasource is set.
  protected _dataSource!: PostNavigatorDataSource;
  protected _delegate!: PostNavigatorDelegate;

  constructor() {
    super();
    this.#fPost = new FPost();
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

    this.#fComments = new FRealTimeComments();
    this.setChild("comment", this.#fComments);
  }

  getPostId(): SocialItemId { return this.#postId; }

  setPostId(id: SocialItemId): void { this.#postId = id; }

  onSimpleButtonClicked(fBtn: Button): void { this.#onNavToPost(fBtn.getValue() as SocialItemId); }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
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
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Panel): void {
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

  #isUserPostAdmin(userId: string | null, post: unknown): boolean {
    if (!userId || !post) {
      return false;
    }
    const postWithOwner = post as { getOwnerId: () => string; getAuthorId: () => string };
    return userId == postWithOwner.getOwnerId() && userId == postWithOwner.getAuthorId();
  }

  #getPrevPostId(): SocialItemId | null {
    return this._dataSource.getPrevPostIdForPostFragment(this);
  }

  #getNextPostId(): SocialItemId | null {
    return this._dataSource.getNextPostIdForPostFragment(this);
  }

  #onNavToPost(id: SocialItemId): void {
    this.setPostId(id);
    this._delegate.onPostIdChangedInPostFragment(this, id);
    this.render();
  }

  #onPostUpdate(updatePost: unknown): void {
    let post = Blog.getPost(this.#postId);
    if (Utilities.isPostRelated(updatePost, post)) {
      this.render();
    }
  }

  #renderComments(panel: PanelWrapper | null): void {
    if (!panel) {
      return;
    }
    let post = Blog.getPost(this.#postId);
    if (!post) {
      return;
    }
    let realPost =
        post.isRepost() ? Blog.getPost(post.getLinkToSocialId()) : post;
    if (!realPost) {
      return;
    }

    if (!realPost.isSocialable()) {
      return;
    }
    this.#fComments.setThreadId(realPost.getId(), realPost.getSocialItemType());
    if (window.dba?.Account) {
      this.#fComments.setIsAdmin(
          this.#isUserPostAdmin(window.dba.Account.getId(), realPost));
    }
    this.#fComments.attachRender(panel);
    this.#fComments.render();
  }
}

export { FPostNavigator };
