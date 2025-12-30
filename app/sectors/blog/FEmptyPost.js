
class FEmptyPost extends blog.FPostBase {
  #post = null;

  setPost(post) { this.#post = post; }

  _renderOnRender(postPanel) {
    let p = postPanel.getContentPanel();
    if (!p) {
      p = postPanel.getTitlePanel();
    }
    this.#renderContent(p, this.#post);
  }

  #renderContent(panel, post) {
    if (!panel) {
      return;
    }
    let c = post ? post.getErrorCode() : null;
    let s;
    switch (c) {
    case dat.EmptyPost.TYPE.DELETED:
      s = "Sorry, this post was deleted.";
      break;
    case dat.EmptyPost.TYPE.PERMISSION:
      s = "Sorry, this post is permission protected.";
      break;
    default:
      s = "Sorry, this post does not exist.";
      break;
    }
    panel.setClassName("info-message-light");
    panel.replaceContent(s);
  }
};

blog.FEmptyPost = FEmptyPost;
}(window.blog = window.blog || {}));
