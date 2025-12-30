
const _CPT_POST_INFO_CARD = {
  MAIN : `<div class="info-panel card">
    <div>
      <div id="__ID_IMAGE__"></div>
    </div>
    <div class="u-font3 line-height32">
      <div id="__ID_TAGS__"></div>
      <div id="__ID_TITLE__" class="title"></div>
      <div id="__ID_CONTENT__" class="hide-overflow"></div>
      <div class="flex space-between">
        <div id="__ID_TIME__" class="small-info-text"></div>
        <div id="__ID_SOCIAL__" class="h-pad5px flex-grow"></div>
        <div id="__ID_SOURCE_LINK__" class="u-font5 clickable underline s-cfunc"></div>
      </div>
    </div>
  </div>`,
}

class PPostInfoCard extends gui.PPostInfoBase {
  #pTags;
  #pTitle;
  #pContent;
  #pTime;
  #pSourceLink;
  #pImage;

  constructor() {
    super();
    this.#pTags = new ui.PanelWrapper();
    this.#pTitle = new ui.Panel();
    this.#pContent = new ui.PanelWrapper();
    this.#pTime = new ui.Panel();
    this.#pSourceLink = new ui.Panel();
    this.#pImage = new ui.PanelWrapper();
  }

  isClickable() { return false; }

  getTagsPanel() { return this.#pTags; }
  getTitlePanel() { return this.#pTitle; }
  getContentPanel() { return this.#pContent; }
  getCreationTimeSmartPanel() { return this.#pTime; }
  getSourceLinkPanel() { return this.#pSourceLink; }
  getImagePanel() { return this.#pImage; }

  _renderFramework() {
    let s = _CPT_POST_INFO_CARD.MAIN;
    s = s.replace("__ID_TAGS__", this._getSubElementId("TG"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_SOURCE_LINK__", this._getSubElementId("SL"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTags.attach(this._getSubElementId("TG"));
    this.#pTitle.attach(this._getSubElementId("TT"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pTime.attach(this._getSubElementId("TM"));
    this.#pSourceLink.attach(this._getSubElementId("SL"));
    this.#pImage.attach(this._getSubElementId("I"));
  }
};

blog.PPostInfoCard = PPostInfoCard;
}(window.blog = window.blog || {}));
