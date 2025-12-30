import { Panel } from './Panel.js';
import { PanelWrapper } from './PanelWrapper.js';

const _CPT_ERROR = {
  MAIN : `<progress id="__ID_PROGRESS__" value="100" max="100"></progress>
  <div class="error-content flex center-align-items">
    <div id="__ID_TEXT__" class="w60 center-align s-font4"></div>
    <div id="__ID_BTN__" class="w40 center-align"></div>
  </div>`,
}

export class PError extends Panel {
  constructor() {
    super();
    this._pText = new Panel();
    this._pBtn = new PanelWrapper();
  }

  getTextPanel() { return this._pText; }
  getBtnPanel() { return this._pBtn; }

  setProgress(value) {
    let e = document.getElementById(this._getSubElementId("P"));
    if (e) {
      e.value = value;
    }
  }

  _renderFramework() {
    let s = _CPT_ERROR.MAIN;
    s = s.replace("__ID_PROGRESS__", this._getSubElementId("P"));
    s = s.replace("__ID_TEXT__", this._getSubElementId("T"));
    s = s.replace("__ID_BTN__", this._getSubElementId("B"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pText.attach(this._getSubElementId("T"));
    this._pBtn.attach(this._getSubElementId("B"));
  }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.PError = PError;
}
