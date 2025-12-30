
export class TimelinePanel extends ui.PanelListPanel {
  constructor() {
    super();
    this._isFlowRunning = true;
  }

  pushStopPanel(panel) {
    this._isFlowRunning = false;
    let p = this.#createStopNodePanel();
    super.pushPanel(p);
    p.wrapPanel(panel);
  }

  pushPanel(panel) {
    let p = this.#createNodePanel();
    super.pushPanel(p);
    p.wrapPanel(panel);
  }

  pushEndPanel(panel) {
    let p;
    if (this.size() == 0) {
      p = this.#createSingleNodePanel();
    } else {
      p = this.#createEndNodePanel();
    }
    super.pushPanel(p);
    p.wrapPanel(panel);
  }

  _createNodePanel() { return null; }

  #createStopNodePanel() {
    if (this.size() == 0) {
      return this.#createBeginNodePanel();
    } else {
      let p = this._createNodePanel();
      p.disableLowerFlow();
      return p;
    }
  }

  #createNodePanel() {
    if (this.size() == 0) {
      return this.#createBeginNodePanel();
    } else {
      return this.#createConnectionNodePanel();
    }
  }

  #createSingleNodePanel() {
    // No connection
    let p = this._createNodePanel();
    p.disableUpperPipe();
    p.disableLowerPipe();
    return p;
  }

  #createBeginNodePanel() {
    // With connection below
    let p = this._createNodePanel();
    p.disableUpperPipe();
    if (!this._isFlowRunning) {
      p.disableLowerFlow();
    }
    return p;
  }

  #createConnectionNodePanel() {
    // With both connections
    let p = this._createNodePanel();
    if (!this._isFlowRunning) {
      p.disableUpperFlow();
      p.disableNodeFlow();
      p.disableLowerFlow();
    }
    return p;
  }

  #createEndNodePanel() {
    // With connection above
    let p = this._createNodePanel();
    if (!this._isFlowRunning) {
      p.disableUpperFlow();
    }
    p.disableLowerPipe();
    return p;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.TimelinePanel = TimelinePanel;
}
