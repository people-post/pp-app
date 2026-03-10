import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FDraftList } from './FDraftList.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Account } from '../../common/dba/Account.js';

export class FInsiderTaskDraftList extends FDraftList {
  _renderOnRender(render: PanelWrapper): void {
    let title = "Tasks";
    if (Account.isWebOwner) {
      title = "External tasks";
    }
    let pMain = new SectionPanel(title);
    render.wrapPanel(pMain);
    this._renderDrafts(pMain.getContentPanel(), []);
  }
}
