
window.CF_CHAT_MESSAGE = {
  GROUP_INFO : "CF_CHAT_MESSAGE_1",
  USER_INFO : "CF_CHAT_MESSAGE_2",
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
}

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ChatMessage } from '../../common/datatypes/ChatMessage.js';
import { T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';

export class FChatMessage extends Fragment {
  constructor() {
    super();
    this._message = null;
    this._target = null;
  }

  setMessage(m) { this._message = m; }
  setTarget(t) { this._target = t; }

  action(type, ...args) {
    switch (type) {
    case CF_CHAT_MESSAGE.GROUP_INFO:
      this.#onShowGroupInfo(args[0]);
      break;
    case CF_CHAT_MESSAGE.USER_INFO:
      this.#onShowUserInfo(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContent() {
    if (this._message.getFromUserId() == dba.Account.getId()) {
      return this.#renderOwnerMessage();
    } else {
      return this.#renderSenderMessage();
    }
  }

  #renderSenderMessage() {
    let fromUser = dba.Users.get(this._message.getFromUserId());
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

  #renderOwnerMessage() {
    let s = _CFT_CHAT_MESSAGE.OWNER_MAIN;
    s = s.replace("__TEXT__", this.#makeMessageContent(this._message));
    return s;
  }

  #renderMessageContentWithUserName(message) {
    let s = _CFT_CHAT_MESSAGE.GROUP_MSG_BODY;
    s = s.replace("__FROM_USER_NAME__",
                  dba.Account.getUserNickname(message.getFromUserId()));
    s = s.replace("__TEXT__", this.#renderMessageContent(message));
    return s;
  }

  #renderMessageContent(message) {
    let s = this.#makeMessageContent(message);
    return _CFT_CHAT_MESSAGE.TEXT.replace("__TEXT__", s);
  }

  #makeMessageContent(message) {
    let s = "";
    switch (message.getType()) {
    case ChatMessage.T_TYPE.FMT:
      s = this.#renderFormattedMsg(message.getData());
      break;
    default:
      s = message.getData();
      break;
    }
    return s;
  }

  #renderFormattedMsg(msg) {
    let s = "";
    let t = ChatMessage.T_FMT_TEMPLATES[msg.id];
    switch (msg.id) {
    case ChatMessage.T_FMT.REQUEST_ACCEPT:
      s = t.replace("__NAME__", this.#renderGroupLink(msg.data.GROUP_ID));
      break;
    case ChatMessage.T_FMT.REQUEST_DECLINE:
      s = t.replace("__NAME__", this.#getGroupName(msg.data.GROUP_ID));
      break;
    case ChatMessage.T_FMT.NEW_GROUP_MEMBER:
      s = t.replace("__NAME__", msg.data.MEMBER_ID);
      break;
    default:
      s = "Unknown message";
      break;
    }
    return s;
  }

  #getGroupName(groupId) {
    let g = dba.Groups.get(groupId);
    if (g) {
      return g.getName();
    }
    return "...";
  }

  #renderGroupLink(groupId) {
    let g = dba.Groups.get(groupId);
    let name = "...";
    if (g) {
      name = g.getName();
    }
    return Utilities.renderSmallButton("CF_CHAT_MESSAGE.GROUP_INFO", groupId,
                                       name);
  }

  #renderUserLink(user) {
    let s = _CFT_CHAT_MESSAGE.FROM_USER;
    s = s.replace("__ID__", user.getId());
    s = s.replace("__ICON__", user.getIconUrl());
    return s;
  }

  #onShowGroupInfo(groupId) {
    Events.triggerTopAction(T_ACTION.SHOW_GROUP_INFO, groupId);
  }

  #onShowUserInfo(userId) {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.FChatMessage = FChatMessage;
}
