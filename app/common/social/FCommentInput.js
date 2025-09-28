(function(socl) {
class FCommentInput extends ui.Fragment {
  #lc;
  #fInput;
  #tmpMessage = null;
  #threadId = null; // dat.SocialItemId
  #hashtagIds = [];

  constructor() {
    super();
    this.#lc = new ui.LContext();
    this.#lc.setDelegate(this);
    this.#lc.setTargetName("comment type");

    this.#fInput = new gui.InputConsoleFragment();
    this.#fInput.setPlaceholder("Your comments here.");
    this.#fInput.setDelegate(this);
    this.setChild("input", this.#fInput);
  }

  setThreadId(sid) { this.#threadId = sid; }
  setTargetHashtagIds(ids) { this.#hashtagIds = ids; }

  onInputConsoleRequestPostFile(file) {}
  onInputConsoleRequestPost(message) { this.#onPostMessage(message); }
  onClickInHashtagFragment(fHashtag) {
    this.#lc.dismiss();
    this.#asyncPostUserHashtagComment(this.#tmpMessage, fHashtag.getTagId());
  }

  onOptionClickedInContextLayer(lc, value) {
    switch (value) {
    case "COMMENT":
      this.#asyncPostUserComment(this.#tmpMessage);
      break;
    case "POST":
      this.#asyncPostUserComment(this.#tmpMessage, true);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ui.PanelWrapper();
    p.setClassName("comment-input-console");
    render.wrapPanel(p);
    this.#fInput.attachRender(p);
    this.#fInput.render();
  }

  #onPostMessage(message) {
    if (dba.Account.getId()) {
      // User, ask to choose comment vs article
      this.#tmpMessage = message;
      this.#lc.clearOptions();
      this.#lc.addOption("Just comment", "COMMENT");
      this.#lc.addOption("Comment and post", "POST");
      for (let id of this.#hashtagIds) {
        let f = new gui.FHashtag();
        f.setTagId(id);
        f.setLayoutType(gui.FHashtag.T_LAYOUT.BUTTON_BAR);
        f.setDelegate(this);
        this.#lc.addOptionFragment(f);
      }
      fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this.#lc,
                                  "Context");
    } else {
      // Guest, ask for a name
      let v = new ui.View();
      let fvc = new S.hr.FvcUserInput();
      let f = new ui.TextInput();
      f.setConfig({
        title : R.get("GUEST_NICKNAME_PROMPT"),
        hint : "Nickname",
        value : dba.Account.getGuestName(),
        isRequired : true
      });
      fvc.addInputCollector(f);
      fvc.setConfig({
        fcnValidate : () => f.validate(),
        fcnOK : () => this.#postGuestComment(message, f.getValue()),
      });
      v.setContentFragment(fvc);
      fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                  "Guest comment", false);
    }
  }

  #postGuestComment(message, guestName) {
    dba.Account.setGuestName(guestName);
    this.#asyncPostGuestComment(message, guestName);
  }

  #asyncPostGuestComment(message, guestName) {
    let url = "api/social/add_guest_comment";
    let fd = new FormData();
    fd.append("item_id", this.#threadId.getValue());
    fd.append("item_type", this.#threadId.getType());
    fd.append("content", message);
    fd.append("guest_name", guestName);
    plt.Api.asyncPost(url, fd).then(r => this.#onPostDone(r),
                                    e => this.#onPostError(e, message));
  }

  #asyncPostUserHashtagComment(message, hashtagId) {
    let url = "api/social/add_comment_article";
    let fd = new FormData();
    fd.append("item_id", hashtagId);
    fd.append("item_type", dat.SocialItem.TYPE.HASHTAG);
    fd.append("content", message);
    plt.Api.asyncPost(url, fd).then(r => this.#onPostDone(r),
                                    e => this.#onPostError(e, message));
  }

  #asyncPostUserComment(message, asPost = false) {
    if (glb.env.isWeb3()) {
      this.#asyncWeb3PostUserComment(this.#tmpMessage, asPost)
          .then(() => this.#onPostDone())
          .catch(e => this.#onPostError(e, this.#tmpMessage));
    } else {
      this.#asyncWeb2PostUserComment(this.#tmpMessage, asPost);
    }
  }

  async #asyncWeb3PostUserComment(message, asPost) {
    if (asPost) {
      console.log("TODO: Post user comment as post is not implemented");
      return;
    }

    // 1. Make article out of comment text.
    let data = {};
    data.title = "";
    data.content = message;
    data.owner_id = dba.Account.getId();
    data.verion = "1.0";
    data.created_at = Date.now() / 1000;

    // 2. Upload article file and get cid
    console.log("Upload article");
    data.id = await dba.Account.asUploadJson(data);

    // 3. Make comment info
    console.log("Make comment info");
    let dInfo = {type : "ARTICLE", cid : data.id};

    // 4. Post comment
    await dba.Account.asComment(this.#threadId.getValue(), dInfo, [ data.id ]);

    if (asPost) {
      // Make article info
      dInfo = {type : "ARTICLE", cid : data.id};
      await dba.Account.asPublishPost(dInfo, [ data.id ]);
    }
  }

  #asyncWeb2PostUserComment(message, asPost) {
    let url = asPost ? "api/social/add_comment_article"
                     : "api/social/add_user_comment";
    let fd = new FormData();
    fd.append("item_id", this.#threadId.getValue());
    fd.append("item_type", this.#threadId.getType());
    fd.append("content", message);
    plt.Api.asyncPost(url, fd).then(r => this.#onPostDone(r),
                                    e => this.#onPostError(e, message));
  }

  #onPostDone(data) {
    this._delegate.onCommentPostedInCommentInputFragment(this);
  }

  #onPostError(e, message) {
    this.#fInput.setText(message);
    this.onRemoteErrorInFragment(this, e);
  }
};

socl.FCommentInput = FCommentInput;
}(window.socl = window.socl || {}));
