import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';
import { FServiceDeliveryEditor } from './FServiceDeliveryEditor.js';

export class FAppointmentDeliveryEditor extends FServiceDeliveryEditor {
  _getType() { return ProductDeliveryChoice.TYPE.SCHEDULE; }
};


// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FAppointmentDeliveryEditor = FAppointmentDeliveryEditor;
}
