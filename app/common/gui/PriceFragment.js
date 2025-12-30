import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Selection } from '../../lib/ui/controllers/fragments/Selection.js';
import { T_DATA } from '../../lib/framework/Events.js';

export class PriceFragment extends Fragment {
  constructor() {
    super();
    this._fListPriceUnits = new Selection();
    this._fListPriceUnits.setDataSource(this);
    this._fListPriceUnits.setDelegate(this);
    this.setChild("lpunits", this._fListPriceUnits);
    this._prices = [];
    this._currentCurrencyId = null;
  }

  getSelectedCurrencyId() { return this._currentCurrencyId; }

  setPrices(prices) {
    this._prices = prices;
    if (this._prices.length) {
      this._currentCurrencyId = this._prices[0].currency_id;
    }
  }

  getItemsForSelection(fSelect) {
    let ids = [];
    for (let p of this._prices) {
      ids.push(p.currency_id);
    }

    let units = [];
    for (let id of ids) {
      let c = dba.Exchange.getCurrency(id);
      if (c) {
        units.push({text : c.getCode(), value : id});
      }
    }
    return units;
  }

  getSelectedValueForSelection(fSelect) {
    return this._currentCurrencyId;
  }

  onSelectionChangedInSelection(fSelect, value) {
    this._currentCurrencyId = value;
    this.render();
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.CURRENCIES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let pp = render.getUnitPanel();

    if (this._prices.length > 1) {
      this._fListPriceUnits.attachRender(pp);
      this._fListPriceUnits.render();
    } else {
      pp.setClassName("small-info-text center-align");
      if (this._prices.length) {
        let c = dba.Exchange.getCurrency(this._prices[0].currency_id)
        pp.replaceContent(c ? c.getCode() : "...");
      } else {
        pp.replaceContent("N/A");
      }
    }

    let price = this.#getCurrentPriceItem();
    let c = price ? dba.Exchange.getCurrency(price.currency_id) : null;

    pp = render.getListPricePanel();
    if (price) {
      pp.replaceContent(Utilities.renderPrice(c, price.list_price));
    } else {
      pp.replaceContent("N/A");
    }

    pp = render.getSalesPricePanel();
    if (price) {
      pp.replaceContent(Utilities.renderPrice(c, price.sales_price));
    } else {
      pp.replaceContent("N/A");
    }
  }

  #getCurrentPriceItem() {
    return this._prices.find(p => p.currency_id == this._currentCurrencyId);
  }

  #clearEmptyPrices() {
    let ps = [];
    for (let p of this._prices) {
      if (p.list_price != "" || p.sales_price != "") {
        ps.push(p);
      }
    }
    this._prices = ps;
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.PriceFragment = PriceFragment;
}
