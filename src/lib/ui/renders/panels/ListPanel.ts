import { PanelListPanel } from './PanelListPanel.js';
import { Panel } from './Panel.js';

export class ListPanel extends PanelListPanel {
  // Vertical list panel, should be renamed to SimpleListPanel
  pushSpace(n: number): void {
    let p = new Panel();
    this.pushPanel(p);
    let items: string[] = [];
    for (let i = 0; i < n; ++i) {
      items.push("<br>");
    }
    p.replaceContent(items.join(""));
  }

  unshiftPanel(panel: Panel): void {
    (this as any)._idOffset -= 1;
    let panelId = (this as any)._getPanelElementId(0);
    (this as any)._panels.unshift(panel);
    let e = (this as any)._getPanelRootElement();
    if (e) {
      let ee = panel.createElement(panelId);
      let table = e as HTMLTableElement;
      if (table.rows && table.rows[0]) {
        let cell = table.rows[0].insertCell(-1);
        cell.innerHTML = ee.outerHTML;
      }
      panel.attach(panelId);
    }
  }

  shift(): void {
    (this as any)._panels.shift();
    (this as any)._idOffset += 1;
    let e = (this as any)._getPanelRootElement();
    if (e && e.firstChild) {
      e.removeChild(e.firstChild);
    }
  }
}

