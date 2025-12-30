
class FProductDeliveryEditor extends ui.Fragment {
  constructor() {
    super();
    this._value = null;
  }

  getData() {
    let d = this._collectData();
    if (d) {
      return JSON.stringify({"type" : this._getType(), "data" : d});
    } else {
      return null;
    }
  }

  setValue(value) { this._value = value; }

  _getType() { return null; }
  _collectData() { return null; }

  _renderOnRender(render) {
    let panel = new ui.ListPanel();
    render.wrapPanel(panel);

    let p = new ui.Panel();
    panel.pushPanel(p);
    if (this._value) {
      p.replaceContent(this._value.getDescription());
    }

    p = new ui.PanelWrapper();
    panel.pushPanel(p);
    this._renderSpec(p);
  }

  _renderSpec(panel) {}
};

shop.FProductDeliveryEditor = FProductDeliveryEditor;
}(window.shop = window.shop || {}));
