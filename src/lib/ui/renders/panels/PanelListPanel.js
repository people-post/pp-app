import { Panel } from './Panel.js';

export class PanelListPanel extends Panel {
  constructor(idOffset = 0) {
    super();
    this._idOffset = idOffset;
    this._panels = [];
  }

  getPanel(idx) { return this._panels[idx]; }

  size() { return this._panels.length; }

  pushPanel(panel) {
    let e = this._getPanelRootElement();
    if (e) {
      let panelId = this._getPanelElementId(this._panels.length);
      let ee = panel.createElement(panelId);
      e.append(ee);
      this._panels.push(panel);
      panel.attach(panelId);
    }
  }

  pop() {
    this._panels.pop();
    let e = this._getPanelRootElement();
    if (e) {
      e.removeChild(e.lastChild);
    }
  }

  clear() {
    this._panels = [];
    super.clear();
  }

  reset(idOffset = 0) {
    this.clear();
    this._idOffset = idOffset;
  }

  _onFrameworkDidAppear() {
    let ps = this._panels;
    this._panels = [];
    for (let p of ps) {
      this.pushPanel(p);
    }
  }

  _getPanelElementId(idx) {
    let id = this._idOffset + idx;
    return this._getSubElementId(id.toString());
  }

  _getPanelRootElement() { return this.getDomElement(); }
}
