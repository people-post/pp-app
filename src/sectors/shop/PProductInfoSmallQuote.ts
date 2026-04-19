
/*
 * +-------+--------------+
 * |       |              |
 * |  IMG  |     TEXT     |
 * |       |              |
 * +-------+--------------+
 */

const _CPT_PRODUCT_INFO_SMALL_QUOTE = {
  MAIN : `<div class="tw:aspect-3/1 tw:relative">
  <div class="tw:absolute tw:inset-0 tw:h-full tw:overflow-hidden quote-element small tw:flex tw:justify-start">
    <div id="__ID_IMAGE__"></div>
    <div class="tw:grow tw:p-[5px]">
      <div id="__ID_SELLER_NAME__"></div>
      <div id="__ID_NAME__" class="tw:text-u-font5"></div>
      <div id="__ID_DESCRIPTION__" class="tw:text-u-font5"></div>
    </div>
  </div>
  </div>`,
} as const;

import { PProductInfoBase } from './PProductInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProductInfoSmallQuote extends PProductInfoBase {
  protected _pSellerName: PanelWrapper;

  constructor() {
    super();
    this._pSellerName = new PanelWrapper();
  }

  getSellerNamePanel(): PanelWrapper { return this._pSellerName; }

  enableImage(): void {
    (this._pThumbnail as any)._pImage?.setClassName(
        "quote-element-image-thumbnail-wrapper tw:flex-shrink-0");
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pSellerName.attach(this._getSubElementId("SN"));
    this._pName.attach(this._getSubElementId("N"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pThumbnail.attach(this._getSubElementId("I"));
  }

  _renderFramework(): string {
    let s: string = _CPT_PRODUCT_INFO_SMALL_QUOTE.MAIN;
    s = s.replace("__ID_SELLER_NAME__", this._getSubElementId("SN"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    return s;
  }
}
