import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { FTabbedPane } from '../../lib/ui/controllers/fragments/FTabbedPane.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import type { SocialItem } from '../../types/basic.js';
import { Article } from '../../common/datatypes/Article.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { FPost } from './FPost.js';
import { FPostList } from './FPostList.js';
import { FvcPostEditor } from './FvcPostEditor.js';
import { FTaggedCommentList } from './FTaggedCommentList.js';
import { CommentIdLoader } from '../../common/social/CommentIdLoader.js';
import { Web3CommentIdLoader } from '../../common/social/Web3CommentIdLoader.js';
import { FCommentInput } from '../../common/social/FCommentInput.js';
import { Blog } from '../../common/dba/Blog.js';
import { Groups } from '../../common/dba/Groups.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Utilities as blogUtilities } from './Utilities.js';
import { Env } from '../../common/plt/Env.js';
import { Api } from '../../common/plt/Api.js';
import type { Post } from '../../types/blog.js';
import type { Article as ArticleType } from '../../common/datatypes/Article.js';
import { Account } from '../../common/dba/Account.js';

const _CPT_POST = {
  MAIN : `<div id="__ID_POST__"></div>
  <div class="pad5px flex space-between">
    <div id="__ID_BTN_PREV__"></div>
    <div id="__ID_BTN_NEXT__"></div>
  </div>
  <div id="__ID_COMMENTS__" class="post-comment"></div>
  <div id="__ID_INPUT__" class="sticky bottom0px"></div>`,
} as const;

class PPost extends Panel {
  #pPost: PanelWrapper;
  #pBtnPrev: PanelWrapper;
  #pBtnNext: PanelWrapper;
  #pComments: PanelWrapper;
  #pInput: PanelWrapper;

  constructor() {
    super();
    this.#pPost = new PanelWrapper();
    this.#pBtnPrev = new PanelWrapper();
    this.#pBtnNext = new PanelWrapper();
    this.#pComments = new PanelWrapper();
    this.#pInput = new PanelWrapper();
  }

  getPostPanel(): PanelWrapper { return this.#pPost; }
  getBtnPrevPanel(): PanelWrapper { return this.#pBtnPrev; }
  getBtnNextPanel(): PanelWrapper { return this.#pBtnNext; }
  getCommentsPanel(): PanelWrapper { return this.#pComments; }
  getInputPanel(): PanelWrapper { return this.#pInput; }

  _renderFramework(): string {
    let s = _CPT_POST.MAIN;
    s = s.replace("__ID_POST__", this._getSubElementId("T"));
    s = s.replace("__ID_BTN_PREV__", this._getSubElementId("P"));
    s = s.replace("__ID_BTN_NEXT__", this._getSubElementId("N"));
    s = s.replace("__ID_COMMENTS__", this._getSubElementId("C"));
    s = s.replace("__ID_INPUT__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pPost.attach(this._getSubElementId("T"));
    this.#pBtnPrev.attach(this._getSubElementId("P"));
    this.#pBtnNext.attach(this._getSubElementId("N"));
    this.#pComments.attach(this._getSubElementId("C"));
    this.#pInput.attach(this._getSubElementId("I"));
  }
};

export class FvcPost extends FScrollViewContent {
  #fPost: FPost;
  #btnPrev: Button;
  #btnNext: Button;
  #cIdLoader: CommentIdLoader | Web3CommentIdLoader;
  #fTabbedComments: FTabbedPane | null = null;
  #fAllComments: FPostList;
  #fBtnEdit: ActionButton;
  #fInput: FCommentInput;
  #postId: SocialItemId = new SocialItemId();

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

    if (Env.isWeb3()) {
      this.#cIdLoader = new Web3CommentIdLoader();
    } else {
      this.#cIdLoader = new CommentIdLoader();
    }
    this.#cIdLoader.setDelegate(this);
    this.#fAllComments = new FPostList();
    this.#fAllComments.setEnableTopBuffer(false);
    this.#fAllComments.setLoader(this.#cIdLoader);
    this.#fAllComments.setDataSource(this);
    this.#fAllComments.setDelegate(this);

    this.#fBtnEdit = new ActionButton();
    this.#fBtnEdit.setIcon(ActionButton.T_ICON.EDIT);
    this.#fBtnEdit.setDelegate(this);

    this.#fInput = new FCommentInput();
    this.#fInput.setDelegate(this);
    this.setChild("input", this.#fInput);
  }

  getActionButton(): ActionButton | null {
    let post = Blog.getPost(this.#postId);
    if (this.#isPostEditable(post)) {
      return this.#fBtnEdit;
    }
    return null;
  }

  setPostId(id: SocialItemId): void { this.#postId = id; }

  onGuiActionButtonClick(_fActionButton: ActionButton): void { this.#onEdit(); }

  onSimpleButtonClicked(fBtn: Button): void { this.#onNavToPost(fBtn.getValue() as SocialItemId | null); }
  onScrollFinished(): void { this.#fAllComments.onScrollFinished(); }

  isUserAdminOfCommentTargetInPostListFragment(_fPostList: FPostList, targetId: string): boolean {
    // Sanity check
    if (targetId != this.#postId.getValue()) {
      return false;
    }

    let post = Blog.getPost(this.#postId);
    let uid = Account.getId();
    return !!(uid && post && uid == post.getOwnerId());
  }

  getContextOptionsForArticleInPostListFragment(_fPostList: FPostList, article: ArticleType): Array<{name: string; value: string}> {
    return this.#getTaggingOptions(article);
  }

  onCommentPostedInCommentInputFragment(_fInput: FCommentInput): void { this.#fAllComments.reset(); }
  onIdUpdatedInLongListIdLoader(_loader: unknown): void {
    this.#fAllComments.onScrollFinished();
  }
  onInfoFragmentCreatedInPostListFragment(_fPostList: FPostList, fInfo: unknown): void {
    (fInfo as {setSizeType(type: string): void}).setSizeType(SocialItem.T_LAYOUT.EXT_COMMENT);
  }
  onArticleContextOptionClickedInPostListFragment(_fPostList: FPostList, value: string, articleId: string): void {
    this.#asyncTagCommentArticle(value, articleId);
  }
  onTaggedCommentListFragmentRequestUntagCommentArticle(_fCommentList: FTaggedCommentList,
                                                        articleId: string): void {
    let tagId = _fCommentList.getTagId();
    if (tagId) {
      this.#asyncUntagCommentArticle(tagId, articleId);
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
    case T_DATA.USER_PUBLIC_PROFILES:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      break;
    case T_DATA.POST:
      this.#onPostUpdate(data as Post);
      break;
    case T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Panel): void {
    let panel = new PPost();
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

    let rPost = this.#getRealPost();
    if (this.#isPostCommentable(rPost)) {
      this.#renderComments(panel.getCommentsPanel(), rPost);
      p = panel.getInputPanel();
      this.#fInput.setThreadId(rPost.getSocialId());
      this.#fInput.setTargetHashtagIds(rPost.getHashtagIds());
      this.#fInput.attachRender(p);
      this.#fInput.render();
    }
  }

  #isPostEditable(post: Post | null): boolean {
    if (!post) {
      return false;
    }

    if (Env.isWeb3()) {
      return false;
    }

    if (!post.isEditable()) {
      return false;
    }

    // Currently only owner can edit article
    // TODO: Support users with permissions, there are legal considerations
    let userIds = [ post.getOwnerId() ];
    if (userIds.indexOf(Account.getId()) < 0) {
      return false;
    }
    return true;
  }

  #isPostCommentable(post: Post | null): boolean {
    if (!post) {
      return false;
    }
    return post.isSocialable();
  }

  #getRealPost(): Post | null {
    let post = Blog.getPost(this.#postId);
      return post && post.isRepost() ? Blog.getPost(post.getLinkToSocialId())
                                   : post;
  }

  #getPrevPostId(): SocialItemId | null {
    return (this._dataSource as any)
               ? (this._dataSource as any).getPreviousPostIdForPostContentFragment(this)
               : null;
  }

  #getNextPostId(): SocialItemId | null {
    return (this._dataSource as any)
               ? (this._dataSource as any).getNextPostIdForPostContentFragment(this)
               : null;
  }

  #onNavToPost(id: SocialItemId | null): void {
    if (id) {
      this.#postId = id;
      if (this._delegate) {
        (this._delegate as any).onPostIdChangedInPostContentFragment(this, id);
      }
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
    }
  }

  #onPostUpdate(updatedPost: Post): void {
    let post = Blog.getPost(this.#postId);
    if (post && blogUtilities.isPostRelated(updatedPost, post)) {
      this.render();
    }
  }

  #onEdit(): void {
    let post = Blog.getPost(this.#postId);
    if (post) {
      let v = new View();
      let f = new FvcPostEditor();
      f.setPost(post);
      v.setContentFragment(f);
      this.onFragmentRequestShowView(this, v, "Edit post " + post.getId());
    }
  }

  #renderComments(panel: PanelWrapper, post: Post): void {
    if (!panel) {
      return;
    }
    this.#cIdLoader.setThreadId(post.getSocialId(), post.getHashtagIds());
    let tagIds = post.getCommentTags();
    if (tagIds.length > 0) {
      let isAdmin =
          Account.isWebOwner() && post.getOwnerId() == Account.getId();

      this.#fTabbedComments = new FTabbedPane();
      this.#fTabbedComments.addPane({name : "All", value : "ALL"},
                                    this.#fAllComments);
      for (let tid of tagIds) {
        let f = new FTaggedCommentList();
        f.setIsAdmin(isAdmin);
        f.setTagId(tid);
        f.setCommentIds(post.getTaggedCommentIds(tid));
        f.setDelegate(this);

        let t = Groups.getTag(tid);
        this.#fTabbedComments.addPane(
            {name : t ? t.getName() : "...", value : tid}, f);
      }
      this.#fTabbedComments.setDefaultPane("ALL");
      this.setChild("comments", this.#fTabbedComments);
      this.#fTabbedComments.attachRender(panel);
      this.#fTabbedComments.render();
    } else {
      this.setChild("comments", this.#fAllComments);
      this.#fAllComments.attachRender(panel);
      this.#fAllComments.render();
    }
  }

  #getTaggingOptions(article: ArticleType): Array<{name: string; value: string}> {
    let ops: Array<{name: string; value: string}> = [];

    // User must be webOwner
    if (!Account.isWebOwner()) {
      return ops;
    }

    let post = Blog.getPost(this.#postId);
    if (!post) {
      return ops;
    }

    // Post owner must be user
    if (post.getOwnerId() != Account.getId()) {
      return ops;
    }

    // Sanity check
    let sid = article.getReplyToSocialId();
    if (!sid) {
      return ops;
    }
    // TODO: Currently tagging for repost is not supported because of following
    // check. Maybe consider provide support
    if (sid.getType() != SocialItem.TYPE.HASHTAG) {
      if (sid.getValue() != this.#postId.getValue()) {
        return ops;
      }
    }

    for (let t of WebConfig.getTags()) {
      ops.push({name : t.getName(), value : t.getId()});
    }
    return ops;
  }

  #asyncTagCommentArticle(tagId: string, articleId: string): void {
    let url = "api/social/tag_comment_article";
    let fd = new FormData();
    fd.append("item_id", this.#postId.getValue()!);
    fd.append("item_type", this.#postId.getType()!);
    fd.append("article_id", articleId);
    fd.append("tag_id", tagId);
    Api.asFragmentPost(this, url, fd)
        .then((d: {article: unknown}) => this.#onTagCommentRRR(d));
  }

  #onTagCommentRRR(data: {article: unknown}): void {
        Blog.updateArticle(new Article(data.article));
  }

  #asyncUntagCommentArticle(tagId: string, articleId: string): void {
    let url = "api/social/untag_comment_article";
    let fd = new FormData();
    fd.append("item_id", this.#postId.getValue()!);
    fd.append("item_type", this.#postId.getType()!);
    fd.append("article_id", articleId);
    fd.append("tag_id", tagId);
    Api.asFragmentPost(this, url, fd)
        .then((d: {article: unknown}) => this.#onUntagCommentRRR(d));
  }

  #onUntagCommentRRR(data: {article: unknown}): void {
        Blog.updateArticle(new Article(data.article));
  }
}
