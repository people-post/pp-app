import { FAttachmentFile } from '../../lib/ui/controllers/fragments/FAttachmentFile.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { OptionContextButton, IOptionContextButtonDelegate } from '../../lib/ui/controllers/fragments/OptionContextButton.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ThumbnailPanelWrapper } from '../../lib/ui/renders/panels/ThumbnailPanelWrapper.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { FFilesThumbnail } from '../../common/gui/FFilesThumbnail.js';
import { FTag } from '../../common/gui/FTag.js';
import { LGallery } from '../../common/gui/LGallery.js';
import { FPostBase } from './FPostBase.js';
import { FQuoteElement } from './FQuoteElement.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FUserIcon } from '../../common/hr/FUserIcon.js';
import { Blog } from '../../common/dba/Blog.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { Utilities as blogUtilities } from './Utilities.js';
import { Utilities } from '../../common/Utilities.js';
import { R } from '../../common/constants/R.js';
import type { Article } from '../../common/datatypes/Article.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';

export interface ArticleInfoDataSource {
  getContextOptionsForArticleInfoFragment(f: FArticleInfo, article: Article): Array<{name: string; value: string}> | null;
}

export interface ArticleInfoDelegate {
  onClickInArticleInfoFragment(f: FArticleInfo, articleId: string): void;
  onContextOptionClickedInArticleInfoFragment(f: FArticleInfo, value: unknown): void;
}

export class FArticleInfo extends FPostBase implements IOptionContextButtonDelegate {
  #fAttachment: FAttachmentFile;
  #fThumbnail: FFilesThumbnail;
  #fQuote: FQuoteElement;
  #fOwnerName: FUserInfo;
  #fOwnerIcon: FUserIcon;
  #fAuthorName: FUserInfo;
  #fBtnContext: OptionContextButton;
  #fTags: FFragmentList;
  #articleId: string | null = null;
  #sizeType: string | null = null;

  constructor() {
    super();
    this.#fAttachment = new FAttachmentFile();
    this.setChild("attachment", this.#fAttachment);

    this.#fThumbnail = new FFilesThumbnail();
    this.#fThumbnail.setDataSource(this);
    this.#fThumbnail.setDelegate(this);
    this.setChild("thumbnail", this.#fThumbnail);

    this.#fQuote = new FQuoteElement();
    this.#fQuote.setDelegate(this);
    this.setChild("quote", this.#fQuote);

    // Original article owner
    this.#fOwnerName = new FUserInfo();
    this.#fOwnerName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("ownerName", this.#fOwnerName);

    this.#fOwnerIcon = new FUserIcon();
    this.setChild("ownerIcon", this.#fOwnerIcon);

    this.#fAuthorName = new FUserInfo();
    this.#fAuthorName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("authorName", this.#fAuthorName);

    this.#fTags = new FFragmentList();
    this.setChild("tags", this.#fTags);

    this.#fBtnContext = new OptionContextButton();
    this.#fBtnContext.setTargetName("comment");
    this.#fBtnContext.setDelegate(this);
    this.setChild("btnContext", this.#fBtnContext);
  }

  getArticleId(): string | null { return this.#articleId; }

  setArticleId(id: string | null): void { this.#articleId = id; }
  setSizeType(st: string | null): void { this.#sizeType = st; }

  getFilesForThumbnailFragment(_fThumbnail: FFilesThumbnail): unknown[] {
    let a = Blog.getArticle(this.#articleId);
    return a ? a.getFiles() : [];
  }

  onQuotedElementRequestShowView(_fQuote: FQuoteElement, _view: View): void {
    if (!this.#articleId) {
      return;
    }
    const delegate = this.getDelegate<ArticleInfoDelegate>();
    if (delegate) {
      delegate.onClickInArticleInfoFragment(this, this.#articleId!);
    }
  }
  onThumbnailClickedInThumbnailFragment(_fThumbnail: FFilesThumbnail, idx: number): void {
    this.#showThumbnail(idx);
  }
  onOptionClickedInContextButtonFragment(_fBtn: OptionContextButton, value: unknown): void {
    const delegate = this.getDelegate<ArticleInfoDelegate>();
    if (delegate) {
      delegate.onContextOptionClickedInArticleInfoFragment(this, value);
    }
  }

  _renderOnRender(postInfoPanel: PPostInfoBase): void {
    let article = Blog.getArticle(this.#articleId);
    if (!article) {
      return;
    }
    if (this.#isArticleHasImage(article)) {
      postInfoPanel.enableImage();
    }

    this.#renderOwnerIcon(postInfoPanel.getOwnerIconPanel(), article);
    this.#renderOwnerName(postInfoPanel.getOwnerNamePanel(), article);
    this.#renderAuthorName(postInfoPanel.getAuthorNamePanel(), article);
    this.#renderTags(postInfoPanel.getTagsPanel() as PanelWrapper | null, article);
    this.#renderArticleText(postInfoPanel.getTitlePanel(),
                            postInfoPanel.getContentPanel(), article);

    if (article.isQuotePost()) {
      postInfoPanel.enableQuote();
      let p = postInfoPanel.getQuotePanel();
      if (p) {
        this.#renderQuote(p, article);
      } else {
        this.#renderSourceLink(postInfoPanel.getSourceLinkPanel(), article);
      }
    }

    this.#renderAttachment(postInfoPanel.getAttachmentPanel(), article);
    this.#renderThumbnail(postInfoPanel.getImagePanel() as PanelWrapper | null, article);
    this.#renderTime(postInfoPanel.getCreationTimeSmartPanel(), article);
    this.#renderDateTime(postInfoPanel.getCreationDateTimePanel(), article);
    this.#renderContext(postInfoPanel.getContextPanel(), article);
  }

  #isArticleHasImage(a: Article | null): boolean { return a !== null && a.getFiles().length > 0; }

  #onGoToSource(url: string): void { window.open(url, '_blank')?.focus(); }

  #renderTags(panel: PanelWrapper | null, article: Article): void {
    if (!panel) {
      return;
    }

    let tagIds = article.getTagIds();
    if (!tagIds) {
      return;
    }
    if (tagIds.length < 1) {
      return;
    }
    let pList = new ListPanel();
    pList.setClassName("tw:flex tw:justify-start tw:items-baseline");
    panel.wrapPanel(pList);

    this.#fTags.clear();
    for (let id of tagIds) {
      let f = new FTag();
      f.setTagId(id);
      this.#fTags.append(f);
      let p = new PanelWrapper();
      pList.pushPanel(p);
      f.attachRender(p);
      f.render();
    }
  }

  #renderArticleText(pTitle: Panel | null, pContent: Panel | null, article: Article): void {
    if (pContent) {
      let s = article.getContent();
      if (UtilitiesExt.isEmptyString(s)) {
        const creationTime = article.getCreationTime();
        if (creationTime) {
          s = UtilitiesExt.timestampToDateString(creationTime.getTime() /
                                                1000);
        }
      } else {
        if (s) {
          s = blogUtilities.stripSimpleTag(s, "p");
        }
      }
      pContent.replaceContent(Utilities.renderContent(s));
    }

    if (pTitle) {
      let s = article.getTitle();
      if (UtilitiesExt.isEmptyString(s) && !pContent) {
        // Use content if no title and no content panel
        s = article.getContent();
      }
      if (!UtilitiesExt.isEmptyString(s)) {
        s = blogUtilities.stripSimpleTag(s!, "p");
        pTitle.replaceContent(Utilities.renderContent(s));
      }
    }
  }

  #renderAttachment(panel: Panel | null, article: Article): void {
    if (!panel) {
      return;
    }
    let attachment = article.getAttachment();
    if (attachment) {
      this.#fAttachment.setFile(attachment);
      this.#fAttachment.attachRender(panel);
      this.#fAttachment.render();
    }
  }

  #renderSourceLink(panel: Panel | null, article: Article): void {
    if (!panel) {
      return;
    }
    let url = article.getExternalQuoteUrl();
    if (url) {
      let e = panel.getDomElement();
      if (e) {
        e.addEventListener("click", () => this.#onGoToSource(url));
      }
      panel.replaceContent(R.t("Source link"));
    }
  }

  #renderThumbnail(panel: PanelWrapper | null, article: Article): void {
    if (!panel) {
      return;
    }

    if (!this.#isArticleHasImage(article)) {
      return;
    }

    let p = new ThumbnailPanelWrapper();
    if (this.#isSquareImage()) {
      p.setClassName("tw:aspect-[1/1] tw:relative");
    }
    panel.wrapPanel(p);

    this.#fThumbnail.attachRender(p);
    this.#fThumbnail.render();
  }

  #isSquareImage(): boolean {
    return this.#sizeType == SocialItem.T_LAYOUT.MEDIUM ||
           this.#sizeType == SocialItem.T_LAYOUT.EXT_QUOTE_SMALL;
  }

  #getQuoteSize(): string {
    if (this.#sizeType == SocialItem.T_LAYOUT.LARGE) {
      return "FULL";
    } else {
      return "SMALL";
    }
  }

  #renderQuote(panel: Panel | null, article: Article): void {
    if (!panel) {
      return;
    }
    if (!article.isQuotePost()) {
      return;
    }
    this.#fQuote.setSize(this.#getQuoteSize());
    this.#fQuote.setItem(article.getLinkTo(), article.getLinkType());
    this.#fQuote.attachRender(panel);
    this.#fQuote.render();
  }

  #renderTime(panel: Panel | null, article: Article): void {
    if (!panel) {
      return;
    }
    const creationTime = article.getCreationTime();
    if (creationTime) {
      panel.replaceContent(Utilities.renderSmartTime(creationTime));
    }
  }

  #renderDateTime(panel: Panel | null, article: Article): void {
    if (!panel) {
      return;
    }
    const creationTime = article.getCreationTime();
    if (creationTime) {
      panel.replaceContent(UtilitiesExt.timestampToDateTimeString(
        creationTime.getTime() / 1000));
    }
  }

  #renderOwnerIcon(panel: Panel | null, article: Article): void {
    if (!panel) {
      return;
    }
    const ownerId = article.getOwnerId();
    if (!ownerId) {
      return;
    }
    this.#fOwnerIcon.setUserId(ownerId);
    this.#fOwnerIcon.attachRender(panel);
    this.#fOwnerIcon.render();
  }

  #renderOwnerName(panel: Panel | null, article: Article): void {
    if (!panel) {
      return;
    }
    const ownerId = article.getOwnerId();
    if (!ownerId) {
      return;
    }
    this.#fOwnerName.setUserId(ownerId);
    this.#fOwnerName.attachRender(panel);
    this.#fOwnerName.render();
  }

  #renderAuthorName(panel: Panel | null, article: Article): void {
    if (!panel) {
      return;
    }
    const authorId = article.getAuthorId();
    if (!authorId) {
      return;
    }
    this.#fAuthorName.setUserId(authorId);
    this.#fAuthorName.attachRender(panel);
    this.#fAuthorName.render();
  }

  #showThumbnail(idx: number): void {
    let a = Blog.getArticle(this.#articleId);
    if (!a) {
      return;
    }

    let lc = new LGallery();
    lc.setFiles(a.getFiles());
    lc.setSelection(idx);
    lc.setCommentThreadId(a.getId(), a.getSocialItemType());
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, lc, "Gallery");
  }

  #renderContext(panel: Panel | null, article: Article): void {
    if (!panel) {
      return;
    }

    let ops =
        this.getDataSource<ArticleInfoDataSource>()?.getContextOptionsForArticleInfoFragment(this, article);

    if (!ops) {
      return;
    }

    if (ops.length < 1) {
      return;
    }

    this.#fBtnContext.clearOptions();
    for (let op of ops) {
      this.#fBtnContext.addOption(op.name, op.value);
    }
    this.#fBtnContext.attachRender(panel);
    this.#fBtnContext.render();
  }
};
