import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ICONS } from '../../lib/ui/Icons.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';

export const CF_POST_INFO = {
  ON_CLICK : Symbol(),
};

const _CFT_POST_INFO = {
  PIN :
      `<span class="pin-icon inline-block s-icon5 v-middle-align">__ICON__</span>`,
};

export class FPostInfo extends gui.MajorSectorItem {
  #fPost;
  #fRefOwnerName;
  #fOwnerName;
  #fSocial;
  #postId = new SocialItemId();
  #sizeType = null;

  constructor() {
    super();
    this.#fRefOwnerName = new S.hr.FUserInfo();
    this.#fRefOwnerName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("refOwnerName", this.#fRefOwnerName);

    this.#fOwnerName = new S.hr.FUserInfo();
    this.#fOwnerName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("ownerName", this.#fOwnerName);

    this.#fSocial = new socl.FSocialBar();
    this.#fSocial.setDataSource(this);
    this.#fSocial.setDelegate(this);
    this.setChild("social", this.#fSocial);
  }

  getSizeType() { return this.#sizeType; }
  getPostId() { return this.#postId; }

  setPostId(id) {
    if (id) {
      this.#postId = id;
    }
  }
  setSizeType(t) { this.#sizeType = t; }

  isUserAdminOfCommentTargetInCommentFragment(fComment, targetId) {
    return ext.Utilities.optCall(this._dataSource,
                                 "isUserAdminOfCommentTargetInPostInfoFragment",
                                 this, targetId);
  }

  getContextOptionsForArticleInfoFragment(fArticle, article) {
    return ext.Utilities.optCall(this._dataSource,
                                 "getContextOptionsForPostInfoFragment", this,
                                 article);
  }

  onClickInArticleInfoFragment(fArticle, articleId) { this.#onClick(); }
  onContextOptionClickedInArticleInfoFragment(fArticle, value) {
    ext.Utilities.optCall(this._delegate,
                          "onContextOptionClickedInPostInfoFragment", this,
                          value, fArticle.getArticleId());
  }
  onGuestCommentStatusChangeInCommentFragment(fComment) {
    ext.Utilities.optCall(this._delegate,
                          "onVisibilityChangeInPostInfoFragment", this);
  }
  onCommentClickedInSocialBar(fSocial) { this.#onClick(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.POST:
      if (this.#isPostRelated(data)) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  action(type, ...args) {
    switch (type) {
    case blog.CF_POST_INFO.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let post = dba.Blog.getPost(this.#postId);
    let realPost = this.#getRealPost(post);
    if (!realPost) {
      let p = new Panel();
      p.setClassName("center-align");
      render.wrapPanel(p);
      p.replaceContent(ICONS.LOADING);
      return;
    }

    this.#fPost = this.#createPostFragment(realPost);
    this.setChild("post", this.#fPost);

    let panel = this.#createPanel();
    // Hack
    if (this.#sizeType == SocialItem.T_LAYOUT.EXT_BRIEF) {
      this.#fSocial.setActions([ socl.FSocialBar.T_ACTION.SHARE ]);
    }

    if (this.#fPost.isInfoClickable() && panel.isClickable()) {
      panel.setClassName("clickable");
      panel.setAttribute("onclick",
                         "javascript:G.action(blog.CF_POST_INFO.ON_CLICK)");
    }

    render.wrapPanel(panel);

    if (panel.isColorInvertible()) {
      if (this.#isPostSelected(this.#postId)) {
        panel.invertColor();
      }
    }

    let className = Utilities.getVisibilityClassName(post.getVisibility());
    panel.setVisibilityClassName(className);

    if (panel.getOwnerNamePanel()) {
      this.#renderCrossRefBy(panel.getCrossRefPanel(), post);
    } else {
      this.#renderCrossRefFrom(panel.getCrossRefPanel(), post, realPost);
    }

    this.#renderPin(panel.getPinPanel(), this.#postId.getValue());
    this.#renderSocialBar(panel.getSocialBarPanel(), panel.isColorInvertible(),
                          this.#postId, realPost);

    this.#fPost.attachRender(panel);
    this.#fPost.render();
  }

  #isPostSelected(postId) {
    return ext.Utilities.optCall(
        this._dataSource, "isPostSelectedInPostInfoFragment", this, postId);
  }

  #isPostRelated(post) {
    if (post.getId() == this.#postId.getValue()) {
      return true;
    }
    let p = dba.Blog.getPost(this.#postId);
    return blog.Utilities.isPostRelated(post, p);
  }

  #getRealPost(post) {
    if (post && post.isRepost()) {
      return dba.Blog.getPost(post.getLinkToSocialId());
    }
    return post;
  }

  #createPostFragment(post) {
    let f;
    let t = post.getSocialItemType();
    switch (t) {
    case SocialItem.TYPE.ARTICLE:
      f = new blog.FArticleInfo();
      f.setArticleId(post.getId());
      f.setSizeType(this.#sizeType);
      f.setDelegate(this);
      f.setDataSource(this);
      break;
    case SocialItem.TYPE.FEED_ARTICLE:
      f = new blog.FFeedArticleInfo();
      f.setArticleId(post.getId());
      f.setSizeType(this.#sizeType);
      break;
    case SocialItem.TYPE.JOURNAL_ISSUE:
      f = new blog.FJournalIssue();
      f.setIssueId(post.getId());
      break;
    case SocialItem.TYPE.COMMENT:
      f = new blog.FComment();
      f.setCommentId(post.getId());
      f.setDataSource(this);
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.INVALID:
      f = new blog.FEmptyPost();
      f.setPost(post);
      break;
    default:
      console.log("Unsupported social item in blog.FPostInfo: " + t);
      break;
    }
    return f;
  }

  #createPanel() {
    let p;
    switch (this.#sizeType) {
    case SocialItem.T_LAYOUT.BIG_HEAD:
      p = new blog.PPostInfoBigHead()
      break;
    case SocialItem.T_LAYOUT.LARGE:
      p = new blog.PPostInfoLarge();
      break;
    case SocialItem.T_LAYOUT.MEDIUM:
      p = new blog.PPostInfoMiddle();
      break;
    case SocialItem.T_LAYOUT.SMALL:
      p = new blog.PPostInfoSmall();
      break;
    case SocialItem.T_LAYOUT.EXT_COMMENT:
      p = new blog.PPostInfoComment()
      break;
    case SocialItem.T_LAYOUT.EXT_QUOTE_SMALL:
      p = new blog.PPostInfoSmallQuote();
      break;
    case SocialItem.T_LAYOUT.EXT_QUOTE_LARGE:
      p = new blog.PPostInfoLargeQuote();
      break;
    case SocialItem.T_LAYOUT.EXT_BRIEF:
      p = new blog.PPostInfoBrief();
      break;
    case SocialItem.T_LAYOUT.EXT_CARD:
      p = new blog.PPostInfoCard();
      break;
    case SocialItem.T_LAYOUT.EXT_HUGE:
      p = new blog.PPostInfoHuge();
      break;
    case SocialItem.T_LAYOUT.EXT_EMBED:
      p = new blog.PPostInfoEmbed();
      break;
    case SocialItem.T_LAYOUT.EXT_FULL_PAGE:
      p = new blog.PPostInfoFullPage();
      break;
    default:
      p = new blog.PPostInfoCompact();
      break;
    }
    return p;
  }

  #onClick() {
    ext.Utilities.optCall(this._delegate, "onClickInPostInfoFragment", this,
                          this.#postId);
  }

  #renderPin(panel, postId) {
    if (!panel) {
      return;
    }

    if (!dba.Blog.isPostPinned(postId)) {
      return;
    }
    // Pin at upper left corner
    let s = _CFT_POST_INFO.PIN;
    s = s.replace("__ICON__", Utilities.renderSvgIcon(C.ICON.PIN));
    panel.replaceContent(s);
  }

  #renderCrossRefBy(panel, post) {
    if (!(panel && post)) {
      return;
    }
    if (!post.isRepost()) {
      panel.replaceContent("");
      return;
    }
    panel.getTextPanel().replaceContent("By");
    let p = panel.getUserPanel();
    this.#fRefOwnerName.setUserId(post.getOwnerId());
    this.#fRefOwnerName.attachRender(p);
    this.#fRefOwnerName.render();
  }

  #renderCrossRefFrom(panel, post, realPost) {
    if (!panel) {
      return;
    }
    if (!post.isRepost()) {
      panel.replaceContent("");
      return;
    }
    panel.getTextPanel().replaceContent("From");
    let p = panel.getUserPanel();
    this.#fOwnerName.setUserId(realPost.getOwnerId());
    this.#fOwnerName.attachRender(p);
    this.#fOwnerName.render();
  }

  #renderSocialBar(panel, inversable, postId, realPost) {
    if (!panel) {
      return;
    }
    if (!realPost.isSocialable()) {
      return;
    }
    if (!dba.Blog.isSocialEnabled()) {
      return;
    }

    if (inversable) {
      this.#fSocial.setInvertColor(this.#isPostSelected(postId));
    }

    this.#fSocial.setItem(realPost);
    this.#fSocial.attachRender(panel);
    this.#fSocial.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.CF_POST_INFO = CF_POST_INFO;
}