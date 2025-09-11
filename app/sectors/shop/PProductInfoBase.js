(function(shop) {
class PProductInfoBase extends shop.PProductBase {
  constructor() {
    super();
    this._pThumbnail = new ui.PanelWrapper();
  }

  getThumbnailPanel() { return this._pThumbnail; }
};

shop.PProductInfoBase = PProductInfoBase;
}(window.shop = window.shop || {}));
