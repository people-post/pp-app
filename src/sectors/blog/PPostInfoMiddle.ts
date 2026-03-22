import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PUserReference } from '../../common/hr/PUserReference.js';

/*
 * +------------+----------------------+
 * |            |                      |
 * |            |     DETAIL           |
 * |    IMG     |                      |
 * | (OPTIONAL) +----------------------+
 * |            |    SOCIAL(optional)  |
 * +------------+----------------------+
 */

const _CPT_POST_INFO_MIDDLE = {
  MAIN : `<div id="__ID_WRAPPER__" class="post-info-wrapper">
  <div id="__ID_PIN__"></div>
  <div id="__ID_MAIN__" class="shadow-post-info">
    <div class="tw:aspect-3/1 tw:relative">
      <div class="tw:absolute tw:inset-0 tw:h-full tw:flex tw:justify-center">
        <div id="__ID_THUMBNAIL__"></div>
        <div class="tw:grow tw:flex tw:flex-col">
          <div class="tw:grow tw:overflow-hidden post-info-right">
            <div id="__ID_REF__" class="crosslink-note"></div>
            <div id="__ID_TEXT__" class="content">
              <div id="__ID_TITLE__" class="title"></div>
              <div id="__ID_CONTENT__" class="tw:text-u-font5"></div>
            </div>
            <div id="__ID_QUOTE__"></div>
          </div>
          <div id="__ID_SOCIAL__"></div>
        </div>
      </div>
    </div>
  </div>
  </div>`,
} as const;

export class PPostInfoMiddle extends PPostInfoBase {
  #pImage: PanelWrapper;
  #pTitle: Panel;
  #pContent: PanelWrapper;
  #pQuote: PanelWrapper;
  #pCrossRef: PUserReference;
  #pSocial: PanelWrapper;
  #pPin: Panel;

  constructor() {
    super();
    this.#pImage = new PanelWrapper();
    this.#pTitle = new Panel();
    this.#pContent = new PanelWrapper();
    this.#pQuote = new PanelWrapper();
    this.#pCrossRef = new PUserReference();
    this.#pSocial = new PanelWrapper();
    this.#pPin = new Panel();
  }

  isColorInvertible(): boolean { return true; }

  getTitlePanel(): Panel { return this.#pTitle; }
  getCrossRefPanel(): PUserReference { return this.#pCrossRef; }
  getContentPanel(): PanelWrapper { return this.#pContent; }
  getQuotePanel(): PanelWrapper { return this.#pQuote; }
  getPinPanel(): Panel { return this.#pPin; }
  getSocialBarPanel(): PanelWrapper { return this.#pSocial; }
  getImagePanel(): PanelWrapper { return this.#pImage; }

  enableImage(): void {
    this.#pImage.setClassName(
        "post-info-image-thumbnail-wrapper tw:flex-shrink-0");
  }
  enableQuote(): void {
    // Limit content height
    let e = document.getElementById(this._getSubElementId("TXT"));
    if (e) {
      e.className = "content tw:max-h-[40px] tw:overflow-hidden";
    }
    this.#pQuote.setClassName("left-pad5 right-pad5");
  }
  setVisibilityClassName(name: string): void {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "shadow-post-info " + name;
    }
  }
  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "post-info-wrapper s-cfuncbg s-csecondary";
    }
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pImage.attach(this._getSubElementId("I"));
    this.#pCrossRef.attach(this._getSubElementId("R"));
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pQuote.attach(this._getSubElementId("Q"));
    this.#pSocial.attach(this._getSubElementId("S"));
    this.#pPin.attach(this._getSubElementId("P"));
  }

  _renderFramework(): string {
    let s: string = _CPT_POST_INFO_MIDDLE.MAIN;
    s = s.replace("__ID_THUMBNAIL__", this._getSubElementId("I"));
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    s = s.replace("__ID_SOCIAL__", this._getSubElementId("S"));
    s = s.replace("__ID_PIN__", this._getSubElementId("P"));
    s = s.replace("__ID_TEXT__", this._getSubElementId("TXT"));
    s = s.replace("__ID_WRAPPER__", this._getSubElementId("W"));
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    return s;
  }
}
