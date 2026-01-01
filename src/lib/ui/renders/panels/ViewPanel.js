import { Panel } from './Panel.js';
import { PanelWrapper } from './PanelWrapper.js';

const _CPT_VIEW = {
  MAIN : `<div id="__ID_HEADER__"></div>
  <div id="__ID_BANNER__" class="banner flex-noshrink"></div>
  <div class="f-scroll-frame flex-grow no-scrollbar s-csecondarybg flex flex-center">
    <div id="__ID_CONTENT__"></div>
  </div>`,
};

export class ViewPanel extends Panel {
  constructor() {
    super();
    this._pHeader = new PanelWrapper();
    this._pBanner = new PanelWrapper();
    this._pContent = new PanelWrapper();
  }

  getHeaderPanel() { return this._pHeader; }
  getBannerPanel() { return this._pBanner; }
  getContentPanel() { return this._pContent; }

  _onFrameworkDidAppear() {
    this._pHeader.attach(this._getSubElementId("H"));
    this._pBanner.attach(this._getSubElementId("B"));
    this._pContent.attach(this._getSubElementId("C"));
  }

  _renderFramework() {
    let s = _CPT_VIEW.MAIN;
    s = s.replace("__ID_HEADER__", this._getSubElementId("H"));
    s = s.replace("__ID_BANNER__", this._getSubElementId("B"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }
};
