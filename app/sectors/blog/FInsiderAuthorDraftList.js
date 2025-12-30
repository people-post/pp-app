import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';

export class FInsiderAuthorDraftList extends blog.FDraftList {
  _renderOnRender(render) {
    let pMain = new SectionPanel("Authored");
    render.wrapPanel(pMain);

    this._renderDrafts(pMain.getContentPanel(), []);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FInsiderAuthorDraftList = FInsiderAuthorDraftList;
}
