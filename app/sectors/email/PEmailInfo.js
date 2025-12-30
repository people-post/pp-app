
import { PEmailBase } from './PEmailBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

const _CPT_EMAIL_INFO = {
  MAIN : `<div class="aspect-5-1-frame">
    <div class="aspect-content border-box top-pad5px right-pad5px">
      <div class="flex flex-start h100">
        <div id="__ID_ICON__" class="w5 flex-noshrink">
        </div>
        <div id="__ID_MAIN__" class="email-info bdlightgray">
          <div class="flex space-between">
            <div id="__ID_SENDER__" class="u-font5 bold"></div>
            <div id="__ID_TIME__" class="small-info-text"></div>
          </div>
          <div id="__ID_TITLE__" class="u-font5"></div>
          <div id="__ID_CONTENT__" class="u-font5 cdimgray"></div>
        </div>
      </div>
    </div>
  </div>`,
}

export class PEmailInfo extends PEmailBase {
  constructor() {
    super();
    this._pIcon = new Panel();
  }

  isColorInvertible() { return true; }

  getIconPanel() { return this._pIcon; }

  invertColor() {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "email-info s-cprimebd";
    }
  }

  _renderFramework() {
    let s = _CPT_EMAIL_INFO.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TI"));
    s = s.replace("__ID_SENDER__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pIcon.attach(this._getSubElementId("I"));
    this._pTitle.attach(this._getSubElementId("T"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pTime.attach(this._getSubElementId("TI"));
    this._pSender.attach(this._getSubElementId("S"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.emal = window.emal || {};
  window.emal.PEmailInfo = PEmailInfo;
}
