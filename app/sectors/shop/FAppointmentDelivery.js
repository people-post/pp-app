
class FAppointmentDelivery extends shop.FServiceDelivery {
  #btnAdd;

  constructor() {
    super();
    this.#btnAdd = new ui.Button();
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
    let p = new ui.PanelWrapper();
    p.setClassName("center-align");
    panel.wrapPanel(p);
    this.#btnAdd.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this.#btnAdd.attachRender(p);
    this.#btnAdd.render();
  }

  #renderFull(panel) {
    this.#btnAdd.setLayoutType(ui.Button.LAYOUT_TYPE.BAR);
    this.#btnAdd.attachRender(panel);
    this.#btnAdd.render();
  }

  #onBook() {
    let v = new ui.View();
    v.setContentFragment(new shop.FvcBookAppointment());
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Book",
                                false);
  }
};

shop.FAppointmentDelivery = FAppointmentDelivery;
}(window.shop = window.shop || {}));
