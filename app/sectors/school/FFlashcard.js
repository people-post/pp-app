export const CF_FLASHCARD = {
  ON_CLICK : Symbol(),
};

export class FFlashcard extends ui.Fragment {
  constructor() {
    super();
    this._quizId = null;
    this._isToggled = false;
    this._panel = null;
  }

  setQuizId(id) {
    this._quizId = id;
    this._isToggled = false;
  }

  action(type, ...args) {
    switch (type) {
    case scol.CF_FLASHCARD.ON_CLICK:
      this.#onToggle();
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
    // TODO: Add option to mark item as "learned/unlearned" and optionally
    // update list immediately.
    let panel = this.#createPanel();
    panel.setAttribute("onclick", `G.action(scol.CF_FLASHCARD.ON_CLICK)`);
    render.wrapPanel(panel);
    this._panel = panel;

    let quiz = dba.Quiz.get(this._quizId);
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

  #createPanel() { return new scol.PFlashcard(); }

  #onToggle() {
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
        {duration : 400, easing : [ "ease-in" ], fill : "forwards"});
    a && a.finished.then(() => this.#onAnimationEnd());
  }

  #onAnimationEnd() { this.render(); }

  #renderNavHint(quiz, panel, isToggled) {
    if (isToggled) {
      panel.replaceContent("Click to go back...");
    } else {
      panel.replaceContent("Click to see answer...");
    }
  }
  #renderQuestion(quiz, panel) {
    panel.replaceContent(Utilities.renderContent(quiz.getQuestion()));
  }

  #renderChoices(quiz, panel) {
    let s = Utilities.renderContent(quiz.getChoices().join('<br>'));
    panel.replaceContent(s);
  }

  #renderAnswers(quiz, panel) {
    let s = Utilities.renderContent(quiz.getAnswers().join('<br>'));
    panel.replaceContent(s);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.scol = window.scol || {};
  window.scol.CF_FLASHCARD = CF_FLASHCARD;
}