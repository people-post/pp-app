import { EmptyPost } from '../../common/datatypes/EmptyPost.js';
import { FPostBase } from './FPostBase.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FEmptyPost extends FPostBase {
  #post: EmptyPost | null = null;

  setPost(post: EmptyPost | null): void { this.#post = post; }

  _renderOnRender(postPanel: Panel): void {
    let p = postPanel.getContentPanel();
    if (!p) {
      p = postPanel.getTitlePanel();
    }
    this.#renderContent(p, this.#post);
  }

  #renderContent(panel: Panel | null, post: EmptyPost | null): void {
    if (!panel) {
      return;
    }
    let c = post ? post.getErrorCode() : null;
    let s: string;
    switch (c) {
    case EmptyPost.TYPE.DELETED:
      s = "Sorry, this post was deleted.";
      break;
    case EmptyPost.TYPE.PERMISSION:
      s = "Sorry, this post is permission protected.";
      break;
    default:
      s = "Sorry, this post does not exist.";
      break;
    }
    panel.setClassName("info-message-light");
    panel.replaceContent(s);
  }
}
