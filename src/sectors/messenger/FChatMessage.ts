export const CF_CHAT_MESSAGE = {
  GROUP_INFO : "CF_CHAT_MESSAGE_1",
  USER_INFO : "CF_CHAT_MESSAGE_2",
} as const;

// Export to window for HTML string templates
declare global {
  interface Window {
    CF_CHAT_MESSAGE?: typeof CF_CHAT_MESSAGE;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_CHAT_MESSAGE = CF_CHAT_MESSAGE;
}

const _CFT_CHAT_MESSAGE = {
  SENDER_MAIN : `<div class="flex flex-start">
    <div class="msg-sender-icon">__SENDER__</div>
    <div>__MSG__</div>
  </div>`,
  OWNER_MAIN : `<div class="owner-message right-align">
    <span class="chat-message-text">__TEXT__</span>
  </div>`,
  GROUP_MSG_BODY : `<div>
    <div class="s-font7">__FROM_USER_NAME__</div>
    <div>__TEXT__</div>
  </div>`,
  TEXT : `<span class="chat-message-text">__TEXT__</span>`,
  FROM_USER :
      `<span class="user-info-icon-small" onclick="javascript:G.action(CF_CHAT_MESSAGE.USER_INFO, '__ID__')">
    <img src="__ICON__">
  </span>`,
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ChatMessage } from '../../common/datatypes/ChatMessage.js';
import { T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { Users } from '../../common/dba/Users.js';
import { Groups } from '../../common/dba/Groups.js';
import { Utilities } from '../../common/Utilities.js';
import type { User } from '../../common/datatypes/User.js';
import type { ChatTarget } from '../../common/datatypes/ChatTarget.js';

export class FChatMessage extends Fragment {
  protected _message: ChatMessage | null = null;
  protected _target: ChatTarget | null = null;

  constructor() {
    super();
  }

  setMessage(m: ChatMessage): void { this._message = m; }
  setTarget(t: ChatTarget): void { this._target = t; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_CHAT_MESSAGE.GROUP_INFO:
      this.#onShowGroupInfo(args[0] as string);
      break;
    case CF_CHAT_MESSAGE.USER_INFO:
      this.#onShowUserInfo(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContent(): string {
    if (!this._message || !this._target) {
      return "";
    }

    if (this._message.getFromUserId() == window.dba.Account.getId()) {
      return this.#renderOwnerMessage();
    } else {
      return this.#renderSenderMessage();
    }
  }

  #renderSenderMessage(): string {
    if (!this._message || !this._target) {
      return "";
    }

    let fromUser = Users.get(this._message.getFromUserId());
    let s = _CFT_CHAT_MESSAGE.SENDER_MAIN;
    if (fromUser) {
      s = s.replace("__SENDER__", this.#renderUserLink(fromUser));
    } else {
      s = s.replace("__SENDER__", "...");
    }

    if (this._target.isGroup()) {
      s = s.replace("__MSG__",
                    this.#renderMessageContentWithUserName(this._message));
    } else {
      s = s.replace("__MSG__", this.#renderMessageContent(this._message));
    }
    return s;
  }

  #renderOwnerMessage(): string {
    if (!this._message) {
      return "";
    }

    let s = _CFT_CHAT_MESSAGE.OWNER_MAIN;
    s = s.replace("__TEXT__", this.#makeMessageContent(this._message));
    return s;
  }

  #renderMessageContentWithUserName(message: ChatMessage): string {
    let s = _CFT_CHAT_MESSAGE.GROUP_MSG_BODY;
    s = s.replace("__FROM_USER_NAME__",
                  window.dba.Account.getUserNickname(message.getFromUserId()));
    s = s.replace("__TEXT__", this.#renderMessageContent(message));
    return s;
  }

  #renderMessageContent(message: ChatMessage): string {
    let s = this.#makeMessageContent(message);
    return _CFT_CHAT_MESSAGE.TEXT.replace("__TEXT__", s);
  }

  #makeMessageContent(message: ChatMessage): string {
    let s = "";
    switch (message.getType()) {
    case ChatMessage.T_TYPE.FMT:
      s = this.#renderFormattedMsg(message.getData() as { id: string; data: Record<string, unknown> });
      break;
    default:
      s = String(message.getData());
      break;
    }
    return s;
  }

  #renderFormattedMsg(msg: { id: string; data: Record<string, unknown> }): string {
    let s = "";
    let t = ChatMessage.T_FMT_TEMPLATES[msg.id];
    switch (msg.id) {
    case ChatMessage.T_FMT.REQUEST_ACCEPT:
      s = t.replace("__NAME__", this.#renderGroupLink(String(msg.data.GROUP_ID)));
      break;
    case ChatMessage.T_FMT.REQUEST_DECLINE:
      s = t.replace("__NAME__", this.#getGroupName(String(msg.data.GROUP_ID)));
      break;
    case ChatMessage.T_FMT.NEW_GROUP_MEMBER:
      s = t.replace("__NAME__", String(msg.data.MEMBER_ID));
      break;
    default:
      s = "Unknown message";
      break;
    }
    return s;
  }

  #getGroupName(groupId: string): string {
    let g = Groups.get(groupId);
    if (g) {
      return g.getName();
    }
    return "...";
  }

  #renderGroupLink(groupId: string): string {
    let g = Groups.get(groupId);
    let name = "...";
    if (g) {
      name = g.getName();
    }
    return Utilities.renderSmallButton("CF_CHAT_MESSAGE.GROUP_INFO", groupId,
                                       name);
  }

  #renderUserLink(user: User): string {
    let s = _CFT_CHAT_MESSAGE.FROM_USER;
    s = s.replace("__ID__", user.getId());
    s = s.replace("__ICON__", user.getIconUrl());
    return s;
  }

  #onShowGroupInfo(groupId: string): void {
    Events.triggerTopAction(T_ACTION.SHOW_GROUP_INFO, groupId);
  }

  #onShowUserInfo(userId: string): void {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }
}
