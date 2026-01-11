import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FAttachmentFile } from '../../lib/ui/controllers/fragments/FAttachmentFile.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { FGallery } from '../../common/gui/FGallery.js';
import { FQuoteElement } from './FQuoteElement.js';
import { Blog } from '../../common/dba/Blog.js';
import { Groups } from '../../common/dba/Groups.js';
import { T_DATA } from '../../common/plt/Events.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { Utilities } from '../../common/Utilities.js';
import { PostInfoPanel } from './PPost.js';

export class FArticle extends Fragment {
  #fQuote: FQuoteElement;
  #fGallery: FGallery;
  #fAttachment: FAttachmentFile;
  #fTags: FSimpleFragmentList;
  #articleId: string | null = null;

  constructor() {
    super();
    this.#fGallery = new FGallery();
    this.#fGallery.setDataSource(this);
    this.#fGallery.setDelegate(this);
    this.setChild("gallery", this.#fGallery);

    this.#fQuote = new FQuoteElement();
    this.#fQuote.setDelegate(this);
    this.setChild("quote", this.#fQuote);

    this.#fAttachment = new FAttachmentFile();
    this.setChild("attachment", this.#fAttachment);

    this.#fTags = new FSimpleFragmentList();
    this.#fTags.setGridMode(true);
    this.setChild("tags", this.#fTags);
  }

  setArticleId(id: string | null): void { this.#articleId = id; }

  onQuotedElementRequestShowView(_fQuote: FQuoteElement, view: unknown): void {
    this.onFragmentRequestShowView(this, view);
  }
  onSimpleButtonClicked(fBtn: Button): void {
    let v = fBtn.getValue();
    switch (v) {
    default:
      this._delegate.onTagClickedInArticleFragment(this, v);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.GROUPS:
      this.#onGroupsUpdate(data as unknown[]);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(postPanel: PostInfoPanel): void {
    let article = Blog.getArticle(this.#articleId);
    if (!article) {
      return;
    }
    let p = postPanel.getTitlePanel();
    p.replaceContent(this.#renderTitle(article.getTitle()));

    p = postPanel.getTCreateDecorPanel();
    p.replaceContent("Created at");

    p = postPanel.getCreationDateTimePanel();
    p.replaceContent(UtilitiesExt.timestampToDateTimeString(
        article.getCreationTime() / 1000));

    p = postPanel.getTUpdateDecorPanel();
    p.replaceContent("Updated at");

    p = postPanel.getUpdateDateTimePanel();
    p.replaceContent(UtilitiesExt.timestampToDateTimeString(
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
      if (p) {
        this.#fQuote.setItem(article.getLinkTo(), article.getLinkType());
        this.#fQuote.attachRender(p);
        this.#fQuote.render();
      }
    }
  }

  #onGroupsUpdate(groups: unknown[]): void {
    let a = Blog.getArticle(this.#articleId);
    if (!a) {
      return;
    }
    for (let g of groups) {
      for (let id of a.getTagIds()) {
        if (id == (g as {getId(): string}).getId()) {
          this.render();
          break;
        }
      }
    }
  }

  #renderTags(panel: Panel | null, tagIds: string[] | null): void {
    if (!tagIds) {
      return;
    }
    if (tagIds.length < 1) {
      return;
    }
    if (!panel) {
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
      let t = Groups.getTag(id);
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

  #renderTitle(title: string | null): string {
    if (title && title.length) {
      return Utilities.renderContent(title);
    }
    return "...";
  }
}
