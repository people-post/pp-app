/*
 * +---+-------------+
 * |   |             |
 * |   |             |
 * |   |-------------|
 * |   |             |
 * +---+-------------+
 */

const _CPT_POST_INFO_LARGE = {
  MAIN : `<div class="flex flex-start v-pad5px info-panel large">
    <div class="w50px flex-noshrink">
      <div id="__ID_OWNER_ICON__" class="user-icon-column"></div>
    </div>
    <div class="flex-grow no-overflow">
      <div>
        <div id="__ID_USER_REF__" class="crosslink-note"></div>
        <div class="flex space-between">
          <div id="__ID_USER_NAME__"></div>
          <div id="__ID_TIME__" class="small-info-text"></div>
        </div>
        <div class="post-content item-detail-large content">
          <div id="__ID_TITLE__" class="title"></div>
          <div id="__ID_CONTENT__" class="hide-overflow"></div>
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

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PUserReference } from '../../common/hr/PUserReference.js';

export class PPostInfoLarge extends PPostInfoBase {
  protected _pOwnerIcon: PanelWrapper;
  protected _pTitle: Panel;
  protected _pContent: PanelWrapper;
  protected _pOwnerName: PanelWrapper;
  protected _pCrossRef: PUserReference;
  protected _pTime: Panel;
  protected _pSocial: PanelWrapper;
  protected _pQuote: PanelWrapper;
  protected _pAttachment: PanelWrapper;
  protected _pImage: PanelWrapper;

  constructor() {
    super();
    this._pOwnerIcon = new PanelWrapper();
    this._pTitle = new Panel();
    this._pContent = new PanelWrapper();
    this._pOwnerName = new PanelWrapper();
    this._pCrossRef = new PUserReference();
    this._pTime = new Panel();
    this._pSocial = new PanelWrapper();
    this._pQuote = new PanelWrapper();
    this._pAttachment = new PanelWrapper();
    this._pImage = new PanelWrapper();
  }

  getOwnerIconPanel(): PanelWrapper { return this._pOwnerIcon; }
  getTitlePanel(): Panel { return this._pTitle; }
  getContentPanel(): PanelWrapper { return this._pContent; }
  getSocialBarPanel(): PanelWrapper { return this._pSocial; }
  getOwnerNamePanel(): PanelWrapper { return this._pOwnerName; }
  getCrossRefPanel(): PUserReference { return this._pCrossRef; }
  getCreationTimeSmartPanel(): Panel { return this._pTime; }
  getQuotePanel(): PanelWrapper { return this._pQuote; }
  getAttachmentPanel(): PanelWrapper { return this._pAttachment; }
  getImagePanel(): PanelWrapper { return this._pImage; }

  _renderFramework(): string {
    let s = _CPT_POST_INFO_LARGE.MAIN;
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
    this._pOwnerIcon.attach(this._getSubElementId("O"));
    this._pTitle.attach(this._getSubElementId("T"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pAttachment.attach(this._getSubElementId("A"));
    this._pSocial.attach(this._getSubElementId("S"));
    this._pOwnerName.attach(this._getSubElementId("N"));
    this._pCrossRef.attach(this._getSubElementId("R"));
    this._pTime.attach(this._getSubElementId("TM"));
    this._pImage.attach(this._getSubElementId("I"));
    this._pQuote.attach(this._getSubElementId("Q"));
  }
}
