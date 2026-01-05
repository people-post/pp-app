import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ICON } from '../constants/Icons.js';
import { Utilities } from '../Utilities.js';

export const CF_INPUT_CONSOLE = {
  ON_KEY_DOWN : "CF_GUI_INPUT_CONSOLE_1",
  ON_KEY_UP : "CF_GUI_INPUT_CONSOLE_2",
  ON_POST : "CF_GUI_INPUT_CONSOLE_3",
  TOGGLE_MORE : "CF_GUI_INPUT_CONSOLE_4",
  ON_POST_FILE : "CF_GUI_INPUT_CONSOLE_5",
}

// Window.gui is already declared in ActionButton.ts, just extend it

if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  (window.gui as { CF_INPUT_CONSOLE: typeof CF_INPUT_CONSOLE }).CF_INPUT_CONSOLE = CF_INPUT_CONSOLE;
}

const _CFT_INPUT_CONSOLE = {
  TEXT_INPUT_NORMAL :
      `<textarea id="ID_INPUT_CONSOLE___FID__" class="console-text" onkeydown="javascript:G.action(gui.CF_INPUT_CONSOLE.ON_KEY_DOWN)" onkeyup="javascript:G.action(gui.CF_INPUT_CONSOLE.ON_KEY_UP)" placeholder="__TEXT_PLACE_HOLDER__">__VALUE__</textarea>`,
  TEXT_INPUT_DISABLED :
      `<textarea class="console-text" placeholder="__TEXT_PLACE_HOLDER__" disabled></textarea>`,
  ICON : `<span class="inline-block s-icon6 clickable">__ICON__</span>`,
  BTN_IMG : `<label class="s-font5" for="_ID_INPUT_CONSOLE_IMG_INPUT">
      <span class="inline-block s-icon3 clickable">__IMG_ICON__</span>
    </label>
    <input id="_ID_INPUT_CONSOLE_IMG_INPUT" type="file" style="display:none" onchange="javascript:G.action(gui.CF_INPUT_CONSOLE.ON_POST_FILE, this)">`,
  BTN_IMG_DISABLED : `<label class="s-font5">
    <span class="inline-block s-icon3 clickable">__IMG_ICON__</span>
   </label>`,
}

interface InputConsoleDelegate {
  onInputConsoleRequestPost?(message: string): void;
  onInputConsoleRequestPostFile?(file: File): void;
  [key: string]: unknown;
}

export class InputConsoleFragment extends Fragment {
  _isVisible: boolean = true;
  _isEnabled: boolean = true;
  _placeholder: string = "";
  _cacheText: string = "";
  _lastKeyDownEvent: KeyboardEvent | null = null;
  _isMenuOpen: boolean = false;
  // @ts-expect-error - _delegate type is more specific than base class
  declare _delegate: InputConsoleDelegate;

  constructor() {
    super();
  }

  isVisible(): boolean {
    return this._isVisible;
  }

  isEnabled(): boolean {
    return this._isEnabled;
  }

  setPlaceholder(text: string): void {
    this._placeholder = text;
  }

  setEnabled(b: boolean): void {
    this._isEnabled = b;
  }

  setVisible(b: boolean): void {
    this._isVisible = b;
  }

  setMenuFragment(f: Fragment | null): void {
    this.setChild("menu", f);
  }

  action(type: string, ...args: unknown[]): void {
    switch (type) {
    case CF_INPUT_CONSOLE.ON_KEY_DOWN:
      this.#onKeyDown();
      break;
    case CF_INPUT_CONSOLE.ON_KEY_UP:
      this.#onKeyUp();
      break;
    case CF_INPUT_CONSOLE.ON_POST:
      this.#onPost();
      break;
    case CF_INPUT_CONSOLE.TOGGLE_MORE:
      this.#toggleMoreMenu();
      break;
    case CF_INPUT_CONSOLE.ON_POST_FILE:
      this.#onPostFile(args[0] as HTMLInputElement);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  setText(text: string): void {
    this._cacheText = text;
    let e = this.#getTextInputNode();
    if (e) {
      e.value = text;
    }
  }

  clearInputText(): void {
    this.setText("");
  }

  toggleVisibility(): void {
    if (this._isVisible) {
      this._cacheText = this.#getInputText();
    }
    this._isVisible = !this._isVisible;
    this.render();
  }

  _renderOnRender(render: { wrapPanel: (p: ListPanel) => void; replaceContent: (content: string) => void }): void {
    if (!this._isVisible) {
      render.replaceContent("");
      return;
    }
    let pAll = new ListPanel();
    render.wrapPanel(pAll);
    let p = new ListPanel();
    p.setClassName("input-console");
    pAll.pushPanel(p);
    let pp = new Panel();
    pp.setClassName("input-console-text");
    p.pushPanel(pp);
    pp.replaceContent(this.#renderTextInput(this._isEnabled));
    // Send btn
    pp = new Panel();
    if (this._isEnabled) {
      pp.setAttribute("onclick",
                      "javascript:G.action(gui.CF_INPUT_CONSOLE.ON_POST)");
    }
    p.pushPanel(pp);
    pp.setClassName("input-console-icon");
    pp.replaceContent(this.#renderSendButton());

    // More btn
    let fMenu = this._getChild("menu");
    if (fMenu) {
      pp = new Panel();
      if (this._isMenuOpen) {
        pp.setClassName("input-console-icon s-cprimebg");
      } else {
        pp.setClassName("input-console-icon");
      }
      if (this._isEnabled) {
        pp.setAttribute(
            "onclick", "javascript:G.action(gui.CF_INPUT_CONSOLE.TOGGLE_MORE)");
      }
      p.pushPanel(pp);
      pp.replaceContent(this.#renderMoreButton());
      if (this._isMenuOpen) {
        let pMenu = new PanelWrapper();
        pMenu.setClassName("input-console-menu");
        pAll.pushPanel(pMenu);
        fMenu.attachRender(pMenu);
        fMenu.render();
      }
    }
  }

  #renderTextInput(isEnabled: boolean): string {
    let s: string;
    if (isEnabled) {
      s = _CFT_INPUT_CONSOLE.TEXT_INPUT_NORMAL;
      s = s.replace("__FID__", this._id);
      s = s.replace("__VALUE__", this._cacheText);
    } else {
      s = _CFT_INPUT_CONSOLE.TEXT_INPUT_DISABLED;
    }
    s = s.replace("__TEXT_PLACE_HOLDER__", this._placeholder);
    return s;
  }

  #renderSendButton(): string {
    let s = _CFT_INPUT_CONSOLE.ICON;
    s = s.replace("__ICON__", Utilities.renderSvgIcon(
                                  ICON.ENTER, "stkdimgray", "filldimgray"));
    return s;
  }

  #renderMoreButton(): string {
    let s = _CFT_INPUT_CONSOLE.ICON;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ICON.CIRCLED_MORE,
                                                          this._isMenuOpen));
    return s;
  }

  #getInputText(): string {
    let e = this.#getTextInputNode();
    return e ? e.value.trim() : "";
  }

  #onKeyDown(): void {
    this._lastKeyDownEvent = (globalThis as { event?: KeyboardEvent }).event || null;
    const evt = this._lastKeyDownEvent;
    if (evt && this.#isSendEvt(evt)) {
      this.#onPost();
    }
  }

  #onKeyUp(): void {
    if (this._lastKeyDownEvent && this.#isSendEvt(this._lastKeyDownEvent)) {
      this.clearInputText();
    }
  }

  #isSendEvt(evt: KeyboardEvent): boolean {
    return !evt.shiftKey && evt.key === "Enter";
  }

  #onPost(): void {
    let message = this.#getInputText();
    if (message.length) {
      this.clearInputText();
      this._delegate.onInputConsoleRequestPost?.(message);
    }
  }

  #toggleMoreMenu(): void {
    this._isMenuOpen = !this._isMenuOpen;
    this.render();
  }

  #onPostFile(inputNode: HTMLInputElement): void {
    if (inputNode.files && inputNode.files[0]) {
      this._delegate.onInputConsoleRequestPostFile?.(inputNode.files[0]);
    }
  }

  #getTextInputNode(): HTMLTextAreaElement | null {
    return document.getElementById("ID_INPUT_CONSOLE_" + this._id) as HTMLTextAreaElement | null;
  }
}
