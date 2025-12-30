import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';

export class FPreviewOrder extends Fragment {
  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this._fItems.setDelegate(this);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.CURRENCIES:
      this.render();
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    this._fItems.clear();
    let order = this._dataSource.getOrderForPreviewOrderFragment(this);
    for (let item of order.getItems()) {
      let f = new cart.FPreviewItem();
      f.setCurrencyId(order.getCurrencyId());
      f.setItem(item);
      this._fItems.append(f);
    }
    let pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this._fItems.attachRender(pp);
    this._fItems.render();

    pp = new ui.Panel();
    pp.setClassName("right-align");
    let c = dba.Exchange.getCurrency(order.getCurrencyId());
    p.pushPanel(pp);
    pp.replaceContent("Total: " + Utilities.renderPrice(c, order.getTotal()));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.FPreviewOrder = FPreviewOrder;
}
