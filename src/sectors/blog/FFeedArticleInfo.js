import { FAttachmentFile } from '../../lib/ui/controllers/fragments/FAttachmentFile.js';
import { ThumbnailPanelWrapper } from '../../lib/ui/renders/panels/ThumbnailPanelWrapper.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';

export class FFeedArticleInfo extends blog.FPostBase {
  #fAttachment;
  #fThumbnail;
  #fOwnerName;
  #fOwnerIcon;
  #fAuthorName;
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

    // Original article owner
    this.#fOwnerName = new S.hr.FUserInfo();
    this.#fOwnerName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("ownerName", this.#fOwnerName);

    this.#fOwnerIcon = new S.hr.FUserIcon();
    this.setChild("ownerIcon", this.#fOwnerIcon);

    this.#fAuthorName = new S.hr.FUserInfo();
    this.#fAuthorName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("authorName", this.#fAuthorName);
  }

  setArticleId(id) { this.#articleId = id; }
  setSizeType(st) { this.#sizeType = st; }

  getFilesForThumbnailFragment(fThumbnail) {
    let a = dba.Blog.getArticle(this.#articleId);
    return a ? a.getFiles() : [];
  }

  onThumbnailClickedInThumbnailFragment(fThumbnail, idx) {
    this.#showThumbnail(idx);
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
    this.#renderArticleText(postInfoPanel.getTitlePanel(),
                            postInfoPanel.getContentPanel(), article);

    this.#renderThumbnail(postInfoPanel.getImagePanel(), article);
    this.#renderTime(postInfoPanel.getCreationTimeSmartPanel(), article);
    this.#renderDateTime(postInfoPanel.getCreationDateTimePanel(), article);
  }

  #isArticleHasImage(a) { return a && a.getFiles().length; }

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
    return this.#sizeType == SocialItem.T_LAYOUT.MEDIUM ||
           this.#sizeType == SocialItem.T_LAYOUT.EXT_QUOTE_SMALL;
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
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FFeedArticleInfo = FFeedArticleInfo;
}
