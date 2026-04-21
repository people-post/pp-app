import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ProductDeliveryType } from '../../common/datatypes/ProductDelivery.js';

export class FProductDeliveryEditor extends Fragment {
  protected _value: ProductDeliveryType | null = null;

  constructor() {
    super();
  }

  getData(): string | null {
    let d = this._collectData();
    if (d) {
      return JSON.stringify({"type" : this._getType(), "data" : d});
    } else {
      return null;
    }
  }

  setValue(value: ProductDeliveryType | null): void { this._value = value; }

  _getType(): string | null { return null; }
  _collectData(): any { return null; }

  _renderOnRender(render: PanelWrapper): void {
    let panel = new ListPanel();
    render.wrapPanel(panel);

    let p = new Panel();
    panel.pushPanel(p);
    if (this._value) {
      let d = this._value.getDescription();
      if (d) {
        p.replaceContent(d);
      }
    }

    let pSpec = new PanelWrapper();
    panel.pushPanel(pSpec);
    this._renderSpec(pSpec);
  }

  _renderSpec(_panel: PanelWrapper): void {}
}
