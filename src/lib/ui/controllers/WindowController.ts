import { RenderController } from './RenderController.js';
import { PanelWrapper } from '../renders/panels/PanelWrapper.js';
import { Layer } from './layers/Layer.js';

export class WindowController extends RenderController {
  declare _childStack: Layer[];

  constructor() {
    super();
    this._childStack = [];
  }

  getWindow(): any { return this.getRender(); }

  onRequestPopLayer(layerController: Layer): void {
    if (this._childStack.length > 1 && layerController == this._childStack[0]) {
      this._childStack[0].detachRender();
      this._childStack.shift();
      this._childStack[0].setActive(true);
      let w = this.getWindow();
      if (w && typeof w.popLayer === 'function') {
        w.popLayer();
      }
    }
  }

  _getTopLayerFragment(): Layer | undefined { return this._childStack[0]; }
  _getBottomLayerFragment(): Layer | undefined {
    return this._childStack[this._childStack.length - 1];
  }

  _getAllChildControllers(): any[] {
    return this._childStack.concat(super._getAllChildControllers() as Layer[]);
  }

  _pushLayer(lc: Layer, stateName: string): void {
    let w = this.getWindow();
    let l = new PanelWrapper();
    l.setClassName("layer");
    lc.setOwner(this);
    if (this._childStack.length > 0) {
      this._childStack[0].setActive(false);
    }

    if (w && typeof w.pushLayer === 'function') {
      w.pushLayer(l);
    }
    lc.attachRender(l);
    this._childStack.unshift(lc);

    lc.render();
    this._onPushState({}, stateName);
  }

  _onPushState(_stateData: any, _title: string): void {}
}

