import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FDraftList } from './FDraftList.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FInsiderAuthorDraftList extends FDraftList {
  _renderOnRender(render: Panel): void {
    let pMain = new SectionPanel("Authored");
    render.wrapPanel(pMain);

    this._renderDrafts(pMain.getContentPanel(), []);
  }
}
