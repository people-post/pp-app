import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FDraftList } from './FDraftList.js';
import { Account } from '../../common/dba/Account.js';

export class FInsiderTaskDraftList extends FDraftList {
  _renderOnRender(render) {
    let pMain = new SectionPanel(Account.isWebOwner() ? "External tasks"
                                                             : "Tasks");
    render.wrapPanel(pMain);
    this._renderDrafts(pMain.getContentPanel(), []);
  }
};
