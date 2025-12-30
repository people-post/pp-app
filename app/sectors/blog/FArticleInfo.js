import { FAttachmentFile } from '../../lib/ui/controllers/fragments/FAttachmentFile.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { OptionContextButton } from '../../lib/ui/controllers/fragments/OptionContextButton.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ThumbnailPanelWrapper } from '../../lib/ui/renders/panels/ThumbnailPanelWrapper.js';

export class FArticleInfo extends blog.FPostBase {
  #fAttachment;
  #fThumbnail;
  #fQuote;
  #fOwnerName;
  #fOwnerIcon;
  #fAuthorName;
  #fBtnContext;
  #fTags;
  #articleId = null;
  #sizeType = null;

  constructor() {
    super();
    this.#fAttachment = new FAttachmentFile();
    this.setChild("attachment", this.#fAttachment);

    this.#fThumbnail = new gui.FilesThumbnailFragment();
    this.#fThumbnail.setDataSource(this);
    this.#fThumbnail.setDelegate(this);
    this.setChild("thumbnail", this.#fThumbnail);

    this.#fQuote = new blog.FQuoteElement();
    this.#fQuote.setDelegate(this);
    this.setChild("quote", this.#fQuote);

    // Original article owner
    this.#fOwnerName = new S.hr.FUserInfo();
    this.#fOwnerName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("ownerName", this.#fOwnerName);

    this.#fOwnerIcon = new S.hr.FUserIcon();
    this.setChild("ownerIcon", this.#fOwnerIcon);

    this.#fAuthorName = new S.hr.FUserInfo();
    this.#fAuthorName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("authorName", this.#fAuthorName);

    this.#fTags = new FFragmentList();
    this.setChild("tags", this.#fTags);

    this.#fBtnContext = new OptionContextButton();
    this.#fBtnContext.setTargetName("comment");
    this.#fBtnContext.setDelegate(this);
    this.setChild("btnContext", this.#fBtnContext);
  }

  getArticleId() { return this.#articleId; }

  setArticleId(id) { this.#articleId = id; }
  setSizeType(st) { this.#sizeType = st; }

  getFilesForThumbnailFragment(fThumbnail) {
    let a = dba.Blog.getArticle(this.#articleId);
    return a ? a.getFiles() : [];
  }

  onQuotedElementRequestShowView(fQuote, view) {
    this._delegate.onClickInArticleInfoFragment(this, this.#articleId);
  }
  onThumbnailClickedInThumbnailFragment(fThumbnail, idx) {
    this.#showThumbnail(idx);
  }
  onOptionClickedInContextButtonFragment(fBtn, value) {
    this._delegate.onContextOptionClickedInArticleInfoFragment(this, value);
  }

  _renderOnRender(postInfoPanel) {
    let article = dba.Blog.getArticle(this.#articleId);
    if (!article) {
      return;
    }
    if (this.#isArticleHasImage(article)) {
      postInfoPanel.enableImage();
    }

    this.#renderOwnerIcon(postInfoPanel.getOwnerIconPanel(), article);
    this.#renderOwnerName(postInfoPanel.getOwnerNamePanel(), article);
    this.#renderAuthorName(postInfoPanel.getAuthorNamePanel(), article);
    this.#renderTags(postInfoPanel.getTagsPanel(), article);
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
    this.#renderThumbnail(postInfoPanel.getImagePanel(), article);
    this.#renderTime(postInfoPanel.getCreationTimeSmartPanel(), article);
    this.#renderDateTime(postInfoPanel.getCreationDateTimePanel(), article);
    this.#renderContext(postInfoPanel.getContextPanel(), article);
  }

  #isArticleHasImage(a) { return a && a.getFiles().length; }

  #onGoToSource(url) { window.open(url, '_blank').focus(); }

  #renderTags(panel, article) {
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
    pList.setClassName("flex flex-start baseline-align-items");
    panel.wrapPanel(pList);

    this.#fTags.clear();
    for (let id of tagIds) {
      let f = new gui.FTag();
      f.setTagId(id);
      this.#fTags.append(f);
      let p = new PanelWrapper();
      pList.pushPanel(p);
      f.attachRender(p);
      f.render();
    }
  }

  #renderArticleText(pTitle, pContent, article) {
    if (pContent) {
      let s = article.getContent();
      if (ext.Utilities.isEmptyString(s)) {
        s = ext.Utilities.timestampToDateString(article.getCreationTime() /
                                                1000);
      } else {
        s = blog.Utilities.stripSimpleTag(s, "p");
      }
      pContent.replaceContent(Utilities.renderContent(s));
    }

    if (pTitle) {
      let s = article.getTitle();
      if (ext.Utilities.isEmptyString(s) && !pContent) {
        // Use content if no title and no content panel
        s = article.getContent();
      }
      if (!ext.Utilities.isEmptyString(s)) {
        s = blog.Utilities.stripSimpleTag(s, "p");
        pTitle.replaceContent(Utilities.renderContent(s));
      }
    }
  }

  #renderAttachment(panel, article) {
    if (!panel) {
      return;
    }
    if (article.getAttachment()) {
      this.#fAttachment.setFile(article.getAttachment());
      this.#fAttachment.attachRender(panel);
      this.#fAttachment.render();
    }
  }

  #renderSourceLink(panel, article) {
    if (!panel) {
      return;
    }

    let url = article.getExternalQuoteUrl();
    if (url) {
      let e = panel.getDomElement();
      e.addEventListener("click", evt => this.#onGoToSource(url));
      panel.replaceContent(R.t("Source link"));
    }
  }

  #renderThumbnail(panel, article) {
    if (!panel) {
      return;
    }

    if (!this.#isArticleHasImage(article)) {
      return;
    }

    let p = new ThumbnailPanelWrapper();
    if (this.#isSquareImage()) {
      p.setClassName("aspect-1-1-frame");
    }
    panel.wrapPanel(p);

    this.#fThumbnail.attachRender(p);
    this.#fThumbnail.render();
  }

  #isSquareImage() {
    return this.#sizeType == dat.SocialItem.T_LAYOUT.MEDIUM ||
           this.#sizeType == dat.SocialItem.T_LAYOUT.EXT_QUOTE_SMALL;
  }

  #getQuoteSize() {
    if (this.#sizeType == dat.SocialItem.T_LAYOUT.LARGE) {
      return "FULL";
    } else {
      return "SMALL";
    }
  }

  #renderQuote(panel, article) {
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

  #renderTime(panel, article) {
    if (!panel) {
      return;
    }
    panel.replaceContent(Utilities.renderSmartTime(article.getCreationTime()));
  }

  #renderDateTime(panel, article) {
    if (!panel) {
      return;
    }
    panel.replaceContent(ext.Utilities.timestampToDateTimeString(
        article.getCreationTime() / 1000));
  }

  #renderOwnerIcon(panel, article) {
    if (!panel) {
      return;
    }
    this.#fOwnerIcon.setUserId(article.getOwnerId());
    this.#fOwnerIcon.attachRender(panel);
    this.#fOwnerIcon.render();
  }

  #renderOwnerName(panel, article) {
    if (!panel) {
      return;
    }
    this.#fOwnerName.setUserId(article.getOwnerId());
    this.#fOwnerName.attachRender(panel);
    this.#fOwnerName.render();
  }

  #renderAuthorName(panel, article) {
    if (!panel) {
      return;
    }
    this.#fAuthorName.setUserId(article.getAuthorId());
    this.#fAuthorName.attachRender(panel);
    this.#fAuthorName.render();
  }

  #showThumbnail(idx) {
    let a = dba.Blog.getArticle(this.#articleId);
    if (!a) {
      return;
    }
    let lc = new gui.LGallery();
    lc.setFiles(a.getFiles());
    lc.setSelection(idx);
    lc.setCommentThreadId(a.getId(), a.getSocialItemType());
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, lc, "Gallery");
  }

  #renderContext(panel, article) {
    if (!panel) {
      return;
    }

    let ops =
        this._dataSource.getContextOptionsForArticleInfoFragment(this, article);

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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FArticleInfo = FArticleInfo;
}
