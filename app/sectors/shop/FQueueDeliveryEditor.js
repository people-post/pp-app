
class FQueueDeliveryEditor extends shop.FServiceDeliveryEditor {
  _getType() { return dat.ProductDeliveryChoice.TYPE.QUEUE; }
};

shop.FQueueDeliveryEditor = FQueueDeliveryEditor;
}(window.shop = window.shop || {}));

