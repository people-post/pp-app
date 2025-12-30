
export class MessageHandler extends ext.Controller {
  constructor() {
    super();
    this._target = new dat.ChatTarget();
    this._messageBuffer = new dat.BufferedList();
  }

  getTarget() { return this._target; }

  setTarget(target) { this._target = target; }

  activate() { this.#asyncGetRelatedMessages() }

  deactivate() {}

  onUserInboxSignal(message) {}

  asyncPost(data, onSuccess, onFail) {
    this.#asyncPost(data, onSuccess, onFail);
  }

  asyncPostFile(file, onSuccess, onFail) {
    this.#asyncPostFile(file, onSuccess, onFail);
  }

  _asyncPullMessages() {
    let url = "api/messenger/pull_message";
    let fd = new FormData();
    fd.append("id", this._target.getId());
    if (this._messageBuffer.getLatestObjectId()) {
      fd.append("from_id", this._messageBuffer.getLatestObjectId());
    }
    if (this._target.isGroup()) {
      fd.append("is_group", "1");
    }
    plt.Api.asyncRawPost(url, fd, r => this.#onPullRRR(r));
  }

  #createMessage(data) {
    let m = new Object();
    m.from_user_id = dba.Account.getId();
    if (this._target.isGroup()) {
      m.in_group_id = this._target.getId();
      m.to_user_id = null;
    } else {
      m.in_group_id = null;
      m.to_user_id = this._target.getId();
    }
    m.type = dat.ChatMessage.T_TYPE.TEXT;
    m.data = data;
    return new dat.ChatMessage(m);
  }

  #asyncPost(data, onSuccess, onFail) {
    let url = "/api/messenger/post_message";
    let fd = new FormData();
    fd.append("to", this._target.getId());
    if (this._target.isGroup()) {
      fd.append("is_group", 1);
    }
    fd.append("data", data);
    plt.Api.asyncRawPost(url, fd,
                      r => this.#onPostRRR(r, data, onSuccess, onFail));
  }

  #asyncPostFile(file, onSuccess, onFail) {
    let url = "/api/messenger/post_message";
    let data = "{\"to\": \"" + this._target.getId() + "\"}";
    // plt.Api.asyncRawPost(url, data);
  }

  #asyncGetRelatedMessages() {
    let url = "/api/messenger/messages";
    let fd = new FormData();
    fd.append("target_id", this._target.getId());
    fd.append("target_type", this._target.getIdType());
    plt.Api.asyncRawPost(url, fd, r => this.#onPullRRR(r));
  }

  #asyncUpdateReadership(untilMessageId) {
    let url =
        "/api/messenger/mark_message_readership?id=" + this._target.getId() +
        "&until_id=" + untilMessageId;
    if (this._target.isGroup()) {
      url += "&is_group=1"
    }
    plt.Api.asyncRawCall(url);
  }

  #onPostRRR(responseText, data, onSuccess, onFail) {
    let response = JSON.parse(responseText);
    if (response.error) {
      onFail(response.error);
    } else {
      let m = this.#createMessage(data);
      onSuccess(m);
    }
  }

  #onPullRRR(responseText) {
    let response = JSON.parse(responseText);
    if (!response.error) {
      let messages = [];
      for (let m of response.data.messages) {
        messages.push(new dat.ChatMessage(m));
      }
      messages = this._messageBuffer.extend(messages);
      if (messages.length > 0) {
        fwk.Events.trigger(plt.T_DATA.MESSAGES,
                           {"target" : this._target, "messages" : messages});
        this.#asyncUpdateReadership(this._messageBuffer.getLatestObjectId());
      }
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.MessageHandler = MessageHandler;
}
