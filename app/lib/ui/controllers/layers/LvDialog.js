(function(ui) {
ui.CRC_DIALOG = {
  CLOSE : "CRC_DIALOG_1",
}

const _CRCT_DIALOG = {
  CLOSE_BTN :
      `<span onclick="javascript:G.action(ui.CRC_DIALOG.CLOSE)">x</span>`,
}

class LvDialog extends ui.ViewLayer {
  constructor() {
    super();
    this._vc = new ui.ViewStack();
    this._vc.setOwner(this);
    this._vc.setLockLastView(false);
    this._vc.setDelegate(this);
    this._enableCloseBtn = true;
    this._pClose = new ui.Panel();
    this._pClose.setClassName("dialog-close-btn s-ctext s-csecondarybg");
    this.setChild("__navigation_controller", this._vc);
  }

  _renderOnRender(render) {
    // Animate when render for the first time, this might be a hack
    let shouldAnimate = !render.getContentPanel();

    let pWrapper = new ui.PanelWrapper();
    pWrapper.setClassName("dialog");
    pWrapper.setAttribute("onclick",
                          "javascript:G.action(ui.CRC_DIALOG.CLOSE)");
    render.wrapPanel(pWrapper);
    let pMain = new ui.ListPanel();
    pMain.setClassName("dialog-content relative");
    pMain.setAttribute("onclick", "javascript:G.anchorClick()");
    pWrapper.wrapPanel(pMain);

    let p = new ui.ListPanel();
    p.setClassName("f-page");
    pMain.pushPanel(p);
    this._vc.attachRender(p);
    this._vc.render();

    // Extra panel for close button
    pMain.pushPanel(this._pClose);
    this._pClose.replaceContent(_CRCT_DIALOG.CLOSE_BTN);

    if (shouldAnimate) {
      pMain.animate([ {top : "100%"}, {top : "10%"} ],
                    {duration : 200, easing : [ "ease-out" ]});
    }
  }

  setEnableCloseButton(b) { this._enableCloseBtn = b; }

  pushView(view, title) { this._vc.onRequestPushView(view, title); }

  action(type, ...args) {
    switch (type) {
    case ui.CRC_DIALOG.CLOSE:
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

ui.LvDialog = LvDialog;
}(window.ui = window.ui || {}));
