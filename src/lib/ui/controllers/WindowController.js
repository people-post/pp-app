import { RenderController } from './RenderController.js';
import { PanelWrapper } from '../renders/panels/PanelWrapper.js';

export class WindowController extends RenderController {
  constructor() {
    super();
    this._childStack = [];
  }

  getWindow() { return this.getRender(); }

  onRequestPopLayer(layerController) {
    if (this._childStack.length > 1 && layerController == this._childStack[0]) {
      this._childStack[0].detachRender();
      this._childStack.shift();
      this._childStack[0].setActive(true);
      let w = this.getWindow();
      w.popLayer();
    }
  }

  _getTopLayerFragment() { return this._childStack[0]; }
  _getBottomLayerFragment() {
    return this._childStack[this._childStack.length - 1];
  }

  _getAllChildControllers() {
    return this._childStack.concat(super._getAllChildControllers());
  }

  _pushLayer(lc, stateName) {
    let w = this.getWindow();
    let l = new PanelWrapper();
    l.setClassName("layer");
    lc.setOwner(this);
    this._childStack[0].setActive(false);

    w.pushLayer(l);
    lc.attachRender(l);
    this._childStack.unshift(lc);

    lc.render();
    this._onPushState({}, stateName);
  }

  _onPushState(stateData, title) {}
}

