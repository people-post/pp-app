import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { FScrollableHook } from '../../lib/ui/controllers/fragments/FScrollableHook.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { FInputConsole } from '../../common/gui/FInputConsole.js';
import { FChatHeader } from './FChatHeader.js';
import { FChatInputMenu } from './FChatInputMenu.js';
import { FvcConversationOptions } from './FvcConversationOptions.js';
import { FChatMessage } from './FChatMessage.js';
import { FChatMessagesScrollContent } from './FChatMessagesScrollContent.js';
import { T_DATA, T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { Env } from '../../common/plt/Env.js';
import { GMessenger } from './GMessenger.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { ChatMessage } from '../../common/datatypes/ChatMessage.js';
import { MessageHandler } from './MessageHandler.js';
import { R } from '../../common/constants/R.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { RemoteError } from '../../types/basic.js';
import { Account } from '../../common/dba/Account.js';

interface MessagesData {
  target: ChatTarget;
  messages: ChatMessage[];
  isOlder?: boolean;
}

const NEAR_BOTTOM_PX = 80;

const _CPT_CHAT_VIEW_CONTENT = {
  MAIN: `<div id="__ID_HEADER__"></div>
  <div class="chat-view-content tw:flex tw:flex-col tw:min-h-0">
    <div id="__ID_CONTENT__" class="chat-main"></div>
    <div id="__ID_CONSOLE__" class="tw:shrink-0"></div>
  </div>`,
} as const;

class PChatContent extends Panel {
  protected _pStickyHeader: PanelWrapper;
  protected _pContent: PanelWrapper;
  protected _pConsole: PanelWrapper;

  constructor() {
    super();
    this._pStickyHeader = new PanelWrapper();
    this._pContent = new PanelWrapper();
    this._pConsole = new PanelWrapper();
  }

  getStickyHeaderPanel(): PanelWrapper { return this._pStickyHeader; }
  getContentPanel(): PanelWrapper { return this._pContent; }
  getConsolePanel(): PanelWrapper { return this._pConsole; }

  _onFrameworkDidAppear(): void {
    this._pStickyHeader.attach(this._getSubElementId("H"));
    this._pContent.attach(this._getSubElementId("T"));
    this._pConsole.attach(this._getSubElementId("S"));
  }

  _renderFramework(): string {
    let s: string = _CPT_CHAT_VIEW_CONTENT.MAIN;
    s = s.replace("__ID_HEADER__", this._getSubElementId("H"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("T"));
    s = s.replace("__ID_CONSOLE__", this._getSubElementId("S"));
    return s;
  }
}

export class FvcChat extends FViewContentBase {
  #fHeader: FChatHeader;
  #fMessagesContent: FChatMessagesScrollContent;
  #fScrollHook: FScrollableHook;
  #fConsole: FInputConsole;
  #btnInfo: ActionButton;
  #btnMore: ActionButton;
  #msgHandler: MessageHandler | null = null;
  #target: ChatTarget | null = null;
  #seenMessageIds: Set<string> = new Set();

  constructor() {
    super();
    this.#fHeader = new FChatHeader();
    this.setChild("header", this.#fHeader);

    this.#fMessagesContent = new FChatMessagesScrollContent();
    this.#fScrollHook = new FScrollableHook(this.#fMessagesContent);
    this.setChild("messagesHook", this.#fScrollHook);

    this.#fConsole = new FInputConsole();
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
    const prevId = this.#target?.getId() ?? null;
    const nextId = target.getId() ?? null;
    if (prevId !== nextId) {
      this.#fMessagesContent.clear();
      this.#seenMessageIds.clear();
    }

    this.#target = target;
    this.#fHeader.setTarget(target);
    this.#msgHandler = GMessenger.getOrInitHandler(target);

    this.#fConsole.setEnabled(!target.isReadOnly());
    if (target.isReadOnly()) {
      if (!target.isGroup()) {
        this.#fConsole.setPlaceholder(
            R.get("PROMPT_SEND_USER_MESSAGE_REQUIREMENT"));
      } else {
        this.#fConsole.setPlaceholder("");
      }
    } else {
      this.#fConsole.setPlaceholder("Message");
    }
  }

  onConversationDeletedInConversationOptionsContentFragment(_fvcOptions: FvcConversationOptions): void {
    this._requestPopView();
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

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
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
          this.#updateChatPanel(msgData.messages,
                                { isOlder: msgData.isOlder === true });
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

  _renderOnRender(render: PanelWrapper): void {
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

    this.#fMessagesContent.setScrollProbe(
        () => this.#fScrollHook.getContentContainerScrollY());
    this.#fMessagesContent.setLoadOlderHandler(() => {
      if (this.#msgHandler) {
        this.#msgHandler.requestLoadOlderMessages();
      }
    });

    this.#fScrollHook.attachRender(pp);
    this.#fScrollHook.render();
  }

  #onPostSuccess(message: ChatMessage): void {
    this.#updateChatPanel([ message ]);
  }

  #onPostFailed(text: string, err: RemoteError): void {
    this.#fConsole.setText(text);
    this.onRemoteErrorInFragment(this, err);
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
    this.onFragmentRequestShowView(this, v, "options");
  }

  #onShowGroupInfo(groupId: string | null): void {
    if (!groupId) {
      return;
    }
    Events.triggerTopAction(T_ACTION.SHOW_GROUP_INFO, groupId);
  }

  #isNearBottom(thresholdPx: number): boolean {
    let p = this.#fScrollHook.getContentContainerPanel();
    let e = p?.getDomElement();
    if (!e) {
      return true;
    }
    let dist = e.scrollHeight - e.scrollTop - e.clientHeight;
    return dist <= thresholdPx;
  }

  #scrollMessagesToBottom(): void {
    let p = this.#fScrollHook.getContentContainerPanel();
    if (p) {
      p.scrollToBottom();
    }
  }

  #updateChatPanel(messages: ChatMessage[],
                    options: { isOlder?: boolean } = {}): void {
    if (!this.#target) {
      return;
    }

    const isOlder = options.isOlder === true;
    const filtered: ChatMessage[] = [];
    for (let m of messages) {
      let id = m.getId();
      if (id) {
        if (this.#seenMessageIds.has(id)) {
          continue;
        }
        this.#seenMessageIds.add(id);
      }
      filtered.push(m);
    }
    if (!filtered.length) {
      return;
    }

    if (isOlder) {
      this.#fMessagesContent.onContentTopResizeBeginInFragment(
          this.#fMessagesContent);
      let frags: FChatMessage[] = [];
      for (let m of filtered) {
        let f = new FChatMessage();
        f.setMessage(m);
        f.setTarget(this.#target);
        frags.push(f);
      }
      this.#fMessagesContent.prependFragments(frags);
    } else {
      for (let m of filtered) {
        let f = new FChatMessage();
        f.setMessage(m);
        f.setTarget(this.#target);
        this.#fMessagesContent.append(f);
      }
    }

    this.#fMessagesContent.render();

    if (isOlder) {
      this.#fMessagesContent.onContentTopResizeEndInFragment(
          this.#fMessagesContent);
    }

    const accountId = Account.getId();
    const isOwn =
        accountId != null &&
        filtered.some(m => m.getFromUserId() === accountId);
    const near = this.#isNearBottom(NEAR_BOTTOM_PX);
    const shouldStick = !isOlder && (near || isOwn);
    if (shouldStick) {
      requestAnimationFrame(() => this.#scrollMessagesToBottom());
    }
  }
}
