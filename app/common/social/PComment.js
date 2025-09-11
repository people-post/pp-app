(function(socl) {
const _CPT_COMMENT = {
  MAIN : `<div class="flex bd-b-1px bd-b-solid bdlightgray v-pad5px">
  <div id="__ID_AUTHOR_ICON__" class="w50px flex-noshrink"></div>
  <div class="flex-grow">
    <div class="flex space-between">
      <div id="__ID_AUTHOR_NAME__" class="comment-info-text"></div>
      <div id="__ID_EXTRA__" class="comment-info-extra"></div>
    </div>
    <div id="__ID_CONTENT__" class="comment-info-text s-font5"></div>
  </div>
  </div>`,
};

class PComment extends ui.Panel {
  #pAuthorIcon;
  #pAuthorName;
  #pContent;
  #pExtra;

  constructor() {
    super();
    this.#pAuthorIcon = new ui.PanelWrapper();
    this.#pAuthorName = new ui.PanelWrapper();
    this.#pContent = new ui.PanelWrapper();
    this.#pExtra = new ui.PanelWrapper();
  }

  getAuthorIconPanel() { return this.#pAuthorIcon; }
  getAuthorNamePanel() { return this.#pAuthorName; }
  getContentPanel() { return this.#pContent; }
  getExtraPanel() { return this.#pExtra; }

  _renderFramework() {
    let s = _CPT_COMMENT.MAIN;
    s = s.replace("__ID_AUTHOR_ICON__", this._getSubElementId("AI"));
    s = s.replace("__ID_AUTHOR_NAME__", this._getSubElementId("AN"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_EXTRA__", this._getSubElementId("E"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pAuthorIcon.attach(this._getSubElementId("AI"));
    this.#pAuthorName.attach(this._getSubElementId("AN"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pExtra.attach(this._getSubElementId("E"));
  }
};

socl.PComment = PComment;
}(window.socl = window.socl || {}));
