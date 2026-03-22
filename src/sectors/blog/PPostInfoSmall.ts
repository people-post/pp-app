import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PUserReference } from '../../common/hr/PUserReference.js';

/*
 * +------------------+-----------+
 * |                  |           |
 * |      TEXT        |    IMG    |
 * |                  |           |
 * +------------------+-----------+
 */

const _CPT_POST_INFO_SMALL = {
  MAIN : `<div id="__ID_WRAPPER__" class="post-info-small-wrapper">
  <div id="__ID_PIN__"></div>
  <div id="__ID_REF__" class="crosslink-note tw:min-h-[10px]"></div>
  <div id="__ID_MAIN__" class="post-info small">
    <div class="tw:aspect-5/1 tw:relative">
      <div class="tw:absolute tw:inset-0 tw:overflow-hidden tw:flex tw:justify-between">
        <div class="tw:w-[60%] tw:grow">
          <div id="__ID_TITLE__" class="tw:text-u-font3 tw:font-bold tw:truncate"></div>
          <div id="__ID_CONTENT__" class="tw:text-u-font6 tw:truncate"></div>
          <div id="__ID_QUOTE__"></div>
        </div>
        <div id="__ID_IMAGE__"></div>
      </div>
    </div>
  </div>
  </div>`,
} as const;

export class PPostInfoSmall extends PPostInfoBase {
  #pTitle: Panel;
  #pContent: PanelWrapper;
  #pPin: Panel;
  #pCrossRef: PUserReference;
  #pQuote: PanelWrapper;
  #pImage: PanelWrapper;

  constructor() {
    super();
    this.#pTitle = new Panel();
    this.#pContent = new PanelWrapper();
    this.#pPin = new Panel();
    this.#pCrossRef = new PUserReference();
    this.#pQuote = new PanelWrapper();
    this.#pImage = new PanelWrapper();
  }

  isColorInvertible(): boolean { return true; }

  getTitlePanel(): Panel { return this.#pTitle; }
  getContentPanel(): PanelWrapper { return this.#pContent; }
  getPinPanel(): Panel { return this.#pPin; }
  getCrossRefPanel(): PUserReference { return this.#pCrossRef; }
  getQuotePanel(): PanelWrapper { return this.#pQuote; }
  getImagePanel(): PanelWrapper { return this.#pImage; }

  enableImage(): void { this.#pImage.setClassName("w35 tw:flex-shrink-0"); }
  enableQuote(): void { this.#pQuote.setClassName("left-pad5 right-pad5"); }

  setVisibilityClassName(name: string): void {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "post-info small " + name;
    }
  }
  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "post-info-small-wrapper s-cfuncbg s-csecondary";
    }
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pImage.attach(this._getSubElementId("I"));
    this.#pPin.attach(this._getSubElementId("P"));
    this.#pCrossRef.attach(this._getSubElementId("R"));
    this.#pQuote.attach(this._getSubElementId("Q"));
  }

  _renderFramework(): string {
    let s: string = _CPT_POST_INFO_SMALL.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_PIN__", this._getSubElementId("P"));
    s = s.replace("__ID_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    s = s.replace("__ID_WRAPPER__", this._getSubElementId("W"));
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    return s;
  }
}
