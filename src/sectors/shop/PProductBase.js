import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProductBase extends Panel {
  constructor() {
    super();
    this._pName = new PanelWrapper();
    this._pDescription = new PanelWrapper();
  }

  getSellerNamePanel() { return null; }
  getSellerIconPanel() { return null; }
  getReferencePanel() { return null; }
  getNamePanel() { return this._pName; }
  getDescriptionPanel() { return this._pDescription; }
  getThumbnailPanel() { return null; }
  getGalleryPanel() { return null; }
  getPricePanel() { return null; }
  getActionPanel() { return null; }
};
