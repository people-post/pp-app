import { Panel } from './Panel.js';
import { PanelWrapper } from './PanelWrapper.js';

const _CPT_VIEW = {
  MAIN : `<div id="__ID_HEADER__"></div>
  <div id="__ID_BANNER__" class="banner flex-noshrink"></div>
  <div class="f-scroll-frame flex-grow no-scrollbar s-csecondarybg flex flex-center">
    <div id="__ID_CONTENT__"></div>
  </div>`,
} as const;

export class ViewPanel extends Panel {
  declare _pHeader: PanelWrapper;
  declare _pBanner: PanelWrapper;
  declare _pContent: PanelWrapper;

  constructor() {
    super();
    this._pHeader = new PanelWrapper();
    this._pBanner = new PanelWrapper();
    this._pContent = new PanelWrapper();
  }

  getHeaderPanel(): PanelWrapper { return this._pHeader; }
  getBannerPanel(): PanelWrapper { return this._pBanner; }
  getContentPanel(): PanelWrapper { return this._pContent; }

  _onFrameworkDidAppear(): void {
    this._pHeader.attach(this._getSubElementId("H"));
    this._pBanner.attach(this._getSubElementId("B"));
    this._pContent.attach(this._getSubElementId("C"));
  }

  _renderFramework(): string {
    let s: string = _CPT_VIEW.MAIN;
    s = s.replace("__ID_HEADER__", this._getSubElementId("H")) as string;
    s = s.replace("__ID_BANNER__", this._getSubElementId("B")) as string;
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C")) as string;
    return s;
  }
}

