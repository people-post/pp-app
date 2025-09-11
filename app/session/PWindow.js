(function(main) {
const _CPT_WINDOW = {
  MAIN : `<div class="w100 h100 flex flex-column">
    <div id="__ID_BANNER__" class="banner s-csecondarybg"></div>
    <div id="__ID_LAYERS__" class="flex-grow relative"></div>
  </div>`,
};

class PWindow extends ui.Panel {
  constructor() {
    super();
    this._pLayers = new ui.ListPanel();
    this._pBanner = new ui.PanelWrapper();
  }

  getBannerPanel() { return this._pBanner; }
  getTopLayer() { return this._pLayers.getPanel(0); }

  pushLayer(layer) {
    layer.setStyle("zIndex", this._pLayers.size());
    this._pLayers.pushPanel(layer);
  }
  popLayer() { this._pLayers.pop(); }

  _renderFramework() {
    let s = _CPT_WINDOW.MAIN;
    s = s.replace("__ID_BANNER__", this._getSubElementId("B"));
    s = s.replace("__ID_LAYERS__", this._getSubElementId("L"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pBanner.attach(this._getSubElementId("B"));
    this._pLayers.attach(this._getSubElementId("L"));
  }
};

main.PWindow = PWindow;
}(window.main = window.main || {}));
