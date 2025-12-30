
const _CPT_PROJECT_STAGE_INFO_COMPACT = {
  MAIN : `<div class="flex space-between baseline-align-items">
      <div>
        <span class="small-info-text">Stage:</span>
        <span id="__ID_NAME__" class="small-info-text"></span>
      </div>
      <div id="__ID_ACTION__"></div>
    </div>`,
}

export class PProjectStageInfoCompact extends wksp.PProjectStageInfoBase {
  setThemeForState(state, status) {
    this._pName.setClassName("small-info-text status-text " +
                             Utilities.getStateClassName(state, status));
  }

  _renderFramework() {
    let s = _CPT_PROJECT_STAGE_INFO_COMPACT.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ACTION__", this._getSubElementId("A"));
    return s;
  }

  _onFrameworkDidAppear() {
    this._pName.attach(this._getSubElementId("N"));
    this._pOptionBtn.attach(this._getSubElementId("A"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.PProjectStageInfoCompact = PProjectStageInfoCompact;
}
