import { PProjectStageBase } from './PProjectStageBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProjectStageInfoBase extends PProjectStageBase {
  constructor() {
    super();
    this._pOptionBtn = new PanelWrapper();
  }

  getOptionBtnPanel() { return this._pOptionBtn; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.PProjectStageInfoBase = PProjectStageInfoBase;
}
