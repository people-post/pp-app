import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PProjectStageBase extends Panel {
  protected _pName: Panel;

  constructor() {
    super();
    this._pName = new Panel();
  }

  getNamePanel(): Panel { return this._pName; }
  getDescriptionPanel(): Panel | null { return null; }
  getCommentPanel(): Panel | null { return null; }
  getOptionBtnPanel(): PanelWrapper | null { return null; }

  setThemeForState(state: string, status: string): void {}
  setSelected(b: boolean): void {}
  setEnabled(b: boolean): void {}
}
