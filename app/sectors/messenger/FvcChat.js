import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ActionButton } from '../../common/gui/ActionButton.js';

export class FvcChat extends FViewContentBase {
  #fHeader;
  #fMessages;
  #fConsole;
  #btnInfo;
  #btnMore;
  #msgHandler = null;
  #target = null;

  constructor() {
    super();
    this.#fHeader = new msgr.FChatHeader();
    this.setChild("header", this.#fHeader);

    this.#fMessages = new FSimpleFragmentList();
    this.setChild("messages", this.#fMessages);

    this.#fConsole = new gui.InputConsoleFragment();
    this.#fConsole.setPlaceholder("Message");
    this.#fConsole.setDelegate(this);
    this.#fConsole.setMenuFragment(new msgr.FChatInputMenu());
    this.setChild("console", this.#fConsole);

    this.#btnInfo = new ActionButton();
    this.#btnInfo.setIcon(ActionButton.T_ICON.INFO);
    this.#btnInfo.setDelegate(this);

    this.#btnMore = new ActionButton();
    this.#btnMore.setIcon(ActionButton.T_ICON.MORE);
    this.#btnMore.setDelegate(this);
  }

  getActionButton() {
    if (this.#target.isGroup()) {
      return this.#btnInfo;
    } else {
      return this.#btnMore;
    }
  }

  setTarget(target) {
    this.#target = target;
    this.#fHeader.setTarget(target);
    this.#msgHandler = msgr.GMessenger.getOrInitHandler(target);

    if (target.isReadOnly() == this.#fConsole.isEnabled()) {
      this.#fConsole.setEnabled(false);
      if (target.isGroup()) {
      } else {
        this.#fConsole.setPlaceholder(
            R.get("PROMPT_SEND_USER_MESSAGE_REQUIREMENT"));
      }
    }
  }

  onConversationDeletedInConversationOptionsContentFragment(fvcOptions) {
    this._owner.onContentFragmentRequestPopView(this);
  }

  onGuiActionButtonClick(fActionBtn) {
    switch (fActionBtn) {
    case this.#btnInfo:
      this.#onShowGroupInfo(this.#target.getId());
      break;
    case this.#btnMore:
      this.#onP2PMore();
      break;
    default:
      break;
    }
  }

  onInputConsoleRequestPost(text) {
    this.#msgHandler.asyncPost(text, m => this.#onPostSuccess(m),
                               e => this.#onPostFailed(text, e));
  }

  onInputConsoleRequestPostFile(file) { this.#msgHandler.asyncPostFile(file); }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
    case plt.T_DATA.GROUPS:
      this.render();
      break;
    case plt.T_DATA.USER_INBOX_SIGNAL:
      this.#msgHandler.onUserInboxSignal(data);
      break;
    case plt.T_DATA.ADDON_SCRIPT:
      if (data == glb.env.SCRIPT.SIGNAL.id) {
        this.#msgHandler.activate();
      }
      break;
    case plt.T_DATA.MESSAGES:
      if (data.target.getId() == this.#msgHandler.getTarget().getId()) {
        this.#updateChatPanel(data.messages);
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _onRenderAttached(render) {
    super._onRenderAttached(render);
    this.#msgHandler.activate();
  }

  _onBeforeRenderDetach() {
    this.#msgHandler.deactivate();
    super._onBeforeRenderDetach();
  }

  _renderOnRender(render) {
    let panel = new msgr.PChatContent();
    render.wrapPanel(panel);

    let p = panel.getStickyHeaderPanel();
    this.#fHeader.attachRender(p);
    this.#fHeader.render();

    p = panel.getConsolePanel();
    this.#fConsole.attachRender(p);
    this.#fConsole.render();

    p = panel.getContentPanel();
    let pp = new PanelWrapper();
    pp.setClassName("chat-thread-main-body");
    p.wrapPanel(pp);
    this.#fMessages.attachRender(pp);
    this.#fMessages.render();
    // This should happen after console is rendered
    p.scrollToBottom();
  }

  #onPostSuccess(message) { this.#updateChatPanel([ message ]); }
  #onPostFailed(text, err) {
    this.#fConsole.setText(text);
    this._owner.onRemoteErrorInFragment(this, err);
  }

  #onP2PMore() {
    let v = new View();
    let f = new msgr.FvcConversationOptions();
    f.setTarget(this.#target);
    f.setDelegate(this);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "options");
  }

  #onShowGroupInfo(groupId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_GROUP_INFO, groupId);
  }

  #updateChatPanel(messages) {
    for (let m of messages) {
      let f = new msgr.FChatMessage();
      f.setMessage(m);
      f.setTarget(this.#target);
      this.#fMessages.append(f);
    }
    this.#fMessages.render();
    let r = this.getRender();
    if (r) {
      r.getContentPanel().scrollToBottom();
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.FvcChat = FvcChat;
}
