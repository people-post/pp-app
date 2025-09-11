(function(ui) {
const _CPT_SPLIT = {
  MAIN : `<div id="__ID_LEFT__"></div>
  <div id="__ID_RIGHT__"></div>`,
}

class SplitPanel extends ui.Panel {
  constructor() {
    super();
    this.setClassName("flex space-between");
    this._pLeft = new ui.PanelWrapper();
    this._pRight = new ui.PanelWrapper();
    this._mode = this.constructor.M_SIDE;
  }

  getLeftPanel() { return this._pLeft; }
  getRightPanel() { return this._pRight; }

  _renderFramework() {
    let s = _CPT_SPLIT.MAIN;
    s = s.replace("__ID_LEFT__", this._getSubElementId("L"));
    s = s.replace("__ID_RIGHT__", this._getSubElementId("R"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pLeft.attach(this._getSubElementId("L"));
    this._pRight.attach(this._getSubElementId("R"));
  }
};

ui.SplitPanel = SplitPanel;
}(window.ui = window.ui || {}));