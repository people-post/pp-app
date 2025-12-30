
class FvcInteractive extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fBtnResume = new ui.Button();
    this._fBtnResume.setName("Resume learning");
    this._fBtnResume.setDelegate(this);
    this.setChild("btnResume", this._fBtnResume);

    this._fBtnGen = new ui.Button();
    this._fBtnGen.setName("New learning...");
    this._fBtnGen.setDelegate(this);
    this.setChild("btnGen", this._fBtnGen);
  }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn) {
    case this._fBtnResume:
      this.#onResume();
      break;
    case this._fBtnGen:
      this.#onGen();
      break;
    default:
      break;
    }
  }
  onQuizIdListGeneratedInQuizFilterContentFragment(fvcFilter, ids,
                                                   displayMethod) {
    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
    switch (displayMethod) {
    case scol.FvcQuizFilter.T_PRESENTATION.FLASHCARD:
      this.#showFlashcards(ids);
      break;
    case scol.FvcQuizFilter.T_PRESENTATION.QUIZ:
      this.#showQuizzes(ids);
      break;
    default:
      break;
    }
  }

  renderItemForSimpleListFragment(fSimpleList, item, panel) {
    panel.replaceContent(item.data.name);
  }

  _renderContentOnRender(render) {
    // TODO:
    // Puzzles, real practice client queue etc.
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);

    pList.pushSpace(1);

    let p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this._fBtnResume.setEnabled(false);
    this._fBtnResume.attachRender(p);
    this._fBtnResume.render();

    pList.pushSpace(1);

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this._fBtnGen.attachRender(p);
    this._fBtnGen.render();
  }

  #onResume() {}

  #onGen() {
    // TODO: Is resumable
    if (true) {
      this._confirmDangerousOperation(R.get("CONFIRM_GEN_QUIZ"),
                                      () => this.#showQuizFilter());
    } else {
      this.#showQuizFilter();
    }
  }

  #showQuizFilter() {
    let v = new ui.View();
    let f = new scol.FvcQuizFilter();
    f.setDelegate(this);
    v.setContentFragment(f);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                "Quiz filter", false);
  }

  #showQuizzes(ids) {
    let v = new ui.View();
    let f = new scol.FvcQuizList();
    f.setQuizIds(ids);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Quizzes");
  }

  #showFlashcards(ids) {
    let v = new ui.View();
    let f = new scol.FvcFlashcard();
    f.setQuizIds(ids);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Flashcard");
  }
};

scol.FvcInteractive = FvcInteractive;
}(window.scol = window.scol || {}));
