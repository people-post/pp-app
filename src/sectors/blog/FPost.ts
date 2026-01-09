import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FSocialBar } from '../../common/social/FSocialBar.js';
import { Blog } from '../../common/dba/Blog.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FvcFilteredPostList } from './FvcFilteredPostList.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
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
import { Env } from '../../common/plt/Env.js';
import { Api } from '../../common/plt/Api.js';
import type { Post } from '../../common/datatypes/Post.js';
import type { Fragment as FragmentType } from '../../lib/ui/controllers/fragments/Fragment.js';

export const CF_POST = {
  TOGGLE_PIN : Symbol(),
} as const;

const _CFT_POST = {
  PIN :
      `<span class="__CLASS__" onclick="javascript:G.action(CF_POST.TOGGLE_PIN)">__ICON__</span>`,
} as const;

export class FPost extends Fragment {
  #fReposter: FUserInfo;
  #fAuthor: FUserInfo;
  #fItem: FragmentType | null = null;
  #fSocial: FSocialBar;
  #btnApply: Button;
  #postId: SocialItemId | null = null;

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

  setPostId(id: SocialItemId | null): void { this.#postId = id; }

  onCommentClickedInSocialBar(_fSocial: FSocialBar): void {}

  onTagClickedInArticleFragment(_fArticle: FragmentType, value: string): void {
    let v = new View();
    let f = new FvcFilteredPostList();
    f.setTagId(value);
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Tag filter");
  }

  onSimpleButtonClicked(fBtn: Button): void {
    let v = fBtn.getValue();
    switch (v) {
    case "APPLY":
      this.#onApplyRole();
      break;
    default:
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case T_DATA.POST:
      this.#onPostUpdate(data as Post);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_POST.TOGGLE_PIN:
      this.#onTogglePin();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: Panel): void {
    if (!this.#postId) {
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

  #shouldShowApplyRoleAction(post: Post, userId: string | null): boolean {
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

  #createItemFragment(post: Post): FragmentType {
    let f: FragmentType;
    let t = post.getSocialItemType();
    switch (t) {
    case SocialItem.TYPE.ARTICLE:
      f = new FArticle();
      (f as FArticle).setArticleId(post.getId());
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.FEED_ARTICLE:
      f = new FFeedArticleInfo();
      (f as FFeedArticleInfo).setArticleId(post.getId());
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.JOURNAL_ISSUE:
      f = new FJournalIssue();
      (f as FJournalIssue).setIssueId(post.getId());
      break;
    case SocialItem.TYPE.INVALID:
      f = new FEmptyPost();
      (f as FEmptyPost).setPost(post);
      break;
    default:
      console.log("Unsupported social item in blog.FPost: " + t);
      f = new FEmptyPost();
      (f as FEmptyPost).setPost(post);
      break;
    }
    return f;
  }

  #renderPin(panel: Panel | null, post: Post): void {
    if (!panel) {
      return;
    }

    // TODO: Support pin in web3
    if (Env.isWeb3()) {
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
    panel.replaceContent(s);
  }

  #renderPinIcon(isSelected: boolean): string {
    return Utilities.renderSvgFuncIcon(ICON.PIN, isSelected);
  }

  #renderAuthor(panel: Panel, authorId: string | null, reposterId: string | null | undefined = null): void {
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

  #onPostUpdate(updatePost: Post): void {
    if (!this.#postId) {
      return;
    }
    let post = Blog.getPost(this.#postId);
    if (post && BlogUtilities.isPostRelated(updatePost, post)) {
      this.render();
    }
  }

  #onApplyRole(): void { Events.triggerTopAction(PltT_ACTION.SHOW_BLOG_ROLES); }

  #onTogglePin(): void {
    if (!this.#postId) {
      return;
    }
    let postId = this.#postId;
    let isSelected = Blog.isPostPinned(postId.getValue());
    if (isSelected) {
      this.#asyncUnpinPost(postId);
    } else {
      this.#asyncPinPost(postId);
    }
  }

  #asyncPinPost(postId: SocialItemId): void {
    let url = "api/blog/pin_article";
    let fd = new FormData();
    fd.append("id", postId.getValue()!);
    fd.append("type", postId.getType()!);
    Api.asFragmentPost(this, url, fd).then((d: {blog_config: unknown}) => this.#onTogglePinRRR(d));
  }

  #asyncUnpinPost(postId: SocialItemId): void {
    let url = "api/blog/unpin_article";
    let fd = new FormData();
    fd.append("id", postId.getValue()!);
    fd.append("type", postId.getType()!);
    Api.asFragmentPost(this, url, fd).then((d: {blog_config: unknown}) => this.#onTogglePinRRR(d));
  }

  #onTogglePinRRR(data: {blog_config: unknown}): void {
    Blog.resetConfig(data.blog_config);
    this.render();
  }
}
