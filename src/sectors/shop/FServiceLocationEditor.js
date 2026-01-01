import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { NumberInput } from '../../lib/ui/controllers/fragments/NumberInput.js';
import { Selection } from '../../lib/ui/controllers/fragments/Selection.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ProductServiceLocation } from '../../common/datatypes/ProductServiceLocation.js';
import { T_DATA } from '../../common/plt/Events.js';
import { PServiceLocationEditor } from './PServiceLocationEditor.js';
import { FServiceTimeslotEditor } from './FServiceTimeslotEditor.js';
import { Shop } from '../../common/dba/Shop.js';

export class FServiceLocationEditor extends Fragment {
  constructor() {
    super();
    this._fBtnAdd = new Button();
    this._fBtnAdd.setName("Add time slot");
    this._fBtnAdd.setDelegate(this);
    this.setChild("add", this._fBtnAdd);

    this._fTimeOverhead = new NumberInput();
    this._fTimeOverhead.setConfig({
      title : "Min time ahead of registration",
      min : 0,
      max : 10000,
      value : 0
    });
    this.setChild("timeoverhead", this._fTimeOverhead);

    this._fPriceOverhead = new NumberInput();
    this._fPriceOverhead.setConfig(
        {title : "Extra price", min : 0, max : 10000, value : 0});
    this.setChild("priceoverhead", this._fTimeOverhead);

    this._fSelectBranch = new Selection();
    this._fSelectBranch.setDataSource(this);
    this._fSelectBranch.setDelegate(this);
    this.setChild("selectBranch", this._fSelectBranch);

    this._fTimeslots = new FSimpleFragmentList();
    this.setChild("timeslots", this._fTimeslots);

    this._branchId = null;
  }

  getSelectedValueForSelection(fSelection) { return this._branchId; }
  getItemsForSelection(fSelection) {
    return Shop.getBranchLabels().map(
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
    let d = new ProductServiceLocation({});
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
    case T_DATA.SHOP_BRANCH_LABELS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let panel = new PServiceLocationEditor();
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
    let f = new FServiceTimeslotEditor();
    f.setData(ts);
    f.setDelegate(this);
    this._fTimeslots.append(f);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FServiceLocationEditor = FServiceLocationEditor;
}
