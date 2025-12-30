

const _CPT_WEB3_ARTICLE_EDITOR = {
  MAIN : `<div id="__ID_TITLE__"></div>
  <br>
  <div id="__ID_FILES__"></div>
  <br>
  <div id="__ID_ATTACHMENT__"></div>
  <br>
  <div id="__ID_CONTENT__"></div>
  <br>
  <br>
  <div id="__ID_BTN_LIST__"></div>
  <br>
  <br>`,
};

import { PArticleBase } from './PArticleBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';

export class PWeb3ArticleEditor extends PArticleBase {
  #pTitle;
  #pFiles;
  #pAttachment;
  #pContent;
  #pBtnList;

  constructor() {
    super();
    this.#pTitle = new Panel();
    this.#pFiles = new PanelWrapper();
    this.#pAttachment = new PanelWrapper();
    this.#pContent = new PanelWrapper();
    this.#pBtnList = new ListPanel();
  }

  getTitlePanel() { return this.#pTitle; }
  getFilesPanel() { return this.#pFiles; }
  getAttachmentPanel() { return this.#pAttachment; }
  getContentPanel() { return this.#pContent; }
  getBtnListPanel() { return this.#pBtnList; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pFiles.attach(this._getSubElementId("F"));
    this.#pAttachment.attach(this._getSubElementId("A"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pBtnList.attach(this._getSubElementId("B"));
  }

  _renderFramework() {
    let s = _CPT_WEB3_ARTICLE_EDITOR.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_FILES__", this._getSubElementId("F"));
    s = s.replace("__ID_ATTACHMENT__", this._getSubElementId("A"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_BTN_LIST__", this._getSubElementId("B"));
    return s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PWeb3ArticleEditor = PWeb3ArticleEditor;
}
