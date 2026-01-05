import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FDraftList } from './FDraftList.js';

export class FInsiderTaskDraftList extends FDraftList {
  _renderOnRender(render) {
    let pMain = new SectionPanel(window.dba.Account.isWebOwner() ? "External tasks"
                                                             : "Tasks");
    render.wrapPanel(pMain);
    this._renderDrafts(pMain.getContentPanel(), []);
  }
};
