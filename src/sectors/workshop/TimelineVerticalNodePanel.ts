const _CPT_TIMELINE_VERTICAL_NODE = {
  MAIN : `<div class="flex">
  <div class="w20 flex flex-center">
    <div class= "v-progress-wrapper w30px">
      <div class="rpe node frame vertical offset-top50" style="transform:translateY(-50%);">
        <div class="rpe-node-content-wrapper">
          <div id="__ID_NODE__"></div>
        </div>
      </div>
      <div id="__ID_U_PIPE__"></div>
      <div id="__ID_L_PIPE__"></div>
      <div id="__ID_U_FLOW__"></div>
      <div id="__ID_L_FLOW__"></div>
    </div>
  </div>
  <div id="__ID_CONTENT_WRAPPER__" class="w80 pad5px"></div>
  </div>`,
} as const;

import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class TimelineVerticalNodePanel extends PanelWrapper {
  protected _pNode: Panel;
  protected _pUpperPipe: Panel;
  protected _pLowerPipe: Panel;
  protected _pUpperFlow: Panel;
  protected _pLowerFlow: Panel;

  constructor() {
    super();
    this._pNode = new Panel();
    this._pNode.setClassName("rpe-content node bggreen");
    this._pUpperPipe = new Panel();
    this._pUpperPipe.setClassName("rpe pipe vertical upper");
    this._pLowerPipe = new Panel();
    this._pLowerPipe.setClassName("rpe pipe vertical lower");
    this._pUpperFlow = new Panel();
    this._pUpperFlow.setClassName("rpe-content pipe vertical upper bggreen");
    this._pLowerFlow = new Panel();
    this._pLowerFlow.setClassName("rpe-content pipe vertical lower bggreen");
  }

  disableUpperPipe(): void {
    this.disableUpperFlow();
    this._pUpperPipe.setClassName("");
  }
  disableLowerPipe(): void {
    this.disableLowerFlow();
    this._pLowerPipe.setClassName("");
  }
  disableUpperFlow(): void { this._pUpperFlow.setClassName(""); }
  disableLowerFlow(): void { this._pLowerFlow.setClassName(""); }
  disableNodeFlow(): void {
    this._pNode.setClassName("rpe-content node bglightgray");
  }

  _getWrapperFramework(wrapperElementId: string): string {
    let s = _CPT_TIMELINE_VERTICAL_NODE.MAIN;
    s = s.replace("__ID_CONTENT_WRAPPER__", wrapperElementId);
    s = s.replace("__ID_NODE__", this._getSubElementId("N"));
    s = s.replace("__ID_U_PIPE__", this._getSubElementId("UP"));
    s = s.replace("__ID_L_PIPE__", this._getSubElementId("LP"));
    s = s.replace("__ID_U_FLOW__", this._getSubElementId("UF"));
    s = s.replace("__ID_L_FLOW__", this._getSubElementId("LF"));
    return s;
  }

  _onWrapperFrameworkDidAppear(): void {
    this._pNode.attach(this._getSubElementId("N"));
    this._pUpperPipe.attach(this._getSubElementId("UP"));
    this._pLowerPipe.attach(this._getSubElementId("LP"));
    this._pUpperFlow.attach(this._getSubElementId("UF"));
    this._pLowerFlow.attach(this._getSubElementId("LF"));
  }
}
