import { ViewLayer } from './ViewLayer.js';
import { ViewStack } from '../ViewStack.js';
import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';

export const CRC_DIALOG = {
  CLOSE : "CRC_DIALOG_1",
}

const _CRCT_DIALOG = {
  CLOSE_BTN :
      `<span data-action="CLOSE">x</span>`,
}

export class LvDialog extends ViewLayer {
  constructor() {
    super();
    this._vc = new ViewStack();
    this._vc.setOwner(this);
    this._vc.setLockLastView(false);
    this._vc.setDelegate(this);
    this._enableCloseBtn = true;
    this._pClose = new Panel();
    this._pClose.setClassName("dialog-close-btn s-ctext s-csecondarybg");
    this.setChild("__navigation_controller", this._vc);
  }

  _renderOnRender(render) {
    // Animate when render for the first time, this might be a hack
    let shouldAnimate = !render.getContentPanel();

    let pWrapper = new PanelWrapper();
    pWrapper.setClassName("dialog");
    pWrapper.setAttribute("data-action", "CLOSE");
    render.wrapPanel(pWrapper);
    let pMain = new ListPanel();
    pMain.setClassName("dialog-content relative");
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
    // Attach event listeners after content is replaced
    setTimeout(() => {
      const wrapperEl = pWrapper.getDomElement();
      const closeBtnEl = this._pClose.getDomElement();
      if (wrapperEl) {
        wrapperEl.addEventListener('click', (e) => {
          // Only close if clicking the wrapper itself, not its children
          if (e.target === wrapperEl) {
            if (this.isActive()) {
              this.action(CRC_DIALOG.CLOSE);
            }
          }
        });
      }
      if (closeBtnEl) {
        const actionEl = closeBtnEl.querySelector('[data-action]');
        if (actionEl) {
          actionEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.isActive()) {
              this.action(CRC_DIALOG.CLOSE);
            }
          });
        }
      }
    }, 0);

    if (shouldAnimate) {
      pMain.animate([ {top : "100%"}, {top : "10%"} ],
                    {duration : 200, easing : [ "ease-out" ]});
    }
  }

  setEnableCloseButton(b) { this._enableCloseBtn = b; }

  pushView(view, title) { this._vc.onRequestPushView(view, title); }

  action(type, ...args) {
    switch (type) {
    case CRC_DIALOG.CLOSE:
      this.#onClose();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  onViewStackStackSizeChange(nc) {
    switch (nc.getNRealViews()) {
    case 0:
      this._owner.onRequestPopLayer(this);
      break;
    case 1:
      this.#showCloseBtn();
      break;
    default:
      this.#hideCloseBtn();
      break;
    }
  }

  onViewStackRequestPopView(nc) {
    if (nc == this._vc) {
      this._owner.onLayerFragmentRequestPopView(this);
    }
  }

  popState(state) { this._vc.popState(state); }

  #onClose() {
    this._vc.clearStackFrom(0);
    this._owner.onRequestPopLayer(this);
  }

  #showCloseBtn() {
    if (this._enableCloseBtn) {
      this._pClose.setVisible(true);
    }
  }

  #hideCloseBtn() { this._pClose.setVisible(false); }
};

