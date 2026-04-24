import { ViewLayer } from './ViewLayer.js';
import { ViewStack } from '../ViewStack.js';
import { View } from '../views/View.js';
import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { LayerOwner } from './Layer.js';

const CRC_DIALOG = {
  CLOSE : "CRC_DIALOG_1",
} as const;

const _CRCT_DIALOG = {
  CLOSE_BTN :
      `<span data-pp-action="${CRC_DIALOG.CLOSE}">x</span>`,
} as const;

export class LvDialog extends ViewLayer {
  declare _vc: ViewStack;
  declare _enableCloseBtn: boolean;
  declare _pClose: Panel;

  constructor() {
    super();
    this._vc = new ViewStack();
    this._vc.setOwner(this);
    (this._vc as any).setLockLastView(false);
    this._vc.setDelegate(this);
    this._enableCloseBtn = true;
    this._pClose = new Panel();
    this._pClose.setClassName("dialog-close-btn s-ctext s-csecondarybg");
    this.setChild("__navigation_controller", this._vc);
  }

  _renderOnRender(render: any): void {
    // Animate when render for the first time, this might be a hack
    let shouldAnimate = !(render as any).getContentPanel();

    let pWrapper = new PanelWrapper();
    pWrapper.setClassName("dialog");
    pWrapper.setAttribute("data-pp-action", CRC_DIALOG.CLOSE);
    pWrapper.setAttribute("data-pp-action-self", "true");
    render.wrapPanel(pWrapper);
    let pMain = new ListPanel();
    pMain.setClassName("dialog-content tw:relative");
    pMain.setAttribute("onclick", "javascript:G.anchorClick()");
    pWrapper.wrapPanel(pMain);

    let p = new ListPanel();
    p.setClassName("f-page");
    pMain.pushPanel(p);
    this._vc.attachRender(p);
    this._vc.render();

    // Extra panel for close button
    pMain.pushPanel(this._pClose);
    this._pClose.replaceContent(_CRCT_DIALOG.CLOSE_BTN);

    if (shouldAnimate) {
      pMain.animate([ {top : "100%"}, {top : "10%"} ],
                    {duration : 200, easing : "ease-out" });
    }
  }

  setEnableCloseButton(b: boolean): void { this._enableCloseBtn = b; }

  pushView(view: View, title: string): void { this._vc.pushView(view, title); }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CRC_DIALOG.CLOSE:
      this.#onClose();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  onViewStackStackSizeChange(nc: ViewStack): void {
    switch ((nc as any).getNRealViews()) {
    case 0:
      this.getOwner<LayerOwner>()?.onLayerRequestPopLayer(this);
      break;
    case 1:
      this.#showCloseBtn();
      break;
    default:
      this.#hideCloseBtn();
      break;
    }
  }

  onViewStackRequestPopView(nc: ViewStack): void {
    if (nc == this._vc) {
      // Back button should pop dialog's internal view stack first.
      // Only dismiss the dialog when already at the root view.
      if (nc.getNRealViews() > 1) {
        nc.popState(null);
      } else {
        this.getOwner<LayerOwner>()?.onLayerRequestPopLayer(this);
      }
    }
  }

  popState(state: any): void { this._vc.popState(state); }

  #onClose(): void {
    (this._vc as any).clearStackFrom(0);
    this.getOwner<LayerOwner>()?.onLayerRequestPopLayer(this);
  }

  #showCloseBtn(): void {
    if (this._enableCloseBtn) {
      this._pClose.setVisible(true);
    }
  }

  #hideCloseBtn(): void { this._pClose.setVisible(false); }
}

