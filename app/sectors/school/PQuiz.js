
const _CPT_QUIZ = {
  MAIN : `<div class="pad5">
    <div id="__ID_QUESTION__" class="u-font3 bold"></div>
    <br>
    <div id="__ID_CHOICES__" class="u-font4"></div>
  </div>`,
}

class PQuiz extends scol.PQuizBase {
  constructor() {
    super();
    this._pChoices = new ui.Panel();
  }

  getChoicesPanel() { return this._pChoices; }

  _renderFramework() {
    let s = _CPT_QUIZ.MAIN;
    s = s.replace("__ID_QUESTION__", this._getSubElementId("Q"));
    s = s.replace("__ID_CHOICES__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pQuestion.attach(this._getSubElementId("Q"));
    this._pChoices.attach(this._getSubElementId("C"));
  }
};

scol.PQuiz = PQuiz;
}(window.scol = window.scol || {}));
