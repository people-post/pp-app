import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Utilities } from '../../common/Utilities.js';
import { FPreviewItem } from './FPreviewItem.js';
import { CustomerOrder } from '../../common/datatypes/CustomerOrder.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

interface PreviewOrderDataSource {
  getOrderForPreviewOrderFragment(f: FPreviewOrder): CustomerOrder;
}

export class FPreviewOrder extends Fragment {
  protected _fItems: FSimpleFragmentList;
  protected _dataSource!: PreviewOrderDataSource;

  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this._fItems.setDelegate(this);
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.CURRENCIES:
      this.render();
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    this._fItems.clear();
    let order = this._dataSource.getOrderForPreviewOrderFragment(this);
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

    pp = new Panel();
    pp.setClassName("right-align");
    let c = Exchange.getCurrency(order.getCurrencyId());
    p.pushPanel(pp);
    pp.replaceContent("Total: " + Utilities.renderPrice(c, order.getTotalPrice() || 0));
  }
};
