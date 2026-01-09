import Controller from '../../lib/ext/Controller.js';
import { Signal } from '../dba/Signal.js';
import { RealTimeComment } from '../datatypes/RealTimeComment.js';
import { BufferedList } from '../datatypes/BufferedList.js';
import { CHANNEL } from '../constants/Constants.js';
import { Api } from '../plt/Api.js';

export class RealTimeCommentAgent extends Controller {
  #threadId: string | null = null;
  #threadIdType: string | null = null;
  #commentBuffer: BufferedList<RealTimeComment> | null = null;
  #lastReadershipUpdatedId: string | null = null;

  getThreadId(): string | null { return this.#threadId; }

  activate(): void {
    if (this.#threadId) {
      Signal.subscribe(CHANNEL.COMMENT, this.#threadId,
                           (_m: unknown) => this.#asyncLoad());
    }
  }
  deactivate(): void { Signal.unsubscribe(CHANNEL.COMMENT); }

  getComments(): RealTimeComment[] {
    if (this.#commentBuffer) {
      return this.#commentBuffer.getObjects();
    } else {
      this.#asyncLoad();
      return [];
    }
  }

  setThreadId(threadId: string, type: string): void {
    if (this.#threadId != threadId) {
      this.#threadId = threadId;
      this.#threadIdType = type;
      this.#commentBuffer = null;
    }
  }

  asyncPost(message: string, guestName: string | null = null): void {
    let url = "api/social/comment";
    let fd = new FormData();
    if (!this.#threadId || !this.#threadIdType) return;
    fd.append("item_id", this.#threadId);
    fd.append("item_type", this.#threadIdType);
    fd.append("content", message);
    if (guestName) {
      fd.append("guest_name", guestName);
    }
    Api.asyncRawPost(url, fd, (r: string) => this.#onPostRRR(r, message));
  }

  asyncKeep(commentId: string): void {
    let url = "api/social/keep_guest_comment";
    let fd = new FormData();
    if (!this.#threadId || !this.#threadIdType) return;
    fd.append("item_id", this.#threadId);
    fd.append("item_type", this.#threadIdType);
    fd.append("comment_id", commentId);
    Api.asyncRawPost(url, fd, (r: string) => this.#onKeepRRR(r));
  }

  asyncDiscard(commentId: string): void {
    let url = "api/social/discard_guest_comment";
    let fd = new FormData();
    if (!this.#threadId || !this.#threadIdType) return;
    fd.append("item_id", this.#threadId);
    fd.append("item_type", this.#threadIdType);
    fd.append("comment_id", commentId);
    Api.asyncRawPost(url, fd, (r: string) => this.#onDiscardRRR(r));
  }

  updateReadership(isAdmin: boolean): void {
    if (!this.#commentBuffer) {
      return;
    }
    let commentId: string | null = null;
    if (isAdmin) {
      let comments =
          this.#commentBuffer.getObjects().filter(c => !c.isPending());
      if (comments.length) {
        commentId = comments[comments.length - 1].getId();
      }
    } else {
      commentId = this.#commentBuffer.getLatestObjectId();
    }

    if (commentId && commentId != this.#lastReadershipUpdatedId) {
      this.#asyncUpdateReadership(commentId);
      this.#lastReadershipUpdatedId = commentId;
    }
  }

  #asyncUpdateReadership(untilCommentId: string): void {
    let url = "api/messenger/mark_comment_readership";
    let fd = new FormData();
    if (!this.#threadId) return;
    fd.append("target_id", this.#threadId);
    fd.append("comment_id", untilCommentId);
    Api.asyncRawPost(url, fd);
  }

  #onKeepRRR(responseText: string): void {
    let response = JSON.parse(responseText) as { error?: unknown };
    if (response.error) {
      // @ts-expect-error - delegate may have this method
      this._delegate?.onRemoteErrorInRealTimeCommentAgent?.(this, response.error);
    } else {
      this.#asyncLoad();
    }
  }

  #onDiscardRRR(responseText: string): void {
    let response = JSON.parse(responseText) as { error?: unknown };
    if (response.error) {
      // @ts-expect-error - delegate may have this method
      this._delegate?.onRemoteErrorInRealTimeCommentAgent?.(this, response.error);
    } else {
      this.#asyncLoad();
    }
  }

  #onPostRRR(responseText: string, message: string): void {
    let response = JSON.parse(responseText) as { error?: unknown };
    if (response.error) {
      // @ts-expect-error - delegate may have this method
      this._delegate?.onPostFailedInRealTimeCommentAgent?.(this, message, response.error);
    } else {
      // @ts-expect-error - delegate may have this method
      this._delegate?.onCommentPostedInRealTimeCommentAgent?.(this);
      this.#asyncLoad();
    }
  }

  #asyncLoad(): void {
    if (!this.#threadId || !this.#threadIdType) {
      return;
    }
    let url = "api/messenger/comments";
    let fd = new FormData();
    fd.append("target_id", this.#threadId);
    fd.append("target_type", this.#threadIdType);
    Api.asyncRawPost(url, fd, (r: string) => this.#onLoadRRR(r, this.#threadId!));
  }

  #onLoadRRR(responseText: string, threadId: string): void {
    let response = JSON.parse(responseText) as { error?: unknown; data?: { messages: unknown[] } };
    if (response.error) {
      // @ts-expect-error - delegate may have this method
      this._delegate?.onRemoteErrorInRealTimeCommentAgent?.(this, response.error);
    } else {
      if (this.#threadId == threadId) {
        let comments: RealTimeComment[] = [];
        for (let m of response.data?.messages || []) {
          comments.push(new RealTimeComment(m));
        }
        this.#commentBuffer = new BufferedList();
        this.#commentBuffer.extend(comments);
        // @ts-expect-error - delegate may have this method
        this._delegate?.onCommentsLoadedInRealTimeCommentAgent?.(this);
      }
    }
  }
}

export default RealTimeCommentAgent;
