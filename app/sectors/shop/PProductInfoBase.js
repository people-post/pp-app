
export class PProductInfoBase extends shop.PProductBase {
  constructor() {
    super();
    this._pThumbnail = new ui.PanelWrapper();
  }

  getThumbnailPanel() { return this._pThumbnail; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PProductInfoBase = PProductInfoBase;
}
