const _CPT_DRAFT_ARTICLE_INFO = {
  MAIN : `<div id="__ID_WRAPPER__" class="info-panel draft">
    <div class="tw:p-[5px] tw:text-u-font5">
      <div class="tw:flex tw:justify-between">
        <div id="__ID_AUTHOR__"></div>
        <div id="__ID_TIME__" class="small-info-text"></div>
      </div>
      <div id="__ID_TAGS__"></div>
      <div id="__ID_TITLE__" class="title"></div>
      <div id="__ID_CONTENT__" class="tw:overflow-hidden"></div>
    </div>
  </div>`,
} as const;

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PDraftArticleInfo extends PPostInfoBase {
  #pAuthorName: PanelWrapper;
  #pTags: PanelWrapper;
  #pTitle: Panel;
  #pContent: PanelWrapper;
  #pTime: Panel;

  constructor() {
    super();
    this.#pAuthorName = new PanelWrapper();
    this.#pTags = new PanelWrapper();
    this.#pTitle = new Panel();
    this.#pContent = new PanelWrapper();
    this.#pTime = new Panel();
  }

  getTitlePanel(): Panel { return this.#pTitle; }
  getContentPanel(): PanelWrapper { return this.#pContent; }
  getAuthorNamePanel(): PanelWrapper { return this.#pAuthorName; }
  getTagsPanel(): PanelWrapper { return this.#pTags; }
  getCreationTimeSmartPanel(): Panel { return this.#pTime; }

  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "info-panel draft s-cfuncbg s-csecondary";
    }
  }

  _renderFramework(): string {
    let s: string = _CPT_DRAFT_ARTICLE_INFO.MAIN;
    s = s.replace("__ID_WRAPPER__", this._getSubElementId("W"));
    s = s.replace("__ID_AUTHOR__", this._getSubElementId("A"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_TAGS__", this._getSubElementId("TG"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pAuthorName.attach(this._getSubElementId("A"));
    this.#pTime.attach(this._getSubElementId("TM"));
    this.#pTags.attach(this._getSubElementId("TG"));
    this.#pTitle.attach(this._getSubElementId("TT"));
    this.#pContent.attach(this._getSubElementId("C"));
  }
};
