// This is maily for JournalIssue
const _CPT_POST_INFO_FULL_PAGE = {
  MAIN : `<div class="h100 h-pad5 v-pad5px y-scroll no-scrollbar">
    <div id="__ID_TITLE__" class="u-font2 bold"></div>
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
