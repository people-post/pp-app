import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcInsights extends FViewContentBase {
  _renderOnRender(render: PanelWrapper): void {
    let panel = new Panel();
    panel.setClassName("tw:h-full");
    render.wrapPanel(panel);
    panel.replaceContent("Insights");
  }
};
