import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Utilities } from '../Utilities.js';
import { ICON } from '../constants/Icons.js';

const _CPT_USER_REFERENCE = {
  MAIN : `<span class="inline-block s-icon5 v-middle-align">__REF_ICON__</span>
    <span id="__ID_TEXT__"></span>
    <span id="__ID_USER__"></span>`,
}

export class PUserReference extends Panel {
  private _pText: Panel;
  private _pUser: PanelWrapper;

  constructor() {
    super();
    this._pText = new Panel();
    this._pUser = new PanelWrapper();
  }

  getTextPanel(): Panel { return this._pText; }
  getUserPanel(): PanelWrapper { return this._pUser; }

  _renderFramework(): string {
    let s = _CPT_USER_REFERENCE.MAIN;
    s = s.replace("__REF_ICON__", Utilities.renderSvgIcon(ICON.REFRESH, 1, 1));
    s = s.replace("__ID_TEXT__", this._getSubElementId("T"));
    s = s.replace("__ID_USER__", this._getSubElementId("U"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pText.attach(this._getSubElementId("T"));
    this._pUser.attach(this._getSubElementId("U"));
  }
}

export default PUserReference;

