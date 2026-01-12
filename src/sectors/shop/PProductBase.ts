import { PPrice } from '../../common/gui/PPrice.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProductBase extends Panel {
  protected _pName: PanelWrapper;
  protected _pDescription: PanelWrapper;

  constructor() {
    super();
    this._pName = new PanelWrapper();
    this._pDescription = new PanelWrapper();
  }

  getSellerNamePanel(): Panel | null { return null; }
  getSellerIconPanel(): Panel | null { return null; }
  getReferencePanel(): Panel | null { return null; }
  getNamePanel(): PanelWrapper { return this._pName; }
  getDescriptionPanel(): PanelWrapper { return this._pDescription; }
  getThumbnailPanel(): PanelWrapper | null { return null; }
  getGalleryPanel(): PanelWrapper | null { return null; }
  getPricePanel(): PPrice | null { return null; }
  getActionPanel(): Panel | null { return null; }
};
