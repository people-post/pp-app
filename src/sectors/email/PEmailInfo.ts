import { PEmailBase } from './PEmailBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

const _CPT_EMAIL_INFO = {
  MAIN : `<div class="tw-aspect-[5/1] tw-relative">
    <div class="tw-absolute tw-inset-0 tw-box-border tw-pt-[5px] tw-pr-[5px]">
      <div class="tw-flex tw-justify-start tw-h-full">
        <div id="__ID_ICON__" class="tw-w-[5%] tw-flex-shrink-0">
        </div>
        <div id="__ID_MAIN__" class="email-info tw-border-lightgray">
          <div class="tw-flex tw-justify-between">
            <div id="__ID_SENDER__" class="tw-text-u-font5 tw-font-bold"></div>
            <div id="__ID_TIME__" class="small-info-text"></div>
          </div>
          <div id="__ID_TITLE__" class="tw-text-u-font5"></div>
          <div id="__ID_CONTENT__" class="tw-text-u-font5 tw-text-gray-600"></div>
        </div>
      </div>
    </div>
  </div>`,
} as const;

export class PEmailInfo extends PEmailBase {
  private _pIcon: Panel;

  constructor() {
    super();
    this._pIcon = new Panel();
  }

  isColorInvertible(): boolean { return true; }

  getIconPanel(): Panel { return this._pIcon; }

  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "email-info s-cprimebd";
    }
  }

  _renderFramework(): string {
    let s = _CPT_EMAIL_INFO.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TI"));
    s = s.replace("__ID_SENDER__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pIcon.attach(this._getSubElementId("I"));
    this._pTitle.attach(this._getSubElementId("T"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pTime.attach(this._getSubElementId("TI"));
    this._pSender.attach(this._getSubElementId("S"));
  }
};
