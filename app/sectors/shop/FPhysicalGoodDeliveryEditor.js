
export class FPhysicalGoodDeliveryEditor extends shop.FProductDeliveryEditor {
  _getType() { return dat.ProductDeliveryChoice.TYPE.GOOD; }
  _collectData() { return null; }
  _renderSpec(panel) {
    panel.replaceContent("TODO: Physical delivery with tax and range setups.");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FPhysicalGoodDeliveryEditor = FPhysicalGoodDeliveryEditor;
}
