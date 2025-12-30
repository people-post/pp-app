import { PanelListPanel } from './PanelListPanel.js';
import { Panel } from './Panel.js';

export class ListPanel extends PanelListPanel {
  // Vertical list panel, should be renamed to SimpleListPanel
  pushSpace(n) {
    let p = new Panel();
    this.pushPanel(p);
    let items = [];
    for (let i = 0; i < n; ++i) {
      items.push("<br>");
    }
    p.replaceContent(items.join(""));
  }

  unshiftPanel(panel) {
    this._idOffset -= 1;
    let panelId = this._getPanelElementId(0);
    this._panels.unshift(panel);
    let e = this._getPanelRootElement();
    if (e) {
      let ee = panel.createElement(panelId);
      e.prepend(ee);
      panel.attach(panelId);
    }
  }

  shift() {
    this._panels.shift();
    this._idOffset += 1;
    let e = this._getPanelRootElement();
    e.removeChild(e.firstChild);
  }
};

