
/*
 * +-+-----------+-------------+
 * |P|           |             |
 * |r|           |             |
 * |o|           |             |
 * |g|           |    DETAIL   |
 * |r| THUMBNAIL |             |
 * |e|           |             |
 * |s|           |             |
 * |s|           |             |
 * +-+-----------+-------------+
 */

const _CPT_PROJECT_INFO_MIDDLE = {
  MAIN : `<div id="__ID_WRAPPER__" class="project-info-wrapper middle">
    <div class="tw-aspect-[5/1] tw-relative">
      <div class="tw-absolute tw-inset-0 tw-flex tw-justify-start">
        <div id="__ID_PROGRESS__" class="tw-flex-shrink-0 v-progress-wrapper w10px"></div>
        <div class="tw-flex-grow tw-h-full">
          <div id="__ID_MAIN__" class="project-info middle tw-h-full tw-border-lightgray">
            <div class="tw-flex tw-justify-start tw-h-full"> 
              <div id="__ID_THUMBNAIL__"></div>
              <div class="tw-flex-grow tw-h-full tw-box-border tw-pt-[5px] tw-pl-[5px] tw-overflow-hidden">
                <div id="__ID_TITLE__" class="tw-font-bold"></div>
                <div id="__ID_CONTENT__" class="tw-text-u-font5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>`,
}

import { PProjectInfoBase } from './PProjectInfoBase.js';

export class PProjectInfoMiddle extends PProjectInfoBase {
  isColorInvertible(): boolean { return true; }
  getProgressDirection(): string { return "V"; }

  setVisibilityClassName(name: string): void {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "project-info-wrapper middle " + name;
    }
  }

  enableImage(): void { this._pImage.setClassName("tw-w-[20%] tw-flex-shrink-0"); }

  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "project-info middle tw-h-full s-cprimebd";
    }
  }

  _renderFramework(): string {
    let s = _CPT_PROJECT_INFO_MIDDLE.MAIN;
    s = s.replace("__ID_WRAPPER__", this._getSubElementId("W"));
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_THUMBNAIL__", this._getSubElementId("I"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_PROGRESS__", this._getSubElementId("P"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pImage.attach(this._getSubElementId("I"));
    this._pTitle.attach(this._getSubElementId("TT"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pProgress.attach(this._getSubElementId("P"));
  }
}
