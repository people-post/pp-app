import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';
import { FProductDeliveryEditor } from './FProductDeliveryEditor.js';

export class FDigitalGoodDeliveryEditor extends FProductDeliveryEditor {
  _getType() { return ProductDeliveryChoice.TYPE.DIGITAL; }
  _collectData() { return null; }
  _renderSpec(panel) {
    panel.replaceContent(
        "Electronic delivery.<br>TODO: Email delivery or download link with pass code");
  }
};
