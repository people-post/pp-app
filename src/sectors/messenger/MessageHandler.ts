import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { BufferedList } from '../../common/datatypes/BufferedList.js';
import { ChatMessage } from '../../common/datatypes/ChatMessage.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import Controller from '../../lib/ext/Controller.js';
import { Api } from '../../common/plt/Api.js';

export class MessageHandler extends Controller {
  protected _target: ChatTarget;
  protected _messageBuffer: BufferedList;

  constructor() {
    super();
    this._target = new ChatTarget();
    this._messageBuffer = new BufferedList();
  }

  getTarget(): ChatTarget { return this._target; }

  setTarget(target: ChatTarget): void { this._target = target; }

  activate(): void { this.#asyncGetRelatedMessages(); }

  deactivate(): void {}

  onUserInboxSignal(_message: unknown): void {}

  asyncPost(data: string, onSuccess: (m: ChatMessage) => void, onFail: (err: string) => void): void {
    this.#asyncPost(data, onSuccess, onFail);
  }

  asyncPostFile(_file: File, _onSuccess: (m: ChatMessage) => void, _onFail: (err: string) => void): void {
    this.#asyncPostFile(_file, _onSuccess, _onFail);
  }

  protected _asyncPullMessages(): void {
    let url = "api/messenger/pull_message";
    let fd = new FormData();
    fd.append("id", this._target.getId());
    if (this._messageBuffer.getLatestObjectId()) {
      fd.append("from_id", this._messageBuffer.getLatestObjectId());
    }
    if (this._target.isGroup()) {
      fd.append("is_group", "1");
    }
    Api.asyncRawPost(url, fd, r => this.#onPullRRR(r));
  }

  #createMessage(data: string): ChatMessage {
    let m: Record<string, unknown> = {};
    m.from_user_id = window.dba.Account.getId();
    if (this._target.isGroup()) {
      m.in_group_id = this._target.getId();
      m.to_user_id = null;
    } else {
      m.in_group_id = null;
      m.to_user_id = this._target.getId();
    }
    m.type = ChatMessage.T_TYPE.TEXT;
    m.data = data;
    return new ChatMessage(m);
  }

  #asyncPost(data: string, onSuccess: (m: ChatMessage) => void, onFail: (err: string) => void): void {
    let url = "/api/messenger/post_message";
    let fd = new FormData();
    fd.append("to", this._target.getId());
    if (this._target.isGroup()) {
      fd.append("is_group", "1");
    }
    fd.append("data", data);
    Api.asyncRawPost(url, fd,
                     r => this.#onPostRRR(r, data, onSuccess, onFail));
  }

  #asyncPostFile(_file: File, _onSuccess: (m: ChatMessage) => void, _onFail: (err: string) => void): void {
    // let url = "/api/messenger/post_message";
    // let data = "{\"to\": \"" + this._target.getId() + "\"}";
    // api.asyncRawPost(url, data);
  }

  #asyncGetRelatedMessages(): void {
    let url = "/api/messenger/messages";
    let fd = new FormData();
    fd.append("target_id", this._target.getId());
    fd.append("target_type", this._target.getIdType());
    Api.asyncRawPost(url, fd, r => this.#onPullRRR(r));
  }

  #asyncUpdateReadership(untilMessageId: string | null): void {
    let url =
        "/api/messenger/mark_message_readership?id=" + this._target.getId() +
        "&until_id=" + untilMessageId;
    if (this._target.isGroup()) {
      url += "&is_group=1";
    }
    Api.asyncRawCall(url);
  }

  #onPostRRR(responseText: string, data: string, onSuccess: (m: ChatMessage) => void, onFail: (err: string) => void): void {
    let response = JSON.parse(responseText) as { error?: string };
    if (response.error) {
      onFail(response.error);
    } else {
      let m = this.#createMessage(data);
      onSuccess(m);
    }
  }

  #onPullRRR(responseText: string): void {
    let response = JSON.parse(responseText) as { error?: string; data?: { messages: unknown[] } };
    if (!response.error && response.data) {
      let messages: ChatMessage[] = [];
      for (let m of response.data.messages) {
        messages.push(new ChatMessage(m));
      }
      messages = this._messageBuffer.extend(messages);
      if (messages.length > 0) {
        Events.trigger(T_DATA.MESSAGES,
                           {"target" : this._target, "messages" : messages});
        this.#asyncUpdateReadership(this._messageBuffer.getLatestObjectId());
      }
    }
  }
}
