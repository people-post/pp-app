import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { T_DATA } from '../../common/plt/Events.js';
import { PFlashcard } from './PFlashcard.js';
import { Quiz } from '../../common/dba/Quiz.js';
import { Utilities } from '../../common/Utilities.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { Quiz as QuizData } from '../../common/datatypes/Quiz.js';

export const CF_FLASHCARD = {
  ON_CLICK : Symbol(),
};

export interface FFlashcardDelegate {
  onQuizInfoClickedInQuizFragment?(f: FFlashcard, quizId: string | null): void;
}

export class FFlashcard extends Fragment {
  protected _quizId: string | null = null;
  protected _isToggled: boolean = false;
  protected _panel: PFlashcard | null = null;

  constructor() {
    super();
    this._quizId = null;
    this._isToggled = false;
    this._panel = null;
  }

  setQuizId(id: string | null): void {
    this._quizId = id;
    this._isToggled = false;
  }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_FLASHCARD.ON_CLICK:
      this.#onToggle();
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

  _renderOnRender(render: any): void {
    // TODO: Add option to mark item as "learned/unlearned" and optionally
    // update list immediately.
    let panel = this.#createPanel();
    panel.setAttribute("onclick", `G.action(CF_FLASHCARD.ON_CLICK)`);
    render.wrapPanel(panel);
    this._panel = panel;

    let quiz = Quiz.get(this._quizId);
    if (!quiz) {
      return;
    }

    let p = panel.getNavHintPanel();
    this.#renderNavHint(quiz, p, this._isToggled);

    if (this._isToggled) {
      p = panel.getAnswersPanel();
      this.#renderAnswers(quiz, p);
    } else {
      p = panel.getQuestionPanel();
      this.#renderQuestion(quiz, p);

      p = panel.getChoicesPanel();
      if (p) {
        this.#renderChoices(quiz, p);
      }
    }
  }

  #createPanel(): PFlashcard { return new PFlashcard(); }

  #onToggle(): void {
    if (!this._panel) {
      return;
    }
    this._isToggled = !this._isToggled;
    let a = this._panel.animate(
        [
          {
            transform : "rotateY(0deg)",
          },
          {
            transform : "rotateY(90deg)",
          },
          {
            transform : "rotateY(90deg)",
            opacity : "0",
          },
          {
            transform : "rotateY(180deg)",
            opacity : "0",
          }
        ],
        {duration : 400, easing : "ease-in", fill : "forwards"});
    a && a.finished.then(() => this.#onAnimationEnd());
  }

  #onAnimationEnd(): void { this.render(); }

  #renderNavHint(_quiz: QuizData, panel: Panel, isToggled: boolean): void {
    if (isToggled) {
      panel.replaceContent("Click to go back...");
    } else {
      panel.replaceContent("Click to see answer...");
    }
  }
  #renderQuestion(quiz: QuizData, panel: Panel): void {
    panel.replaceContent(Utilities.renderContent(quiz.getQuestion()));
  }

  #renderChoices(quiz: QuizData, panel: Panel): void {
    let s = Utilities.renderContent(quiz.getChoices().join('<br>'));
    panel.replaceContent(s);
  }

  #renderAnswers(quiz: QuizData, panel: Panel): void {
    let s = Utilities.renderContent(quiz.getAnswers().join('<br>'));
    panel.replaceContent(s);
  }
}
