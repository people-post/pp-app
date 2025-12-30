
const _CPT_FLOW_CHART_PROGRESS = {
  MAIN : `<div id="__ID_MAIN__" class="flow-progress">
    <div id="__ID_WRAPPER__" class="flow-progress-content"></div>
  </div>`,
}

class PFlowChartProgress extends ui.PanelWrapper {
  constructor() {
    super();
    this._elementType = "foreignObject";
    this._namespace = "http://www.w3.org/2000/svg";
  }

  setThemeClassName(name) {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      if (name && name.length) {
        e.className = "flow-progress " + name;
      } else {
        e.className = "flow-progress";
      }
    }
  }

  _getWrapperFramework(wrapperElementId) {
    let s = _CPT_FLOW_CHART_PROGRESS.MAIN;
    s = s.replace("__ID_WRAPPER__", wrapperElementId);
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    return s;
  }
};

wksp.PFlowChartProgress = PFlowChartProgress;
}(window.wksp = window.wksp || {}));
