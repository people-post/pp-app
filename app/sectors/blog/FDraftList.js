
class FDraftList extends ui.Fragment {
  #fList;
  #selectedId = null;

  constructor() {
    super();
    this.#fList = new ui.FFragmentList();
    this.setChild("list", this.#fList);
  }

  isDraftSelectedInDraftArticleInfoFragment(fDraftInfo, draftId) {
    return this.#selectedId == draftId;
  }

  onClickInDraftArticleInfoFragment(fDraftInfo, draftId) {
    this.#selectedId = draftId;
    this.render();
  }

  _renderDrafts(panel, ids) {
    if (ids.length) {
      this.#fList.clear();

      let pList = new ui.ListPanel();
      panel.wrapPanel(pList);

      // Hack to make fItems as event source, may need better design
      this.#fList.attachRender(pList);

      for (let id of ids) {
        let p = new ui.PanelWrapper();
        pList.pushPanel(p);
        let f = new blog.FDraftArticleInfo();
        f.setDelegate(this);
        f.setDataSource(this);
        f.setDraftId(id);
        this.#fList.append(f);
        f.attachRender(p);
        f.render();
      }
    } else {
      panel.replaceContent("Empty");
    }
  }
};

blog.FDraftList = FDraftList;
}(window.blog = window.blog || {}));
