import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export const CF_POST = {
  TOGGLE_PIN : Symbol(),
};

const _CFT_POST = {
  PIN :
      `<span class="__CLASS__" onclick="javascript:G.action(blog.CF_POST.TOGGLE_PIN)">__ICON__</span>`,
};

export class FPost extends Fragment {
  #fReposter;
  #fAuthor;
  #fItem;
  #fSocial;
  #btnApply;
  #postId = null; // dat.SocialItemId

  constructor() {
    super();
    this.#btnApply = new Button();
    this.#btnApply.setName("Join our writer groups");
    this.#btnApply.setValue("APPLY");
    this.#btnApply.setDelegate(this);
    this.setChild("btnApply", this.#btnApply);

    this.#fAuthor = new S.hr.FUserInfo();
    this.#fAuthor.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("author", this.#fAuthor);

    this.#fReposter = new S.hr.FUserInfo();
    this.#fReposter.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("reposter", this.#fReposter);

    this.#fSocial = new socl.FSocialBar();
    this.#fSocial.setDataSource(this);
    this.#fSocial.setDelegate(this);
    this.setChild("social", this.#fSocial);
  }

  setPostId(id) { this.#postId = id; }

  onCommentClickedInSocialBar(fSocial) {}

  onTagClickedInArticleFragment(fArticle, value) {
    let v = new View();
    let f = new blog.FvcFilteredPostList();
    f.setTagId(value);
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Tag filter");
  }

  onSimpleButtonClicked(fBtn) {
    let v = fBtn.getValue();
    switch (v) {
    case "APPLY":
      this.#onApplyRole();
      break;
    default:
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PROFILE:
    case plt.T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case plt.T_DATA.POST:
      this.#onPostUpdate(data);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  action(type, ...args) {
    switch (type) {
    case blog.CF_POST.TOGGLE_PIN:
      this.#onTogglePin();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let post = dba.Blog.getPost(this.#postId);
    if (!post) {
      return;
    }
    let realPost =
        post.isRepost() ? dba.Blog.getPost(post.getLinkToSocialId()) : post;
    if (!realPost) {
      return;
    }
    let panel = new blog.PPost();
    render.wrapPanel(panel);

    let p = panel.getPinPanel();
    this.#renderPin(p, post);

    p = panel.getAuthorPanel();
    if (post.isRepost()) {
      this.#renderAuthor(p, realPost.getAuthorId(), post.getAuthorId());
    } else {
      this.#renderAuthor(p, post.getAuthorId());
    }

    if (!post.getLinkTo() &&
        this.#shouldShowApplyRoleAction(post, dba.Account.getId())) {
      p = panel.getJobAdPanel();
      this.#btnApply.attachRender(p);
      this.#btnApply.render();
    }

    this.#fItem = this.#createItemFragment(realPost);
    this.setChild("item", this.#fItem);
    this.#fItem.attachRender(panel);
    this.#fItem.render();

    if (realPost.isSocialable()) {
      if (dba.Blog.isSocialEnabled()) {
        p = panel.getSocialBarPanel();
        this.#fSocial.setItem(realPost);
        this.#fSocial.attachRender(p);
        this.#fSocial.render();
      }
    }
  }

  #shouldShowApplyRoleAction(post, userId) {
    if (!userId) {
      // TODO: Open to guests
      return false;
    }
    if (userId == post.getOwnerId()) {
      return false;
    }
    let roles = dba.Blog.hackGetOpenRoles();
    if (roles.length) {
      // True if not a member of any role
      return roles.every(r => r.member_ids.indexOf(userId) < 0);
    }
    return false;
  }

  #createItemFragment(post) {
    let f;
    let t = post.getSocialItemType();
    switch (t) {
    case dat.SocialItem.TYPE.ARTICLE:
      f = new blog.FArticle();
      f.setArticleId(post.getId());
      f.setDelegate(this);
      break;
    case dat.SocialItem.TYPE.FEED_ARTICLE:
      f = new blog.FFeedArticle();
      f.setArticleId(post.getId());
      f.setDelegate(this);
      break;
    case dat.SocialItem.TYPE.JOURNAL_ISSUE:
      f = new blog.FJournalIssue();
      f.setIssueId(post.getId());
      break;
    case dat.SocialItem.TYPE.INVALID:
      f = new blog.FEmptyPost();
      f.setPost(post);
      break;
    default:
      console.log("Unsupported social item in blog.FPost: " + t);
      break;
    }
    return f;
  }

  #renderPin(panel, post) {
    if (!panel) {
      return;
    }

    // TODO: Support pin in web3
    if (glb.env.isWeb3()) {
      return;
    }

    if (!post.isPinnable()) {
      return;
    }
    if (!dba.Account.isWebOwner()) {
      // Only web owner can pin
      return;
    }

    if (dba.Account.getId() != post.getOwnerId()) {
      // Only pin owner's post
      return;
    }

    let isSelected = dba.Blog.isPostPinned(post.getId());
    let s = _CFT_POST.PIN;
    s = s.replace("__ICON__", this.#renderPinIcon(isSelected));
    if (isSelected) {
      s = s.replace("__CLASS__",
                    "inline-block s-icon3 clickable s-cprimebg inset");
    } else {
      s = s.replace("__CLASS__", "inline-block s-icon3 clickable outset");
    }
    return panel.replaceContent(s);
  }

  #renderPinIcon(isSelected) {
    return Utilities.renderSvgFuncIcon(C.ICON.PIN, isSelected);
  }

  #renderAuthor(panel, authorId, reposterId = null) {
    let p = new ListPanel();
    panel.wrapPanel(p);
    let pp = new Panel();
    pp.setElementType("SPAN");
    p.pushPanel(pp);
    pp.replaceContent("By: ");

    pp = new PanelWrapper();
    pp.setElementType("SPAN");
    p.pushPanel(pp);
    this.#fAuthor.setUserId(authorId);
    this.#fAuthor.attachRender(pp);
    this.#fAuthor.render();

    if (reposterId) {
      pp = new Panel();
      pp.setElementType("SPAN");
      p.pushPanel(pp);
      pp.replaceContent(", reposted by: ");

      pp = new PanelWrapper();
      pp.setElementType("SPAN");
      p.pushPanel(pp);
      this.#fReposter.setUserId(reposterId);
      this.#fReposter.attachRender(pp);
      this.#fReposter.render();
    }
  }

  #onPostUpdate(updatePost) {
    let post = dba.Blog.getPost(this.#postId);
    if (blog.Utilities.isPostRelated(updatePost, post)) {
      this.render();
    }
  }

  #onApplyRole() { fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_BLOG_ROLES); }

  #onTogglePin() {
    let postId = this.#postId;
    let isSelected = dba.Blog.isPostPinned(postId.getValue());
    if (isSelected) {
      this.#asyncUnpinPost(postId);
    } else {
      this.#asyncPinPost(postId);
    }
  }

  #asyncPinPost(postId) {
    let url = "api/blog/pin_article";
    let fd = new FormData();
    fd.append("id", postId.getValue());
    fd.append("type", postId.getType());
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onTogglePinRRR(d));
  }

  #asyncUnpinPost(postId) {
    let url = "api/blog/unpin_article";
    let fd = new FormData();
    fd.append("id", postId.getValue());
    fd.append("type", postId.getType());
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onTogglePinRRR(d));
  }

  #onTogglePinRRR(data) {
    dba.Blog.resetConfig(data.blog_config);
    this.render();
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.CF_POST = CF_POST;
  window.blog.FPost = FPost;
}
