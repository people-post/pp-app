import { PanelWrapper } from './PanelWrapper.js';

const _CPT_SECTION = {
  FRAMEWORK : `<p class="title">__TITLE__:</p>
      <div id="__ID__"></div>`,
} as const;

export class SectionPanel extends PanelWrapper {
  declare _title: string;
  declare _content: PanelWrapper;

  constructor(title: string) {
    super();
    this._title = title;
    this._content = new PanelWrapper();
  }

  _getWrapperFramework(wrapperElementId: string): string {
    let s = _CPT_SECTION.FRAMEWORK;
    s = s.replace("__TITLE__", this._title);
    s = s.replace("__ID__", wrapperElementId);
    return s;
  }

  _onFrameworkDidAppear(): void { this.wrapPanel(this._content); }
}

