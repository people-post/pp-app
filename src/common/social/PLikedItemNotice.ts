import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel as BasePanel } from '../../lib/ui/renders/panels/Panel.js';

const _CPT_LIKED_ITEM_NOTICE_INFO = {
  MAIN : `<div id="__ID_MSG__"></div>
    <div id="__ID_TITLE__" class="bold ellipsis"></div>`,
}

export class PLikedItemNotice extends Panel {
  private _pMessage: ListPanel;
  private _pTitle: BasePanel;

  constructor() {
    super();
    this._pMessage = new ListPanel();
    this._pTitle = new BasePanel();
  }

  getMessagePanel(): ListPanel { return this._pMessage; }
  getTitlePanel(): BasePanel { return this._pTitle; }

  _renderFramework(): string {
    let s = _CPT_LIKED_ITEM_NOTICE_INFO.MAIN;
    s = s.replace("__ID_MSG__", this._getSubElementId("M"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pMessage.attach(this._getSubElementId("M"));
    this._pTitle.attach(this._getSubElementId("T"));
  }
}

export default PLikedItemNotice;
