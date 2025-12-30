
class FProductDeliveryEditorManager extends ui.Fragment {
  constructor() {
    super();
    this._mChoices = this.#initChoiceMap();

    this._fChoices = new ui.FTabbedPane();
    this._fChoices.setEnableEdit(true);
    this._fChoices.setMaxNTabs(this._mChoices.size);
    this._fChoices.setDelegate(this);
    this.setChild("choices", this._fChoices);

    this._lc = new ui.LContext();
    this._lc.setDelegate(this);
  }

  getChoiceDataList() {
    let ds = [];
    for (let v of this._mChoices.values()) {
      let d = v.fDetail.getData();
      if (d) {
        ds.push(d);
      }
    }
    return ds;
  }

  setChoices(choices) {
    for (let c of choices) {
      let d = this._mChoices.get(c.getType());
      if (d) {
        d.fDetail.setValue(c.getDataObject());
      }
      this.#addPane(c.getType());
    }
  }

  onTabbedPaneFragmentRequestAddPane(fChoices) { this.#showContextMenu(); }
  onTabbedPaneFragmentRequestClosePane(fChoices, value) {
    let v = this._mChoices.get(value);
    if (v) {
      this._confirmDangerousOperation(
          "Are you sure you want to remove delivery method: " + v.name + "?",
          () => this._fChoices.popPane(value));
    }
    return false;
  }

  onOptionClickedInContextLayer(lContext, value) { this.#addPane(value); }

  _renderOnRender(render) {
    this._fChoices.attachRender(render);
    this._fChoices.render();
  }

  #addPane(type) {
    let d = this._mChoices.get(type);
    if (d) {
      this._fChoices.addPane({name : d.name, value : type}, d.fDetail);
    }
  }

  #initChoiceMap() {
    let m = new Map();
    let t = dat.ProductDeliveryChoice.TYPE;
    let f = new shop.FPhysicalGoodDeliveryEditor();
    f.setDelegate(this);
    m.set(t.GOOD, {name : "Goods", fDetail : f});

    f = new shop.FDigitalGoodDeliveryEditor();
    f.setDelegate(this);
    m.set(t.DIGITAL, {name : "Digital", fDetail : f});

    f = new shop.FAppointmentDeliveryEditor();
    f.setDelegate(this);
    m.set(t.SCHEDULE, {name : "Appointment", fDetail : f});

    f = new shop.FQueueDeliveryEditor();
    f.setDelegate(this);
    m.set(t.QUEUE, {name : "Walk-in", fDetail : f});
    return m;
  }

  #showContextMenu() {
    this._lc.setTargetName("Delivery method");
    this._lc.setDescription(null);
    this._lc.clearOptions();
    let vs = this._fChoices.getTabValues();
    for (let [v, d] of this._mChoices.entries()) {
      if (!vs.includes(v)) {
        this._lc.addOption(d.name, v);
      }
    }
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this._lc,
                             "Context");
  }
};

shop.FProductDeliveryEditorManager = FProductDeliveryEditorManager;
}(window.shop = window.shop || {}));
