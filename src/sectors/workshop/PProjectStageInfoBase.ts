import { PProjectStageBase } from './PProjectStageBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProjectStageInfoBase extends PProjectStageBase {
  protected _pOptionBtn: PanelWrapper;

  constructor() {
    super();
    this._pOptionBtn = new PanelWrapper();
  }

  getOptionBtnPanel(): PanelWrapper { return this._pOptionBtn; }
}
