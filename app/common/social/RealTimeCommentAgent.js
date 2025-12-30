import Controller from '../../lib/ext/Controller.js';
import { Signal } from '../dba/Signal.js';
import { api } from '../plt/Api.js';
import { RealTimeComment } from '../datatypes/RealTimeComment.js';
import { BufferedList } from '../datatypes/BufferedList.js';

export class RealTimeCommentAgent extends Controller {
  #threadId = null;
  #threadIdType = null;
  #commentBuffer = null;
  #lastReadershipUpdatedId = null;

  getThreadId() { return this.#threadId; }

  activate() {
    if (this.#threadId) {
      Signal.subscribe(C.CHANNEL.COMMENT, this.#threadId,
                           m => this.#asyncLoad());
    }
  }
  deactivate() { Signal.unsubscribe(C.CHANNEL.COMMENT); }

  getComments() {
    if (this.#commentBuffer) {
      return this.#commentBuffer.getObjects();
    } else {
      this.#asyncLoad();
      return [];
    }
  }

  setThreadId(threadId, type) {
    if (this.#threadId != threadId) {
      this.#threadId = threadId;
      this.#threadIdType = type;
      this.#commentBuffer = null;
    }
  }

  asyncPost(message, guestName = null) {
    let url = "api/social/comment";
    let fd = new FormData();
    fd.append("item_id", this.#threadId);
    fd.append("item_type", this.#threadIdType);
    fd.append("content", message);
    if (guestName) {
      fd.append("guest_name", guestName);
    }
    api.asyncRawPost(url, fd, r => this.#onPostRRR(r, message));
  }

  asyncKeep(commentId) {
    let url = "api/social/keep_guest_comment";
    let fd = new FormData();
    fd.append("item_id", this.#threadId);
    fd.append("item_type", this.#threadIdType);
    fd.append("comment_id", commentId);
    api.asyncRawPost(url, fd, r => this.#onKeepRRR(r));
  }

  asyncDiscard(commentId) {
    let url = "api/social/discard_guest_comment";
    let fd = new FormData();
    fd.append("item_id", this.#threadId);
    fd.append("item_type", this.#threadIdType);
    fd.append("comment_id", commentId);
    api.asyncRawPost(url, fd, r => this.#onDiscardRRR(r));
  }

  updateReadership(isAdmin) {
    if (!this.#commentBuffer) {
      return;
    }
    let commentId = null;
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

  #asyncUpdateReadership(untilCommentId) {
    let url = "api/messenger/mark_comment_readership";
    let fd = new FormData();
    fd.append("target_id", this.#threadId);
    fd.append("comment_id", untilCommentId);
    api.asyncRawPost(url, fd);
  }

  #onKeepRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this._delegate.onRemoteErrorInRealTimeCommentAgent(this, response.error);
    } else {
      this.#asyncLoad();
    }
  }

  #onDiscardRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this._delegate.onRemoteErrorInRealTimeCommentAgent(this, response.error);
    } else {
      this.#asyncLoad();
    }
  }

  #onPostRRR(responseText, message) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this._delegate.onPostFailedInRealTimeCommentAgent(this, message,
                                                        response.error);
    } else {
      this._delegate.onCommentPostedInRealTimeCommentAgent(this);
      this.#asyncLoad();
    }
  }

  #asyncLoad() {
    if (!this.#threadId) {
      return;
    }
    let url = "api/messenger/comments";
    let fd = new FormData();
    fd.append("target_id", this.#threadId);
    fd.append("target_type", this.#threadIdType);
    api.asyncRawPost(url, fd, r => this.#onLoadRRR(r, this.#threadId));
  }

  #onLoadRRR(responseText, threadId) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this._delegate.onRemoteErrorInRealTimeCommentAgent(this, response.error);
    } else {
      if (this.#threadId == threadId) {
        let comments = [];
        for (let m of response.data.messages) {
          comments.push(new RealTimeComment(m));
        }
        this.#commentBuffer = new BufferedList();
        this.#commentBuffer.extend(comments);
        this._delegate.onCommentsLoadedInRealTimeCommentAgent(this);
      }
    }
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.socl = window.socl || {};
  window.socl.RealTimeCommentAgent = RealTimeCommentAgent;
}
