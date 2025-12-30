
class FInsiderTaskDraftList extends blog.FDraftList {
  _renderOnRender(render) {
    let pMain = new ui.SectionPanel(dba.Account.isWebOwner() ? "External tasks"
                                                             : "Tasks");
    render.wrapPanel(pMain);
    this._renderDrafts(pMain.getContentPanel(), []);
  }
};

blog.FInsiderTaskDraftList = FInsiderTaskDraftList;
}(window.blog = window.blog || {}));
