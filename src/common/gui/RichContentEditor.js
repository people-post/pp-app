import { FInput } from '../../lib/ui/controllers/fragments/FInput.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { T_DATA } from '../../lib/framework/Events.js';

const _CF_RICH_CONTENT_EDITOR = {
  TOOLBAR : [
    {name : 'document', items : [ 'Source', '-', 'SelectAll' ]},
    {name : 'editing', items : [ 'Undo', 'Redo' ]},
    {name : 'formating', items : [ 'CopyFormatting', 'RemoveFormat' ]},
    {name : 'colors', items : [ 'TextColor', 'BGColor' ]},
    {name : 'basicstyles', items : [ 'Bold', 'Italic', 'Underline', 'Strike' ]},
    {name : 'note', items : [ 'Subscript', 'Superscript' ]},
    {name : 'list', items : [ 'NumberedList', 'BulletedList' ]},
    {name : 'paragraph', items : [ 'Outdent', 'Indent' ]},
    {
      name : 'justify',
      items : [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ]
    },
    {name : 'alignment', items : [ 'BidiLtr', 'BidiRtl' ]},
    {name : 'quotes', items : [ 'Blockquote', 'Link', 'Unlink' ]},
    {name : 'insert', items : [ 'Table', 'HorizontalRule' ]},
    {name : 'styles', items : [ 'Styles', 'Format' ]},
    {name : 'font', items : [ 'Font', 'FontSize' ]},
  ],
}

const _CFT_RICH_CONTENT_EDITOR = {
  INPUT :
      `<textarea id="__ID__" class="normal" placeholder="__HINT__">__VALUE__</textarea>`,
}

export class RichContentEditor extends FInput {
  constructor() {
    super();
    this._editor = null;
    this._config = {title : "", hint : "", value : "", className : ""};
  }

  getValue() { return this._editor.getData(); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.ADDON_SCRIPT:
      if (data == glb.env.SCRIPT.EDITOR.id) {
        this.#loadJsEditor();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let pp = render;
    if (this._config.title && this._config.title.length) {
      let p = new SectionPanel(this._config.title);
      render.wrapPanel(p);
      pp = p.getContentPanel();
    }

    let s = _CFT_RICH_CONTENT_EDITOR.INPUT;
    s = s.replace("__HINT__", this._config.hint);
    s = s.replace("__ID__", this._getInputElementId());
    s = s.replace("__VALUE__", this._config.value ? this._config.value : "");

    pp.replaceContent(s);

    this.#loadJsEditor();
  }

  #loadJsEditor() {
    if (glb.env.isScriptLoaded(glb.env.SCRIPT.EDITOR.id)) {
      let config = {toolbar : _CF_RICH_CONTENT_EDITOR.TOOLBAR};
      this._editor = CKEDITOR.replace(this._getInputElementId(), config);
    }
  }
};

