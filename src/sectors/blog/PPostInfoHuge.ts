import { PPostInfoThumbnailBase } from './PPostInfoThumbnailBase.js';

const _CPT_POST_INFO_HUGE = {
  MAIN : `<div class="post-info huge">
  <div id="__ID_IMAGE__"></div>
  <div class="tw:aspect-5/1 tw:relative">
    <div class="tw:absolute tw:inset-0 tw:overflow-hidden">
      <div id="__ID_REF__" class="crosslink-note"></div>
      <div id="__ID_TITLE__" class="tw:text-u-font1"></div>
      <div id="__ID_DATE_TIME__" class="small-info-text"></div>
      <div id="__ID_QUOTE__"></div>
    </div>
  </div>
  </div>`,
} as const;

export class PPostInfoHuge extends PPostInfoThumbnailBase {
  _renderFramework(): string {
    let s: string = _CPT_POST_INFO_HUGE.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    s = s.replace("__ID_DATE_TIME__", this._getSubElementId("DT"));
    return s;
  }
};
