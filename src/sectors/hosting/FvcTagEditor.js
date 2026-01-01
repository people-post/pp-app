import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { T_DATA } from '../../lib/framework/Events.js';
import { FTagEditor } from './FTagEditor.js';

export class FvcTagEditor extends FScrollViewContent {
  constructor() {
    super();
    this._fTagEditor = new FTagEditor();
    this._fTagEditor.setDelegate(this);
    this.setChild("editor", this._fTagEditor);
  }

  onClickInTagEditorFragment(fTagEditor) {}

  setTagId(id) { this._fTagEditor.setTagId(id); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.WEB_CONFIG:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    this._fTagEditor.attachRender(render);
    this._fTagEditor.render();
  }
};
