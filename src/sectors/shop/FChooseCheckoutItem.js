import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FChooseCheckoutItem extends Fragment {
  action(type, ...args) {
    switch (type) {
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let pMain = new ListPanel();
    render.wrapPanel(pMain);
    let p = new Panel();
    pMain.pushPanel(p);
    p.replaceContent("TODO: Options to add more or change item");
  }
};
