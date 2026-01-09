import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcInsights extends FViewContentBase {
  _renderOnRender(render: Render): void {
    let panel = new Panel();
    panel.setClassName("h100");
    render.wrapPanel(panel);
    panel.replaceContent("Insights");
  }
};
