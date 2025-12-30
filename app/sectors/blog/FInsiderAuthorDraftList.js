
class FInsiderAuthorDraftList extends blog.FDraftList {
  _renderOnRender(render) {
    let pMain = new ui.SectionPanel("Authored");
    render.wrapPanel(pMain);

    this._renderDrafts(pMain.getContentPanel(), []);
  }
};

blog.FInsiderAuthorDraftList = FInsiderAuthorDraftList;
}(window.blog = window.blog || {}));
