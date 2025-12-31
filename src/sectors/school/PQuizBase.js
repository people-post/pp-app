
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PQuizBase extends Panel {
  constructor() {
    super();
    this._pQuestion = new Panel();
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
