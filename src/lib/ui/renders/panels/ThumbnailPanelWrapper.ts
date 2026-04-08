import { PanelWrapper } from './PanelWrapper.js';

const _CPW_THUMBNAIL = {
  MAIN : `<div class="tw:absolute tw:inset-0">
    <div class="thumbnail-wrapper tw:w-full tw:h-full">
      <div id="__ID__" class="thumbnail tw:w-full tw:h-full"></div>
    </div>
  </div>`,
} as const;

export class ThumbnailPanelWrapper extends PanelWrapper {
  declare _className: string;

  constructor() {
    super();
    this._className = "tw:aspect-[16/9] tw:relative";
  }

  _getWrapperFramework(wrapperElementId: string): string {
    let s: string = _CPW_THUMBNAIL.MAIN;
    s = s.replace("__ID__", wrapperElementId) as string;
    return s;
  }
}

