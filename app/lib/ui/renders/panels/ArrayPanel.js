import { Panel } from './Panel.js';

export class ArrayPanel extends Panel {
  // Horizontal array panel
  constructor() {
    super();
    this._panels = [];
    this._tableClassName = "";
  }

  getPanel(idx) { return this._panels[idx]; }

  size() { return this._panels.length; }
  setTableClassName(name) { this._tableClassName = name; }

  pushPanel(panel) {
    let panelId = this.#getPanelElementId(this._panels.length);
    this._panels.push(panel);
    let ee = panel.createElement(panelId);
    let table = this.getDomElement().firstChild;
    let cell = table.rows[0].insertCell(-1);
    cell.innerHTML = ee.outerHTML;
    panel.attach(panelId);
  }

  _renderFramework() {
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

  #getPanelElementId(idx) { return this._elementId + "_" + idx; }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.ArrayPanel = ArrayPanel;
}