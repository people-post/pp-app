export const CF_TAG_EDITOR = {
  ON_CLICK : Symbol(),
}

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { ThemeEditorFragment } from '../../common/gui/ThemeEditorFragment.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { PTagEditor } from './PTagEditor.js';
import { PTagEditorInfo } from './PTagEditorInfo.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FvcUserInput } from '../../common/hr/FvcUserInput.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';
import type { PTagEditorBase } from './PTagEditorBase.js';

interface TagEditorDelegate {
  onClickInTagEditorFragment(f: FTagEditor): void;
}

export class FTagEditor extends Fragment {
  static T_LAYOUT = {
    INFO : Symbol(),
  };

  protected _fBtnQuick: Button;
  protected _fTheme: ThemeEditorFragment;
  protected _tagId: string | null;
  protected _tLayout: symbol | null;
  protected _delegate!: TagEditorDelegate;

  constructor() {
    super();
    this._fBtnQuick = new Button();
    this._fBtnQuick.setName("Rename...");
    this._fBtnQuick.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fBtnQuick.setDelegate(this);
    this.setChild("btnQuick", this._fBtnQuick);

    this._fTheme = new ThemeEditorFragment();
    this._fTheme.setDelegate(this);
    this.setChild("theme", this._fTheme);

    this._tagId = null;
    this._tLayout = null;
  }

  getTagId(): string | null { return this._tagId; }

  setLayoutType(t: symbol | null): void { this._tLayout = t; }
  setTagId(id: string | null): void { this._tagId = id; }

  onSimpleButtonClicked(fBtn: Button): void { this.#onRename(); }
  onGuiThemeEditorFragmentRequestChangeColor(fThemeEditor: ThemeEditorFragment, key: string, color: string): void {
    if (this._tagId) {
      WebConfig.asyncUpdateGroupConfig(this._tagId, null, key, color);
    }
  }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_TAG_EDITOR.ON_CLICK:
      this._delegate.onClickInTagEditorFragment(this);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: Render): void {
    if (!this._tagId) {
      return;
    }
    let tag = WebConfig.getTag(this._tagId);
    if (!tag) {
      return;
    }
    let panel = this.#createPanel();
    render.wrapPanel(panel);
    let p = panel.getNamePanel();
    if (p) {
      p.replaceContent(tag.getName());
    }

    p = panel.getThemePanel();
    if (p) {
      let owner = WebConfig.getOwner();
      let iconUrl = owner ? owner.getIconUrl() : "";
      this._fTheme.setIconUrl(iconUrl);
      this._fTheme.setTheme(tag.getTheme() || WebConfig.getDefaultTheme());
      this._fTheme.attachRender(p);
      this._fTheme.render();
    }

    p = panel.getQuickButtonPanel();
    if (p) {
      this._fBtnQuick.attachRender(p);
      this._fBtnQuick.render();
    }
  }

  #createPanel(): PTagEditorBase {
    let p: PTagEditorBase;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.INFO:
      p = new PTagEditorInfo();
      p.setAttribute("onclick", "G.action(CF_TAG_EDITOR.ON_CLICK)");
      break;
    default:
      p = new PTagEditor();
      break;
    }
    return p;
  }

  #onRename(): void {
    if (!this._tagId) {
      return;
    }
    let tag = WebConfig.getTag(this._tagId);
    if (!tag) {
      return;
    }
    let v = new View();
    let fvc = new FvcUserInput();
    let f = new TextInput();
    f.setConfig({
      title : "Change tag name:",
      hint : "New tag name",
      value : tag.getName(),
      isRequired : true
    });
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate : () => f.validate(),
      fcnOK : () =>
          WebConfig.asyncUpdateGroupConfig(this._tagId, f.getValue()),
    });
    v.setContentFragment(fvc);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Rename",
                                false);
  }
};
