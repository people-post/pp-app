import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProjectInfoBase extends Panel {
  // TODO: Extend from PQuotableBase
  constructor() {
    super();
    this._pTitle = new Panel();
    this._pContent = new Panel();
    this._pImage = new PanelWrapper();
    this._pProgress = new PanelWrapper();
  }

  isColorInvertible() { return false; }

  getImagePanel() { return this._pImage; }
  getTitlePanel() { return this._pTitle; }
  getContentPanel() { return this._pContent; }
  getProgressPanel() { return this._pProgress; }
  getUserIconPanel() { return null; }
  getUserNamePanel() { return null; }
  getReferencePanel() { return null; }
  getCreationTimeSmartPanel() { return null; }
  getSocialBarPanel() { return null; }
  getProgressDirection() { return "H"; }

  setVisibilityClassName(name) {}
  enableImage() {}
  invertColor() {}
};
