import { LvMultiPage } from './LvMultiPage.js';
import { PMainTabbed } from './PMainTabbed.js';
import { VBlank } from '../lib/ui/controllers/views/VBlank.js';
import { ViewPanel } from '../lib/ui/renders/panels/ViewPanel.js';
import { PanelWrapper } from '../lib/ui/renders/panels/PanelWrapper.js';
import { FrameConfig, WebConfig } from '../common/dba/WebConfig.js';
import { PageViewController } from '../lib/ui/controllers/PageViewController.js';
import { PMain } from './PMain.js';

export class LvTabbedPage extends LvMultiPage {
  init(): void {
    if (!this._pMain) {
      super.init();
      return;
    }
    let c = WebConfig.getLeftSideFrameConfig();
    let leftPanel = this._pMain.getLeftSidePanel?.();
    if (leftPanel) {
      this.#initSideFrame("left", leftPanel, c);
    }

    c = WebConfig.getRightSideFrameConfig();
    let rightPanel = this._pMain.getRightSidePanel?.();
    if (rightPanel) {
      this.#initSideFrame("right", rightPanel, c);
    }
    super.init();
  }

  getDefaultActionButtonForView(_v: unknown): unknown { return null; }

  onResize(): void {
    this.#updateLayout();
    this._vc.onResize();
    super.onResize();
  }

  onPageViewControllerOverlayPermissionChange(_pvc: PageViewController, isOverlayAllowed: boolean): void {
    if (this._pMain?.isNavOverlay()) {
      // TODO: setVisible not working here because of grid display
      this._pMain.getConsoleOverlayPanel()?.getTabPanel()?.setDisplay(
          isOverlayAllowed ? "" : "none");
    }
  }

  _isExtrasPageNeeded(): boolean {
    return this._pMain?.isNavOverlay() === true &&
           this._gateway.getExtrasPageConfigs().length > 0;
  }

  _createMainPanel(): PMain | null { return new PMainTabbed(); }

  _renderOnRender(render: PanelWrapper): void {
    // This is before init()
    if (!this._pMain) {
      return;
    }
    render.wrapPanel(this._pMain);
    this.#updateLayout();
    this._vc.attachRender(this._pMain.getContentPanel());
    this._vc.render();
  }

  #initSideFrame(name: string, panel: ViewPanel, config: FrameConfig | null): void {
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
    if (!this._pMain) {
      return;
    }
    let wasOverlay = this._pMain.isConsoleOverlay();
    let w = this._pMain.getWidth();
    this._pMain.setEnableConsoleOverlay?.(w < 400);
    let pw = w >= 500 ? 5 : 0;
    let p = this._pMain.getLeftSidePanel?.();
    if (p) {
      p.setWidth(pw, "%");
    }
    p = this._pMain.getRightSidePanel?.();
    if (p) {
      p.setWidth(pw, "%");
    }

    // If narrow, reduce pages to 4 and use extra sector
    if (this._pMain.isConsoleOverlay?.() != wasOverlay) {
      this._vc.init(this._getVisiblePageConfigs());
      let navWrapperPanel = this._pMain.getNavWrapperPanel?.();
      if (navWrapperPanel) {
        this._vc.replaceNavWrapperPanel(navWrapperPanel);
      }
    }
  }
}

export default LvTabbedPage;
