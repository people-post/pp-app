import { PanelListPanel } from '../../lib/ui/renders/panels/PanelListPanel.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { TimelineVerticalNodePanel } from './TimelineVerticalNodePanel.js';

export class TimelinePanel extends PanelListPanel {
  protected _isFlowRunning: boolean;

  constructor() {
    super();
    this._isFlowRunning = true;
  }

  pushStopPanel(panel: Panel): void {
    this._isFlowRunning = false;
    let p = this.#createStopNodePanel();
    super.pushPanel(p);
    p.wrapPanel(panel);
  }

  pushPanel(panel: Panel): void {
    let p = this.#createNodePanel();
    super.pushPanel(p);
    p.wrapPanel(panel);
  }

  pushEndPanel(panel: Panel): void {
    let p: TimelineVerticalNodePanel;
    if (this.size() == 0) {
      p = this.#createSingleNodePanel();
    } else {
      p = this.#createEndNodePanel();
    }
    super.pushPanel(p);
    p.wrapPanel(panel);
  }

  protected _createNodePanel(): TimelineVerticalNodePanel | null { return null; }

  #createStopNodePanel(): TimelineVerticalNodePanel {
    if (this.size() == 0) {
      return this.#createBeginNodePanel();
    } else {
      let p = this._createNodePanel();
      if (!p) {
        throw new Error("_createNodePanel returned null");
      }
      p.disableLowerFlow();
      return p;
    }
  }

  #createNodePanel(): TimelineVerticalNodePanel {
    if (this.size() == 0) {
      return this.#createBeginNodePanel();
    } else {
      return this.#createConnectionNodePanel();
    }
  }

  #createSingleNodePanel(): TimelineVerticalNodePanel {
    // No connection
    let p = this._createNodePanel();
    if (!p) {
      throw new Error("_createNodePanel returned null");
    }
    p.disableUpperPipe();
    p.disableLowerPipe();
    return p;
  }

  #createBeginNodePanel(): TimelineVerticalNodePanel {
    // With connection below
    let p = this._createNodePanel();
    if (!p) {
      throw new Error("_createNodePanel returned null");
    }
    p.disableUpperPipe();
    if (!this._isFlowRunning) {
      p.disableLowerFlow();
    }
    return p;
  }

  #createConnectionNodePanel(): TimelineVerticalNodePanel {
    // With both connections
    let p = this._createNodePanel();
    if (!p) {
      throw new Error("_createNodePanel returned null");
    }
    if (!this._isFlowRunning) {
      p.disableUpperFlow();
      p.disableNodeFlow();
      p.disableLowerFlow();
    }
    return p;
  }

  #createEndNodePanel(): TimelineVerticalNodePanel {
    // With connection above
    let p = this._createNodePanel();
    if (!p) {
      throw new Error("_createNodePanel returned null");
    }
    if (!this._isFlowRunning) {
      p.disableUpperFlow();
    }
    p.disableLowerPipe();
    return p;
  }
}
