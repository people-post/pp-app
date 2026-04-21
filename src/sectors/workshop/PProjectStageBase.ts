import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProjectStageBase extends Panel {
  protected _pName: Panel;

  constructor() {
    super();
    this._pName = new Panel();
  }

  getNamePanel(): Panel { return this._pName; }
  getDescriptionPanel(): PanelWrapper | null { return null; }
  getCommentPanel(): PanelWrapper | null { return null; }
  getOptionBtnPanel(): PanelWrapper | null { return null; }

  setThemeForState(_state: string | null, _status: string | null): void {}
  setSelected(_b: boolean): void {}
  setEnabled(_b: boolean): void {}
}
