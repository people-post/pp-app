
// This is maily for JournalIssue
const _CPT_POST_INFO_FULL_PAGE = {
  MAIN : `<div class="h100 h-pad5 v-pad5px y-scroll no-scrollbar">
    <div id="__ID_TITLE__" class="u-font2 bold"></div>
    <div id="__ID_CONTENT__"></div>
  </div>`,
}

class PPostInfoFullPage extends gui.PPostInfoBase {
  #pTitle;
  #pContent;

  constructor() {
    super();
    this.#pTitle = new ui.Panel();
    this.#pContent = new ui.PanelWrapper();
  }

  getTitlePanel() { return this.#pTitle; }
  getContentPanel() { return this.#pContent; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
  }

  _renderFramework() {
    let s = _CPT_POST_INFO_FULL_PAGE.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }
};

blog.PPostInfoFullPage = PPostInfoFullPage;
}(window.blog = window.blog || {}));
