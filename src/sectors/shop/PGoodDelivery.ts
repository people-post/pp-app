import { PGoodDeliveryBase } from './PGoodDeliveryBase.js';

const _CPT_PRODUCT = {
  MAIN : `<div id="__ID_BTN_ADD__"></div>
  <div id="__ID_COUNT__" class="small-info-text"></div>`,
} as const;

export class PGoodDelivery extends PGoodDeliveryBase {
  _renderFramework(): string {
    let s = _CPT_PRODUCT.MAIN;
    s = s.replace("__ID_BTN_ADD__", this._getSubElementId("BA"));
    s = s.replace("__ID_COUNT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pBtnAdd.attach(this._getSubElementId("BA"));
    this._pProductCount.attach(this._getSubElementId("C"));
  }
}
