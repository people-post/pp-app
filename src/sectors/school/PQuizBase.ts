import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PQuizBase extends Panel {
  protected _pQuestion: Panel;

  constructor() {
    super();
    this._pQuestion = new Panel();
  }

  isColorInvertible(): boolean { return false; }

  getQuestionPanel(): Panel { return this._pQuestion; }
  getChoicesPanel(): Panel | null { return null; }

  invertColor(): void {}
}
