
/*
 * +-+-----------+-------------+
 * |P|           |             |
 * |r|           |             |
 * |o|           |             |
 * |g|           |    DETAIL   |
 * |r| THUMBNAIL |             |
 * |e|           |             |
 * |s|           |             |
 * |s|           |             |
 * +-+-----------+-------------+
 */

const _CPT_PROJECT_INFO_MIDDLE = {
  MAIN : `<div id="__ID_WRAPPER__" class="project-info-wrapper middle">
    <div class="aspect-5-1-frame">
      <div class="aspect-content flex flex-start">
        <div id="__ID_PROGRESS__" class="flex-noshrink v-progress-wrapper w10px"></div>
        <div class="flex-grow h100">
          <div id="__ID_MAIN__" class="project-info middle h100 bdlightgray">
            <div class="flex flex-start h100"> 
              <div id="__ID_THUMBNAIL__"></div>
              <div class="flex-grow h100 border-box top-pad5px left-pad5px hide-overflow">
                <div id="__ID_TITLE__" class="bold"></div>
                <div id="__ID_CONTENT__" class="u-font5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>`,
}

export class PProjectInfoMiddle extends wksp.PProjectInfoBase {
  isColorInvertible() { return true; }
  getProgressDirection() { return "V"; }

  setVisibilityClassName(name) {
    let e = document.getElementById(this._getSubElementId("W"));
    if (e) {
      e.className = "project-info-wrapper middle " + name;
    }
  }

  enableImage() { this._pImage.setClassName("w20 flex-noshrink"); }

  invertColor() {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "project-info middle h100 s-cprimebd";
    }
  }

  _renderFramework() {
    let s = _CPT_PROJECT_INFO_MIDDLE.MAIN;
    s = s.replace("__ID_WRAPPER__", this._getSubElementId("W"));
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_THUMBNAIL__", this._getSubElementId("I"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("TT"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_PROGRESS__", this._getSubElementId("P"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pImage.attach(this._getSubElementId("I"));
    this._pTitle.attach(this._getSubElementId("TT"));
    this._pContent.attach(this._getSubElementId("C"));
    this._pProgress.attach(this._getSubElementId("P"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.PProjectInfoMiddle = PProjectInfoMiddle;
}
