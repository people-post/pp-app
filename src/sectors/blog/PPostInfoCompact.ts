const _CPT_POST_INFO_COMPACT = {
  MAIN : `<div id="__ID_WRAPPER__" class="post-info-compact-wrapper">
  <div id="__ID_PIN__"></div>
  <div id="__ID_MAIN__" class="post-info compact tw-relative">
    <div class="tw-h-[60px] tw-overflow-hidden tw-flex tw-justify-between">
      <div class="tw-w-[60%] tw-flex-grow tw-flex tw-flex-col tw-justify-center">
        <div id="__ID_REF__" class="crosslink-note"></div>
        <div id="__ID_TITLE__" class="tw-text-u-font1 tw-font-bold tw-truncate"></div>
        <div id="__ID_DATE_TIME__" class="small-info-text"></div>
        <div id="__ID_QUOTE__"></div>
      </div>
      <div id="__ID_IMAGE__"></div>
    </div>
  </div>
  </div>`,
} as const;

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PUserReference } from '../../common/hr/PUserReference.js';

export class PPostInfoCompact extends PPostInfoBase {
  private _pTitle: PanelWrapper;
  private _pPin: Panel;
  private _pCrossRef: PUserReference;
  private _pQuote: PanelWrapper;
  private _pDateTime: Panel;
  private _pImage: PanelWrapper;

  constructor() {
    super();
    this._pTitle = new PanelWrapper();
    this._pPin = new Panel();
    this._pCrossRef = new PUserReference();
    this._pQuote = new PanelWrapper();
    this._pDateTime = new Panel();
    this._pImage = new PanelWrapper();
  }

  isColorInvertible(): boolean { return true; }

  getTitlePanel(): PanelWrapper { return this._pTitle; }
  getPinPanel(): Panel | null { return this._pPin; }
  getCrossRefPanel(): PUserReference { return this._pCrossRef; }
  getQuotePanel(): PanelWrapper | null { return this._pQuote; }
  getCreationDateTimePanel(): Panel { return this._pDateTime; }
  getImagePanel(): PanelWrapper | null { return this._pImage; }

  enableImage(): void { this._pImage.setClassName("tw-w-fullpx tw-flex-shrink-0"); }
  enableQuote(): void { this._pQuote.setClassName("tw-max-h-[20px] left-pad5 right-pad5"); }

  setVisibilityClassName(name: string): void {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "post-info compact tw-relative " + name;
    }
  }
  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "post-info-compact-wrapper s-cfuncbg s-csecondary";
    }
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pImage.attach(this._getSubElementId("I"));
    this._pPin.attach(this._getSubElementId("P"));
    this._pCrossRef.attach(this._getSubElementId("R"));
    this._pQuote.attach(this._getSubElementId("Q"));
    this._pDateTime.attach(this._getSubElementId("DT"));
  }

  _renderFramework(): string {
    let s = _CPT_POST_INFO_COMPACT.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_DATE_TIME__", this._getSubElementId("DT"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_PIN__", this._getSubElementId("P"));
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    s = s.replace("__ID_WRAPPER__", this._getSubElementId("W"));
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    return s;
  }
};
