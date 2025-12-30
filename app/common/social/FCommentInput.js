import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { LContext } from '../../lib/ui/controllers/fragments/LContext.js';
import { InputConsoleFragment } from '../gui/InputConsoleFragment.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcUserInput } from '../hr/FvcUserInput.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Account } from '../dba/Account.js';
import { FHashtag } from '../gui/FHashtag.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { api } from '../plt/Api.js';

export class FCommentInput extends Fragment {
  #lc;
  #fInput;
  #tmpMessage = null;
  #threadId = null; // SocialItemId
  #hashtagIds = [];

  constructor() {
    super();
    this.#lc = new LContext();
    this.#lc.setDelegate(this);
    this.#lc.setTargetName("comment type");

    this.#fInput = new InputConsoleFragment();
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
    let p = new PanelWrapper();
    p.setClassName("comment-input-console");
    render.wrapPanel(p);
    this.#fInput.attachRender(p);
    this.#fInput.render();
  }

  #onPostMessage(message) {
    if (Account.getId()) {
      // User, ask to choose comment vs article
      this.#tmpMessage = message;
      this.#lc.clearOptions();
      this.#lc.addOption("Just comment", "COMMENT");
      this.#lc.addOption("Comment and post", "POST");
      for (let id of this.#hashtagIds) {
        let f = new FHashtag();
        f.setTagId(id);
        f.setLayoutType(FHashtag.T_LAYOUT.BUTTON_BAR);
        f.setDelegate(this);
        this.#lc.addOptionFragment(f);
      }
      Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                  "Context");
    } else {
      // Guest, ask for a name
      let v = new View();
      let fvc = new FvcUserInput();
      let f = new TextInput();
      f.setConfig({
        title : R.get("GUEST_NICKNAME_PROMPT"),
        hint : "Nickname",
        value : Account.getGuestName(),
        isRequired : true
      });
      fvc.addInputCollector(f);
      fvc.setConfig({
        fcnValidate : () => f.validate(),
        fcnOK : () => this.#postGuestComment(message, f.getValue()),
      });
      v.setContentFragment(fvc);
      Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                  "Guest comment", false);
    }
  }

  #postGuestComment(message, guestName) {
    Account.setGuestName(guestName);
    this.#asyncPostGuestComment(message, guestName);
  }

  #asyncPostGuestComment(message, guestName) {
    let url = "api/social/add_guest_comment";
    let fd = new FormData();
    fd.append("item_id", this.#threadId.getValue());
    fd.append("item_type", this.#threadId.getType());
    fd.append("content", message);
    fd.append("guest_name", guestName);
    api.asyncPost(url, fd).then(r => this.#onPostDone(r),
                                    e => this.#onPostError(e, message));
  }

  #asyncPostUserHashtagComment(message, hashtagId) {
    let url = "api/social/add_comment_article";
    let fd = new FormData();
    fd.append("item_id", hashtagId);
    fd.append("item_type", SocialItem.TYPE.HASHTAG);
    fd.append("content", message);
    api.asyncPost(url, fd).then(r => this.#onPostDone(r),
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

    // Make article out of comment text.
    let oArticle = new pp.dat.OArticle();
    oArticle.setContent(message);
    oArticle.setOwnerId(Account.getId());
    oArticle.markCreation();

    await Account.asComment(this.#threadId.getValue(), oArticle, asPost);
  }

  #asyncWeb2PostUserComment(message, asPost) {
    let url = asPost ? "api/social/add_comment_article"
                     : "api/social/add_user_comment";
    let fd = new FormData();
    fd.append("item_id", this.#threadId.getValue());
    fd.append("item_type", this.#threadId.getType());
    fd.append("content", message);
    api.asyncPost(url, fd).then(r => this.#onPostDone(r),
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

// Backward compatibility
if (typeof window !== 'undefined') {
  window.socl = window.socl || {};
  window.socl.FCommentInput = FCommentInput;
}
