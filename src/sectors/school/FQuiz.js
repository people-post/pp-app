import { MajorSectorItem } from '../../common/gui/MajorSectorItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Quiz } from '../../common/dba/Quiz.js';
import { PQuiz } from './PQuiz.js';
import { PQuizInfo } from './PQuizInfo.js';
import { Utilities } from '../../common/Utilities.js';

export const CF_QUIZ_INFO = {
  VIEW_QUIZ : Symbol(),
};

// Export to window for string template access
if (typeof window !== 'undefined') {
  window.CF_QUIZ_INFO = CF_QUIZ_INFO;
}

export class FQuiz extends MajorSectorItem {
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
    case CF_QUIZ_INFO.VIEW_QUIZ:
      this._delegate.onQuizInfoClickedInQuizFragment(this, this._quizId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.QUIZ:
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

    let quiz = Quiz.get(this._quizId);
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
      p = new PQuiz();
      break;
    default:
      p = this.#createInfoPanel();
      break;
    }
    return p;
  }

  #createInfoPanel() {
    let p = new PQuizInfo();
    p.setClassName("clickable");
    p.setAttribute("onclick",
                   "javascript:G.action(window.CF_QUIZ_INFO.VIEW_QUIZ)");
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
