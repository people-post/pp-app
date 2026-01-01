import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FProductDeliveryEditor extends Fragment {
  constructor() {
    super();
    this._value = null;
  }

  getData() {
    let d = this._collectData();
    if (d) {
      return JSON.stringify({"type" : this._getType(), "data" : d});
    } else {
      return null;
    }
  }

  setValue(value) { this._value = value; }

  _getType() { return null; }
  _collectData() { return null; }

  _renderOnRender(render) {
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

  _renderSpec(panel) {}
};
