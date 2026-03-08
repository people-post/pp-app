import { PQuizBase } from './PQuizBase.js';

const _CPT_QUIZ_INFO = {
  MAIN : `<div class="aspect-5-1-frame">
    <div class="aspect-content tw-box-border tw-pt-[5px] tw-pr-[5px]">
      <div class="tw-flex tw-justify-start tw-h-full">
        <div id="__ID_MAIN__" class="quiz-info tw-border-lightgray">
          <div id="__ID_QUESTION__" class="u-font3 tw-font-bold tw-text-gray-600"></div>
        </div>
      </div>
    </div>
  </div>`,
}

export class PQuizInfo extends PQuizBase {
  isColorInvertible(): boolean { return true; }

  invertColor(): void {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "quiz-info s-cprimebd";
    }
  }

  _renderFramework(): string {
    let s = _CPT_QUIZ_INFO.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_QUESTION__", this._getSubElementId("Q"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pQuestion.attach(this._getSubElementId("Q"));
  }
}
