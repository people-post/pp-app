export const CF_CHAT_INPUT_MENU = {
  CALL : "CF_CHAT_INPUT_MENU_1",
  VIDEO_CALL : "CF_CHAT_INPUT_MENU_2",
  SEND_FILE : "CF_CHAT_INPUT_MENU_3",
} as const;

// Export to window for HTML string templates
declare global {
  interface Window {
    CF_CHAT_INPUT_MENU?: typeof CF_CHAT_INPUT_MENU;
    _CFT_CHAT_INPUT_MENU?: typeof _CFT_CHAT_INPUT_MENU;
    [key: string]: unknown;
  }
}

const _CFT_CHAT_INPUT_MENU = {
  ACTION_ICON :
      `<span class="tw:inline-block tw:w-s-icon3 tw:h-s-icon3 tw:cursor-pointer" data-pp-action="__ACTION__">__ICON__</span>`,
  BTN_FILE :
      `<span class="tw:inline-block tw:w-s-icon3 tw:h-s-icon3 tw:cursor-pointer" onclick="javascript:this.nextElementSibling.click()">__ICON__</span>
  <input type="file" style="display:none" data-pp-change-action="${CF_CHAT_INPUT_MENU.SEND_FILE}" data-pp-change-args='["$this"]'>`,
} as const;

if (typeof window !== 'undefined') {
  window.CF_CHAT_INPUT_MENU = CF_CHAT_INPUT_MENU;
  window._CFT_CHAT_INPUT_MENU = _CFT_CHAT_INPUT_MENU;
}

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { UiUtilities } from '../../lib/ui/Utilities.js';
import { ICON } from '../../common/constants/Icons.js';
import type { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FChatInputMenu extends Fragment {
  _renderOnRender(render: PanelWrapper): void {
    let p = new ListPanel();
    p.setClassName("tw:flex tw:justify-start");
    render.wrapPanel(p);

    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderSendFileButton());

    // pp = new ui.Panel();
    // p.pushPanel(pp);
    // pp.replaceContent(
    //    this.#renderActionIcon("CF_CHAT_INPUT_MENU.CALL", ICON.CALL));

    // pp = new ui.Panel();
    // p.pushPanel(pp);
    // pp.replaceContent(this.#renderActionIcon("CF_CHAT_INPUT_MENU.VIDEO_CALL",
    //                                  ICON.CALL_VIDEO));
  }

  /*
  #renderActionIcon(action: string, icon: string): string {
    let s: string = _CFT_CHAT_INPUT_MENU.ACTION_ICON;
    s = s.replace("__ACTION__", action);
    s = s.replace("__ICON__", UiUtilities.renderSvgFuncIcon(icon));
    return s;
  }
  */

  #renderSendFileButton(): string {
    let s = _CFT_CHAT_INPUT_MENU.BTN_FILE;
    return s.replace("__ICON__", UiUtilities.renderSvgFuncIcon(ICON.SEND_FILE));
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_CHAT_INPUT_MENU.SEND_FILE:
      this.#onSendFile(args[0] as HTMLInputElement);
      break;
    case CF_CHAT_INPUT_MENU.CALL:
      this.#onCall();
      break;
    case CF_CHAT_INPUT_MENU.VIDEO_CALL:
      this.#onVideoCall();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  #onSendFile(inputNode: HTMLInputElement): void {
    let file = inputNode.files?.[0];
    if (file) {
      file.arrayBuffer().then(r => console.log(r));
    }
  }
  #onCall(): void { console.log("Start call"); }
  #onVideoCall(): void { console.log("Start video call"); }
}
