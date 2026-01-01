import { ViewLayer } from '../lib/ui/controllers/layers/ViewLayer.js';
import { ViewStack } from '../lib/ui/controllers/ViewStack.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { PanelWrapper } from '../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../lib/ui/renders/panels/ListPanel.js';
import { FvcPortalMain } from '../sectors/shop/FvcPortalMain.js';

export class LvPortal extends ViewLayer {
  constructor() {
    super();
    this._vc = new ViewStack();
    this._vc.setOwner(this);
    this._vc.setDataSource(this);
    this._vc.setDelegate(this);
    let vs = [ new View() ];
    vs[0].setContentFragment(new FvcPortalMain());
    this._vc.resetStack(vs);
  }

  getDefaultActionButtonForViewStack(nc) { return null; }
  getUrlParamString() { return this._vc.getUrlParamString(); }

  onResize() {
    this.#layout();
    this._vc.onResize();
    super.onResize();
  }

  onViewStackStackSizeChange(nc) {}
  onViewStackRequestPopView(nc) {
    this._owner.onLayerFragmentRequestPopView(this);
  }

  initFromUrl(urlParam) { this._vc.initFromUrl(urlParam); }

  popState(state) { this._vc.popState(state); }
  pushView(view, title) { this._vc.pushView(view, title); }

  _renderOnRender(render) {
    let p = new PanelWrapper();
    p.setClassName("f-main");
    render.wrapPanel(p);
    let pp = new ListPanel();
    pp.setClassName("f-page");
    pp.setAttribute("z-index", "1");
    p.wrapPanel(pp);
    this.#layout();
    this._vc.attachRender(pp);
    this._vc.render();
  }

  _getAllChildControllers() { return [ this._vc ]; }

  #layout() {
    let r = this.getRender();
    let p = r.getContentPanel();
    let w = r.getWidth();
    if (w < 400) {
      p.setClassName("f-main narrow");
    } else if (w < 500) {
      p.setClassName("f-main normal");
    } else {
      p.setClassName("f-main wide");
    }
  }
};
