import { ViewLayer } from '../lib/ui/controllers/layers/ViewLayer.js';
import { ViewStack } from '../lib/ui/controllers/ViewStack.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { PanelWrapper } from '../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../lib/ui/renders/panels/ListPanel.js';
import { FvcPortalMain } from '../sectors/shop/FvcPortalMain.js';

export class LvPortal extends ViewLayer {
  private _vc: ViewStack;

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

  getDefaultActionButtonForViewStack(_nc: ViewStack): unknown { return null; }
  getUrlParamString(): string { return this._vc.getUrlParamString(); }

  onResize(): void {
    this.#layout();
    this._vc.onResize();
    super.onResize();
  }

  onViewStackStackSizeChange(_nc: ViewStack): void {}
  onViewStackRequestPopView(_nc: ViewStack): void {
    // @ts-expect-error - owner may have this method
    this._owner?.onLayerFragmentRequestPopView?.(this);
  }

  initFromUrl(urlParam: URLSearchParams): void { this._vc.initFromUrl(urlParam); }

  popState(state: unknown): void { this._vc.popState(state); }
  pushView(view: View, title: string): void { this._vc.pushView(view, title); }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
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

  _getAllChildControllers(): ViewStack[] { return [ this._vc ]; }

  #layout(): void {
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
}

export default LvPortal;
