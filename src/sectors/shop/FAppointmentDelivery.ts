import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FServiceDelivery } from './FServiceDelivery.js';
import { FvcBookAppointment } from './FvcBookAppointment.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FAppointmentDelivery extends FServiceDelivery {
  #btnAdd: Button;

  constructor() {
    super();
    this.#btnAdd = new Button();
    this.#btnAdd.setName("Book...");
    this.#btnAdd.setDelegate(this);
    this.setChild("btnAdd", this.#btnAdd);
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onBook(); }

  _renderOnRender(render: Render): void {
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.COMPACT:
      this.#renderCompact(render);
      break;
    default:
      this.#renderFull(render);
      break;
    }
  }

  #renderCompact(panel: Render): void {
    let p = new PanelWrapper();
    p.setClassName("center-align");
    panel.wrapPanel(p);
    this.#btnAdd.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnAdd.attachRender(p);
    this.#btnAdd.render();
  }

  #renderFull(panel: Render): void {
    this.#btnAdd.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#btnAdd.attachRender(panel);
    this.#btnAdd.render();
  }

  #onBook(): void {
    let v = new View();
    v.setContentFragment(new FvcBookAppointment());
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Book",
                                false);
  }
}
