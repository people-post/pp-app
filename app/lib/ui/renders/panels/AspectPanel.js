import { PanelWrapper } from './PanelWrapper.js';

export class AspectPanel extends PanelWrapper {
  _getWrapperFramework(wrapperElementId) {
    let s = `<div id="__ID__" class="aspect-content"></div>`;
    s = s.replace("__ID__", wrapperElementId);
    return s;
  }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.AspectPanel = AspectPanel;
}
