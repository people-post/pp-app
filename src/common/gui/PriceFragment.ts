import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Selection } from '../../lib/ui/controllers/fragments/Selection.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Exchange } from '../dba/Exchange.js';
import Utilities from '../../lib/ext/Utilities.js';
import { PPriceBase } from './PPriceBase.js';

interface PriceItem {
  currency_id: string;
  list_price: string | number;
  sales_price: string | number;
}

export class PriceFragment extends Fragment {
  private _fListPriceUnits: Selection;
  private _prices: PriceItem[] = [];
  private _currentCurrencyId: string | null = null;

  constructor() {
    super();
    this._fListPriceUnits = new Selection();
    this._fListPriceUnits.setDataSource(this);
    this._fListPriceUnits.setDelegate(this);
    this.setChild("lpunits", this._fListPriceUnits);
  }

  getSelectedCurrencyId(): string | null { return this._currentCurrencyId; }

  setPrices(prices: PriceItem[]): void {
    this._prices = prices;
    if (this._prices.length) {
      this._currentCurrencyId = this._prices[0].currency_id;
    }
  }

  getItemsForSelection(_fSelect: Selection): Array<{text: string; value: string}> {
    let ids: string[] = [];
    for (let p of this._prices) {
      ids.push(p.currency_id);
    }

    let units: Array<{text: string; value: string}> = [];
    for (let id of ids) {
      let c = Exchange.getCurrency(id);
      if (c) {
        units.push({text : c.getCode(), value : id});
      }
    }
    return units;
  }

  getSelectedValueForSelection(_fSelect: Selection): string | null {
    return this._currentCurrencyId;
  }

  onSelectionChangedInSelection(_fSelect: Selection, value: string): void {
    this._currentCurrencyId = value;
    this.render();
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case PltT_DATA.CURRENCIES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PPriceBase): void {
    let pp = render.getUnitPanel();

    if (this._prices.length > 1) {
      this._fListPriceUnits.attachRender(pp);
      this._fListPriceUnits.render();
    } else {
      pp.setClassName("small-info-text center-align");
      if (this._prices.length) {
        let c = Exchange.getCurrency(this._prices[0].currency_id);
        pp.replaceContent(c ? c.getCode() : "...");
      } else {
        pp.replaceContent("N/A");
      }
    }

    let price = this.#getCurrentPriceItem();
    let c = price ? Exchange.getCurrency(price.currency_id) : null;

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

  #getCurrentPriceItem(): PriceItem | undefined {
    return this._prices.find(p => p.currency_id == this._currentCurrencyId);
  }

  #clearEmptyPrices(): void {
    let ps: PriceItem[] = [];
    for (let p of this._prices) {
      if (p.list_price != "" || p.sales_price != "") {
        ps.push(p);
      }
    }
    this._prices = ps;
  }
}

export default PriceFragment;
