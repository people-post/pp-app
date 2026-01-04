import { PanelWrapper } from './PanelWrapper.js';

export class AspectPanel extends PanelWrapper {
  _getWrapperFramework(wrapperElementId: string): string {
    let s = `<div id="__ID__" class="aspect-content"></div>`;
    s = s.replace("__ID__", wrapperElementId);
    return s;
  }
}

