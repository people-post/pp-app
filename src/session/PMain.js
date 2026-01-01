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
  #pConsoleColumn;
  #pConsoleOverlay;
  #pContent;
  #pLeft;
  #pRight;
  #isNavEnabled = true;
  #isConsoleOverlay = null;

  constructor() {
    super();
    this.#pConsoleColumn = new ConsoleColPanel();
    this.#pConsoleOverlay = new ConsoleOverlayPanel();
    this.#pContent = new ListPanel();
    this.#pLeft = new ViewPanel();
    this.#pRight = new ViewPanel();
  }

  isConsoleOverlay() { return this.#isConsoleOverlay; }
  isNavOverlay() { return this.#isNavEnabled && this.#isConsoleOverlay; }

  getLeftSidePanel() { return this.#pLeft; }
  getRightSidePanel() { return this.#pRight; }
  getConsoleOverlayPanel() { return this.#pConsoleOverlay; }
  getContentPanel() { return this.#pContent; }
  getHomeBtnPanel() {
    return this.#isNavEnabled ? this.#getConsolePanel().getHomeBtnPanel()
                              : null;
  }
  getNavWrapperPanel() {
    return this.#isNavEnabled ? this.#getConsolePanel() : null;
  }

  setEnableConsoleOverlay(b) {
    this.#isConsoleOverlay = b;
    this.#pConsoleOverlay.setVisible(this.isNavOverlay());
    this.#pConsoleColumn.setDisplay(this.#isNavColumn() ? "" : "none");
  }
  setEnableNavPanel(b) { this.#isNavEnabled = b; }

  _renderFramework() {
    let s = _CPT_MAIN.MAIN;
    s = s.replace("__ID_SIDE_LEFT__", this._getSubElementId("SL"));
    s = s.replace("__ID_SIDE_RIGHT__", this._getSubElementId("SR"));
    s = s.replace("__ID_NAV_COLUMN__", this._getSubElementId("NC"));
    s = s.replace("__ID_NAV_OVERLAY__", this._getSubElementId("NO"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pLeft.attach(this._getSubElementId("SL"));
    this.#pRight.attach(this._getSubElementId("SR"));
    this.#pConsoleColumn.attach(this._getSubElementId("NC"));
    this.#pConsoleOverlay.attach(this._getSubElementId("NO"));
    this.#pContent.attach(this._getSubElementId("C"));
  }

  #isNavColumn() { return this.#isNavEnabled && !this.#isConsoleOverlay; }
  #getConsolePanel() {
    return this.#isConsoleOverlay ? this.#pConsoleOverlay
                                  : this.#pConsoleColumn;
  }
};

