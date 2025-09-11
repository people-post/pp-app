(function(ui) {
class FSimpleFragmentList extends ui.FFragmentList {
  constructor() {
    super();
    this._mode = null;
    this._config = null;
  }

  setHorizontalMode(b) { this._mode = b ? "H" : null; }
  setGridMode(b, nCols = 0) {
    this._mode = b ? "G" : null;
    if (b) {
      this._config = {"nCols" : nCols};
    }
  }

  _renderOnRender(render) {
    let pList;
    if (render instanceof ui.ListPanel) {
      pList = render;
      pList.clear();
    } else {
      pList = new ui.ListPanel();
      this.#initPanel(pList);
      render.wrapPanel(pList);
    }
    for (let f of this.getChildren()) {
      let p = this.#createItemPanel();
      pList.pushPanel(p);
      f.attachRender(p);
      f.render();
    }
  }

  #initPanel(panel) {
    switch (this._mode) {
    case "H":
      panel.setClassName("flex flex-start center-align-items x-scroll no-wrap");
      break;
    default:
      break;
    }
  }

  #createItemPanel() {
    let p = new ui.PanelWrapper();
    switch (this._mode) {
    case "G":
      this.#initGridItemPanel(p, this._config);
      break;
    case "H":
      this.#initHorizontalItemPanel(p);
      break;
    default:
      break;
    }
    return p;
  }

  #initHorizontalItemPanel(panel) {}
  #initGridItemPanel(panel, config) {
    panel.setClassName("inline-block");
    if (config.nCols > 0) {
      // Grid layout
      let w = Math.floor(1000 / config.nCols) / 10.0;
      panel.setAttribute("style", "width: " + w + "%;");
    } else {
      // Flex layout
    }
  }
};

ui.FSimpleFragmentList = FSimpleFragmentList;
}(window.ui = window.ui || {}));
