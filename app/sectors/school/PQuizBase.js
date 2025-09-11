(function(scol) {
class PQuizBase extends ui.Panel {
  constructor() {
    super();
    this._pQuestion = new ui.Panel();
  }

  isColorInvertible() { return false; }

  getQuestionPanel() { return this._pQuestion; }
  getChoicesPanel() { return null; }

  invertColor() {}
};

scol.PQuizBase = PQuizBase;
}(window.scol = window.scol || {}));
