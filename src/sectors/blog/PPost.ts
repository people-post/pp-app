const _CPT_POST = {
  MAIN : `<div id="__ID_TITLE__" class="view-content-title"></div>
    <div class="flex space-between">
      <div>
        <div id="__ID_AUTHOR__" class="small-info-text"></div>
        <div class="small-info-text">
          <span id="__ID_T_CREATE_DECOR__"></span><span>:&nbsp;</span><span id="__ID_T_CREATE__"></span>
        </div>
        <div class="small-info-text">
          <span id="__ID_T_UPDATE_DECOR__"></span><span>:&nbsp;</span><span id="__ID_T_UPDATE__"></span>
        </div>
      </div>
      <div class="right-align">
        <div id="__ID_JOB_AD__"></div>
        <div id="__ID_PIN__"></div>
      </div>
    </div>
    <div id="__ID_TAGS__"></div>
    <div id="__ID_ATTACHMENT__"></div>
    <div id="__ID_ABSTRACT__" class="pad10px u-font3"></div>
    <div id="__ID_CONTENT__" class="pad10px u-font3 hide-overflow post-content"></div>
    <div id="__ID_SUMMARY__" class="pad10px u-font3"></div>
    <div id="__ID_SOURCE_LINK__" class="clickable underline s-cfunc"></div>
    <div id="__ID_GALLERY__" class="relative"></div>
    <div id="__ID_QUOTE__" class="left-pad10 right-pad10"></div>
    <br>
    <div id="__ID_SOCIAL__"></div>`,
} as const;

import { PPostBase } from '../../common/gui/PPostBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export interface PostInfoPanel {
  getTitlePanel(): Panel;
  getAbstractPanel(): PanelWrapper;
  getSummaryPanel(): PanelWrapper;
  getTagsPanel(): PanelWrapper;
  getAttachmentPanel(): PanelWrapper;
  getContentPanel(): PanelWrapper;
  getGalleryPanel(): PanelWrapper;
  getQuotePanel(): PanelWrapper | null;
  getSocialBarPanel(): PanelWrapper;
  getAuthorPanel(): PanelWrapper;
  getTCreateDecorPanel(): Panel;
  getCreationDateTimePanel(): Panel;
  getTUpdateDecorPanel(): Panel;
  getUpdateDateTimePanel(): Panel;
  getJobAdPanel(): PanelWrapper;
  getPinPanel(): Panel;
  getSourceLinkPanel(): Panel;
}

export class PPost extends PPostBase implements PostInfoPanel {
  #pTitle: Panel;
  #pAbstract: PanelWrapper;
  #pSummary: PanelWrapper;
  #pTags: PanelWrapper;
  #pAttachment: PanelWrapper;
  #pContent: PanelWrapper;
  #pGallery: PanelWrapper;
  #pQuote: PanelWrapper;
  #pSocialBar: PanelWrapper;
  #pAuthor: PanelWrapper;
  #pTCreateDecor: Panel;
  #pTCreate: Panel;
  #pTUpdateDecor: Panel;
  #pTUpdate: Panel;
  #pJobAd: PanelWrapper;
  #pPin: Panel;
  #pSourceLink: Panel;

  constructor() {
    super();
    this.#pTitle = new Panel();
    this.#pAbstract = new PanelWrapper();
    this.#pSummary = new PanelWrapper();
    this.#pTags = new PanelWrapper();
    this.#pAttachment = new PanelWrapper();
    this.#pContent = new PanelWrapper();
    this.#pGallery = new PanelWrapper();
    this.#pQuote = new PanelWrapper();
    this.#pSocialBar = new PanelWrapper();
    this.#pAuthor = new PanelWrapper();
    this.#pTCreateDecor = new Panel();
    this.#pTCreate = new Panel();
    this.#pTUpdateDecor = new Panel();
    this.#pTUpdate = new Panel();
    this.#pJobAd = new PanelWrapper();
    this.#pPin = new Panel();
    this.#pSourceLink = new Panel();
  }

  getTitlePanel(): Panel { return this.#pTitle; }
  getAbstractPanel(): PanelWrapper { return this.#pAbstract; }
  getSummaryPanel(): PanelWrapper { return this.#pSummary; }
  getTagsPanel(): PanelWrapper { return this.#pTags; }
  getAttachmentPanel(): PanelWrapper { return this.#pAttachment; }
  getContentPanel(): PanelWrapper { return this.#pContent; }
  getGalleryPanel(): PanelWrapper { return this.#pGallery; }
  getQuotePanel(): PanelWrapper | null { return this.#pQuote; }
  getSocialBarPanel(): PanelWrapper { return this.#pSocialBar; }
  getAuthorPanel(): PanelWrapper { return this.#pAuthor; }
  getTCreateDecorPanel(): Panel { return this.#pTCreateDecor; }
  getCreationDateTimePanel(): Panel { return this.#pTCreate; }
  getTUpdateDecorPanel(): Panel { return this.#pTUpdateDecor; }
  getUpdateDateTimePanel(): Panel { return this.#pTUpdate; }
  getJobAdPanel(): PanelWrapper { return this.#pJobAd; }
  getPinPanel(): Panel { return this.#pPin; }
  getSourceLinkPanel(): Panel { return this.#pSourceLink; }

  _renderFramework(): string {
    let s = _CPT_POST.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_ABSTRACT__", this._getSubElementId("AB"));
    s = s.replace("__ID_SUMMARY__", this._getSubElementId("SM"));
    s = s.replace("__ID_TAGS__", this._getSubElementId("TG"));
    s = s.replace("__ID_ATTACHMENT__", this._getSubElementId("AT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_GALLERY__", this._getSubElementId("G"));
    s = s.replace("__ID_QUOTE__", this._getSubElementId("Q"));
    s = s.replace("__ID_SOCIAL__", this._getSubElementId("S"));
    s = s.replace("__ID_AUTHOR__", this._getSubElementId("A"));
    s = s.replace("__ID_T_CREATE_DECOR__", this._getSubElementId("CD"));
    s = s.replace("__ID_T_CREATE__", this._getSubElementId("TC"));
    s = s.replace("__ID_T_UPDATE_DECOR__", this._getSubElementId("UD"));
    s = s.replace("__ID_T_UPDATE__", this._getSubElementId("TU"));
    s = s.replace("__ID_JOB_AD__", this._getSubElementId("J"));
    s = s.replace("__ID_PIN__", this._getSubElementId("P"));
    s = s.replace("__ID_SOURCE_LINK__", this._getSubElementId("SL"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pAbstract.attach(this._getSubElementId("AB"));
    this.#pSummary.attach(this._getSubElementId("SM"));
    this.#pTags.attach(this._getSubElementId("TG"));
    this.#pAttachment.attach(this._getSubElementId("AT"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pGallery.attach(this._getSubElementId("G"));
    this.#pQuote.attach(this._getSubElementId("Q"));
    this.#pSocialBar.attach(this._getSubElementId("S"));
    this.#pAuthor.attach(this._getSubElementId("A"));
    this.#pTCreateDecor.attach(this._getSubElementId("CD"));
    this.#pTCreate.attach(this._getSubElementId("TC"));
    this.#pTUpdateDecor.attach(this._getSubElementId("UD"));
    this.#pTUpdate.attach(this._getSubElementId("TU"));
    this.#pJobAd.attach(this._getSubElementId("J"));
    this.#pPin.attach(this._getSubElementId("P"));
    this.#pSourceLink.attach(this._getSubElementId("SL"));
  }
};
