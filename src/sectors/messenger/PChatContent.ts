import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

const _CPT_CHAT_VIEW_CONTENT = {
  MAIN : `<div id="__ID_HEADER__"></div>
  <div class="chat-view-content flex flex-column flex-end">
    <div id="__ID_CONTENT__" class="chat-main no-scrollbar"></div>
    <div id="__ID_CONSOLE__"></div>
  </div>`,
} as const;

export class PChatContent extends Panel {
  protected _pStickyHeader: PanelWrapper;
  protected _pContent: PanelWrapper;
  protected _pConsole: PanelWrapper;

  constructor() {
    super();
    this._pStickyHeader = new PanelWrapper();
    this._pContent = new PanelWrapper();
    this._pConsole = new PanelWrapper();
  }

  getStickyHeaderPanel(): PanelWrapper { return this._pStickyHeader; }
  getContentPanel(): PanelWrapper { return this._pContent; }
  getConsolePanel(): PanelWrapper { return this._pConsole; }

  _onFrameworkDidAppear(): void {
    this._pStickyHeader.attach(this._getSubElementId("H"));
    this._pContent.attach(this._getSubElementId("T"));
    this._pConsole.attach(this._getSubElementId("S"));
  }

  _renderFramework(): string {
    let s = _CPT_CHAT_VIEW_CONTENT.MAIN;
    s = s.replace("__ID_HEADER__", this._getSubElementId("H"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("T"));
    s = s.replace("__ID_CONSOLE__", this._getSubElementId("S"));
    return s;
  }
}
