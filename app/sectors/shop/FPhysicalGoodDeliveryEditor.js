(function(shop) {
class FPhysicalGoodDeliveryEditor extends shop.FProductDeliveryEditor {
  _getType() { return dat.ProductDeliveryChoice.TYPE.GOOD; }
  _collectData() { return null; }
  _renderSpec(panel) {
    panel.replaceContent("TODO: Physical delivery with tax and range setups.");
  }
};

shop.FPhysicalGoodDeliveryEditor = FPhysicalGoodDeliveryEditor;
}(window.shop = window.shop || {}));
