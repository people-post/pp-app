import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Utilities } from '../../common/Utilities.js';
import { FPreviewItem } from './FPreviewItem.js';
import { CustomerOrder } from '../../common/datatypes/CustomerOrder.js';

export interface PreviewOrderDataSource {
  getOrderForPreviewOrderFragment(f: FPreviewOrder): CustomerOrder;
}

export class FPreviewOrder extends Fragment {
  protected _fItems: FSimpleFragmentList;

  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this._fItems.setDelegate(this);
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.CURRENCIES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    this._fItems.clear();
    let order = this.getDelegate<PreviewOrderDataSource>()?.getOrderForPreviewOrderFragment(this);
    if (!order) {
      return;
    }
    for (let item of order.getItems()) {
      for (let subItem of item.getItems()) {
        let f = new FPreviewItem();
        f.setCurrencyId(order.getCurrencyId());
        f.setItem(subItem);
        this._fItems.append(f);
      }
    }
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fItems.attachRender(pp);
    this._fItems.render();

    pp = new PanelWrapper();
    pp.setClassName("tw:text-right");
    let c = Exchange.getCurrency(order.getCurrencyId());
    p.pushPanel(pp);
    pp.replaceContent("Total: " + Utilities.renderPrice(c ?? null, order.getTotalPrice() || 0));
  }
};
