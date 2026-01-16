import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { InputConsoleFragment } from '../gui/InputConsoleFragment.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcUserInput } from '../hr/FvcUserInput.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FHashtag } from '../gui/FHashtag.js';
import { SocialItem } from '../interface/SocialItem.js';
import { dat } from 'pp-api';
import { Env } from '../plt/Env.js';
import { Api } from '../plt/Api.js';
import { R } from '../constants/R.js';
import { Account } from '../dba/Account.js';

const { OArticle } = dat;

interface SocialItemId {
  getValue(): string;
  getType(): string;
}

export class FCommentInput extends Fragment {
  #lc: LContext;
  #fInput: InputConsoleFragment;
  #tmpMessage: string | null = null;
  #threadId: SocialItemId | null = null;
  #hashtagIds: string[] = [];

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

  setThreadId(sid: SocialItemId): void { this.#threadId = sid; }
  setTargetHashtagIds(ids: string[]): void { this.#hashtagIds = ids; }

  onInputConsoleRequestPostFile(_file: File): void {}
  onInputConsoleRequestPost(message: string): void { this.#onPostMessage(message); }
  onClickInHashtagFragment(fHashtag: FHashtag): void {
    this.#lc.dismiss();
    this.#asyncPostUserHashtagComment(this.#tmpMessage || "", fHashtag.getTagId() ?? "");
  }

  onOptionClickedInContextLayer(_lc: LContext, value: string): void {
    switch (value) {
    case "COMMENT":
      this.#asyncPostUserComment(this.#tmpMessage || "");
      break;
    case "POST":
      this.#asyncPostUserComment(this.#tmpMessage || "", true);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    let p = new PanelWrapper();
    render.wrapPanel(p);
    this.#fInput.attachRender(p);
    this.#fInput.render();
  }

  #onPostMessage(message: string): void {
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

  #postGuestComment(message: string, guestName: string): void {
    Account.setGuestName(guestName);
    this.#asyncPostGuestComment(message, guestName);
  }

  #asyncPostGuestComment(message: string, guestName: string): void {
    if (!this.#threadId) {
      return;
    }
    let url = "api/social/add_guest_comment";
    let fd = new FormData();
    fd.append("item_id", this.#threadId.getValue());
    fd.append("item_type", this.#threadId.getType());
    fd.append("content", message);
    fd.append("guest_name", guestName);
    Api.asPost(url, fd).then(r => this.#onPostDone(r),
                                    e => this.#onPostError(e, message));
  }

  #asyncPostUserHashtagComment(message: string, hashtagId: string): void {
    let url = "api/social/add_comment_article";
    let fd = new FormData();
    fd.append("item_id", hashtagId);
    fd.append("item_type", SocialItem.TYPE.HASHTAG);
    fd.append("content", message);
    Api.asPost(url, fd).then(r => this.#onPostDone(r),
                                    e => this.#onPostError(e, message));
  }

  #asyncPostUserComment(message: string, asPost = false): void {
    if (Env.isWeb3()) {
      this.#asyncWeb3PostUserComment(message, asPost)
          .then(() => this.#onPostDone(undefined))
          .catch(e => this.#onPostError(e, message));
    } else {
      this.#asyncWeb2PostUserComment(message, asPost);
    }
  }

  async #asyncWeb3PostUserComment(message: string, asPost: boolean): Promise<void> {
    if (asPost) {
      console.log("TODO: Post user comment as post is not implemented");
      return;
    }
    if (!this.#threadId) {
      return;
    }

    // Make article out of comment text.
    let oArticle = new OArticle();
    oArticle.setContent(message);
    oArticle.setOwnerId(Account.getId() ?? "");
    oArticle.markCreation();

    await Account.asComment(this.#threadId.getValue(), oArticle, asPost);
  }

  #asyncWeb2PostUserComment(message: string, asPost: boolean): void {
    if (!this.#threadId) {
      return;
    }
    let url = asPost ? "api/social/add_comment_article"
                     : "api/social/add_user_comment";
    let fd = new FormData();
    fd.append("item_id", this.#threadId.getValue());
    fd.append("item_type", this.#threadId.getType());
    fd.append("content", message);
    Api.asPost(url, fd).then(r => this.#onPostDone(r),
                                    e => this.#onPostError(e, message));
  }

  #onPostDone(_data?: unknown): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onCommentPostedInCommentInputFragment?.(this);
  }

  #onPostError(e: unknown, message: string): void {
    this.#fInput.setText(message);
    this.onRemoteErrorInFragment(this, e);
  }
}

export default FCommentInput;
