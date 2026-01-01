import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';
import { FProductDeliveryEditor } from './FProductDeliveryEditor.js';

export class FPhysicalGoodDeliveryEditor extends FProductDeliveryEditor {
  _getType() { return ProductDeliveryChoice.TYPE.GOOD; }
  _collectData() { return null; }
  _renderSpec(panel) {
    panel.replaceContent("TODO: Physical delivery with tax and range setups.");
  }
};
