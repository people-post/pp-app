import { Panel } from './Panel.js';

export class PanelListPanel extends Panel {
  declare _idOffset: number;
  declare _panels: Panel[];

  constructor(idOffset: number = 0) {
    super();
    this._idOffset = idOffset;
    this._panels = [];
  }

  getPanel(idx: number): Panel | undefined { return this._panels[idx]; }

  size(): number { return this._panels.length; }

  pushPanel(panel: Panel): void {
    let e = this._getPanelRootElement();
    if (e) {
      let panelId = this._getPanelElementId(this._panels.length);
      let ee = panel.createElement(panelId);
      e.append(ee);
      this._panels.push(panel);
      panel.attach(panelId);
    }
  }

  pop(): void {
    this._panels.pop();
    let e = this._getPanelRootElement();
    if (e && e.lastChild) {
      e.removeChild(e.lastChild);
    }
  }

  clear(): void {
    this._panels = [];
    super.clear();
  }

  reset(idOffset: number = 0): void {
    this.clear();
    this._idOffset = idOffset;
  }

  _onFrameworkDidAppear(): void {
    let ps = this._panels;
    this._panels = [];
    for (let p of ps) {
      this.pushPanel(p);
    }
  }

  _getPanelElementId(idx: number): string {
    let id = this._idOffset + idx;
    return this._getSubElementId(id.toString());
  }

  _getPanelRootElement(): HTMLElement | null { return this.getDomElement(); }
}

