import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PProjectStageBase extends Panel {
  constructor() {
    super();
    this._pName = new Panel();
  }

  getNamePanel() { return this._pName; }
  getDescriptionPanel() { return null; }
  getCommentPanel() { return null; }
  getOptionBtnPanel() { return null; }

  setThemeForState(state, status) {}
  setSelected(b) {}
  setEnabled(b) {}
};
