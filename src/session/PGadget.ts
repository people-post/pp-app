import { Panel } from '../lib/ui/renders/panels/Panel.js';
import { ListPanel } from '../lib/ui/renders/panels/ListPanel.js';
import { ConsoleOverlayPanel } from '../lib/ui/renders/panels/ConsoleOverlayPanel.js';

const _CPT_GADGET = {
  MAIN : `<div class="f-gadget">
    <div id="__ID_CONTENT__" class="f-page" style="z-index: 1"></div>
    <div id="__ID_NAV_OVERLAY__" class="layer f-nav-overlay clickthrough" style="z-index: 2"></div>
  </div>`,
};

export class PGadget extends Panel {
  #pContent: ListPanel;
  #pConsoleOverlay: ConsoleOverlayPanel;

  constructor() {
    super();
    this.#pContent = new ListPanel();
    this.#pConsoleOverlay = new ConsoleOverlayPanel();
  }

  getContentPanel(): ListPanel { return this.#pContent; }
  getHomeBtnPanel(): ReturnType<ConsoleOverlayPanel['getHomeBtnPanel']> { return this.#pConsoleOverlay.getHomeBtnPanel(); }

  setEnableNavPanel(_b: boolean): void {}

  onResize(): void {}

  _renderFramework(): string {
    let s = _CPT_GADGET.MAIN;
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_NAV_OVERLAY__", this._getSubElementId("NO"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pConsoleOverlay.attach(this._getSubElementId("NO"));
  }
}

export default PGadget;
