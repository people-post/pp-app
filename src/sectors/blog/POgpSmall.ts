import { POgp } from './POgp.js';

const _CPT_OGP_SMALL = {
  MAIN : `<div class="tw:aspect-3/1 tw:relative">
  <div class="tw:absolute tw:inset-0 tw:h-full tw:overflow-hidden quote-element small tw:flex tw:justify-start">
    <div id="__ID_IMAGE__"></div>
    <div class="tw:grow tw:p-[5px]">
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

export class POgpSmall extends POgp {
  _getTemplate(): string { return _CPT_OGP_SMALL.MAIN; }
}
