(function(ui) {
const _CPT_SECTION = {
  FRAMEWORK : `<p class="title">__TITLE__:</p>
      <div id="__ID__"></div>`,
}

class SectionPanel extends ui.PanelWrapper {
  constructor(title) {
    super();
    this._title = title;
    this._content = new ui.PanelWrapper();
  }

  _getWrapperFramework(wrapperElementId) {
    let s = _CPT_SECTION.FRAMEWORK;
    s = s.replace("__TITLE__", this._title);
    s = s.replace("__ID__", wrapperElementId);
    return s;
  }

  _onFrameworkDidAppear() { this.wrapPanel(this._content); }
}

ui.SectionPanel = SectionPanel;
}(window.ui = window.ui || {}));
