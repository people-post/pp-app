
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

const _CPT_CHAT_VIEW_CONTENT = {
  MAIN : `<div id="__ID_HEADER__"></div>
  <div class="chat-view-content flex flex-column flex-end">
    <div id="__ID_CONTENT__" class="chat-main no-scrollbar"></div>
    <div id="__ID_CONSOLE__"></div>
  </div>`,
}

export class PChatContent extends Panel {
  constructor() {
    super();
    this._pStickyHeader = new PanelWrapper();
    this._pContent = new PanelWrapper();
    this._pConsole = new PanelWrapper();
  }

  getStickyHeaderPanel() { return this._pStickyHeader; }
  getContentPanel() { return this._pContent; }
  getConsolePanel() { return this._pConsole; }

  _onFrameworkDidAppear() {
    this._pStickyHeader.attach(this._getSubElementId("H"));
    this._pContent.attach(this._getSubElementId("T"));
    this._pConsole.attach(this._getSubElementId("S"));
  }

  _renderFramework() {
    let s = _CPT_CHAT_VIEW_CONTENT.MAIN;
    s = s.replace("__ID_HEADER__", this._getSubElementId("H"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("T"));
    s = s.replace("__ID_CONSOLE__", this._getSubElementId("S"));
    return s;
  }
};
