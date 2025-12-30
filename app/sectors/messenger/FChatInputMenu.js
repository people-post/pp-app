
window.CF_CHAT_INPUT_MENU = {
  CALL : "CF_CHAT_INPUT_MENU_1",
  VIDEO_CALL : "CF_CHAT_INPUT_MENU_2",
  SEND_FILE : "CF_CHAT_INPUT_MENU_3",
};

window._CFT_CHAT_INPUT_MENU = {
  ACTION_ICON :
      `<span class="inline-block s-icon3 clickable" onclick="javascript:G.action(__ACTION__)">__ICON__</span>`,
  BTN_FILE :
      `<span class="inline-block s-icon3 clickable" onclick="javascript:this.nextElementSibling.click()">__ICON__</span>
    <input type="file" style="display:none" onchange="javascript:G.action(CF_CHAT_INPUT_MENU.SEND_FILE, this)">`,
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';

export class FChatInputMenu extends Fragment {
  _renderOnRender(render) {
    let p = new ListPanel();
    p.setClassName("flex flex-start");
    render.wrapPanel(p);

    let pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderSendFileButton());

    // pp = new ui.Panel();
    // p.pushPanel(pp);
    // pp.replaceContent(
    //    this.#renderActionIcon("CF_CHAT_INPUT_MENU.CALL", C.ICON.CALL));

    // pp = new ui.Panel();
    // p.pushPanel(pp);
    // pp.replaceContent(this.#renderActionIcon("CF_CHAT_INPUT_MENU.VIDEO_CALL",
    //                                  C.ICON.CALL_VIDEO));
  }

  #renderActionIcon(action, icon) {
    let s = _CFT_CHAT_INPUT_MENU.ACTION_ICON;
    s = s.replace("__ACTION__", action);
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(icon));
    return s;
  }

  #renderSendFileButton() {
    let s = _CFT_CHAT_INPUT_MENU.BTN_FILE;
    return s.replace("__ICON__", Utilities.renderSvgFuncIcon(C.ICON.SEND_FILE));
  }

  action(type, ...args) {
    switch (type) {
    case CF_CHAT_INPUT_MENU.SEND_FILE:
      this.#onSendFile(args[0]);
      break;
    case CF_CHAT_INPUT_MENU.CALL:
      this.#onCall();
      break;
    case CF_CHAT_INPUT_MENU.VIDEO_CALL:
      this.#onVideoCall();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  #onSendFile(inputNode) {
    let file = inputNode.files[0];
    file.arrayBuffer().then(r => console.log(r));
  }
  #onCall() { console.log("Start call"); }
  #onVideoCall() { console.log("Start video call"); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.FChatInputMenu = FChatInputMenu;
}
