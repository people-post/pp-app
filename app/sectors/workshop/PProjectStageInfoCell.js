(function(wksp) {
const _CPT_PROJECT_STAGE_INFO_CELL = {
  MAIN : `<div class="flex space-between">
    <div id="__ID_NAME__" class="s-font5 cdimgray"></div>
    <div id="__ID_ACTION__"></div>
  </div>`,
}

class PProjectStageInfoCell extends wksp.PProjectStageInfoBase {
  _renderFramework() {
    let s = _CPT_PROJECT_STAGE_INFO_CELL.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ACTION__", this._getSubElementId("A"));
    return s;
  }

  _onFrameworkDidAppear() {
    this._pName.attach(this._getSubElementId("N"));
    this._pOptionBtn.attach(this._getSubElementId("A"));
  }
};

wksp.PProjectStageInfoCell = PProjectStageInfoCell;
}(window.wksp = window.wksp || {}));
