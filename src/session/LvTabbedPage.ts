import { LvMultiPage } from './LvMultiPage.js';
import { PMain } from './PMain.js';
import { VBlank } from '../lib/ui/controllers/views/VBlank.js';
import { WebConfig } from '../common/dba/WebConfig.js';
import { PageViewController } from '../lib/ui/controllers/PageViewController.js';

export class LvTabbedPage extends LvMultiPage {
  init(): void {
    let c = WebConfig.getLeftSideFrameConfig();
    this.#initSideFrame("left", this._pMain.getLeftSidePanel(), c);

    c = WebConfig.getRightSideFrameConfig();
    this.#initSideFrame("right", this._pMain.getRightSidePanel(), c);
    super.init();
  }

  getDefaultActionButtonForView(_v: unknown): unknown { return null; }

  onResize(): void {
    this.#updateLayout();
    this._vc.onResize();
    super.onResize();
  }

  onPageViewControllerOverlayPermissionChange(pvc: PageViewController, isOverlayAllowed: boolean): void {
    if (this._pMain.isNavOverlay()) {
      // TODO: setVisible not working here because of grid display
      this._pMain.getConsoleOverlayPanel().getTabPanel().setDisplay(
          isOverlayAllowed ? "" : "none");
    }
  }

  _isExtrasPageNeeded(): boolean {
    return this._pMain.isNavOverlay() &&
           this._gateway.getExtrasPageConfigs().length > 0;
  }

  _createMainPanel(): PMain { return new PMain(); }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    // This is before init()
    render.wrapPanel(this._pMain);
    this.#updateLayout();
    this._vc.attachRender(this._pMain.getContentPanel());
    this._vc.render();
  }

  #initSideFrame(name: string, panel: ReturnType<PMain['getLeftSidePanel']>, config: ReturnType<typeof WebConfig.getLeftSideFrameConfig>): void {
    let v;
    if (config) {
      switch (config.type) {
      case "BGPRIME":
        v = new VBlank();
        v.setLayoutType(VBlank.T_LAYOUT.BGPRIME);
        break;
      default:
        break;
      }
    }
    if (!v) {
      v = new VBlank();
    }
    this.setChild(name, v);
    v.attachRender(panel);
    v.render();
  }

  #updateLayout(): void {
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
}

export default LvTabbedPage;
