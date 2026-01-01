import { PanelWrapper } from './PanelWrapper.js';

const _CPT_SECTION = {
  FRAMEWORK : `<p class="title">__TITLE__:</p>
      <div id="__ID__"></div>`,
}

export class SectionPanel extends PanelWrapper {
  constructor(title) {
    super();
    this._title = title;
    this._content = new PanelWrapper();
  }

  _getWrapperFramework(wrapperElementId) {
    let s = _CPT_SECTION.FRAMEWORK;
    s = s.replace("__TITLE__", this._title);
    s = s.replace("__ID__", wrapperElementId);
    return s;
  }

  _onFrameworkDidAppear() { this.wrapPanel(this._content); }
}
