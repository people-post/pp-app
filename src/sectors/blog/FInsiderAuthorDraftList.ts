import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FDraftList } from './FDraftList.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FInsiderAuthorDraftList extends FDraftList {
  _renderOnRender(render: PanelWrapper): void {
    let pMain = new SectionPanel("Authored");
    render.wrapPanel(pMain);

    this._renderDrafts(pMain.getContentPanel(), []);
  }
}
