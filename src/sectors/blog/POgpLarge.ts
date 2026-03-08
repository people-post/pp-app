import { POgp } from './POgp.js';

const _CPT_OGP_LARGE = {
  MAIN : `<div class="quote-element tw-p-[5px]">
  <div class="tw-flex tw-justify-between">
    <div id="__ID_AUTHOR__"></div>
    <div id="__ID_TIME__" class="small-info-text"></div>
  </div>
  <div class="quote-element-content tw-p-[5px]">
    <div id="__ID_TITLE__" class="tw-text-u-font5"></div>
    <div id="__ID_CONTENT__" class="tw-text-u-font5"></div>
  </div>
  <div id="__ID_IMAGE__"></div>
  </div>`,
} as const;

export class POgpLarge extends POgp {
  _getTemplate(): string { return _CPT_OGP_LARGE.MAIN; }
};
