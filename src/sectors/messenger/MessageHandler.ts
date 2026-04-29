import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { BufferedList } from '../../common/datatypes/BufferedList.js';
import { ChatMessage } from '../../common/datatypes/ChatMessage.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import Controller from '../../lib/ext/Controller.js';
import { Api } from '../../common/plt/Api.js';
import { Account } from '../../common/dba/Account.js';
import { MessageData } from '../../types/backend2.js';
import { RemoteError } from '../../types/basic.js';

interface ApiResponse {
  error?: RemoteError;
  data?: {
    messages: MessageData[];
  };
}

/** Synthetic ids for P2P-only rows; excluded from pull/read cursors */
export const P2P_LOCAL_ID_PREFIX = 'p2p:' as const;

export class MessageHandler extends Controller {
  protected _target: ChatTarget;
  protected _messageBuffer: BufferedList<ChatMessage>;
  #loadingOlder: boolean = false;
  #hasMoreOlder: boolean = true;

  constructor() {
    super();
    this._target = new ChatTarget();
    this._messageBuffer = new BufferedList<ChatMessage>();
  }

  getTarget(): ChatTarget { return this._target; }

  setTarget(target: ChatTarget): void { this._target = target; }

  activate(): void { this.#asyncGetRelatedMessages(); }

  deactivate(): void {}

  /** Pull-to-refresh at top of thread: load messages older than the buffer (requires `before_id` on `/api/messenger/messages`). */
  requestLoadOlderMessages(): void {
    if (this.#loadingOlder || !this.#hasMoreOlder) {
      return;
    }
    const id = this._target.getId();
    if (!id) {
      return;
    }
    const idType = this._target.getIdType();
    if (!idType) {
      return;
    }
    const oldest = this.getOldestServerMessageId();
    if (!oldest) {
      return;
    }
    this.#loadingOlder = true;
    let url = "/api/messenger/messages";
    let fd = new FormData();
    fd.append("target_id", id);
    fd.append("target_type", idType);
    fd.append("before_id", oldest);
    if (this._target.isGroup()) {
      fd.append("is_group", "1");
    }
    Api.asyncRawPost(url, fd, r => this.#onPullOlderRRR(r), null, null);
  }

  onUserInboxSignal(_message: unknown): void {}

  asyncPost(data: string, onSuccess: (m: ChatMessage) => void, onFail: (err: RemoteError) => void): void {
    this.routeOutgoingMessage(data, onSuccess, onFail);
  }

  /** Override in `PeerMessageHandler` to send over WebRTC when the DataChannel is open. */
  protected routeOutgoingMessage(data: string, onSuccess: (m: ChatMessage) => void, onFail: (err: RemoteError) => void): void {
    this.#asyncPost(data, onSuccess, onFail);
  }

  /**
   * Latest persisted message id for `pull_message` / readership.
   * Synthetic `p2p:*` ids from WebRTC must not be sent as API cursors.
   */
  protected getLatestServerMessageId(): string | null {
    const objs = this._messageBuffer.getObjects();
    for (let i = objs.length - 1; i >= 0; i--) {
      const id = objs[i].getId();
      if (id && !id.startsWith(P2P_LOCAL_ID_PREFIX)) {
        return id;
      }
    }
    return null;
  }

  /** Oldest server-backed row id for `before_id` pagination (skips `p2p:*`). */
  protected getOldestServerMessageId(): string | null {
    for (const obj of this._messageBuffer.getObjects()) {
      const id = obj.getId();
      if (id && !id.startsWith(P2P_LOCAL_ID_PREFIX)) {
        return id;
      }
    }
    return null;
  }

  asyncPostFile(_file: File, _onSuccess: (m: ChatMessage) => void, _onFail: (err: string) => void): void {
    this.#asyncPostFile(_file, _onSuccess, _onFail);
  }

  protected _asyncPullMessages(): void {
    const id = this._target.getId();
    if (!id) {
      return;
    }
    let url = "api/messenger/pull_message";
    let fd = new FormData();
    fd.append("id", id);
    const latestId = this.getLatestServerMessageId();
    if (latestId) {
      fd.append("from_id", latestId);
    }
    if (this._target.isGroup()) {
      fd.append("is_group", "1");
    }
    Api.asyncRawPost(url, fd, r => this.#onPullRRR(r), null, null);
  }

  #createMessage(data: string): ChatMessage {
    let m: MessageData = {
      id: "",
      from_user_id: Account.getId()!,
      to_user_id: null,
      in_group_id: null,
      data: data,
      type: ChatMessage.T_TYPE.TEXT,
      created_at: 0,
    };
    if (this._target.isGroup()) {
      m.in_group_id = this._target.getId();
      m.to_user_id = null;
    } else {
      m.in_group_id = null;
      m.to_user_id = this._target.getId();
    }
    return new ChatMessage(m);
  }

  #asyncPost(data: string, onSuccess: (m: ChatMessage) => void, onFail: (err: RemoteError) => void): void {
    const id = this._target.getId();
    if (!id) {
      return;
    }
    let url = "/api/messenger/post_message";
    let fd = new FormData();
    fd.append("to", id);
    if (this._target.isGroup()) {
      fd.append("is_group", "1");
    }
    fd.append("data", data);
    Api.asyncRawPost(url, fd,
                     r => this.#onPostRRR(r, data, onSuccess, onFail), null, null);
  }

  #asyncPostFile(_file: File, _onSuccess: (m: ChatMessage) => void, _onFail: (err: string) => void): void {
    // let url = "/api/messenger/post_message";
    // let data = "{\"to\": \"" + this._target.getId() + "\"}";
    // api.asyncRawPost(url, data);
  }

  #asyncGetRelatedMessages(): void {
    const id = this._target.getId();
    if (!id) {
      return;
    }
    const idType = this._target.getIdType();
    if (!idType) {
      return;
    }
    this._messageBuffer.clear();
    this.#hasMoreOlder = true;
    let url = "/api/messenger/messages";
    let fd = new FormData();
    fd.append("target_id", id);
    fd.append("target_type", idType);
    Api.asyncRawPost(url, fd, r => this.#onPullRRR(r), null, null);
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

  #onPostRRR(responseText: string, data: string, onSuccess: (m: ChatMessage) => void, onFail: (err: RemoteError) => void): void {
    let response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      onFail(response.error);
    } else {
      let m = this.#createMessage(data);
      onSuccess(m);
    }
  }

  #onPullRRR(responseText: string): void {
    let response = JSON.parse(responseText) as ApiResponse;
    if (!response.error && response.data) {
      let messages: ChatMessage[] = [];
      for (let m of response.data.messages) {
        messages.push(new ChatMessage(m));
      }
      messages = this._messageBuffer.extend(messages);
      if (messages.length > 0) {
        Events.trigger(T_DATA.MESSAGES,
                           {"target" : this._target, "messages" : messages});
        this.#asyncUpdateReadership(this.getLatestServerMessageId());
      }
    }
  }

  #onPullOlderRRR(responseText: string): void {
    this.#loadingOlder = false;
    let response = JSON.parse(responseText) as ApiResponse;
    if (response.error || !response.data) {
      return;
    }
    const raw = response.data.messages;
    if (!raw.length) {
      this.#hasMoreOlder = false;
      return;
    }
    let messages: ChatMessage[] = [];
    for (let m of raw) {
      messages.push(new ChatMessage(m));
    }
    const prepended = this._messageBuffer.prependOlder(messages);
    if (prepended.length === 0) {
      this.#hasMoreOlder = false;
      return;
    }
    Events.trigger(
        T_DATA.MESSAGES,
        {"target" : this._target, "messages" : prepended, "isOlder" : true});
  }
}
