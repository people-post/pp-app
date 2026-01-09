import { ConsoleColPanel } from '../lib/ui/renders/panels/ConsoleColPanel.js';
import { ConsoleOverlayPanel } from '../lib/ui/renders/panels/ConsoleOverlayPanel.js';
import { ListPanel } from '../lib/ui/renders/panels/ListPanel.js';
import { ViewPanel } from '../lib/ui/renders/panels/ViewPanel.js';
import { Panel } from '../lib/ui/renders/panels/Panel.js';
import { PMain } from './PMain.js';

const _CPT_MAIN = {
  MAIN : `<div class="h100 w100">
    <div class="h100 w100 flex" style="z-index: 1">
      <div id="__ID_SIDE_LEFT__" class="h100"></div>
      <div id="__ID_NAV_COLUMN__" class="f-nav-column no-scrollbar"></div>
      <div id="__ID_CONTENT__" class="h100 flex-grow relative hide-overflow"></div>
      <div id="__ID_SIDE_RIGHT__" class="h100"></div>
    </div>
    <div id="__ID_NAV_OVERLAY__" class="layer f-nav-overlay clickthrough" style="z-index: 2"></div>
  </div>`,
};

export class PMainTabbed extends PMain {
  #pConsoleColumn: ConsoleColPanel;
  #pConsoleOverlay: ConsoleOverlayPanel;
  #pContent: ListPanel;
  #pLeft: ViewPanel;
  #pRight: ViewPanel;
  #isNavEnabled = true;
  #isConsoleOverlay: boolean | null = null;

  constructor() {
    super();
    this.#pConsoleColumn = new ConsoleColPanel();
    this.#pConsoleOverlay = new ConsoleOverlayPanel();
    this.#pContent = new ListPanel();
    this.#pLeft = new ViewPanel();
    this.#pRight = new ViewPanel();
  }

  override isConsoleOverlay(): boolean | null { return this.#isConsoleOverlay; }
  override isNavOverlay(): boolean { return this.#isNavEnabled && (this.#isConsoleOverlay === true); }

  override getLeftSidePanel(): ViewPanel { return this.#pLeft; }
  override getRightSidePanel(): ViewPanel { return this.#pRight; }
  override getConsoleOverlayPanel(): ConsoleOverlayPanel { return this.#pConsoleOverlay; }
  override getContentPanel(): ListPanel { return this.#pContent; }
  override getHomeBtnPanel(): Panel | null {
    return this.#isNavEnabled ? this.#getConsolePanel().getHomeBtnPanel()
                              : null;
  }
  override getNavWrapperPanel(): ConsoleColPanel | ConsoleOverlayPanel | null {
    return this.#isNavEnabled ? this.#getConsolePanel() : null;
  }

  override setEnableConsoleOverlay(b: boolean): void {
    this.#isConsoleOverlay = b;
    this.#pConsoleOverlay.setVisible(this.isNavOverlay());
    this.#pConsoleColumn.setDisplay(this.#isNavColumn() ? "" : "none");
  }
  override setEnableNavPanel(b: boolean): void { this.#isNavEnabled = b; }

  _renderFramework(): string {
    let s = _CPT_MAIN.MAIN;
    s = s.replace("__ID_SIDE_LEFT__", this._getSubElementId("SL"));
    s = s.replace("__ID_SIDE_RIGHT__", this._getSubElementId("SR"));
    s = s.replace("__ID_NAV_COLUMN__", this._getSubElementId("NC"));
    s = s.replace("__ID_NAV_OVERLAY__", this._getSubElementId("NO"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pLeft.attach(this._getSubElementId("SL"));
    this.#pRight.attach(this._getSubElementId("SR"));
    this.#pConsoleColumn.attach(this._getSubElementId("NC"));
    this.#pConsoleOverlay.attach(this._getSubElementId("NO"));
    this.#pContent.attach(this._getSubElementId("C"));
  }

  #isNavColumn(): boolean { return this.#isNavEnabled && this.#isConsoleOverlay !== true; }
  #getConsolePanel(): ConsoleColPanel | ConsoleOverlayPanel {
    return this.#isConsoleOverlay ? this.#pConsoleOverlay
                                  : this.#pConsoleColumn;
  }
}

export default PMainTabbed;
