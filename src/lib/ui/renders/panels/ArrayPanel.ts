import { Panel } from './Panel.js';

export class ArrayPanel extends Panel {
  // Horizontal array panel
  declare _panels: Panel[];
  declare _tableClassName: string;

  constructor() {
    super();
    this._panels = [];
    this._tableClassName = "";
  }

  getPanel(idx: number): Panel | undefined { return this._panels[idx]; }

  size(): number { return this._panels.length; }
  setTableClassName(name: string): void { this._tableClassName = name; }

  pushPanel(panel: Panel): void {
    let panelId = this.#getPanelElementId(this._panels.length);
    this._panels.push(panel);
    let ee = panel.createElement(panelId);
    let e = this.getDomElement();
    if (e) {
      let table = e.firstChild as HTMLTableElement;
      if (table && table.rows && table.rows[0]) {
        let cell = table.rows[0].insertCell(-1);
        cell.innerHTML = ee.outerHTML;
      }
    }
    panel.attach(panelId);
  }

  _renderFramework(): string {
    let table = document.createElement("TABLE");
    table.className = this._tableClassName;
    let row = table.insertRow(-1);
    for (let [i, p] of this._panels.entries()) {
      let panelId = this.#getPanelElementId(i);
      let e = p.createElement(panelId);
      let cell = row.insertCell(-1);
      cell.innerHTML = e.outerHTML;
    }
    return table.outerHTML;
  }

  #getPanelElementId(idx: number): string { return this._elementId + "_" + idx; }
}

