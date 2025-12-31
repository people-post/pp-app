import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { FTabbedPane } from '../../lib/ui/controllers/fragments/FTabbedPane.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Article } from '../../common/datatypes/Article.js';

const _CPT_POST = {
  MAIN : `<div id="__ID_POST__"></div>
  <div class="pad5px flex space-between">
    <div id="__ID_BTN_PREV__"></div>
    <div id="__ID_BTN_NEXT__"></div>
  </div>
  <div id="__ID_COMMENTS__" class="post-comment"></div>
  <div id="__ID_INPUT__" class="sticky bottom0px"></div>`,
};

class PPost extends Panel {
  #pPost;
  #pBtnPrev;
  #pBtnNext;
  #pComments;
  #pInput;

  constructor() {
    super();
    this.#pPost = new PanelWrapper();
    this.#pBtnPrev = new PanelWrapper();
    this.#pBtnNext = new PanelWrapper();
    this.#pComments = new PanelWrapper();
    this.#pInput = new PanelWrapper();
  }

  getPostPanel() { return this.#pPost; }
  getBtnPrevPanel() { return this.#pBtnPrev; }
  getBtnNextPanel() { return this.#pBtnNext; }
  getCommentsPanel() { return this.#pComments; }
  getInputPanel() { return this.#pInput; }

  _renderFramework() {
    let s = _CPT_POST.MAIN;
    s = s.replace("__ID_POST__", this._getSubElementId("T"));
    s = s.replace("__ID_BTN_PREV__", this._getSubElementId("P"));
    s = s.replace("__ID_BTN_NEXT__", this._getSubElementId("N"));
    s = s.replace("__ID_COMMENTS__", this._getSubElementId("C"));
    s = s.replace("__ID_INPUT__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pPost.attach(this._getSubElementId("T"));
    this.#pBtnPrev.attach(this._getSubElementId("P"));
    this.#pBtnNext.attach(this._getSubElementId("N"));
    this.#pComments.attach(this._getSubElementId("C"));
    this.#pInput.attach(this._getSubElementId("I"));
  }
};

class FvcPost extends FScrollViewContent {
  #fPost;
  #btnPrev;
  #btnNext;
  #cIdLoader;
  #fTabbedComments;
  #fAllComments;
  #fBtnEdit;
  #fInput;
  #postId = new SocialItemId();

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

    if (glb.env.isWeb3()) {
      this.#cIdLoader = new socl.Web3CommentIdLoader();
    } else {
      this.#cIdLoader = new socl.CommentIdLoader();
    }
    this.#cIdLoader.setDelegate(this);
    this.#fAllComments = new blog.FPostList();
    this.#fAllComments.setEnableTopBuffer(false);
    this.#fAllComments.setLoader(this.#cIdLoader);
    this.#fAllComments.setDataSource(this);
    this.#fAllComments.setDelegate(this);

    this.#fBtnEdit = new gui.ActionButton();
    this.#fBtnEdit.setIcon(gui.ActionButton.T_ICON.EDIT);
    this.#fBtnEdit.setDelegate(this);

    this.#fInput = new socl.FCommentInput();
    this.#fInput.setDelegate(this);
    this.setChild("input", this.#fInput);
  }

  getActionButton() {
    let post = dba.Blog.getPost(this.#postId);
    if (this.#isPostEditable(post)) {
      return this.#fBtnEdit;
    }
    return null;
  }

  setPostId(id) { this.#postId = id; }

  onGuiActionButtonClick(fActionButton) { this.#onEdit(); }

  onSimpleButtonClicked(fBtn) { this.#onNavToPost(fBtn.getValue()); }
  onScrollFinished() { this.#fAllComments.onScrollFinished(); }

  isUserAdminOfCommentTargetInPostListFragment(fPostList, targetId) {
    // Sanity check
    if (targetId != this.#postId.getValue()) {
      return false;
    }

    let post = dba.Blog.getPost(this.#postId);
    let uid = dba.Account.getId();
    return uid && uid == post.getOwnerId();
  }

  getContextOptionsForArticleInPostListFragment(fPostList, article) {
    return this.#getTaggingOptions(article);
  }

  onCommentPostedInCommentInputFragment(fInput) { this.#fAllComments.reset(); }
  onIdUpdatedInLongListIdLoader(loader) {
    this.#fAllComments.onScrollFinished();
  }
  onInfoFragmentCreatedInPostListFragment(fPostList, fInfo) {
    fInfo.setSizeType(SocialItem.T_LAYOUT.EXT_COMMENT);
  }
  onArticleContextOptionClickedInPostListFragment(fPostList, value, articleId) {
    this.#asyncTagCommentArticle(value, articleId);
  }
  onTaggedCommentListFragmentRequestUntagCommentArticle(fCommentList,
                                                        articleId) {
    this.#asyncUntagCommentArticle(fCommentList.getTagId(), articleId);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PROFILE:
    case plt.T_DATA.USER_PUBLIC_PROFILES:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      break;
    case plt.T_DATA.POST:
      this.#onPostUpdate(data);
      break;
    case plt.T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
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

  #isPostEditable(post) {
    if (!post) {
      return false;
    }

    if (glb.env.isWeb3()) {
      return false;
    }

    if (!post.isEditable()) {
      return false;
    }

    // Currently only owner can edit article
    // TODO: Support users with permissions, there are legal considerations
    let userIds = [ post.getOwnerId() ];
    if (userIds.indexOf(dba.Account.getId()) < 0) {
      return false;
    }
    return true;
  }

  #isPostCommentable(post) {
    if (!post) {
      return false;
    }
    return post.isSocialable();
  }

  #getRealPost() {
    let post = dba.Blog.getPost(this.#postId);
    return post && post.isRepost() ? dba.Blog.getPost(post.getLinkToSocialId())
                                   : post;
  }

  #getPrevPostId() {
    return this._dataSource
               ? this._dataSource.getPreviousPostIdForPostContentFragment(this)
               : null;
  }

  #getNextPostId() {
    return this._dataSource
               ? this._dataSource.getNextPostIdForPostContentFragment(this)
               : null;
  }

  #onNavToPost(id) {
    this.#postId = id;
    if (this._delegate) {
      this._delegate.onPostIdChangedInPostContentFragment(this, id);
    }
    this._owner.onContentFragmentRequestUpdateHeader(this);
    this.render();
  }

  #onPostUpdate(updatedPost) {
    let post = dba.Blog.getPost(this.#postId);
    if (blog.Utilities.isPostRelated(updatedPost, post)) {
      this.render();
    }
  }

  #onEdit() {
    let post = dba.Blog.getPost(this.#postId);
    if (post) {
      let v = new View();
      let f = new blog.FvcPostEditor();
      f.setPost(post);
      v.setContentFragment(f);
      this.onFragmentRequestShowView(this, v, "Edit post " + post.getId());
    }
  }

  #renderComments(panel, post) {
    if (!panel) {
      return;
    }
    this.#cIdLoader.setThreadId(post.getSocialId(), post.getHashtagIds());
    let tagIds = post.getCommentTags();
    if (tagIds.length > 0) {
      let isAdmin =
          dba.Account.isWebOwner() && post.getOwnerId() == dba.Account.getId();

      this.#fTabbedComments = new FTabbedPane();
      this.#fTabbedComments.addPane({name : "All", value : "ALL"},
                                    this.#fAllComments);
      for (let tid of tagIds) {
        let f = new blog.FTaggedCommentList();
        f.setIsAdmin(isAdmin);
        f.setTagId(tid);
        f.setCommentIds(post.getTaggedCommentIds(tid));
        f.setDelegate(this);

        let t = dba.Groups.getTag(tid);
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

  #getTaggingOptions(article) {
    let ops = [];

    // User must be webOwner
    if (!dba.Account.isWebOwner()) {
      return ops;
    }

    let post = dba.Blog.getPost(this.#postId);
    if (!post) {
      return ops;
    }

    // Post owner must be user
    if (post.getOwnerId() != dba.Account.getId()) {
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

    for (let t of dba.WebConfig.getTags()) {
      ops.push({name : t.getName(), value : t.getId()});
    }
    return ops;
  }

  #asyncTagCommentArticle(tagId, articleId) {
    let url = "api/social/tag_comment_article";
    let fd = new FormData();
    fd.append("item_id", this.#postId.getValue());
    fd.append("item_type", this.#postId.getType());
    fd.append("article_id", articleId);
    fd.append("tag_id", tagId);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onTagCommentRRR(d));
  }

  #onTagCommentRRR(data) {
    dba.Blog.updateArticle(new Article(data.article));
  }

  #asyncUntagCommentArticle(tagId, articleId) {
    let url = "api/social/untag_comment_article";
    let fd = new FormData();
    fd.append("item_id", this.#postId.getValue());
    fd.append("item_type", this.#postId.getType());
    fd.append("article_id", articleId);
    fd.append("tag_id", tagId);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onUntagCommentRRR(d));
  }

  #onUntagCommentRRR(data) {
    dba.Blog.updateArticle(new Article(data.article));
  }
}

export { FvcPost };

// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcPost = FvcPost;
}
