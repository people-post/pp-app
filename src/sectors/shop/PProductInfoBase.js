import { PProductBase } from './PProductBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProductInfoBase extends PProductBase {
  constructor() {
    super();
    this._pThumbnail = new PanelWrapper();
  }

  getThumbnailPanel() { return this._pThumbnail; }
};
