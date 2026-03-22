import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PUserReference } from '../../common/hr/PUserReference.js';

/*
 * +---+-------------+
 * |   |             |
 * |   |             |
 * |   |-------------|
 * |   |             |
 * +---+-------------+
 */

const _CPT_POST_INFO_LARGE = {
  MAIN : `<div class="tw:flex tw:justify-start tw:py-[5px] info-panel large">
    <div class="w50px tw:shrink-0">
      <div id="__ID_OWNER_ICON__" class="user-icon-column"></div>
    </div>
    <div class="tw:grow tw:min-w-0">
      <div>
        <div id="__ID_USER_REF__" class="crosslink-note"></div>
        <div class="tw:flex tw:justify-between">
          <div id="__ID_USER_NAME__"></div>
          <div id="__ID_TIME__" class="small-info-text"></div>
        </div>
        <div class="post-content item-detail-large content">
          <div id="__ID_TITLE__" class="title"></div>
          <div id="__ID_CONTENT__" class="tw:overflow-hidden"></div>
        </div>
      </div>
      <div>
        <div id="__ID_ATTACHMENT__"></div>
        <div id="__ID_IMAGE__"></div>
        <div id="__ID_QUOTE__"></div>
        <div id="__ID_SOCIAL__"></div>
      </div>
    </div>
  </div>`,
} as const;

export class PPostInfoLarge extends PPostInfoBase {
  #pOwnerIcon: PanelWrapper;
  #pTitle: Panel;
  #pContent: PanelWrapper;
  #pOwnerName: PanelWrapper;
  #pCrossRef: PUserReference;
  #pTime: Panel;
  #pSocial: PanelWrapper;
  #pQuote: PanelWrapper;
  #pAttachment: PanelWrapper;
  #pImage: PanelWrapper;

  constructor() {
    super();
    this.#pOwnerIcon = new PanelWrapper();
    this.#pTitle = new Panel();
    this.#pContent = new PanelWrapper();
    this.#pOwnerName = new PanelWrapper();
    this.#pCrossRef = new PUserReference();
    this.#pTime = new Panel();
    this.#pSocial = new PanelWrapper();
    this.#pQuote = new PanelWrapper();
    this.#pAttachment = new PanelWrapper();
    this.#pImage = new PanelWrapper();
  }

  getOwnerIconPanel(): PanelWrapper { return this.#pOwnerIcon; }
  getTitlePanel(): Panel { return this.#pTitle; }
  getContentPanel(): PanelWrapper { return this.#pContent; }
  getSocialBarPanel(): PanelWrapper { return this.#pSocial; }
  getOwnerNamePanel(): PanelWrapper { return this.#pOwnerName; }
  getCrossRefPanel(): PUserReference { return this.#pCrossRef; }
  getCreationTimeSmartPanel(): Panel { return this.#pTime; }
  getQuotePanel(): PanelWrapper { return this.#pQuote; }
  getAttachmentPanel(): PanelWrapper { return this.#pAttachment; }
  getImagePanel(): PanelWrapper { return this.#pImage; }

  _renderFramework(): string {
    let s: string = _CPT_POST_INFO_LARGE.MAIN;
    s = s.replace("__ID_OWNER_ICON__", this._getSubElementId("O"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_ATTACHMENT__", this._getSubElementId("A"));
    s = s.replace("__ID_SOCIAL__", this._getSubElementId("S"));
    s = s.replace("__ID_USER_REF__", this._getSubElementId("R"));
    s = s.replace("__ID_USER_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pOwnerIcon.attach(this._getSubElementId("O"));
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pAttachment.attach(this._getSubElementId("A"));
    this.#pSocial.attach(this._getSubElementId("S"));
    this.#pOwnerName.attach(this._getSubElementId("N"));
    this.#pCrossRef.attach(this._getSubElementId("R"));
    this.#pTime.attach(this._getSubElementId("TM"));
    this.#pImage.attach(this._getSubElementId("I"));
    this.#pQuote.attach(this._getSubElementId("Q"));
  }
}
