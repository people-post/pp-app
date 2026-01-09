import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import type Render from '../../lib/ui/renders/Render.js';

interface ProductDeliveryChoiceData {
  getDescription(): string;
}

export class FProductDeliveryEditor extends Fragment {
  protected _value: ProductDeliveryChoiceData | null = null;

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

  setValue(value: ProductDeliveryChoiceData | null): void { this._value = value; }

  _getType(): symbol | null { return null; }
  _collectData(): any { return null; }

  _renderOnRender(render: Render): void {
    let panel = new ListPanel();
    render.wrapPanel(panel);

    let p = new Panel();
    panel.pushPanel(p);
    if (this._value) {
      p.replaceContent(this._value.getDescription());
    }

    p = new PanelWrapper();
    panel.pushPanel(p);
    this._renderSpec(p);
  }

  _renderSpec(_panel: PanelWrapper): void {}
}
