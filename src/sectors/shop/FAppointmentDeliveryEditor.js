import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';

export class FAppointmentDeliveryEditor extends shop.FServiceDeliveryEditor {
  _getType() { return ProductDeliveryChoice.TYPE.SCHEDULE; }
};


// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FAppointmentDeliveryEditor = FAppointmentDeliveryEditor;
}
