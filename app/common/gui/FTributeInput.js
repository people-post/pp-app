(function(gui) {
const _CF_TRIBUTE_INPUT = {
  TYPE : {FLAT : "FLAT"},
}

class FTributetInput extends ui.FInput {
  constructor() {
    super();
    this._fPercent = new ui.NumberInput();
    this.setChild('percent', this._fPercent);
  }

  getConfig() {
    // Same format as server return object
    return {
      type : _CF_TRIBUTE_INPUT.TYPE.FLAT,
      data : this._fPercent.getValue()
    };
  }

  setConfig(config) {
    // Same format as server return object
    if (config) {
      switch (config.type) {
      case _CF_TRIBUTE_INPUT.TYPE.FLAT:
        this.#setFlatTribute(config.data);
        break;
      default:
        break;
      }
    } else {
      this.#setFlatTribute(0);
    }
    super.setConfig(config);
  }

  _renderOnRender(render) {
    let pSplit = new ui.SplitPanel();
    render.wrapPanel(pSplit);

    let p = pSplit.getLeftPanel();
    p.setClassName("small-info-text");
    p.replaceContent(this.#renderTributeType());

    p = pSplit.getRightPanel();
    this.#renderTributeInputOnRender(p);
  }

  #renderTributeType() {
    let s = "Type: ";
    switch (this._config.type) {
    case _CF_TRIBUTE_INPUT.TYPE.FLAT:
      s += "Flat";
      break;
    default:
      s += "N/A";
      break;
    }
    return s;
  }

  #renderTributeInputOnRender(render) {
    switch (this._config.type) {
    case _CF_TRIBUTE_INPUT.TYPE.FLAT:
      this.#renderFlatTribute(render);
      break;
    default:
      break;
    }
  }

  #renderFlatTribute(render) {
    this._fPercent.attachRender(render);
    this._fPercent.render();
  }

  #setFlatTribute(percent) {
    this._fPercent.setConfig({
      title : "",
      max : 100,
      min : 0,
      step : 1,
      value : percent,
      unit : "%"
    });
  }
};

gui.FTributetInput = FTributetInput;
}(window.gui = window.gui || {}));
