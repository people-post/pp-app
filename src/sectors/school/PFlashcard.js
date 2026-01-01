
const _CPT_FLASHCARD = {
  MAIN : `<div class="pad5">
  <div class="pad5 bd1px bdsolid bdlightgray bdradius5px">
    <div id="__ID_ANSWERS__" class="u-font3 bold"></div>
    <div id="__ID_QUESTION__" class="u-font3 bold"></div>
    <br>
    <div id="__ID_CHOICES__" class="u-font4"></div>
    <br>
    <div id="__ID_NAV_HINT__" class="small-info-text right-align"></div>
  </div>
  </div>`,
}

import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PFlashcard extends Panel {
  constructor() {
    super();
    this._pQuestion = new Panel();
    this._pChoices = new Panel();
    this._pAnswers = new Panel();
    this._pNavHint = new Panel();
  }

  getQuestionPanel() { return this._pQuestion; }
  getChoicesPanel() { return this._pChoices; }
  getAnswersPanel() { return this._pAnswers; }
  getNavHintPanel() { return this._pNavHint; }

  _renderFramework() {
    let s = _CPT_FLASHCARD.MAIN;
    s = s.replace("__ID_QUESTION__", this._getSubElementId("Q"));
    s = s.replace("__ID_CHOICES__", this._getSubElementId("C"));
    s = s.replace("__ID_ANSWERS__", this._getSubElementId("A"));
    s = s.replace("__ID_NAV_HINT__", this._getSubElementId("H"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pQuestion.attach(this._getSubElementId("Q"));
    this._pChoices.attach(this._getSubElementId("C"));
    this._pAnswers.attach(this._getSubElementId("A"));
    this._pNavHint.attach(this._getSubElementId("H"));
  }
};
