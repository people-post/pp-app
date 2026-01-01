
/*
 * +-------------+
 * |             |
 * |             |
 * |-------------|
 * |             |
 * +-------------+
 */

const _CPT_POST_INFO_BRIEF = {
  MAIN : `<div class="info-panel brief">
    <div>
      <div id="__ID_ATTACHMENT__"></div>
      <div id="__ID_IMAGE__"></div>
    </div>
    <div class="u-font3 line-height32">
      <div id="__ID_TAGS__"></div>
      <div id="__ID_TITLE__" class="title"></div>
      <div id="__ID_CONTENT__" class="hide-overflow"></div>
      <div class="flex space-between">
        <div id="__ID_TIME__" class="small-info-text"></div>
        <div id="__ID_SOCIAL__" class="h-pad5px flex-grow"></div>
        <div id="__ID_SOURCE_LINK__" class="u-font5 clickable underline s-cfunc"></div>
      </div>
    </div>
  </div>`,
}

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PPostInfoBrief extends PPostInfoBase {
  #pTags;
  #pTitle;
  #pContent;
  #pTime;
  #pSourceLink;
  #pAttachment;
  #pImage;
  #pSocial;

  constructor() {
    super();
    this.#pTags = new PanelWrapper();
    this.#pTitle = new Panel();
    this.#pContent = new PanelWrapper();
    this.#pTime = new Panel();
    this.#pSourceLink = new Panel();
    this.#pAttachment = new PanelWrapper();
    this.#pImage = new PanelWrapper();
    this.#pSocial = new PanelWrapper();
  }

  isClickable() { return false; }

  getTagsPanel() { return this.#pTags; }
  getTitlePanel() { return this.#pTitle; }
  getContentPanel() { return this.#pContent; }
  getCreationTimeSmartPanel() { return this.#pTime; }
  getSourceLinkPanel() { return this.#pSourceLink; }
  getAttachmentPanel() { return this.#pAttachment; }
  getImagePanel() { return this.#pImage; }
  getSocialBarPanel() { return this.#pSocial; }

  _renderFramework() {
    let s = _CPT_POST_INFO_BRIEF.MAIN;
    s = s.replace("__ID_TAGS__", this._getSubElementId("TG"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_TIME__", this._getSubElementId("TM"));
    s = s.replace("__ID_SOURCE_LINK__", this._getSubElementId("SL"));
    s = s.replace("__ID_ATTACHMENT__", this._getSubElementId("A"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_SOCIAL__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTags.attach(this._getSubElementId("TG"));
    this.#pTitle.attach(this._getSubElementId("TT"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pTime.attach(this._getSubElementId("TM"));
    this.#pSourceLink.attach(this._getSubElementId("SL"));
    this.#pAttachment.attach(this._getSubElementId("A"));
    this.#pImage.attach(this._getSubElementId("I"));
    this.#pSocial.attach(this._getSubElementId("S"));
  }
};
