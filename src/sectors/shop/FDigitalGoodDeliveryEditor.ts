import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';
import { FProductDeliveryEditor } from './FProductDeliveryEditor.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FDigitalGoodDeliveryEditor extends FProductDeliveryEditor {
  _getType(): symbol { return ProductDeliveryChoice.TYPE.DIGITAL; }
  _collectData(): null { return null; }
  _renderSpec(panel: Panel): void {
    panel.replaceContent(
        "Electronic delivery.<br>TODO: Email delivery or download link with pass code");
  }
}
