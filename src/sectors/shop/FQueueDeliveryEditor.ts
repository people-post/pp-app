import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';
import { FServiceDeliveryEditor } from './FServiceDeliveryEditor.js';

export class FQueueDeliveryEditor extends FServiceDeliveryEditor {
  _getType(): string | null { return ProductDeliveryChoice.TYPE.QUEUE; }
}
