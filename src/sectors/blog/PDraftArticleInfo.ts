const _CPT_DRAFT_ARTICLE_INFO = {
  MAIN : `<div id="__ID_WRAPPER__" class="info-panel draft">
    <div class="pad5px u-font5">
      <div class="flex space-between">
        <div id="__ID_AUTHOR__"></div>
        <div id="__ID_TIME__" class="small-info-text"></div>
      </div>
      <div id="__ID_TAGS__"></div>
      <div id="__ID_TITLE__" class="title"></div>
      <div id="__ID_CONTENT__" class="hide-overflow"></div>
    </div>
  </div>`,
} as const;

import { PArticleBase } from './PArticleBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PDraftArticleInfo extends PArticleBase {
  private _pAuthorName: PanelWrapper;
  private _pTags: PanelWrapper;
  private _pTitle: Panel;
  private _pContent: PanelWrapper;
  private _pTime: Panel;

  constructor() {
    super();
    this._pAuthorName = new PanelWrapper();
    this._pTags = new PanelWrapper();
    this._pTitle = new Panel();
    this._pContent = new PanelWrapper();
    this._pTime = new Panel();
  }

  getTitlePanel(): Panel { return this._pTitle; }
  getContentPanel(): PanelWrapper { return this._pContent; }
  getOwnerIconPanel(): Panel | null { return null; }
  getOwnerNamePanel(): Panel | null { return null; }
  getAuthorNamePanel(): PanelWrapper { return this._pAuthorName; }
  getTagsPanel(): PanelWrapper { return this._pTags; }
  getCreationTimeSmartPanel(): Panel { return this._pTime; }
  getCreationDateTimePanel(): Panel | null { return null; }

  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "info-panel draft s-cfuncbg s-csecondary";
    }
  }

  _renderFramework(): string {
    let s = _CPT_DRAFT_ARTICLE_INFO.MAIN;
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
    this._pAuthorName.attach(this._getSubElementId("A"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pTags.attach(this._getSubElementId("TG"));
    this._pTitle.attach(this._getSubElementId("TT"));
    this._pContent.attach(this._getSubElementId("C"));
  }
};
