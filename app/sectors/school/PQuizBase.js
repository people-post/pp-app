
export class PQuizBase extends ui.Panel {
  constructor() {
    super();
    this._pQuestion = new ui.Panel();
  }

  isColorInvertible() { return false; }

  getQuestionPanel() { return this._pQuestion; }
  getChoicesPanel() { return null; }

  invertColor() {}
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.scol = window.scol || {};
  window.scol.PQuizBase = PQuizBase;
}
