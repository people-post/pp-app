import { Panel } from '../lib/ui/renders/panels/Panel.js';
import { ListPanel } from '../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../lib/ui/renders/panels/PanelWrapper.js';
import { Panel as BasePanel } from '../lib/ui/renders/panels/Panel.js';

const _CPT_WINDOW = {
  MAIN : `<div class="w100 h100 flex flex-column">
    <div id="__ID_BANNER__" class="banner s-csecondarybg"></div>
    <div id="__ID_LAYERS__" class="flex-grow relative"></div>
  </div>`,
};

export class PWindow extends Panel {
  private _pLayers: ListPanel;
  private _pBanner: PanelWrapper;

  constructor() {
    super();
    this._pLayers = new ListPanel();
    this._pBanner = new PanelWrapper();
  }

  getBannerPanel(): PanelWrapper { return this._pBanner; }
  getTopLayer(): BasePanel | null { return this._pLayers.getPanel(0) || null; }

  pushLayer(layer: BasePanel): void {
    layer.setStyle("zIndex", this._pLayers.size().toString());
    this._pLayers.pushPanel(layer);
  }
  popLayer(): void { this._pLayers.pop(); }

  _renderFramework(): string {
    let s = _CPT_WINDOW.MAIN;
    s = s.replace("__ID_BANNER__", this._getSubElementId("B"));
    s = s.replace("__ID_LAYERS__", this._getSubElementId("L"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pBanner.attach(this._getSubElementId("B"));
    this._pLayers.attach(this._getSubElementId("L"));
  }
}

export default PWindow;
