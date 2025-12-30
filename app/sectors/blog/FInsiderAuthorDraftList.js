
export class FInsiderAuthorDraftList extends blog.FDraftList {
  _renderOnRender(render) {
    let pMain = new ui.SectionPanel("Authored");
    render.wrapPanel(pMain);

    this._renderDrafts(pMain.getContentPanel(), []);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FInsiderAuthorDraftList = FInsiderAuthorDraftList;
}
