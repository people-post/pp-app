
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
};

import { PPostBase } from '../../common/gui/PPostBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PPost extends PPostBase {
  #pTitle;
  #pAbstract;
  #pSummary;
  #pTags;
  #pAttachment;
  #pContent;
  #pGallery;
  #pQuote;
  #pSocialBar;
  #pAuthor;
  #pTCreateDecor;
  #pTCreate;
  #pTUpdateDecor;
  #pTUpdate;
  #pJobAd;
  #pPin;
  #pSourceLink;

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

  getTitlePanel() { return this.#pTitle; }
  getAbstractPanel() { return this.#pAbstract; }
  getSummaryPanel() { return this.#pSummary; }
  getTagsPanel() { return this.#pTags; }
  getAttachmentPanel() { return this.#pAttachment; }
  getContentPanel() { return this.#pContent; }
  getGalleryPanel() { return this.#pGallery; }
  getQuotePanel() { return this.#pQuote; }
  getSocialBarPanel() { return this.#pSocialBar; }
  getAuthorPanel() { return this.#pAuthor; }
  getTCreateDecorPanel() { return this.#pTCreateDecor; }
  getCreationDateTimePanel() { return this.#pTCreate; }
  getTUpdateDecorPanel() { return this.#pTUpdateDecor; }
  getUpdateDateTimePanel() { return this.#pTUpdate; }
  getJobAdPanel() { return this.#pJobAd; }
  getPinPanel() { return this.#pPin; }
  getSourceLinkPanel() { return this.#pSourceLink; }

  _renderFramework() {
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

  _onFrameworkDidAppear() {
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
