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
import type Render from '../../lib/ui/renders/Render.js';

export class FServiceLocationEditor extends Fragment {
  protected _fBtnAdd: Button;
  protected _fTimeOverhead: NumberInput;
  protected _fPriceOverhead: NumberInput;
  protected _fSelectBranch: Selection;
  protected _fTimeslots: FSimpleFragmentList;
  protected _branchId: string | null = null;

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
    this.setChild("priceoverhead", this._fPriceOverhead);

    this._fSelectBranch = new Selection();
    this._fSelectBranch.setDataSource(this);
    this._fSelectBranch.setDelegate(this);
    this.setChild("selectBranch", this._fSelectBranch);

    this._fTimeslots = new FSimpleFragmentList();
    this.setChild("timeslots", this._fTimeslots);
  }

  getSelectedValueForSelection(_fSelection: Selection): string | null { return this._branchId; }
  getItemsForSelection(_fSelection: Selection): Array<{text: string; value: string}> {
    return Shop.getBranchLabels().map(
        a => { return {"text" : a.getName(), "value" : a.getId()}; });
  }

  onServiceTimeslotEditorRequestDelete(fTimeslot: FServiceTimeslotEditor): void {
    this._fTimeslots.remove(fTimeslot);
  }
  onSelectionChangedInSelection(_fSelection: Selection, value: string): void { this._branchId = value; }

  setData(d: ProductServiceLocation | null): void {
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

  collectData(): ProductServiceLocation {
    let d = new ProductServiceLocation({});
    for (let f of this._fTimeslots.getChildren()) {
      let timeslotEditor = f as FServiceTimeslotEditor;
      d.appendTimeslot(timeslotEditor.collectData());
    }
    d.setTimeOverhead(this._fTimeOverhead.getValue());
    d.setPriceOverhead(this._fPriceOverhead.getValue());
    d.setBranchId(this._branchId!);
    return d;
  }

  onSimpleButtonClicked(_fBtn: Button): void {
    this.#addTimeslot(null);
    this._fTimeslots.render();
  }

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.SHOP_BRANCH_LABELS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  _renderOnRender(render: Render): void {
    let panel = new PServiceLocationEditor();
    render.wrapPanel(panel);
    let p = panel.getTimeOverheadPanel();
    this._fTimeOverhead.attachRender(p);
    this._fTimeOverhead.render();

    p = panel.getPriceOverheadPanel();
    this._fPriceOverhead.attachRender(p);
    this._fPriceOverhead.render();

    p = panel.getTimeslotsPanel();
    this._fTimeslots.attachRender(p);
    this._fTimeslots.render();

    p = panel.getLocationsPanel();
    this.#renderBranchSelection(p);

    p = panel.getBtnAddPanel();
    this._fBtnAdd.attachRender(p);
    this._fBtnAdd.render();
  }

  #renderBranchSelection(panel: any): void {
    this._fSelectBranch.attachRender(panel);
    this._fSelectBranch.render();
  }

  #addTimeslot(ts: ProductServiceTimeslot | null): void {
    let f = new FServiceTimeslotEditor();
    f.setData(ts);
    f.setDelegate(this);
    this._fTimeslots.append(f);
  }
}
