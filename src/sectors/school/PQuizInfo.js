import { PQuizBase } from './PQuizBase.js';

const _CPT_QUIZ_INFO = {
  MAIN : `<div class="aspect-5-1-frame">
    <div class="aspect-content border-box top-pad5px right-pad5px">
      <div class="flex flex-start h100">
        <div id="__ID_MAIN__" class="quiz-info bdlightgray">
          <div id="__ID_QUESTION__" class="u-font3 bold cdimgray"></div>
        </div>
      </div>
    </div>
  </div>`,
}

export class PQuizInfo extends PQuizBase {
  isColorInvertible() { return true; }

  invertColor() {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "quiz-info s-cprimebd";
    }
  }

  _renderFramework() {
    let s = _CPT_QUIZ_INFO.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_QUESTION__", this._getSubElementId("Q"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pQuestion.attach(this._getSubElementId("Q"));
  }
};
