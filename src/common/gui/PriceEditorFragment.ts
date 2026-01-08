import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Selection } from '../../lib/ui/controllers/fragments/Selection.js';
import { NumberInput } from '../../lib/ui/controllers/fragments/NumberInput.js';
import { T_DATA } from '../../lib/framework/Events.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ArrayPanel } from '../../lib/ui/renders/panels/ArrayPanel.js';
import { Shop } from '../dba/Shop.js';
import { Exchange } from '../dba/Exchange.js';

interface PriceItem {
  currency_id: string;
  list_price: string | number;
  sales_price: string | number;
}

export class PriceEditorFragment extends Fragment {
  private _fListPriceUnits: Selection;
  private _fListPriceInput: NumberInput;
  private _fSalesPriceInput: NumberInput;
  private _prices: PriceItem[] = [];
  private _currentCurrencyId: string | null = null;
  private _hasError = false;

  constructor() {
    super();
    this._fListPriceUnits = new Selection();
    this._fListPriceUnits.setDataSource(this);
    this._fListPriceUnits.setDelegate(this);
    this._fListPriceInput = new NumberInput();
    this._fListPriceInput.setDelegate(this);
    this._fSalesPriceInput = new NumberInput();
    this._fSalesPriceInput.setDelegate(this);
    this.setChild("lpunits", this._fListPriceUnits);
    this.setChild("lpinput", this._fListPriceInput);
    this.setChild("spinput", this._fSalesPriceInput);
  }

  getPrices(): PriceItem[] { return this._prices; }
  setPrices(prices: PriceItem[]): void {
    this._prices = prices;
    if (this._prices.length) {
      this._currentCurrencyId = this._prices[0].currency_id;
    }
  }

  getItemsForSelection(_fSelect: Selection): Array<{text: string; value: string}> {
    let ids: string[] = [];
    ids = Shop.getCurrencyIds();
    Exchange.loadMissingCurrencies(ids);

    let units: Array<{text: string; value: string}> = [];
    for (let id of ids) {
      let c = Exchange.getCurrency(id);
      if (c) {
        units.push({text : this.#renderCurrencyName(c), value : id});
      }
    }
    return units;
  }
  getSelectedValueForSelection(_fSelect: Selection): string | null { return this._currentCurrencyId; }
  onInputChangeInNumberInputFragment(fInput: NumberInput, value: number): void {
    fInput.validate();
    let price = this.#getCurrentPriceItem();
    if (!price) {
      price = {
        currency_id : this._currentCurrencyId || "",
        list_price : "",
        sales_price : ""
      };
      this._prices.push(price);
    }

    if (fInput == this._fListPriceInput) {
      price.list_price = value;
    } else if (fInput == this._fSalesPriceInput) {
      price.sales_price = value;
    }

    this.#clearEmptyPrices();
  }
  onSelectionChangedInSelection(_fSelect: Selection, value: string): void {
    this._currentCurrencyId = value;
    this.render();
  }

  validate(): boolean {
    this.#clearErrorMark();
    if (this._prices.length == 0) {
      this.#markError(R.get("EL_PRICE_REQUIRED"));
      return false;
    }

    if (!this._fListPriceInput.validate()) {
      return false;
    }
    if (!this._fSalesPriceInput.validate()) {
      return false;
    }

    for (let p of this._prices) {
      if (p.list_price == "" || p.sales_price == "") {
        let c = Exchange.getCurrency(p.currency_id);
        let s = R.get("EL_INCOMPLETE_PRICE");
        s = s.replace("__CURRENCY__", c ? c.getName() : p.currency_id);
        this.#markError(s);
        return false;
      }
    }
    return true;
  }

  #clearErrorMark(): void {
    if (this._hasError) {
      this._hasError = false;
      this.render();
    }
  }

  #markError(err: string): void {
    this.onLocalErrorInFragment(this, err);
    this._hasError = true;
    this.render();
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.CURRENCIES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Panel): void {
    let p = new ListPanel();
    if (this._hasError) {
      p.setClassName("input-error");
    }
    render.wrapPanel(p);

    let pp = new Panel();
    p.pushPanel(pp);

    this._fListPriceUnits.attachRender(pp);
    this._fListPriceUnits.render();

    pp = new ArrayPanel();
    p.pushPanel(pp);
    let ppp: Panel;
    ppp = new Panel();
    ppp.setClassName("list-price");
    pp.pushPanel(ppp);
    ppp.replaceContent("List price: ");

    ppp = new Panel();
    ppp.setClassName("list-price");
    pp.pushPanel(ppp);
    let price = this.#getCurrentPriceItem();
    this.#renderListPriceValue(ppp, price ? price.list_price : null);

    pp = new ArrayPanel();
    p.pushPanel(pp);
    ppp = new Panel();
    pp.pushPanel(ppp);
    ppp.replaceContent("Sales price: ");

    ppp = new Panel();
    pp.pushPanel(ppp);
    this.#renderSalesPriceValue(ppp, price ? price.sales_price : null);
  }

  #renderListPriceValue(render: Panel, value: string | number | null): void {
    if (this._currentCurrencyId) {
      this._fListPriceInput.setConfig({
        title : "",
        min : 0.01,
        max : 1000000000,
        step : 0.01,
        value : value as number
      });
      this._fListPriceInput.attachRender(render);
      this._fListPriceInput.render();
    } else {
      render.replaceContent(value ? value.toString() : "N/A");
    }
  }

  #renderSalesPriceValue(render: Panel, value: string | number | null): void {
    if (this._currentCurrencyId) {
      this._fSalesPriceInput.setConfig({
        title : "",
        min : 0.01,
        max : 1000000000,
        step : 0.01,
        value : value as number
      });
      this._fSalesPriceInput.attachRender(render);
      this._fSalesPriceInput.render();
    } else {
      render.replaceContent(value ? value.toString() : "N/A");
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

  #renderCurrencyName(currency: ReturnType<typeof Exchange.getCurrency>): string {
    let s = `__NAME__(__CODE__)`;
    s = s.replace("__NAME__", currency.getName());
    s = s.replace("__CODE__", currency.getCode());
    return s;
  }
}

export default PriceEditorFragment;
