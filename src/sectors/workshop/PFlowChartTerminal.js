
const _CPT_FLOW_CHART_TERMINAL = {
  MAIN : `<div id="__ID_MAIN__" class="flow-terminal">
    <div id="__ID_WRAPPER__" class="flow-terminal-content"></div>
  </div>`,
}
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PFlowChartTerminal extends PanelWrapper {
  constructor() {
    super();
    this._elementType = "foreignObject";
    this._namespace = "http://www.w3.org/2000/svg";
  }

  setThemeClassName(name) {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      if (name && name.length) {
        e.className = "flow-terminal " + name;
      } else {
        e.className = "flow-terminal";
      }
    }
  }

  setMainElementAttribute(name, value) {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.setAttribute(name, value);
    }
  }

  _getWrapperFramework(wrapperElementId) {
    let s = _CPT_FLOW_CHART_TERMINAL.MAIN;
    s = s.replace("__ID_WRAPPER__", wrapperElementId);
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    return s;
  }
};
