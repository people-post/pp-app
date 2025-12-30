import { LvMultiPage } from './LvMultiPage.js';
import { PMain } from './PMain.js';

export class LvTabbedPage extends LvMultiPage {
  init() {
    let c = dba.WebConfig.getLeftSideFrameConfig();
    this.#initSideFrame("left", this._pMain.getLeftSidePanel(), c);

    c = dba.WebConfig.getRightSideFrameConfig();
    this.#initSideFrame("right", this._pMain.getRightSidePanel(), c);
    super.init();
  }

  getDefaultActionButtonForView(v) { return null; }

  onResize() {
    this.#updateLayout();
    this._vc.onResize();
    super.onResize();
  }

  onPageViewControllerOverlayPermissionChange(pvc, isOverlayAllowed) {
    if (this._pMain.isNavOverlay()) {
      // TODO: setVisible not working here because of grid display
      this._pMain.getConsoleOverlayPanel().getTabPanel().setDisplay(
          isOverlayAllowed ? "" : "none");
    }
  }

  _isExtrasPageNeeded() {
    return this._pMain.isNavOverlay() &&
           this._gateway.getExtrasPageConfigs().length > 0;
  }

  _createMainPanel() { return new PMain(); }

  _renderOnRender(render) {
    // This is before init()
    render.wrapPanel(this._pMain);
    this.#updateLayout();
    this._vc.attachRender(this._pMain.getContentPanel());
    this._vc.render();
  }

  #initSideFrame(name, panel, config) {
    let v;
    if (config) {
      switch (config.type) {
      case "BGPRIME":
        v = new ui.VBlank();
        v.setLayoutType(ui.VBlank.T_LAYOUT.BGPRIME);
        break;
      default:
        break;
      }
    }
    if (!v) {
      v = new ui.VBlank();
    }
    this.setChild(name, v);
    v.attachRender(panel);
    v.render();
  }

  #updateLayout() {
    let wasOverlay = this._pMain.isConsoleOverlay();
    let w = this._pMain.getWidth();
    this._pMain.setEnableConsoleOverlay(w < 400);
    let pw = w >= 500 ? 5 : 0;
    let p = this._pMain.getLeftSidePanel();
    p.setWidth(pw, "%");
    p = this._pMain.getRightSidePanel();
    p.setWidth(pw, "%");

    // If narrow, reduce pages to 4 and use extra sector
    if (this._pMain.isConsoleOverlay() != wasOverlay) {
      this._vc.init(this._getVisiblePageConfigs());
      this._vc.replaceNavWrapperPanel(this._pMain.getNavWrapperPanel());
    }
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.main = window.main || {};
  window.main.LvTabbedPage = LvTabbedPage;
}
