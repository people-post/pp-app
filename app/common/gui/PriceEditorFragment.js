(function(gui) {
class PriceEditorFragment extends ui.Fragment {
  constructor() {
    super();
    this._fListPriceUnits = new ui.Selection();
    this._fListPriceUnits.setDataSource(this);
    this._fListPriceUnits.setDelegate(this);
    this._fListPriceInput = new ui.NumberInput();
    this._fListPriceInput.setDelegate(this);
    this._fSalesPriceInput = new ui.NumberInput();
    this._fSalesPriceInput.setDelegate(this);
    this.setChild("lpunits", this._fListPriceUnits);
    this.setChild("lpinput", this._fListPriceInput);
    this.setChild("spinput", this._fSalesPriceInput);
    this._prices = [];
    this._currentCurrencyId = null;
    this._hasError = false;
  }

  getPrices() { return this._prices; }
  setPrices(prices) {
    this._prices = prices;
    if (this._prices.length) {
      this._currentCurrencyId = this._prices[0].currency_id;
    }
  }

  getItemsForSelection(fSelect) {
    let ids = [];
    ids = dba.Shop.getCurrencyIds();
    dba.Exchange.loadMissingCurrencies(ids);

    let units = [];
    for (let id of ids) {
      let c = dba.Exchange.getCurrency(id);
      if (c) {
        units.push({text : this.#renderCurrencyName(c), value : id});
      }
    }
    return units;
  }
  getSelectedValueForSelection(fSelect) { return this._currentCurrencyId; }
  onInputChangeInNumberInputFragment(fInput, value) {
    fInput.validate();
    let price = this.#getCurrentPriceItem();
    if (!price) {
      price = {
        currency_id : this._currentCurrencyId,
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
  onSelectionChangedInSelection(fSelect, value) {
    this._currentCurrencyId = value;
    this.render();
  }

  validate() {
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
        let c = dba.Exchange.getCurrency(p.currency_id);
        let s = R.get("EL_INCOMPLETE_PRICE");
        s = s.replace("__CURRENCY__", c ? c.getName() : p.currency_id);
        this.#markError(s);
        return false;
      }
    }
    return true;
  }

  #clearErrorMark() {
    if (this._hasError) {
      this._hasError = false;
      this.render();
    }
  }

  #markError(err) {
    this.onLocalErrorInFragment(this, err);
    this._hasError = true;
    this.render();
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.CURRENCIES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    if (this._hasError) {
      p.setClassName("input-error");
    }
    render.wrapPanel(p);

    let pp = new ui.Panel();
    p.pushPanel(pp);

    this._fListPriceUnits.attachRender(pp);
    this._fListPriceUnits.render();

    pp = new ui.ArrayPanel();
    p.pushPanel(pp);
    let ppp;
    ppp = new ui.Panel();
    ppp.setClassName("list-price");
    pp.pushPanel(ppp);
    ppp.replaceContent("List price: ");

    ppp = new ui.Panel();
    ppp.setClassName("list-price");
    pp.pushPanel(ppp);
    let price = this.#getCurrentPriceItem();
    this.#renderListPriceValue(ppp, price ? price.list_price : null);

    pp = new ui.ArrayPanel();
    p.pushPanel(pp);
    ppp = new ui.Panel();
    pp.pushPanel(ppp);
    ppp.replaceContent("Sales price: ");

    ppp = new ui.Panel();
    pp.pushPanel(ppp);
    this.#renderSalesPriceValue(ppp, price ? price.sales_price : null);
  }

  #renderListPriceValue(render, value) {
    if (this._currentCurrencyId) {
      this._fListPriceInput.setConfig({
        title : "",
        min : 0.01,
        max : 1000000000,
        step : 0.01,
        value : value
      });
      this._fListPriceInput.attachRender(render);
      this._fListPriceInput.render();
    } else {
      render.replaceContent(value ? value : "N/A");
    }
  }

  #renderSalesPriceValue(render, value) {
    if (this._currentCurrencyId) {
      this._fSalesPriceInput.setConfig({
        title : "",
        min : 0.01,
        max : 1000000000,
        step : 0.01,
        value : value
      });
      this._fSalesPriceInput.attachRender(render);
      this._fSalesPriceInput.render();
    } else {
      render.replaceContent(value ? value : "N/A");
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

  #renderCurrencyName(currency) {
    let s = `__NAME__(__CODE__)`;
    s = s.replace("__NAME__", currency.getName());
    s = s.replace("__CODE__", currency.getCode());
    return s;
  }
};

gui.PriceEditorFragment = PriceEditorFragment;
}(window.gui = window.gui || {}));
