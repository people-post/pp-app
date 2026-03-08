// This is maily for JournalIssue
const _CPT_POST_INFO_FULL_PAGE = {
  MAIN : `<div class="tw-h-full h-pad5 tw-py-[5px] tw-overflow-y-auto no-scrollbar">
    <div id="__ID_TITLE__" class="tw-text-u-font2 tw-font-bold"></div>
    <div id="__ID_CONTENT__"></div>
  </div>`,
} as const;

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PPostInfoFullPage extends PPostInfoBase {
  #pTitle: Panel;
  #pContent: PanelWrapper;

  constructor() {
    super();
    this.#pTitle = new Panel();
    this.#pContent = new PanelWrapper();
  }

  getTitlePanel(): Panel { return this.#pTitle; }
  getContentPanel(): PanelWrapper { return this.#pContent; }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
  }

  _renderFramework(): string {
    let s = _CPT_POST_INFO_FULL_PAGE.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }
}
