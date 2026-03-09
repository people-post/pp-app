
/*
 * +-----------+-----------+--------+
 * |           |           |        |
 * |           |           |        |
 * | THUMBNAIL |   DETAIL  | PRICE  |
 * |           |           | ACTION |
 * |           |           |        |
 * +-----------+-----------+--------+
 */

const _CPT_PRODUCT_INFO_MIDDLE = {
  MAIN : `<div class="product-info-wrapper midsize">
  <div class="tw:aspect-[4/1] tw:relative">
    <div class="tw:absolute tw:inset-0 tw:box-border tw:flex tw:justify-around product-info midsize">
      <div id="__ID_THUMBNAIL__" class="product-info-left tw:flex-shrink-0"></div>
      <div class="product-info-detail tw:flex-grow tw:h-full tw:overflow-hidden tw:cursor-pointer">
        <div id="__ID_NAME__" class="tw:font-bold"></div>
        <div id="__ID_DESCRIPTION__" class="tw:text-u-font7"></div>
      </div>
      <div class="product-info-misc tw:flex-shrink-0">
        <div id="__ID_PRICE__"></div>
        <div id="__ID_ACTION__"></div>
      </div>
    </div>
  </div>
  </div>`,
} as const;

import { PProductInfoBase } from './PProductInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PPriceCompact } from '../../common/gui/PPriceCompact.js';

export class PProductInfoMiddle extends PProductInfoBase {
  protected _pPrice: PPriceCompact;
  protected _pAction: PanelWrapper;

  constructor() {
    super();
    this._pPrice = new PPriceCompact();
    this._pAction = new PanelWrapper();
  }

  getPricePanel(): PPriceCompact { return this._pPrice; }
  getActionPanel(): PanelWrapper { return this._pAction; }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pThumbnail.attach(this._getSubElementId("I"));
    this._pName.attach(this._getSubElementId("N"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pPrice.attach(this._getSubElementId("P"));
    this._pAction.attach(this._getSubElementId("A"));
  }

  _renderFramework(): string {
    let s = _CPT_PRODUCT_INFO_MIDDLE.MAIN;
    s = s.replace("__ID_THUMBNAIL__", this._getSubElementId("I"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_PRICE__", this._getSubElementId("P"));
    s = s.replace("__ID_ACTION__", this._getSubElementId("A"));
    return s;
  }
}
