(function(socl) {
const _CPT_REPOST_ITEM_NOTICE_INFO = {
  MAIN : `<div id="__ID_MSG__" class="flex flex-begin"></div>
    <div id="__ID_TITLE__" class="bold"></div>`,
};

class PRepostItemNotice extends ui.Panel {
  constructor() {
    super();
    this._pMessage = new ui.ListPanel();
    this._pTitle = new ui.Panel();
  }

  getMessagePanel() { return this._pMessage; }
  getTitlePanel() { return this._pTitle; }

  _renderFramework() {
    let s = _CPT_REPOST_ITEM_NOTICE_INFO.MAIN;
    s = s.replace("__ID_MSG__", this._getSubElementId("M"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pMessage.attach(this._getSubElementId("M"));
    this._pTitle.attach(this._getSubElementId("T"));
  }
};

socl.PRepostItemNotice = PRepostItemNotice;
}(window.socl = window.socl || {}));
