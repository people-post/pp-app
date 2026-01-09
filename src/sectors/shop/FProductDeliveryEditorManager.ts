import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FTabbedPane } from '../../lib/ui/controllers/fragments/FTabbedPane.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FPhysicalGoodDeliveryEditor } from './FPhysicalGoodDeliveryEditor.js';
import { FDigitalGoodDeliveryEditor } from './FDigitalGoodDeliveryEditor.js';
import { FAppointmentDeliveryEditor } from './FAppointmentDeliveryEditor.js';
import { FQueueDeliveryEditor } from './FQueueDeliveryEditor.js';
import type Render from '../../lib/ui/renders/Render.js';

interface DeliveryChoiceDetail {
  name: string;
  fDetail: FProductDeliveryEditor;
}

interface ProductDeliveryChoiceData {
  getType(): symbol;
  getDataObject(): any;
}

export class FProductDeliveryEditorManager extends Fragment {
  protected _mChoices: Map<symbol, DeliveryChoiceDetail>;
  protected _fChoices: FTabbedPane;
  protected _lc: LContext;

  constructor() {
    super();
    this._mChoices = this.#initChoiceMap();

    this._fChoices = new FTabbedPane();
    this._fChoices.setEnableEdit(true);
    this._fChoices.setMaxNTabs(this._mChoices.size);
    this._fChoices.setDelegate(this);
    this.setChild("choices", this._fChoices);

    this._lc = new LContext();
    this._lc.setDelegate(this);
  }

  getChoiceDataList(): string[] {
    let ds: string[] = [];
    for (let v of this._mChoices.values()) {
      let d = v.fDetail.getData();
      if (d) {
        ds.push(d);
      }
    }
    return ds;
  }

  setChoices(choices: ProductDeliveryChoiceData[]): void {
    for (let c of choices) {
      let d = this._mChoices.get(c.getType());
      if (d) {
        d.fDetail.setValue(c.getDataObject());
      }
      this.#addPane(c.getType());
    }
  }

  onTabbedPaneFragmentRequestAddPane(_fChoices: FTabbedPane): void { this.#showContextMenu(); }
  onTabbedPaneFragmentRequestClosePane(_fChoices: FTabbedPane, value: symbol): boolean {
    let v = this._mChoices.get(value);
    if (v) {
      this._confirmDangerousOperation(
          "Are you sure you want to remove delivery method: " + v.name + "?",
          () => this._fChoices.popPane(value));
    }
    return false;
  }

  onOptionClickedInContextLayer(_lContext: LContext, value: symbol): void { this.#addPane(value); }

  _renderOnRender(render: Render): void {
    this._fChoices.attachRender(render);
    this._fChoices.render();
  }

  #addPane(type: symbol): void {
    let d = this._mChoices.get(type);
    if (d) {
      this._fChoices.addPane({name : d.name, value : type}, d.fDetail);
    }
  }

  #initChoiceMap(): Map<symbol, DeliveryChoiceDetail> {
    let m = new Map<symbol, DeliveryChoiceDetail>();
    let t = ProductDeliveryChoice.TYPE;
    let f = new FPhysicalGoodDeliveryEditor();
    f.setDelegate(this);
    m.set(t.GOOD, {name : "Goods", fDetail : f});

    f = new FDigitalGoodDeliveryEditor();
    f.setDelegate(this);
    m.set(t.DIGITAL, {name : "Digital", fDetail : f});

    f = new FAppointmentDeliveryEditor();
    f.setDelegate(this);
    m.set(t.SCHEDULE, {name : "Appointment", fDetail : f});

    f = new FQueueDeliveryEditor();
    f.setDelegate(this);
    m.set(t.QUEUE, {name : "Walk-in", fDetail : f});
    return m;
  }

  #showContextMenu(): void {
    this._lc.setTargetName("Delivery method");
    this._lc.setDescription(null);
    this._lc.clearOptions();
    let vs = this._fChoices.getTabValues();
    for (let [v, d] of this._mChoices.entries()) {
      if (!vs.includes(v)) {
        this._lc.addOption(d.name, v);
      }
    }
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this._lc,
                             "Context");
  }
}
