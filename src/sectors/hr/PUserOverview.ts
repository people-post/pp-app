import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

const _CPT_USER_OVERVIEW = {
  MAIN : `<div class="aspect-5-1-frame bglightgrey">
    <div id="__ID_BG_IMAGE__" class="aspect-content"></div>
    <div id="__ID_USER_ICON__" class="user-info-header-user-icon s-icon2"></div>
    <div id="__ID_BG_UPLOAD__" class="user-info-header-image-upload"></div>
  </div>`,
} as const;

export class PUserOverview extends Panel {
  protected _pBgImage: PanelWrapper;
  protected _pUserIcon: PanelWrapper;
  protected _pBgUpload: PanelWrapper;

  constructor() {
    super();
    this._pBgImage = new PanelWrapper();
    this._pUserIcon = new PanelWrapper();
    this._pBgUpload = new PanelWrapper();
  }

  getBackgroundImagePanel(): PanelWrapper { return this._pBgImage; }
  getUserIconPanel(): PanelWrapper { return this._pUserIcon; }
  getUploadButtonPanel(): PanelWrapper { return this._pBgUpload; }

  _renderFramework(): string {
    let s = _CPT_USER_OVERVIEW.MAIN;
    s = s.replace("__ID_BG_IMAGE__", this._getSubElementId("B"));
    s = s.replace("__ID_USER_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_BG_UPLOAD__", this._getSubElementId("U"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pBgImage.attach(this._getSubElementId("B"));
    this._pUserIcon.attach(this._getSubElementId("I"));
    this._pBgUpload.attach(this._getSubElementId("U"));
  }
}
