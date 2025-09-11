(function(shop) {
class FServiceLocationEditor extends ui.Fragment {
  constructor() {
    super();
    this._fBtnAdd = new ui.Button();
    this._fBtnAdd.setName("Add time slot");
    this._fBtnAdd.setDelegate(this);
    this.setChild("add", this._fBtnAdd);

    this._fTimeOverhead = new ui.NumberInput();
    this._fTimeOverhead.setConfig({
      title : "Min time ahead of registration",
      min : 0,
      max : 10000,
      value : 0
    });
    this.setChild("timeoverhead", this._fTimeOverhead);

    this._fPriceOverhead = new ui.NumberInput();
    this._fPriceOverhead.setConfig(
        {title : "Extra price", min : 0, max : 10000, value : 0});
    this.setChild("priceoverhead", this._fTimeOverhead);

    this._fSelectBranch = new ui.Selection();
    this._fSelectBranch.setDataSource(this);
    this._fSelectBranch.setDelegate(this);
    this.setChild("selectBranch", this._fSelectBranch);

    this._fTimeslots = new ui.FSimpleFragmentList();
    this.setChild("timeslots", this._fTimeslots);

    this._branchId = null;
  }

  getSelectedValueForSelection(fSelection) { return this._branchId; }
  getItemsForSelection(fSelection) {
    return dba.Shop.getBranchLabels().map(
        a => { return {"text" : a.getName(), "value" : a.getId()}; });
  }

  onServiceTimeslotEditorRequestDelete(fTimeslot) {
    this._fTimeslots.remove(fTimeslot);
  }
  onSelectionChangedInSelection(fSelection, value) { this._branchId = value; }

  setData(d) {
    this._fTimeslots.clear();
    if (d) {
      let c = this._fTimeOverhead.getConfig();
      c.value = d.getTimeOverhead();
      this._fTimeOverhead.setConfig(c);

      c = this._fPriceOverhead.getConfig();
      c.value = d.getPriceOverhead();
      this._fPriceOverhead.setConfig(c);

      for (let ts of d.getTimeslots()) {
        this.#addTimeslot(ts);
      }
      this._branchId = d.getBranchId();
    }
  }

  collectData() {
    let d = new dat.ProductServiceLocation({});
    for (let f of this._fTimeslots.getChildren()) {
      d.appendTimeslot(f.collectData());
    }
    d.setTimeOverhead(this._fTimeOverhead.getValue());
    d.setPriceOverhead(this._fPriceOverhead.getValue());
    d.setBranchId(this._branchId);
    return d;
  }

  onSimpleButtonClicked(fBtn) {
    this.#addTimeslot(null);
    this._fTimeslots.render();
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.SHOP_BRANCH_LABELS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let panel = new shop.PServiceLocationEditor();
    render.wrapPanel(panel);
    let p = panel.getTimeOverheadPanel();
    this._fTimeOverhead.attachRender(p);
    this._fTimeOverhead.render();

    p = panel.getPriceOverheadPanel();
    this._fPriceOverhead.attachRender(p);
    this._fPriceOverhead.render();

    p = panel.getTimeOverheadPanel();
    p = panel.getTimeslotsPanel();
    this._fTimeslots.attachRender(p);
    this._fTimeslots.render();

    p = panel.getLocationsPanel();
    this.#renderBranchSelection(p);

    p = panel.getBtnAddPanel();
    this._fBtnAdd.attachRender(p);
    this._fBtnAdd.render();
  }

  #renderBranchSelection(panel) {
    this._fSelectBranch.attachRender(panel);
    this._fSelectBranch.render();
  }

  #addTimeslot(ts) {
    let f = new shop.FServiceTimeslotEditor();
    f.setData(ts);
    f.setDelegate(this);
    this._fTimeslots.append(f);
  }
};

shop.FServiceLocationEditor = FServiceLocationEditor;
}(window.shop = window.shop || {}));
