import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';
import { FServiceDeliveryEditor } from './FServiceDeliveryEditor.js';

export class FQueueDeliveryEditor extends FServiceDeliveryEditor {
  _getType(): symbol { return ProductDeliveryChoice.TYPE.QUEUE; }
}
