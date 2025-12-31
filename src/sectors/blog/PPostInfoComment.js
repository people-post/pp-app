
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
};

import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PPostInfoComment extends PPostInfoBase {
  #pOwnerIcon;
  #pOwnerName;
  #pContent;
  #pContext;

  constructor() {
    super();
    this.#pOwnerIcon = new PanelWrapper();
    this.#pOwnerName = new PanelWrapper();
    this.#pContent = new PanelWrapper();
    this.#pContext = new PanelWrapper();
  }

  getOwnerIconPanel() { return this.#pOwnerIcon; }
  getOwnerNamePanel() { return this.#pOwnerName; }
  getContentPanel() { return this.#pContent; }
  getContextPanel() { return this.#pContext; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pOwnerIcon.attach(this._getSubElementId("I"));
    this.#pOwnerName.attach(this._getSubElementId("N"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pContext.attach(this._getSubElementId("X"));
  }

  _renderFramework() {
    let s = _CPT_POST_INFO_COMMENT.MAIN;
    s = s.replace("__ID_OWNER_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_OWNER_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    s = s.replace("__ID_CONTEXT__", this._getSubElementId("X"));
    return s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PPostInfoComment = PPostInfoComment;
}
