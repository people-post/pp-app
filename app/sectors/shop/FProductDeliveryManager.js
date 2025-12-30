
export class FProductDeliveryManager extends ui.Fragment {
  constructor() {
    super();
    this._fChoices = new ui.ButtonGroup();
    this._fChoices.setDelegate(this);

    this._mChoices = this.#initChoiceMap();
    this._tLayout = null; // shop.FProductDelivery.T_LAYOUT
  }

  getProductForProductDeliveryFragment(fDelivery) {
    return this._dataSource.getProductForDeliveryManagerFragment(this);
  }

  setLayoutType(t) { this._tLayout = t; }

  onButtonGroupSelectionChanged(fButtonGroup, value) {}
  onGoodDeliveryFragmentRequestAddToCart(fPhysical) { this.#onAddToCart(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.DRAFT_ORDERS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let product = this._dataSource.getProductForDeliveryManagerFragment(this);
    if (!product) {
      return;
    }

    let choices = product.getDeliveryChoices();
    switch (this._tLayout) {
    case shop.FProductDelivery.T_LAYOUT.COMPACT:
      this.#renderCompact(choices, render);
      break;
    default:
      this.#renderFull(choices, render);
      break;
    }
  }

  #renderCompact(choices, panel) {
    let c = choices[0];
    if (!c) {
      return;
    }
    let f = this.#getDeliveryFragment(c);
    if (f) {
      this.setChild("choice", f);
      f.setLayoutType(shop.FProductDelivery.T_LAYOUT.COMPACT);
      f.attachRender(panel);
      f.render();
    }
  }

  #renderFull(choices, panel) {
    let f;
    if (choices.length > 1) {
      this._fChoices.clearChoices();
      for (let [i, c] of choices.entries()) {
        this._fChoices.addChoice({
          name : this.#getDeliveryChoiceName(c),
          value : i,
          fDetail : this.#getDeliveryFragment(c)
        });
      }
      f = this._fChoices;
      let v = this._fChoices.getSelectedValue();
      if (v == null || v < 0 || v >= choices.length) {
        this._fChoices.setSelectedValue(0);
      }
    } else if (choices.length == 1) {
      f = this.#getDeliveryFragment(c);
    }

    if (f) {
      this.setChild("choice", f);
      f.attachRender(panel);
      f.render();
    }
  }

  #getDeliveryFragment(choice) {
    let d = this._mChoices.get(choice.getType());
    let f = d ? d.fDetail : null;
    if (f) {
      f.setData(choice.getDataObject());
    }
    return f;
  }

  #getDeliveryChoiceName(choice) {
    let d = this._mChoices.get(choice.getType());
    return d ? d.name : "";
  }

  #initChoiceMap() {
    let m = new Map();
    let t = dat.ProductDeliveryChoice.TYPE;
    let f = new shop.FPhysicalGoodDelivery();
    f.setDataSource(this);
    f.setDelegate(this);
    m.set(t.GOOD, {name : "Physical delivery", fDetail : f});

    f = new shop.FDigitalGoodDelivery();
    f.setDataSource(this);
    f.setDelegate(this);
    m.set(t.DIGITAL, {name : "Digital delivery", fDetail : f});

    f = new shop.FAppointmentDelivery();
    f.setDataSource(this);
    f.setDelegate(this);
    m.set(t.SCHEDULE, {name : "Appointment", fDetail : f});

    f = new shop.FQueueDelivery();
    f.setDataSource(this);
    f.setDelegate(this);
    m.set(t.QUEUE, {name : "Walk in", fDetail : f});
    return m;
  }

  #onAddToCart() {
    this._delegate.onProductDeliveryManagerFragmentRequestAddToCart(this);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FProductDeliveryManager = FProductDeliveryManager;
}
