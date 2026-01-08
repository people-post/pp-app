const _CPT_TAG_EDITOR = {
  MAIN : `<div id="__ID_NAME__"></div>
    <div id="__ID_THEME__"></div>`,
}

import { PTagEditorBase } from './PTagEditorBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PTagEditor extends PTagEditorBase {
  protected _pTheme: PanelWrapper;

  constructor() {
    super();
    this._pTheme = new PanelWrapper();
  }

  getThemePanel(): PanelWrapper { return this._pTheme; }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pTheme.attach(this._getSubElementId("T"));
  }

  _renderFramework(): string {
    let s = _CPT_TAG_EDITOR.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_THEME__", this._getSubElementId("T"));
    return s;
  }
}
