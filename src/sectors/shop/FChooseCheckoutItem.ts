import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FChooseCheckoutItem extends Fragment {
  action(_type: string, ..._args: unknown[]): void {
    super.action(_type, ..._args);
  }

  handleSessionDataUpdate(_dataType: symbol, _data: unknown): void {
    super.handleSessionDataUpdate(_dataType, _data);
  }

  _renderOnRender(render: any): void {
    let pMain = new ListPanel();
    render.wrapPanel(pMain);
    let p = new Panel();
    pMain.pushPanel(p);
    p.replaceContent("TODO: Options to add more or change item");
  }
}
