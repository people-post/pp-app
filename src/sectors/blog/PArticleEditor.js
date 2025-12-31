

const _CPT_ARTICLE_EDITOR = {
  MAIN : `<div id="__ID_TITLE__"></div>
  <br>
  <div id="__ID_FILES__"></div>
  <br>
  <div id="__ID_ATTACHMENT__"></div>
  <br>
  <div id="__ID_CONTENT__"></div>
  <br>
  <div id="__ID_QUOTE_URL__"></div>
  <br>
  <div id="__ID_QUOTE_PREVIEW__" class="pad5"></div>
  <br>
  <div id="__ID_TAGS__"></div>
  <br>
  <div id="__ID_OPTIONS__"></div>
  <br>
  <br>
  <br>
  <div id="__ID_BTN_LIST__"></div>
  <br>
  <br>`,
};

import { PArticleBase } from './PArticleBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';

export class PArticleEditor extends PArticleBase {
  #pTitle;
  #pFiles;
  #pAttachment;
  #pContent;
  #pTags;
  #pQuoteUrl;
  #pQuotePreview;
  #pOptions;
  #pBtnList;

  constructor() {
    super();
    this.#pTitle = new Panel();
    this.#pFiles = new PanelWrapper();
    this.#pAttachment = new PanelWrapper();
    this.#pContent = new PanelWrapper();
    this.#pTags = new SectionPanel("Menu tags");
    this.#pQuoteUrl = new PanelWrapper();
    this.#pQuotePreview = new PanelWrapper();
    this.#pOptions = new SectionPanel("Options");
    this.#pBtnList = new ListPanel();
  }

  getTitlePanel() { return this.#pTitle; }
  getFilesPanel() { return this.#pFiles; }
  getAttachmentPanel() { return this.#pAttachment; }
  getContentPanel() { return this.#pContent; }
  getTagsPanel() { return this.#pTags; }
  getQuoteUrlPanel() { return this.#pQuoteUrl; }
  getQuotePreviewPanel() { return this.#pQuotePreview; }
  getOptionsPanel() { return this.#pOptions; }
  getBtnListPanel() { return this.#pBtnList; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pFiles.attach(this._getSubElementId("F"));
    this.#pAttachment.attach(this._getSubElementId("A"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pTags.attach(this._getSubElementId("TG"));
    this.#pQuoteUrl.attach(this._getSubElementId("Q"));
    this.#pQuotePreview.attach(this._getSubElementId("QP"));
    this.#pOptions.attach(this._getSubElementId("O"));
    this.#pBtnList.attach(this._getSubElementId("B"));
  }

  _renderFramework() {
    let s = _CPT_ARTICLE_EDITOR.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_FILES__", this._getSubElementId("F"));
    s = s.replace("__ID_ATTACHMENT__", this._getSubElementId("A"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_TAGS__", this._getSubElementId("TG"));
    s = s.replace("__ID_QUOTE_URL__", this._getSubElementId("Q"));
    s = s.replace("__ID_QUOTE_PREVIEW__", this._getSubElementId("QP"));
    s = s.replace("__ID_OPTIONS__", this._getSubElementId("O"));
    s = s.replace("__ID_BTN_LIST__", this._getSubElementId("B"));
    return s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PArticleEditor = PArticleEditor;
}
