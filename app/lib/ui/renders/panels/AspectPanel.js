(function(ui) {
class AspectPanel extends ui.PanelWrapper {
  _getWrapperFramework(wrapperElementId) {
    let s = `<div id="__ID__" class="aspect-content"></div>`;
    s = s.replace("__ID__", wrapperElementId);
    return s;
  }
}

ui.AspectPanel = AspectPanel;
}(window.ui = window.ui || {}));
