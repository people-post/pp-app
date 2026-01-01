import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';
import { FServiceDeliveryEditor } from './FServiceDeliveryEditor.js';

export class FAppointmentDeliveryEditor extends FServiceDeliveryEditor {
  _getType() { return ProductDeliveryChoice.TYPE.SCHEDULE; }
};
