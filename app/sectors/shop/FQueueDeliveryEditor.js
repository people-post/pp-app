import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';

export class FQueueDeliveryEditor extends shop.FServiceDeliveryEditor {
  _getType() { return ProductDeliveryChoice.TYPE.QUEUE; }
};




// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FQueueDeliveryEditor = FQueueDeliveryEditor;
}
