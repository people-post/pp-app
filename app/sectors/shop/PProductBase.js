(function(shop) {
class PProductBase extends ui.Panel {
  constructor() {
    super();
    this._pName = new ui.PanelWrapper();
    this._pDescription = new ui.PanelWrapper();
  }

  getSellerNamePanel() { return null; }
  getSellerIconPanel() { return null; }
  getReferencePanel() { return null; }
  getNamePanel() { return this._pName; }
  getDescriptionPanel() { return this._pDescription; }
  getThumbnailPanel() { return null; }
  getGalleryPanel() { return null; }
  getPricePanel() { return null; }
  getActionPanel() { return null; }
};

shop.PProductBase = PProductBase;
}(window.shop = window.shop || {}));
