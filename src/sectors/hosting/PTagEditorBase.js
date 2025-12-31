
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PTagEditorBase extends Panel {
  constructor() {
    super();
    this._pName = new PanelWrapper();
  }

  getNamePanel() { return this._pName; }
  getQuickButtonPanel() { return null; }
  getThemePanel() { return null; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hstn = window.hstn || {};
  window.hstn.PTagEditorBase = PTagEditorBase;
}
