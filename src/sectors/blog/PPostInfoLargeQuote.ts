import { PPostInfoQuoteBase } from './PPostInfoQuoteBase.js';

const _CPT_POST_INFO_LARGE_QUOTE = {
  MAIN : `<div class="quote-element tw:p-[5px]">
  <div id="__ID_REF__" class="crosslink-note"></div>
  <div class="tw:flex tw:justify-between">
    <div id="__ID_AUTHOR__"></div>
    <div id="__ID_TIME__" class="small-info-text"></div>
  </div>
  <div class="quote-element-content tw:p-[5px]">
    <div id="__ID_TITLE__" class="tw:text-u-font5"></div>
    <div id="__ID_CONTENT__" class="tw:text-u-font5"></div>
  </div>
  <div id="__ID_IMAGE__"></div>
  </div>`,
} as const;

export class PPostInfoLargeQuote extends PPostInfoQuoteBase {
  _renderFramework(): string {
    let s: string = _CPT_POST_INFO_LARGE_QUOTE.MAIN;
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_AUTHOR__", this._getSubElementId("A"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    return s;
  }
};
