
class PWalkinQueueItemBase extends ui.Panel {
  constructor() {
    super();
    this._pName = new ui.Panel();
  }

  getNameDecorPanel() { return null; }
  getNamePanel() { return this._pName; }
  getActionPanel(idx) { return null; }
  getAgentPanel() { return null; }

  invertColor() {}
};

shop.PWalkinQueueItemBase = PWalkinQueueItemBase;
}(window.shop = window.shop || {}));
