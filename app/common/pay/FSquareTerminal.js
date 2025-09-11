(function(pay) {
class FSquareTerminal extends ui.Fragment {
  constructor() {
    super();
    this._obj = null;
  }

  setData(obj) { this._obj = obj; }

  _renderOnRender(render) {
    let panel = new pay.PSquareTerminal();
    render.wrapPanel(panel);

    let p = panel.getTitlePanel();
    this.#renderItemInfo(p, "Square terminal", "Device type");

    p = panel.getDeviceIdPanel();
    this.#renderItemInfo(p, this._obj.getDeviceId(), "Device id");

    p = panel.getPairCodePanel();
    this.#renderItemInfo(p, this._obj.getPairCode(), "Pair code");

    p = panel.getPairByPanel();
    this.#renderItemInfo(p, this._obj.getPairBy(), "Pair by");

    p = panel.getStatusPanel();
    this.#renderItemInfo(p, this._obj.getStatus(), "Status");

    p = panel.getPairedAtPanel();
    this.#renderItemInfo(p, this._obj.getPairedAt(), "Paired at");
  }

  #renderItemInfo(panel, value, title) {
    if (value) {
      panel.replaceContent(title + ": " + value);
    }
  }
};

pay.FSquareTerminal = FSquareTerminal;
}(window.pay = window.pay || {}));
