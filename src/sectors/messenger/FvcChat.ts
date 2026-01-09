import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { InputConsoleFragment } from '../../common/gui/InputConsoleFragment.js';
import { FChatHeader } from './FChatHeader.js';
import { FChatInputMenu } from './FChatInputMenu.js';
import { PChatContent } from './PChatContent.js';
import { FvcConversationOptions } from './FvcConversationOptions.js';
import { FChatMessage } from './FChatMessage.js';
import { T_DATA, T_ACTION } from '../../common/plt/Events.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { Events } from '../../lib/framework/Events.js';
import { Env } from '../../common/plt/Env.js';
import { GMessenger } from './GMessenger.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { ChatMessage } from '../../common/datatypes/ChatMessage.js';
import { MessageHandler } from './MessageHandler.js';
import { R } from '../../common/constants/R.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

interface MessagesData {
  target: ChatTarget;
  messages: ChatMessage[];
}

export class FvcChat extends FViewContentBase {
  #fHeader: FChatHeader;
  #fMessages: FSimpleFragmentList;
  #fConsole: InputConsoleFragment;
  #btnInfo: ActionButton;
  #btnMore: ActionButton;
  #msgHandler: MessageHandler | null = null;
  #target: ChatTarget | null = null;

  constructor() {
    super();
    this.#fHeader = new FChatHeader();
    this.setChild("header", this.#fHeader);

    this.#fMessages = new FSimpleFragmentList();
    this.setChild("messages", this.#fMessages);

    this.#fConsole = new InputConsoleFragment();
    this.#fConsole.setPlaceholder("Message");
    this.#fConsole.setDelegate(this);
    this.#fConsole.setMenuFragment(new FChatInputMenu());
    this.setChild("console", this.#fConsole);

    this.#btnInfo = new ActionButton();
    this.#btnInfo.setIcon(ActionButton.T_ICON.INFO);
    this.#btnInfo.setDelegate(this);

    this.#btnMore = new ActionButton();
    this.#btnMore.setIcon(ActionButton.T_ICON.MORE);
    this.#btnMore.setDelegate(this);
  }

  getActionButton(): ActionButton | null {
    if (!this.#target) {
      return null;
    }
    if (this.#target.isGroup()) {
      return this.#btnInfo;
    } else {
      return this.#btnMore;
    }
  }

  setTarget(target: ChatTarget): void {
    this.#target = target;
    this.#fHeader.setTarget(target);
    this.#msgHandler = GMessenger.getOrInitHandler(target);

    if (target.isReadOnly() == this.#fConsole.isEnabled()) {
      this.#fConsole.setEnabled(false);
      if (!target.isGroup()) {
        this.#fConsole.setPlaceholder(
            R.get("PROMPT_SEND_USER_MESSAGE_REQUIREMENT"));
      }
    }
  }

  onConversationDeletedInConversationOptionsContentFragment(_fvcOptions: FvcConversationOptions): void {
    this._owner.onContentFragmentRequestPopView(this);
  }

  onGuiActionButtonClick(fActionBtn: ActionButton): void {
    if (!this.#target) {
      return;
    }

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

  onInputConsoleRequestPost(text: string): void {
    if (!this.#msgHandler) {
      return;
    }
    this.#msgHandler.asyncPost(text, m => this.#onPostSuccess(m),
                               e => this.#onPostFailed(text, e));
  }

  onInputConsoleRequestPostFile(file: File): void {
    if (!this.#msgHandler) {
      return;
    }
    this.#msgHandler.asyncPostFile(file, () => {}, () => {});
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.GROUPS:
      this.render();
      break;
    case T_DATA.USER_INBOX_SIGNAL:
      if (this.#msgHandler) {
        this.#msgHandler.onUserInboxSignal(data);
      }
      break;
    case T_DATA.ADDON_SCRIPT:
      if (data == Env.SCRIPT.SIGNAL.id && this.#msgHandler) {
        this.#msgHandler.activate();
      }
      break;
    case T_DATA.MESSAGES:
      if (this.#msgHandler) {
        let msgData = data as MessagesData;
        if (msgData.target.getId() == this.#msgHandler.getTarget().getId()) {
          this.#updateChatPanel(msgData.messages);
        }
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _onRenderAttached(render: Panel): void {
    super._onRenderAttached(render);
    if (this.#msgHandler) {
      this.#msgHandler.activate();
    }
  }

  _onBeforeRenderDetach(): void {
    if (this.#msgHandler) {
      this.#msgHandler.deactivate();
    }
    super._onBeforeRenderDetach();
  }

  _renderOnRender(render: Panel): void {
    let panel = new PChatContent();
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

  #onPostSuccess(message: ChatMessage): void { this.#updateChatPanel([ message ]); }
  #onPostFailed(text: string, err: string): void {
    this.#fConsole.setText(text);
    this._owner.onRemoteErrorInFragment(this, err);
  }

  #onP2PMore(): void {
    if (!this.#target) {
      return;
    }

    let v = new View();
    let f = new FvcConversationOptions();
    f.setTarget(this.#target);
    f.setDelegate(this);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "options");
  }

  #onShowGroupInfo(groupId: string): void {
    Events.triggerTopAction(T_ACTION.SHOW_GROUP_INFO, groupId);
  }

  #updateChatPanel(messages: ChatMessage[]): void {
    if (!this.#target) {
      return;
    }

    for (let m of messages) {
      let f = new FChatMessage();
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
}
