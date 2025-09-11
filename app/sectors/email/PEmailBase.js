(function(emal) {
class PEmailBase extends ui.Panel {
  constructor() {
    super();
    this._pTitle = new ui.Panel();
    this._pContent = new ui.Panel();
    this._pTime = new ui.Panel();
    this._pSender = new ui.Panel();
  }

  isColorInvertible() { return false; }

  getTitlePanel() { return this._pTitle; }
  getContentPanel() { return this._pContent; }
  getTimePanel() { return this._pTime; }
  getSenderPanel() { return this._pSender; }
  getReceiverPanel() { return null; }
  getIconPanel() { return null; }
  getCarbonCopyPanel() { return null; }

  invertColor() {}
};

emal.PEmailBase = PEmailBase;
}(window.emal = window.emal || {}));
