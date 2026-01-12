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

const _CFT_INPUT_CONSOLE = {
  TEXT_INPUT_NORMAL :
      `<textarea id="ID_INPUT_CONSOLE___FID__" class="console-text" onkeydown="javascript:G.action('${CF_INPUT_CONSOLE.ON_KEY_DOWN}')" onkeyup="javascript:G.action('${CF_INPUT_CONSOLE.ON_KEY_UP}')" placeholder="__TEXT_PLACE_HOLDER__">__VALUE__</textarea>`,
  TEXT_INPUT_DISABLED :
      `<textarea class="console-text" placeholder="__TEXT_PLACE_HOLDER__" disabled></textarea>`,
  ICON : `<span class="inline-block s-icon6 clickable">__ICON__</span>`,
  BTN_IMG : `<label class="s-font5" for="_ID_INPUT_CONSOLE_IMG_INPUT">
      <span class="inline-block s-icon3 clickable">__IMG_ICON__</span>
    </label>
    <input id="_ID_INPUT_CONSOLE_IMG_INPUT" type="file" style="display:none" onchange="javascript:G.action('${CF_INPUT_CONSOLE.ON_POST_FILE}', this)">`,
  BTN_IMG_DISABLED : `<label class="s-font5">
    <span class="inline-block s-icon3 clickable">__IMG_ICON__</span>
   </label>`,
}

export interface InputConsoleDelegate {
  onInputConsoleRequestPost?(message: string): void;
  onInputConsoleRequestPostFile?(file: File): void;
}

export class InputConsoleFragment extends Fragment {
  #isVisible: boolean = true;
  #isEnabled: boolean = true;
  #placeholder: string = "";
  #cacheText: string = "";
  #lastKeyDownEvent: KeyboardEvent | null = null;
  #isMenuOpen: boolean = false;

  isVisible(): boolean {
    return this.#isVisible;
  }

  isEnabled(): boolean {
    return this.#isEnabled;
  }

  setPlaceholder(text: string): void {
    this.#placeholder = text;
  }

  setEnabled(b: boolean): void {
    this.#isEnabled = b;
  }

  setVisible(b: boolean): void {
    this.#isVisible = b;
  }

  setMenuFragment(f: Fragment | null): void {
    this.setChild("menu", f);
  }

  action(type: string | symbol, ...args: unknown[]): void {
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
    this.#cacheText = text;
    let e = this.#getTextInputNode();
    if (e) {
      e.value = text;
    }
  }

  clearInputText(): void {
    this.setText("");
  }

  toggleVisibility(): void {
    if (this.#isVisible) {
      this.#cacheText = this.#getInputText();
    }
    this.#isVisible = !this.#isVisible;
    this.render();
  }

  _renderOnRender(render: PanelWrapper): void {
    if (!this.#isVisible) {
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
    pp.replaceContent(this.#renderTextInput(this.#isEnabled));
    // Send btn
    pp = new Panel();
    if (this.#isEnabled) {
      pp.setAttribute("onclick",
                      "javascript:G.action('${CF_INPUT_CONSOLE.ON_POST}')");
    }
    p.pushPanel(pp);
    pp.setClassName("input-console-icon");
    pp.replaceContent(this.#renderSendButton());

    // More btn
    let fMenu = this._getChild("menu");
    if (fMenu) {
      pp = new Panel();
      if (this.#isMenuOpen) {
        pp.setClassName("input-console-icon s-cprimebg");
      } else {
        pp.setClassName("input-console-icon");
      }
      if (this.#isEnabled) {
        pp.setAttribute(
            "onclick", "javascript:G.action('${CF_INPUT_CONSOLE.TOGGLE_MORE}')");
      }
      p.pushPanel(pp);
      pp.replaceContent(this.#renderMoreButton());
      if (this.#isMenuOpen) {
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
      s = s.replace("__VALUE__", this.#cacheText);
    } else {
      s = _CFT_INPUT_CONSOLE.TEXT_INPUT_DISABLED;
    }
    s = s.replace("__TEXT_PLACE_HOLDER__", this.#placeholder);
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
                                                          this.#isMenuOpen));
    return s;
  }

  #getInputText(): string {
    let e = this.#getTextInputNode();
    return e ? e.value.trim() : "";
  }

  #onKeyDown(): void {
    this.#lastKeyDownEvent = (globalThis as { event?: KeyboardEvent }).event || null;
    const evt = this.#lastKeyDownEvent;
    if (evt && this.#isSendEvt(evt)) {
      this.#onPost();
    }
  }

  #onKeyUp(): void {
    if (this.#lastKeyDownEvent && this.#isSendEvt(this.#lastKeyDownEvent)) {
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
      const delegate = this.getDelegate<InputConsoleDelegate>();
      delegate?.onInputConsoleRequestPost?.(message);
    }
  }

  #toggleMoreMenu(): void {
    this.#isMenuOpen = !this.#isMenuOpen;
    this.render();
  }

  #onPostFile(inputNode: HTMLInputElement): void {
    if (inputNode.files && inputNode.files[0]) {
      const delegate = this.getDelegate<InputConsoleDelegate>();
      delegate?.onInputConsoleRequestPostFile?.(inputNode.files[0]);
    }
  }

  #getTextInputNode(): HTMLTextAreaElement | null {
    return document.getElementById("ID_INPUT_CONSOLE_" + this._id) as HTMLTextAreaElement | null;
  }
}
