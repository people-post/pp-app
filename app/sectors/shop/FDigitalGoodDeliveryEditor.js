
export class FDigitalGoodDeliveryEditor extends shop.FProductDeliveryEditor {
  _getType() { return dat.ProductDeliveryChoice.TYPE.DIGITAL; }
  _collectData() { return null; }
  _renderSpec(panel) {
    panel.replaceContent(
        "Electronic delivery.<br>TODO: Email delivery or download link with pass code");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FDigitalGoodDeliveryEditor = FDigitalGoodDeliveryEditor;
}
