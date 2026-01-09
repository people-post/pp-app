import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';
import { FProductDeliveryEditor } from './FProductDeliveryEditor.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FPhysicalGoodDeliveryEditor extends FProductDeliveryEditor {
  _getType(): symbol { return ProductDeliveryChoice.TYPE.GOOD; }
  _collectData(): null { return null; }
  _renderSpec(panel: Panel): void {
    panel.replaceContent("TODO: Physical delivery with tax and range setups.");
  }
}
