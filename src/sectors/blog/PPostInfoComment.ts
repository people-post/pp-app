const _CPT_POST_INFO_COMMENT = {
  MAIN : `<div class="flex bd-b-1px bd-b-solid bdlightgray v-pad5px">
  <div id="__ID_OWNER_ICON__" class="w50px flex-noshrink"></div>
  <div class="flex-grow">
    <div class="flex space-between">
      <div id="__ID_OWNER_NAME__" class="comment-info-text"></div>
      <div id="__ID_CONTEXT__" class="comment-info-extra"></div>
    </div>
    <div id="__ID_CONTENT__" class="comment-info-text s-font5"></div>
  </div>
  </div>`,
} as const;

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PPostInfoComment extends PPostInfoBase {
  #pOwnerIcon: PanelWrapper;
  #pOwnerName: PanelWrapper;
  #pContent: PanelWrapper;
  #pContext: PanelWrapper;

  constructor() {
    super();
    this.#pOwnerIcon = new PanelWrapper();
    this.#pOwnerName = new PanelWrapper();
    this.#pContent = new PanelWrapper();
    this.#pContext = new PanelWrapper();
  }

  getOwnerIconPanel(): PanelWrapper { return this.#pOwnerIcon; }
  getOwnerNamePanel(): PanelWrapper { return this.#pOwnerName; }
  getContentPanel(): PanelWrapper { return this.#pContent; }
  getContextPanel(): PanelWrapper { return this.#pContext; }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pOwnerIcon.attach(this._getSubElementId("I"));
    this.#pOwnerName.attach(this._getSubElementId("N"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pContext.attach(this._getSubElementId("X"));
  }

  _renderFramework(): string {
    let s = _CPT_POST_INFO_COMMENT.MAIN;
    s = s.replace("__ID_OWNER_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_OWNER_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_CONTEXT__", this._getSubElementId("X"));
    return s;
  }
}
