import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class ActionButtonGroup extends FFragmentList {
  _renderOnRender(render: PanelWrapper): void {
    const pList = new ListPanel();
    (render as { wrapPanel(p: unknown): void }).wrapPanel(pList);
    for (const c of this.getChildren()) {
      const p = new Panel();
      pList.pushPanel(p);
      c.attachRender(p);
      c.render();
    }
  }
}

