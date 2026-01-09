import { PProductBase } from './PProductBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProductInfoBase extends PProductBase {
  protected _pThumbnail: PanelWrapper;

  constructor() {
    super();
    this._pThumbnail = new PanelWrapper();
  }

  getThumbnailPanel(): PanelWrapper { return this._pThumbnail; }
}
