import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PTagEditorBase extends Panel {
  protected _pName: PanelWrapper;

  constructor() {
    super();
    this._pName = new PanelWrapper();
  }

  getNamePanel(): PanelWrapper { return this._pName; }
  getQuickButtonPanel(): PanelWrapper | null { return null; }
  getThemePanel(): PanelWrapper | null { return null; }
}
