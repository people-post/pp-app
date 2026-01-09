import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { T_DATA } from '../../lib/framework/Events.js';
import { FTagEditor } from './FTagEditor.js';
import type Render from '../../lib/ui/renders/Render.js';

interface TagEditorDelegate {
  onClickInTagEditorFragment(fTagEditor: FTagEditor): void;
}

export class FvcTagEditor extends FScrollViewContent {
  protected _fTagEditor: FTagEditor;
  protected _delegate!: TagEditorDelegate;

  constructor() {
    super();
    this._fTagEditor = new FTagEditor();
    this._fTagEditor.setDelegate(this);
    this.setChild("editor", this._fTagEditor);
  }

  onClickInTagEditorFragment(fTagEditor: FTagEditor): void {}

  setTagId(id: string | null): void { this._fTagEditor.setTagId(id); }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.WEB_CONFIG:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: Render): void {
    this._fTagEditor.attachRender(render);
    this._fTagEditor.render();
  }
};
