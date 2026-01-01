import { PanelWrapper } from './PanelWrapper.js';

const _CPW_THUMBNAIL = {
  MAIN : `<div class="aspect-content">
    <div class="thumbnail-wrapper">
      <div id="__ID__" class="thumbnail"></div>
    </div>
  </div>`,
}

export class ThumbnailPanelWrapper extends PanelWrapper {
  constructor() {
    super();
    this._className = "aspect-16-9-frame";
  }

  _getWrapperFramework(wrapperElementId) {
    let s = _CPW_THUMBNAIL.MAIN;
    s = s.replace("__ID__", wrapperElementId);
    return s;
  }
}
