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

if (typeof window !== 'undefined') {
  window.CF_CHAT_INPUT_MENU = CF_CHAT_INPUT_MENU;
  window._CFT_CHAT_INPUT_MENU = _CFT_CHAT_INPUT_MENU;
}

const _CFT_CHAT_INPUT_MENU = {
  ACTION_ICON :
      `<span class="inline-block s-icon3 clickable" onclick="javascript:G.action(__ACTION__)">__ICON__</span>`,
  BTN_FILE :
      `<span class="inline-block s-icon3 clickable" onclick="javascript:this.nextElementSibling.click()">__ICON__</span>
    <input type="file" style="display:none" onchange="javascript:G.action(CF_CHAT_INPUT_MENU.SEND_FILE, this)">`,
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ICON } from '../../common/constants/Icons.js';
import { Utilities } from '../../common/Utilities.js';
import type { Panel as PanelType } from '../../lib/ui/renders/panels/Panel.js';

export class FChatInputMenu extends Fragment {
  _renderOnRender(render: PanelType): void {
    let p = new ListPanel();
    p.setClassName("flex flex-start");
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

  #renderActionIcon(action: string, icon: string): string {
    let s = _CFT_CHAT_INPUT_MENU.ACTION_ICON;
    s = s.replace("__ACTION__", action);
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(icon));
    return s;
  }

  #renderSendFileButton(): string {
    let s = _CFT_CHAT_INPUT_MENU.BTN_FILE;
    return s.replace("__ICON__", Utilities.renderSvgFuncIcon(ICON.SEND_FILE));
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
