import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ICONS } from '../../lib/ui/Icons.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/interface/SocialItem.js';
import { MajorSectorItem } from '../../common/gui/MajorSectorItem.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FSocialBar } from '../../common/social/FSocialBar.js';
import { Blog } from '../../common/dba/Blog.js';
import { T_DATA } from '../../common/plt/Events.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { Utilities } from './Utilities.js';
import { Utilities as CommonUtilities } from '../../common/Utilities.js';
import { FArticleInfo } from './FArticleInfo.js';
import { FFeedArticleInfo } from './FFeedArticleInfo.js';
import { FJournalIssue } from './FJournalIssue.js';
import { FComment } from './FComment.js';
import { FEmptyPost } from './FEmptyPost.js';
import { PPostInfoBigHead } from './PPostInfoBigHead.js';
import { PPostInfoLarge } from './PPostInfoLarge.js';
import { PPostInfoMiddle } from './PPostInfoMiddle.js';
import { PPostInfoSmall } from './PPostInfoSmall.js';
import { PPostInfoComment } from './PPostInfoComment.js';
import { PPostInfoSmallQuote } from './PPostInfoSmallQuote.js';
import { PPostInfoLargeQuote } from './PPostInfoLargeQuote.js';
import { PPostInfoBrief } from './PPostInfoBrief.js';
import { PPostInfoCard } from './PPostInfoCard.js';
import { PPostInfoHuge } from './PPostInfoHuge.js';
import { PPostInfoEmbed } from './PPostInfoEmbed.js';
import { PPostInfoFullPage } from './PPostInfoFullPage.js';
import { PPostInfoCompact } from './PPostInfoCompact.js';
import { ICON } from '../../common/constants/Icons.js';
import type { Post } from '../../common/datatypes/Post.js';
import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import type { Article } from '../../common/datatypes/Article.js';

export const CF_POST_INFO = {
  ON_CLICK : "CF_POST_INFO_1",
} as const;

const _CFT_POST_INFO = {
  PIN :
      `<span class="pin-icon inline-block s-icon5 v-middle-align">__ICON__</span>`,
} as const;

export interface PostInfoDataSource {
  isUserAdminOfCommentTargetInPostInfoFragment(f: FPostInfo, targetId: string): boolean;
  getContextOptionsForPostInfoFragment(f: FPostInfo, article: Article): Array<{name: string; value: string}> | null;
}

export interface PostInfoDelegate {
  onContextOptionClickedInPostInfoFragment(f: FPostInfo, value: string): void;
  onVisibilityChangeInPostInfoFragment(f: FPostInfo): void;
}

export class FPostInfo extends MajorSectorItem {
  #fPost: Fragment | null = null;
  #fRefOwnerName: FUserInfo;
  #fOwnerName: FUserInfo;
  #fSocial: FSocialBar;
  #postId: SocialItemId = new SocialItemId();
  #sizeType: string | null = null;

  constructor() {
    super();
    this.#fRefOwnerName = new FUserInfo();
    this.#fRefOwnerName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("refOwnerName", this.#fRefOwnerName);

    this.#fOwnerName = new FUserInfo();
    this.#fOwnerName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("ownerName", this.#fOwnerName);

    this.#fSocial = new FSocialBar();
    this.#fSocial.setDataSource(this);
    this.#fSocial.setDelegate(this);
    this.setChild("social", this.#fSocial);
  }

  getSizeType(): string | null { return this.#sizeType; }
  getPostId(): SocialItemId { return this.#postId; }

  setPostId(id: SocialItemId | null): void {
    if (id) {
      this.#postId = id;
    }
  }
  setSizeType(t: string | null): void { this.#sizeType = t; }

  isUserAdminOfCommentTargetInPostInfoFragment(targetId: string): boolean {
    const dataSource = this.getDataSource<PostInfoDataSource>();
    if (!dataSource) {
      return false;
    }
    return dataSource.isUserAdminOfCommentTargetInPostInfoFragment(this, targetId);
  }

  getContextOptionsForPostInfoFragment(article: Article): Array<{name: string; value: string}> | null {
    const dataSource = this.getDataSource<PostInfoDataSource>();
    if (!dataSource) {
      return null;
    }
    return dataSource.getContextOptionsForPostInfoFragment(this, article);
  }

  onClickInPostInfoFragment(): void { this.#onClick(); }
  onContextOptionClickedInPostInfoFragment(value: string): void {
    const delegate = this.getDelegate<PostInfoDelegate>();
    if (!delegate) {
      return;
    }
    delegate.onContextOptionClickedInPostInfoFragment(this, value);
  }
  onVisibilityChangeInPostInfoFragment(): void {
    const delegate = this.getDelegate<PostInfoDelegate>();
    if (!delegate) {
      return;
    }
    delegate.onVisibilityChangeInPostInfoFragment(this);
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.POST:
      if (this.#isPostRelated(data as Post)) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_POST_INFO.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    let post = Blog.getPost(this.#postId);
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
      this.#fSocial.setActions([ FSocialBar.T_ACTION.SHARE ]);
    }

    if (this.#fPost && (this.#fPost as any).isInfoClickable && panel.isClickable()) {
      panel.setClassName("clickable");
      panel.setAttribute("onclick",
                         `javascript:G.action("${CF_POST_INFO.ON_CLICK}")`);
    }

    render.wrapPanel(panel);

    if (panel.isColorInvertible()) {
      if (this.#isPostSelected(this.#postId)) {
        panel.invertColor();
      }
    }

    let className = CommonUtilities.getVisibilityClassName(post.getVisibility());
    panel.setVisibilityClassName(className);

    if (panel.getOwnerNamePanel()) {
      this.#renderCrossRefBy(panel.getCrossRefPanel(), post);
    } else {
      this.#renderCrossRefFrom(panel.getCrossRefPanel(), post, realPost);
    }

    this.#renderPin(panel.getPinPanel(), this.#postId.getValue());
    this.#renderSocialBar(panel.getSocialBarPanel(), panel.isColorInvertible(),
                          this.#postId, realPost);

    if (this.#fPost) {
      this.#fPost.attachRender(panel);
      this.#fPost.render();
    }
  }

  #isPostSelected(postId: SocialItemId): boolean {
    return UtilitiesExt.optCall(
        this._dataSource, "isPostSelectedInPostInfoFragment", this, postId) as boolean;
  }

  #isPostRelated(post: Post): boolean {
    if (post.getId() == this.#postId.getValue()) {
      return true;
    }
    let p = Blog.getPost(this.#postId);
    return p ? Utilities.isPostRelated(post, p) : false;
  }

  #getRealPost(post: Post | null): Post | null {
    if (post && post.isRepost()) {
      return Blog.getPost(post.getLinkToSocialId());
    }
    return post;
  }

  #createPostFragment(post: Post): Fragment {
    let f: Fragment;
    let t = post.getSocialItemType();
    switch (t) {
    case SocialItem.TYPE.ARTICLE:
      f = new FArticleInfo();
      (f as FArticleInfo).setArticleId(post.getId());
      (f as FArticleInfo).setSizeType(this.#sizeType);
      f.setDelegate(this);
      f.setDataSource(this);
      break;
    case SocialItem.TYPE.FEED_ARTICLE:
      f = new FFeedArticleInfo();
      (f as FFeedArticleInfo).setArticleId(post.getId());
      (f as FFeedArticleInfo).setSizeType(this.#sizeType);
      break;
    case SocialItem.TYPE.JOURNAL_ISSUE:
      f = new FJournalIssue();
      (f as FJournalIssue).setIssueId(post.getId());
      break;
    case SocialItem.TYPE.COMMENT:
      f = new FComment();
      (f as FComment).setCommentId(post.getId());
      f.setDataSource(this);
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.INVALID:
      f = new FEmptyPost();
      (f as FEmptyPost).setPost(post);
      break;
    default:
      console.log("Unsupported social item in blog.FPostInfo: " + t);
      f = new FEmptyPost();
      (f as FEmptyPost).setPost(post);
      break;
    }
    return f;
  }

  #createPanel(): any {
    let p: any;
    switch (this.#sizeType) {
    case SocialItem.T_LAYOUT.BIG_HEAD:
      p = new PPostInfoBigHead();
      break;
    case SocialItem.T_LAYOUT.LARGE:
      p = new PPostInfoLarge();
      break;
    case SocialItem.T_LAYOUT.MEDIUM:
      p = new PPostInfoMiddle();
      break;
    case SocialItem.T_LAYOUT.SMALL:
      p = new PPostInfoSmall();
      break;
    case SocialItem.T_LAYOUT.EXT_COMMENT:
      p = new PPostInfoComment();
      break;
    case SocialItem.T_LAYOUT.EXT_QUOTE_SMALL:
      p = new PPostInfoSmallQuote();
      break;
    case SocialItem.T_LAYOUT.EXT_QUOTE_LARGE:
      p = new PPostInfoLargeQuote();
      break;
    case SocialItem.T_LAYOUT.EXT_BRIEF:
      p = new PPostInfoBrief();
      break;
    case SocialItem.T_LAYOUT.EXT_CARD:
      p = new PPostInfoCard();
      break;
    case SocialItem.T_LAYOUT.EXT_HUGE:
      p = new PPostInfoHuge();
      break;
    case SocialItem.T_LAYOUT.EXT_EMBED:
      p = new PPostInfoEmbed();
      break;
    case SocialItem.T_LAYOUT.EXT_FULL_PAGE:
      p = new PPostInfoFullPage();
      break;
    default:
      p = new PPostInfoCompact();
      break;
    }
    return p;
  }

  #onClick(): void {
    UtilitiesExt.optCall(this._delegate, "onClickInPostInfoFragment", this,
                          this.#postId);
  }

  #renderPin(panel: Panel | null, postId: string | null): void {
    if (!panel) {
      return;
    }

    if (!postId || !Blog.isPostPinned(postId)) {
      return;
    }
    // Pin at upper left corner
    let s = _CFT_POST_INFO.PIN;
    s = s.replace("__ICON__", CommonUtilities.renderSvgIcon(ICON.PIN));
    panel.replaceContent(s);
  }

  #renderCrossRefBy(panel: any, post: Post): void {
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

  #renderCrossRefFrom(panel: any, post: Post, realPost: Post): void {
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

  #renderSocialBar(panel: Panel | null, inversable: boolean, postId: SocialItemId, realPost: Post): void {
    if (!panel) {
      return;
    }
    if (!realPost.isSocialable()) {
      return;
    }
    if (!Blog.isSocialEnabled()) {
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
