import { Panel } from '../lib/ui/renders/panels/Panel.js';
import { ConsoleColPanel } from '../lib/ui/renders/panels/ConsoleColPanel.js';
import { ConsoleOverlayPanel } from '../lib/ui/renders/panels/ConsoleOverlayPanel.js';
import { ListPanel } from '../lib/ui/renders/panels/ListPanel.js';
import { ViewPanel } from '../lib/ui/renders/panels/ViewPanel.js';

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

export class PMain extends Panel {
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

  isConsoleOverlay(): boolean | null { return this.#isConsoleOverlay; }
  isNavOverlay(): boolean { return this.#isNavEnabled && (this.#isConsoleOverlay === true); }

  getLeftSidePanel(): ViewPanel { return this.#pLeft; }
  getRightSidePanel(): ViewPanel { return this.#pRight; }
  getConsoleOverlayPanel(): ConsoleOverlayPanel { return this.#pConsoleOverlay; }
  getContentPanel(): ListPanel { return this.#pContent; }
  getHomeBtnPanel(): ReturnType<ConsoleColPanel['getHomeBtnPanel']> | null {
    return this.#isNavEnabled ? this.#getConsolePanel().getHomeBtnPanel()
                              : null;
  }
  getNavWrapperPanel(): ConsoleColPanel | ConsoleOverlayPanel | null {
    return this.#isNavEnabled ? this.#getConsolePanel() : null;
  }

  setEnableConsoleOverlay(b: boolean): void {
    this.#isConsoleOverlay = b;
    this.#pConsoleOverlay.setVisible(this.isNavOverlay());
    this.#pConsoleColumn.setDisplay(this.#isNavColumn() ? "" : "none");
  }
  setEnableNavPanel(b: boolean): void { this.#isNavEnabled = b; }

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

export default PMain;
