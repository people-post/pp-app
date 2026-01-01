import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class ActionButtonGroup extends FFragmentList {
  _renderOnRender(render) {
    let pList = new ListPanel();
    render.wrapPanel(pList);
    for (let c of this.getChildren()) {
      let p = new Panel();
      pList.pushPanel(p);
      c.attachRender(p);
      c.render();
    }
  }
}
