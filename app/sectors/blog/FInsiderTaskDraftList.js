import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';

export class FInsiderTaskDraftList extends blog.FDraftList {
  _renderOnRender(render) {
    let pMain = new SectionPanel(dba.Account.isWebOwner() ? "External tasks"
                                                             : "Tasks");
    render.wrapPanel(pMain);
    this._renderDrafts(pMain.getContentPanel(), []);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FInsiderTaskDraftList = FInsiderTaskDraftList;
}
