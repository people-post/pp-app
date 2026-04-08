import { MajorSectorItem } from '../../common/gui/MajorSectorItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Quiz } from '../../common/dba/Quiz.js';
import type { Quiz as QuizData } from '../../common/datatypes/Quiz.js';
import { PQuiz } from './PQuiz.js';
import { PQuizInfo } from './PQuizInfo.js';
import { Utilities } from '../../common/Utilities.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export const CF_QUIZ_INFO = {
  VIEW_QUIZ : Symbol(),
};

// Export to window for string template access
if (typeof window !== 'undefined') {
  (window as any).CF_QUIZ_INFO = CF_QUIZ_INFO;
}

export interface FQuizDelegate {
  onQuizInfoClickedInQuizFragment(f: FQuiz, quizId: string | null): void;
}

export interface FQuizDataSource {
  isQuizSelectedInQuizFragment(f: FQuiz, quizId: string | null): boolean;
}

export class FQuiz extends MajorSectorItem {
  static T_LAYOUT = {
    FULL : Symbol(),
    INFO: Symbol(),
  };

  protected _quizId: string | null = null;
  protected _tLayout: symbol | null = null;

  constructor() {
    super();
    this._quizId = null;
    this._tLayout = null;
  }

  setQuizId(id: string | null): void { this._quizId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_QUIZ_INFO.VIEW_QUIZ:
      this.getDelegate<FQuizDelegate>()?.onQuizInfoClickedInQuizFragment(this, this._quizId);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.QUIZ:
      if ((data as QuizData).getId() == this._quizId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    // Wrap panel first to occupy necessary space, it will impact progressive
    // loading in long list
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let quiz = Quiz.get(this._quizId);
    if (!quiz) {
      return;
    }

    if (panel.isColorInvertible()) {
      if (this.getDataSource<FQuizDataSource>()?.isQuizSelectedInQuizFragment(this, this._quizId)) {
        panel.invertColor();
      }
    }

    let p = panel.getQuestionPanel();
    this.#renderQuestion(quiz, p);

    let pChoices = panel.getChoicesPanel();
    if (pChoices) {
      this.#renderChoices(quiz, pChoices);
    }
  }

  #createPanel(): PQuiz | PQuizInfo {
    let p: PQuiz | PQuizInfo;
    switch (this._tLayout) {
    case FQuiz.T_LAYOUT.FULL:
      p = new PQuiz();
      break;
    default:
      p = this.#createInfoPanel();
      break;
    }
    return p;
  }

  #createInfoPanel(): PQuizInfo {
    let p = new PQuizInfo();
    p.setClassName("tw:cursor-pointer");
    p.setAttribute("onclick",
                   "javascript:G.action(window.CF_QUIZ_INFO.VIEW_QUIZ)");
    return p;
  }

  #renderQuestion(quiz: any, panel: Panel): void {
    panel.replaceContent(Utilities.renderContent(quiz.getQuestion()));
  }

  #renderChoices(quiz: any, panel: Panel | null): void {
    if (!panel) {
      return;
    }
    let s = Utilities.renderContent(quiz.getChoices().join('<br>'));
    panel.replaceContent(s);
  }
}
