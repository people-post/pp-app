import { PanelWrapper } from './PanelWrapper.js';

const _CPW_THUMBNAIL = {
  MAIN : `<div class="aspect-content">
    <div class="thumbnail-wrapper">
      <div id="__ID__" class="thumbnail"></div>
    </div>
  </div>`,
} as const;

export class ThumbnailPanelWrapper extends PanelWrapper {
  declare _className: string;

  constructor() {
    super();
    this._className = "aspect-16-9-frame";
  }

  _getWrapperFramework(wrapperElementId: string): string {
    let s: string = _CPW_THUMBNAIL.MAIN;
    s = s.replace("__ID__", wrapperElementId) as string;
    return s;
  }
}

