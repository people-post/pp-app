(function(blog) {

const _CPT_WEB3_ARTICLE_EDITOR = {
  MAIN : `<div id="__ID_TITLE__"></div>
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

class PWeb3ArticleEditor extends blog.PArticleBase {
  #pTitle;
  #pAttachment;
  #pContent;
  #pBtnList;

  constructor() {
    super();
    this.#pTitle = new ui.Panel();
    this.#pAttachment = new ui.PanelWrapper();
    this.#pContent = new ui.PanelWrapper();
    this.#pBtnList = new ui.ListPanel();
  }

  getTitlePanel() { return this.#pTitle; }
  getAttachmentPanel() { return this.#pAttachment; }
  getContentPanel() { return this.#pContent; }
  getBtnListPanel() { return this.#pBtnList; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pAttachment.attach(this._getSubElementId("A"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pBtnList.attach(this._getSubElementId("B"));
  }

  _renderFramework() {
    let s = _CPT_WEB3_ARTICLE_EDITOR.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_ATTACHMENT__", this._getSubElementId("A"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_BTN_LIST__", this._getSubElementId("B"));
    return s;
  }
};

blog.PWeb3ArticleEditor = PWeb3ArticleEditor;
}(window.blog = window.blog || {}));
