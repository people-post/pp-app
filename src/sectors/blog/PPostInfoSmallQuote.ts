import { PPostInfoQuoteBase } from './PPostInfoQuoteBase.js';

const _CPT_POST_INFO_SMALL_QUOTE = {
  MAIN : `<div class="tw:aspect-3/1 tw:relative">
  <div class="tw:absolute tw:inset-0 tw:h-full tw:overflow-hidden quote-element small tw:flex tw:justify-start">
    <div id="__ID_IMAGE__"></div>
    <div class="tw:grow tw:p-[5px]">
      <div id="__ID_REF__" class="crosslink-note"></div>
      <div class="tw:flex tw:justify-between">
        <div id="__ID_AUTHOR__"></div>
        <div id="__ID_TIME__" class="small-info-text"></div>
      </div>
      <div id="__ID_TITLE__" class="tw:text-u-font5"></div>
      <div id="__ID_CONTENT__" class="tw:text-u-font5"></div>
    </div>
  </div>
  </div>`,
} as const;

export class PPostInfoSmallQuote extends PPostInfoQuoteBase {
  _renderFramework(): string {
    let s: string = _CPT_POST_INFO_SMALL_QUOTE.MAIN;
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_AUTHOR__", this._getSubElementId("A"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    return s;
  }
};
