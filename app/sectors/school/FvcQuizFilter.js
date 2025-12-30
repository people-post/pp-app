
class FvcQuizFilter extends ui.FScrollViewContent {
  static T_PRESENTATION = {
    QUIZ : Symbol(),
    FLASHCARD: Symbol(),
  };

  constructor() {
    super();
    this._fScope = new ui.ButtonGroup();
    // Values are synced with backend
    this._fScope.addChoice({name : "Learned", value : "MARKED", icon : null});
    this._fScope.addChoice({name : "New", value : "NEW", icon : null});
    this._fScope.addChoice({name : "All", value : "ALL", icon : null});
    this._fScope.setSelectedValue("MARKED");
    this._fScope.setDelegate(this);
    this.setChild("scope", this._fScope);

    this._fMethod = new ui.ButtonGroup();
    this._fMethod.addChoice({
      name : "Quiz",
      value : this.constructor.T_PRESENTATION.QUIZ,
      icon : null
    });
    this._fMethod.addChoice({
      name : "Flashcard",
      value : this.constructor.T_PRESENTATION.FLASHCARD,
      icon : null
    });
    this._fMethod.setSelectedValue(this.constructor.T_PRESENTATION.QUIZ);
    this._fMethod.setDelegate(this);
    this.setChild("method", this._fMethod);

    this._fBtnApply = new ui.Button();
    this._fBtnApply.setName("Apply");
    this._fBtnApply.setDelegate(this);
    this.setChild("btnApply", this._fBtnApply);

    this._pScope = new scol.PFilterItem();
  }

  onSimpleButtonClicked(fBtn) { this.#onSubmit(); }
  onButtonGroupSelectionChanged(fBtnGroup, value) {
    switch (fBtnGroup) {
    case this._fScope:
      this.#asyncEstimateFilter(this._pScope.getHintPanel());
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render) {
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);

    let p = this._pScope;
    pList.pushPanel(p);
    this._fScope.attachRender(p.getContentPanel());
    this.#asyncEstimateFilter(p.getHintPanel());
    this._fScope.render();

    pList.pushSpace(1);

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this._fMethod.attachRender(p);
    this._fMethod.render();

    pList.pushSpace(1);

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this._fBtnApply.attachRender(p);
    this._fBtnApply.render();
  }

  #onSubmit() {
    let url = "api/school/quiz_ids"; // TODO: Replace quizzes in backend.
    let fd = new FormData();
    // TODO: All vs unmarked only, tags, downsample, id range.
    fd.append("scope", this._fScope.getSelectedValue());
    fd.append("tags", "");    // TODO: support advanced tag operations.
    fd.append("from_idx", 0); // If known from previous gen
    fd.append("to_idx", 1000);
    fd.append("down_sample", 100);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onQuizIdListRRR(d));
  }

  #asyncEstimateFilter(pHint) {
    let url = "api/school/quiz_count";
    let fd = new FormData();
    fd.append("scope", this._fScope.getSelectedValue());
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onEstimateFilterRRR(d, pHint));
  }

  #onEstimateFilterRRR(data, pHint) {
    pHint.replaceContent("Items selected: " + data.total);
  }

  #onQuizIdListRRR(data) {
    let ids = data.ids;
    // TODO: Shuffle if needed
    this._delegate.onQuizIdListGeneratedInQuizFilterContentFragment(
        this, ids, this._fMethod.getSelectedValue());
  }
};

scol.FvcQuizFilter = FvcQuizFilter;
}(window.scol = window.scol || {}));
