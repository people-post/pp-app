import { FInput } from '../../lib/ui/controllers/fragments/FInput.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Env } from '../plt/Env.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

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

interface RichContentConfig {
  title?: string;
  hint?: string;
  value?: string;
  className?: string;
}

interface CKEditorInstance {
  getData(): string;
}

declare var CKEDITOR: {
  replace(id: string, config: {toolbar: typeof _CF_RICH_CONTENT_EDITOR.TOOLBAR}): CKEditorInstance;
};

export class RichContentEditor extends FInput {
  private _editor: CKEditorInstance | null = null;
  protected _config: RichContentConfig = {title : "", hint : "", value : "", className : ""};

  getValue(): string { return this._editor ? this._editor.getData() : ""; }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case PltT_DATA.ADDON_SCRIPT:
      if (data == Env.SCRIPT.EDITOR.id) {
        this.#loadJsEditor();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    let pp: Panel | null = render;
    if (this._config.title && this._config.title.length) {
      let p = new SectionPanel(this._config.title);
      render.wrapPanel(p);
      pp = p.getContentPanel();
    }

    let s = _CFT_RICH_CONTENT_EDITOR.INPUT;
    s = s.replace("__HINT__", this._config.hint || "");
    s = s.replace("__ID__", this._getInputElementId());
    s = s.replace("__VALUE__", this._config.value ? this._config.value : "");

    if (pp) {
      pp.replaceContent(s);
    }

    this.#loadJsEditor();
  }

  #loadJsEditor(): void {
    if (Env.isScriptLoaded(Env.SCRIPT.EDITOR.id)) {
      let config = {toolbar : _CF_RICH_CONTENT_EDITOR.TOOLBAR};
      this._editor = CKEDITOR.replace(this._getInputElementId(), config);
    }
  }
}

export default RichContentEditor;
