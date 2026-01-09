import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FDraftList } from './FDraftList.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FInsiderTaskDraftList extends FDraftList {
  _renderOnRender(render: Panel): void {
    let title = "Tasks";
    if (window.dba?.Account?.isWebOwner) {
      title = "External tasks";
    }
    let pMain = new SectionPanel(title);
    render.wrapPanel(pMain);
    this._renderDrafts(pMain.getContentPanel(), []);
  }
}
