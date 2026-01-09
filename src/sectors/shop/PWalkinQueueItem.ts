
const _CPT_WALKIN_QUEUE_ITEM = {
  MAIN : `<div class="pad5px">
    <div id="__ID_STATUS__"></div>
    <br>
    <div id="__ID_NAME_DECOR__"></div>
    <div id="__ID_NAME__" class="s-font001 ellipsis center-align"></div>
    <br>
    <div id="__ID_AGENT__"></div>
    <br>
    <div class="flex space-around">
      <div id="__ID_ACTION1__"></div>
      <div id="__ID_ACTION2__"></div>
    </div>
  </div>`,
} as const;

import { PWalkinQueueItemBase } from './PWalkinQueueItemBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PWalkinQueueItem extends PWalkinQueueItemBase {
  protected _pStatus: PanelWrapper;
  protected _pNameDecor: Panel;
  protected _pActions: PanelWrapper[];
  protected _pAgent: PanelWrapper;

  constructor() {
    super();
    this._pStatus = new PanelWrapper();
    this._pNameDecor = new Panel();
    this._pActions = [ new PanelWrapper(), new PanelWrapper() ];
    this._pAgent = new PanelWrapper();
  }

  getNameDecorPanel(): Panel { return this._pNameDecor; }
  getStatusPanel(): PanelWrapper { return this._pStatus; }
  getActionPanel(idx: number): PanelWrapper | null { return this._pActions[idx] || null; }
  getAgentPanel(): PanelWrapper { return this._pAgent; }

  _renderFramework(): string {
    let s = _CPT_WALKIN_QUEUE_ITEM.MAIN;
    s = s.replace("__ID_NAME_DECOR__", this._getSubElementId("ND"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    s = s.replace("__ID_ACTION1__", this._getSubElementId("A1"));
    s = s.replace("__ID_ACTION2__", this._getSubElementId("A2"));
    s = s.replace("__ID_AGENT__", this._getSubElementId("G"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pNameDecor.attach(this._getSubElementId("ND"));
    this._pName.attach(this._getSubElementId("N"));
    this._pStatus.attach(this._getSubElementId("S"));
    this._pActions[0].attach(this._getSubElementId("A1"));
    this._pActions[1].attach(this._getSubElementId("A2"));
    this._pAgent.attach(this._getSubElementId("G"));
  }
}
