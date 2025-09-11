(function(scol) {
const _CPT_FILTER_ITEM = {
  MAIN : `<div class="pad5">
  <div class="pad5 bd1px bdsolid bdlightgray bdradius5px">
    <div id="__ID_CONTENT__"></div>
    <div id="__ID_HINT__" class="small-info-text right-align"></div>
  </div>
  </div>`,
}

class PFilterItem extends ui.Panel {
  constructor() {
    super();
    this._pContent = new ui.PanelWrapper();
    this._pHint = new ui.Panel();
  }

  getContentPanel() { return this._pContent; }
  getHintPanel() { return this._pHint; }

  _renderFramework() {
    let s = _CPT_FILTER_ITEM.MAIN;
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_HINT__", this._getSubElementId("H"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pContent.attach(this._getSubElementId("C"));
    this._pHint.attach(this._getSubElementId("H"));
  }
};

scol.PFilterItem = PFilterItem;
}(window.scol = window.scol || {}));
