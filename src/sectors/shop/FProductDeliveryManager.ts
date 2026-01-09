import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ButtonGroup } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { ProductDeliveryChoice } from '../../common/datatypes/ProductDeliveryChoice.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FProductDelivery } from './FProductDelivery.js';
import { FPhysicalGoodDelivery } from './FPhysicalGoodDelivery.js';
import { FDigitalGoodDelivery } from './FDigitalGoodDelivery.js';
import { FAppointmentDelivery } from './FAppointmentDelivery.js';
import { FQueueDelivery } from './FQueueDelivery.js';

interface ChoiceDetail {
  name: string;
  fDetail: FProductDelivery;
}

export class FProductDeliveryManager extends Fragment {
  private _fChoices: ButtonGroup;
  private _mChoices: Map<string, ChoiceDetail>;
  private _tLayout: string | null = null; // FProductDelivery.T_LAYOUT

  constructor() {
    super();
    this._fChoices = new ButtonGroup();
    this._fChoices.setDelegate(this);

    this._mChoices = this.#initChoiceMap();
    this._tLayout = null;
  }

  getProductForProductDeliveryFragment(_fDelivery: FProductDelivery): ReturnType<typeof this._dataSource.getProductForDeliveryManagerFragment> {
    // @ts-expect-error - dataSource may have this method
    return this._dataSource?.getProductForDeliveryManagerFragment?.(this);
  }

  setLayoutType(t: string | null): void { this._tLayout = t; }

  onButtonGroupSelectionChanged(_fButtonGroup: ButtonGroup, _value: unknown): void {}
  onGoodDeliveryFragmentRequestAddToCart(_fPhysical: FPhysicalGoodDelivery): void { this.#onAddToCart(); }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.DRAFT_ORDERS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    // @ts-expect-error - dataSource may have this method
    let product = this._dataSource?.getProductForDeliveryManagerFragment?.(this);
    if (!product) {
      return;
    }

    let choices = product.getDeliveryChoices();
    switch (this._tLayout) {
    case FProductDelivery.T_LAYOUT.COMPACT:
      this.#renderCompact(choices, render);
      break;
    default:
      this.#renderFull(choices, render);
      break;
    }
  }

  #renderCompact(choices: ProductDeliveryChoice[], panel: ReturnType<typeof this.getRender>): void {
    let c = choices[0];
    if (!c) {
      return;
    }
    let f = this.#getDeliveryFragment(c);
    if (f) {
      this.setChild("choice", f);
      f.setLayoutType(FProductDelivery.T_LAYOUT.COMPACT);
      f.attachRender(panel);
      f.render();
    }
  }

  #renderFull(choices: ProductDeliveryChoice[], panel: ReturnType<typeof this.getRender>): void {
    let f: FProductDelivery | ButtonGroup | null = null;
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
      if (v == null || (typeof v === 'number' && (v < 0 || v >= choices.length))) {
        this._fChoices.setSelectedValue(0);
      }
    } else if (choices.length == 1) {
      f = this.#getDeliveryFragment(choices[0]);
    }

    if (f) {
      this.setChild("choice", f);
      f.attachRender(panel);
      f.render();
    }
  }

  #getDeliveryFragment(choice: ProductDeliveryChoice): FProductDelivery | null {
    let d = this._mChoices.get(choice.getType());
    let f = d ? d.fDetail : null;
    if (f) {
      f.setData(choice.getDataObject());
    }
    return f;
  }

  #getDeliveryChoiceName(choice: ProductDeliveryChoice): string {
    let d = this._mChoices.get(choice.getType());
    return d ? d.name : "";
  }

  #initChoiceMap(): Map<string, ChoiceDetail> {
    let m = new Map<string, ChoiceDetail>();
    let t = ProductDeliveryChoice.TYPE;
    let f = new FPhysicalGoodDelivery();
    f.setDataSource(this);
    f.setDelegate(this);
    m.set(t.GOOD, {name : "Physical delivery", fDetail : f});

    f = new FDigitalGoodDelivery();
    f.setDataSource(this);
    f.setDelegate(this);
    m.set(t.DIGITAL, {name : "Digital delivery", fDetail : f});

    f = new FAppointmentDelivery();
    f.setDataSource(this);
    f.setDelegate(this);
    m.set(t.SCHEDULE, {name : "Appointment", fDetail : f});

    f = new FQueueDelivery();
    f.setDataSource(this);
    f.setDelegate(this);
    m.set(t.QUEUE, {name : "Walk in", fDetail : f});
    return m;
  }

  #onAddToCart(): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onProductDeliveryManagerFragmentRequestAddToCart?.(this);
  }
}

export default FProductDeliveryManager;
