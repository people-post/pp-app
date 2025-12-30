import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class FAppointmentDelivery extends shop.FServiceDelivery {
  #btnAdd;

  constructor() {
    super();
    this.#btnAdd = new Button();
    this.#btnAdd.setName("Book...");
    this.#btnAdd.setDelegate(this);
    this.setChild("btnAdd", this.#btnAdd);
  }

  onSimpleButtonClicked(fBtn) { this.#onBook(); }

  _renderOnRender(render) {
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.COMPACT:
      this.#renderCompact(render);
      break;
    default:
      this.#renderFull(render);
      break;
    }
  }

  #renderCompact(panel) {
    let p = new PanelWrapper();
    p.setClassName("center-align");
    panel.wrapPanel(p);
    this.#btnAdd.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnAdd.attachRender(p);
    this.#btnAdd.render();
  }

  #renderFull(panel) {
    this.#btnAdd.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#btnAdd.attachRender(panel);
    this.#btnAdd.render();
  }

  #onBook() {
    let v = new View();
    v.setContentFragment(new shop.FvcBookAppointment());
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Book",
                                false);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FAppointmentDelivery = FAppointmentDelivery;
}
