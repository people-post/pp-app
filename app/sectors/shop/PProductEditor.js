
const _CPT_PRODUCT_EDITOR = {
  MAIN : `<div class="product">
  <div id="__ID_NAME__"></div>
  <div id="__ID_FILES__"></div>
  <div id="__ID_DESCRIPTION__"></div>
  <br>
  <div id="__ID_MENU_TAGS__"></div>
  <br>
  <div id="__ID_PRICE__"></div>
  <br>
  <div id="__ID_DELIVERY__"></div>
  <br>
  <div id="__ID_ACTIONS__"></div>
  <br>
  </div>`,
}

export class PProductEditor extends ui.Panel {
  constructor() {
    super();
    this._pName = new ui.Panel();
    this._pFiles = new ui.PanelWrapper();
    this._pDescription = new ui.PanelWrapper();
    this._pMenuTags = new ui.SectionPanel("Menu tags");
    this._pPrice = new ui.PanelWrapper();
    this._pDelivery = new ui.PanelWrapper();
    this._pActions = new ui.Panel();
  }

  getNamePanel() { return this._pName; }
  getFilesPanel() { return this._pFiles; }
  getDescriptionPanel() { return this._pDescription; }
  getMenuTagsPanel() { return this._pMenuTags.getContentPanel(); }
  getPricePanel() { return this._pPrice; }
  getDeliveryPanel() { return this._pDelivery; }
  getActionsPanel() { return this._pActions; }

  _renderFramework() {
    let s = _CPT_PRODUCT_EDITOR.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_FILES__", this._getSubElementId("F"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_MENU_TAGS__", this._getSubElementId("M"));
    s = s.replace("__ID_PRICE__", this._getSubElementId("P"));
    s = s.replace("__ID_DELIVERY__", this._getSubElementId("DL"));
    s = s.replace("__ID_ACTIONS__", this._getSubElementId("A"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pFiles.attach(this._getSubElementId("F"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pMenuTags.attach(this._getSubElementId("M"));
    this._pPrice.attach(this._getSubElementId("P"));
    this._pDelivery.attach(this._getSubElementId("DL"));
    this._pActions.attach(this._getSubElementId("A"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PProductEditor = PProductEditor;
}
