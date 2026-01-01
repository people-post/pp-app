
import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FvcInsights extends FViewContentBase {
  _renderOnRender(render) {
    let panel = new Panel();
    panel.setClassName("h100");
    render.wrapPanel(panel);
    panel.replaceContent("Insights");
  }
};
