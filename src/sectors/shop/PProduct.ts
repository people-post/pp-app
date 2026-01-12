const _CPT_PRODUCT = {
  MAIN : `<div class="product">
  <br>
  <div class="title">
    <div id="__ID_NAME__"></div>
  </div>
  <br>
  <div id="__ID_GALLERY__"></div>
  <div class="description">
    <div id="__ID_DESCRIPTION__"></div>
  </div>
  <br>
  <div id="__ID_PRICE__"></div>
  <br>
  <div id="__ID_ACTIONS__"></div>
  <br>
  </div>`,
} as const;

import { PProductBase } from './PProductBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PPrice } from '../../common/gui/PPrice.js';

export class PProduct extends PProductBase {
  private _pGallery: PanelWrapper;
  private _pPrice: PPrice;
  private _pAction: PanelWrapper;

  constructor() {
    super();
    this._pGallery = new PanelWrapper();
    this._pPrice = new PPrice();
    this._pAction = new PanelWrapper();
  }

  override getGalleryPanel(): PanelWrapper { return this._pGallery; }
  override getPricePanel(): PPrice { return this._pPrice; }
  override getActionPanel(): PanelWrapper { return this._pAction; }

  _renderFramework(): string {
    let s: string = _CPT_PRODUCT.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_GALLERY__", this._getSubElementId("G"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_PRICE__", this._getSubElementId("P"));
    s = s.replace("__ID_ACTIONS__", this._getSubElementId("A"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pGallery.attach(this._getSubElementId("G"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pPrice.attach(this._getSubElementId("P"));
    this._pAction.attach(this._getSubElementId("A"));
  }
};
