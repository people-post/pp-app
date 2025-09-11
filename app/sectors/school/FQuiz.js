(function(scol) {
scol.CF_QUIZ_INFO = {
  VIEW_QUIZ : Symbol(),
};

class FQuiz extends gui.MajorSectorItem {
  static T_LAYOUT = {
    FULL : Symbol(),
    INFO: Symbol(),
  };

  constructor() {
    super();
    this._quizId = null;
    this._tLayout = null;
  }

  setQuizId(id) { this._quizId = id; }
  setLayoutType(t) { this._tLayout = t; }

  action(type, ...args) {
    switch (type) {
    case scol.CF_QUIZ_INFO.VIEW_QUIZ:
      this._delegate.onQuizInfoClickedInQuizFragment(this, this._quizId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.QUIZ:
      if (data.getId() == this._quizId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render) {
    // Wrap panel first to occupy necessary space, it will impact progressive
    // loading in long list
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let quiz = dba.Quiz.get(this._quizId);
    if (!quiz) {
      return;
    }

    if (panel.isColorInvertible()) {
      if (this._dataSource.isQuizSelectedInQuizFragment(this, this._quizId)) {
        panel.invertColor();
      }
    }

    let p = panel.getQuestionPanel();
    this.#renderQuestion(quiz, p);

    p = panel.getChoicesPanel();
    if (p) {
      this.#renderChoices(quiz, p);
    }
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.FULL:
      p = new scol.PQuiz();
      break;
    default:
      p = this.#createInfoPanel();
      break;
    }
    return p;
  }

  #createInfoPanel() {
    let p = new scol.PQuizInfo();
    p.setClassName("clickable");
    p.setAttribute("onclick",
                   "javascript:G.action(scol.CF_QUIZ_INFO.VIEW_QUIZ)");
    return p;
  }

  #renderQuestion(quiz, panel) {
    panel.replaceContent(Utilities.renderContent(quiz.getQuestion()));
  }

  #renderChoices(quiz, panel) {
    let s = Utilities.renderContent(quiz.getChoices().join('<br>'));
    panel.replaceContent(s);
  }
};

scol.FQuiz = FQuiz;
}(window.scol = window.scol || {}));
