const _CPT_POST_INFO_BIG_HEAD = {
  MAIN : `<div id="__ID_IMAGE__"></div>
  <div class="post-info-big-head-wrapper">
    <div class="post-info big-head">
      <div class="aspect-5-1-frame">
        <div class="aspect-content hide-overflow">
          <div id="__ID_REF__" class="crosslink-note"></div>
          <div id="__ID_TITLE__" class="u-font1 bold ellipsis"></div>
          <div id="__ID_DATE_TIME__" class="small-info-text"></div>
          <div id="__ID_QUOTE__"></div>
        </div>
      </div>
    </div>
  </div>`,
} as const;

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PUserReference } from '../../common/hr/PUserReference.js';

export class PPostInfoBigHead extends PPostInfoBase {
  private _pTitle: Panel;
  private _pCrossRef: PUserReference;
  private _pQuote: PanelWrapper;
  private _pDateTime: Panel;
  private _pImage: PanelWrapper;

  constructor() {
    super();
    this._pTitle = new Panel();
    this._pCrossRef = new PUserReference();
    this._pQuote = new PanelWrapper();
    this._pDateTime = new Panel();
    this._pImage = new PanelWrapper();
  }

  getTitlePanel(): Panel { return this._pTitle; }
  getPinPanel(): Panel | null { return null; }
  getCrossRefPanel(): PUserReference { return this._pCrossRef; }
  getQuotePanel(): PanelWrapper | null { return this._pQuote; }
  getCreationDateTimePanel(): Panel { return this._pDateTime; }
  getImagePanel(): PanelWrapper | null { return this._pImage; }

  enableQuote(): void { this._pQuote.setClassName("left-pad5 right-pad5"); }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pImage.attach(this._getSubElementId("I"));
    this._pCrossRef.attach(this._getSubElementId("R"));
    this._pQuote.attach(this._getSubElementId("Q"));
    this._pDateTime.attach(this._getSubElementId("DT"));
  }

  _renderFramework(): string {
    let s = _CPT_POST_INFO_BIG_HEAD.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    s = s.replace("__ID_DATE_TIME__", this._getSubElementId("DT"));
    return s;
  }
};
