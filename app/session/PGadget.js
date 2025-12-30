const _CPT_GADGET = {
  MAIN : `<div class="f-gadget">
    <div id="__ID_CONTENT__" class="f-page" style="z-index: 1"></div>
    <div id="__ID_NAV_OVERLAY__" class="layer f-nav-overlay clickthrough" style="z-index: 2"></div>
  </div>`,
};

export class PGadget extends ui.Panel {
  #pContent;
  #pConsoleOverlay;

  constructor() {
    super();
    this.#pContent = new ui.ListPanel();
    this.#pConsoleOverlay = new ui.ConsoleOverlayPanel();
  }

  getContentPanel() { return this.#pContent; }
  getHomeBtnPanel() { return this.#pConsoleOverlay.getHomeBtnPanel(); }

  setEnableNavPanel(b) {}

  onResize() {}

  _renderFramework() {
    let s = _CPT_GADGET.MAIN;
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_NAV_OVERLAY__", this._getSubElementId("NO"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pConsoleOverlay.attach(this._getSubElementId("NO"));
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.main = window.main || {};
  window.main.PGadget = PGadget;
}
