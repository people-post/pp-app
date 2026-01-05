import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FSocialBar } from '../../common/social/FSocialBar.js';
import { Blog } from '../../common/dba/Blog.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FvcFilteredPostList } from './FvcFilteredPostList.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { glb } from '../../lib/framework/Global.js';
import { Utilities } from '../../common/Utilities.js';
import { ICON } from '../../common/constants/Icons.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { T_ACTION as PltT_ACTION } from '../../common/plt/Events.js';
import { PPost } from './PPost.js';
import { FArticle } from './FArticle.js';
import { FFeedArticleInfo } from './FFeedArticleInfo.js';
import { FJournalIssue } from './FJournalIssue.js';
import { FEmptyPost } from './FEmptyPost.js';
import { Utilities as BlogUtilities } from './Utilities.js';

export const CF_POST = {
  TOGGLE_PIN : Symbol(),
};

const _CFT_POST = {
  PIN :
      `<span class="__CLASS__" onclick="javascript:G.action(CF_POST.TOGGLE_PIN)">__ICON__</span>`,
};

export class FPost extends Fragment {
  #fReposter;
  #fAuthor;
  #fItem;
  #fSocial;
  #btnApply;
  #postId = null; // SocialItemId

  constructor() {
    super();
    this.#btnApply = new Button();
    this.#btnApply.setName("Join our writer groups");
    this.#btnApply.setValue("APPLY");
    this.#btnApply.setDelegate(this);
    this.setChild("btnApply", this.#btnApply);

    this.#fAuthor = new FUserInfo();
    this.#fAuthor.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("author", this.#fAuthor);

    this.#fReposter = new FUserInfo();
    this.#fReposter.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("reposter", this.#fReposter);

    this.#fSocial = new FSocialBar();
    this.#fSocial.setDataSource(this);
    this.#fSocial.setDelegate(this);
    this.setChild("social", this.#fSocial);
  }

  setPostId(id) { this.#postId = id; }

  onCommentClickedInSocialBar(fSocial) {}

  onTagClickedInArticleFragment(fArticle, value) {
    let v = new View();
    let f = new FvcFilteredPostList();
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
    case T_DATA.USER_PROFILE:
    case T_DATA.USER_PUBLIC_PROFILES:
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

  action(type, ...args) {
    switch (type) {
    case CF_POST.TOGGLE_PIN:
      this.#onTogglePin();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let post = Blog.getPost(this.#postId);
    if (!post) {
      return;
    }
    let realPost =
        post.isRepost() ? Blog.getPost(post.getLinkToSocialId()) : post;
    if (!realPost) {
      return;
    }
    let panel = new PPost();
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
        this.#shouldShowApplyRoleAction(post, window.dba.Account.getId())) {
      p = panel.getJobAdPanel();
      this.#btnApply.attachRender(p);
      this.#btnApply.render();
    }

    this.#fItem = this.#createItemFragment(realPost);
    this.setChild("item", this.#fItem);
    this.#fItem.attachRender(panel);
    this.#fItem.render();

    if (realPost.isSocialable()) {
      if (Blog.isSocialEnabled()) {
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
    let roles = Blog.hackGetOpenRoles();
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
    case SocialItem.TYPE.ARTICLE:
      f = new FArticle();
      f.setArticleId(post.getId());
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.FEED_ARTICLE:
      f = new FFeedArticleInfo();
      f.setArticleId(post.getId());
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.JOURNAL_ISSUE:
      f = new FJournalIssue();
      f.setIssueId(post.getId());
      break;
    case SocialItem.TYPE.INVALID:
      f = new FEmptyPost();
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
    if (!window.dba.Account.isWebOwner()) {
      // Only web owner can pin
      return;
    }

    if (window.dba.Account.getId() != post.getOwnerId()) {
      // Only pin owner's post
      return;
    }

    let isSelected = Blog.isPostPinned(post.getId());
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
    return Utilities.renderSvgFuncIcon(ICON.PIN, isSelected);
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
    let post = Blog.getPost(this.#postId);
    if (BlogUtilities.isPostRelated(updatePost, post)) {
      this.render();
    }
  }

  #onApplyRole() { Events.triggerTopAction(PltT_ACTION.SHOW_BLOG_ROLES); }

  #onTogglePin() {
    let postId = this.#postId;
    let isSelected = Blog.isPostPinned(postId.getValue());
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
    glb.api.asFragmentPost(this, url, fd).then(d => this.#onTogglePinRRR(d));
  }

  #asyncUnpinPost(postId) {
    let url = "api/blog/unpin_article";
    let fd = new FormData();
    fd.append("id", postId.getValue());
    fd.append("type", postId.getType());
    glb.api.asFragmentPost(this, url, fd).then(d => this.#onTogglePinRRR(d));
  }

  #onTogglePinRRR(data) {
    Blog.resetConfig(data.blog_config);
    this.render();
  }
}
