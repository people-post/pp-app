import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FAttachmentFile } from '../../lib/ui/controllers/fragments/FAttachmentFile.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { FGallery } from '../../common/gui/FGallery.js';

export class FArticle extends Fragment {
  #fQuote;
  #fGallery;
  #fAttachment;
  #fTags;
  #articleId = null;

  constructor() {
    super();
    this.#fGallery = new FGallery();
    this.#fGallery.setDataSource(this);
    this.#fGallery.setDelegate(this);
    this.setChild("gallery", this.#fGallery);

    this.#fQuote = new blog.FQuoteElement();
    this.#fQuote.setDelegate(this);
    this.setChild("quote", this.#fQuote);

    this.#fAttachment = new FAttachmentFile();
    this.setChild("attachment", this.#fAttachment);

    this.#fTags = new FSimpleFragmentList();
    this.#fTags.setGridMode(true);
    this.setChild("tags", this.#fTags);
  }

  setArticleId(id) { this.#articleId = id; }

  onQuotedElementRequestShowView(fQuote, view) {
    this.onFragmentRequestShowView(this, view);
  }
  onSimpleButtonClicked(fBtn) {
    let v = fBtn.getValue();
    switch (v) {
    default:
      this._delegate.onTagClickedInArticleFragment(this, v);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.GROUPS:
      this.#onGroupsUpdate(data);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(postPanel) {
    let article = dba.Blog.getArticle(this.#articleId);
    if (!article) {
      return;
    }
    let p = postPanel.getTitlePanel();
    p.replaceContent(this.#renderTitle(article.getTitle()));

    p = postPanel.getTCreateDecorPanel();
    p.replaceContent("Created at");

    p = postPanel.getCreationDateTimePanel();
    p.replaceContent(ext.Utilities.timestampToDateTimeString(
        article.getCreationTime() / 1000));

    p = postPanel.getTUpdateDecorPanel();
    p.replaceContent("Updated at");

    p = postPanel.getUpdateDateTimePanel();
    p.replaceContent(ext.Utilities.timestampToDateTimeString(
        article.getUpdateTime() / 1000));

    this.#renderTags(postPanel.getTagsPanel(), article.getTagIds());

    if (article.getAttachment()) {
      p = postPanel.getAttachmentPanel();
      this.#fAttachment.setFile(article.getAttachment());
      this.#fAttachment.attachRender(p);
      this.#fAttachment.render();
    }

    p = postPanel.getContentPanel();
    p.replaceContent(Utilities.renderContent(article.getContent()));

    p = postPanel.getGalleryPanel();
    this.#fGallery.setFiles(article.getFiles());
    this.#fGallery.attachRender(p);
    this.#fGallery.render();

    if (article.isQuotePost()) {
      p = postPanel.getQuotePanel();
      this.#fQuote.setItem(article.getLinkTo(), article.getLinkType());
      this.#fQuote.attachRender(p);
      this.#fQuote.render();
    }
  }

  #onGroupsUpdate(groups) {
    let a = dba.Blog.getArticle(this.#articleId);
    if (!a) {
      return;
    }
    for (let g of groups) {
      for (let id of a.getTagIds()) {
        if (id == g.getId()) {
          this.render();
          break;
        }
      }
    }
  }

  #renderTags(panel, tagIds) {
    if (!tagIds) {
      return;
    }
    if (tagIds.length < 1) {
      return;
    }
    let pList = new ListPanel();
    pList.setClassName("flex flex-start baseline-align-items");
    panel.wrapPanel(pList);
    let p = new Panel();
    p.setClassName("small-info-text");
    pList.pushPanel(p);
    p.replaceContent("Tags: ");
    p = new PanelWrapper();
    pList.pushPanel(p);

    this.#fTags.clear();
    for (let id of tagIds) {
      let f = new Button();
      f.setDelegate(this);
      let t = dba.Groups.getTag(id);
      f.setName(t ? t.getName() : "...");
      f.setValue(id);
      f.setLayoutType(Button.LAYOUT_TYPE.SMALL);
      if (t) {
        f.setTheme(t.getTheme());
      }
      this.#fTags.append(f);
    }
    this.#fTags.attachRender(p);
    this.#fTags.render();
  }

  #renderTitle(title) {
    if (title && title.length) {
      return Utilities.renderContent(title);
    }
    return "...";
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FArticle = FArticle;
}
