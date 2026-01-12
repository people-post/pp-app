const _CPT_POST_INFO_EMBED = {
  MAIN : `<div class="post-info">
    <div id="__ID_TITLE__" class="u-font3"></div>
  </div>`,
} as const;

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PPostInfoEmbed extends PPostInfoBase {
  #pTitle: Panel;
  constructor() {
    super();
    this.#pTitle = new Panel();
  }

  getTitlePanel(): Panel { return this.#pTitle; }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
  }

  _renderFramework(): string {
    let s = _CPT_POST_INFO_EMBED.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    return s;
  }
};
