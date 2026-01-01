import { Panel } from '../lib/ui/renders/panels/Panel.js';
import { ListPanel } from '../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../lib/ui/renders/panels/PanelWrapper.js';

const _CPT_WINDOW = {
  MAIN : `<div class="w100 h100 flex flex-column">
    <div id="__ID_BANNER__" class="banner s-csecondarybg"></div>
    <div id="__ID_LAYERS__" class="flex-grow relative"></div>
  </div>`,
};

export class PWindow extends Panel {
  constructor() {
    super();
    this._pLayers = new ListPanel();
    this._pBanner = new PanelWrapper();
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

