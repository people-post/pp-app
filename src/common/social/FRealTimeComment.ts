import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { OptionContextButton } from '../../lib/ui/controllers/fragments/OptionContextButton.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { FUserIcon } from '../hr/FUserIcon.js';
import { FUserInfo } from '../hr/FUserInfo.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PComment } from './PComment.js';
import { Utilities } from '../Utilities.js';
import { RealTimeComment } from '../datatypes/RealTimeComment.js';
import { R } from '../constants/R.js';
import { ICON } from '../constants/Icons.js';

const _CFT_REAL_TIME_COMMENT = {
  ICON : `<span class="inline-block s-icon6">__ICON__</span>`,
};

interface FRealTimeCommentDelegate {
  onCommentFragmentRequestKeepComment(f: FRealTimeComment, commentId: string): void;
  onCommentFragmentRequestDiscardComment(f: FRealTimeComment, commentId: string): void;
}

interface FRealTimeCommentDataSource {
  shouldShowAdminOptionsInCommentFragment(f: FRealTimeComment): boolean;
}

export class FRealTimeComment extends Fragment {
  #fAction: OptionContextButton;
  #fUserIcon: FUserIcon;
  #fUserName: FUserInfo;
  #comment: RealTimeComment | null = null;
  protected _delegate!: FRealTimeCommentDelegate;
  protected _dataSource!: FRealTimeCommentDataSource;

  constructor() {
    super();
    this.#fAction = new OptionContextButton();
    this.#fAction.setTargetName(R.get("guest comment"));
    this.#fAction.addOption("Keep", "KEEP");
    this.#fAction.addOption("Discard", "DISCARD", null,
                            Button.T_THEME.RISKY);
    this.#fAction.setDelegate(this);
    this.setChild("action", this.#fAction);

    this.#fUserIcon = new FUserIcon();
    this.setChild("usericon", this.#fUserIcon);

    this.#fUserName = new FUserInfo();
    this.#fUserName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("username", this.#fUserName);
  }

  setComment(c: RealTimeComment): void { this.#comment = c; }

  onOptionClickedInContextButtonFragment(fContextBtn: OptionContextButton, value: string): void {
    if (!this.#comment) {
      return;
    }
    switch (value) {
    case "KEEP":
      this._delegate.onCommentFragmentRequestKeepComment(this,
                                                         this.#comment.getId());
      break;
    case "DISCARD":
      this._delegate.onCommentFragmentRequestDiscardComment(
          this, this.#comment.getId());
      break;
    default:
      break;
    }
  }

  _renderOnRender(render: any): void {
    if (!this.#comment) {
      return;
    }

    let panel = new PComment();
    render.wrapPanel(panel);

    let p = panel.getAuthorIconPanel();
    this.#renderAuthorIcon(p, this.#comment);

    p = panel.getAuthorNamePanel();
    this.#renderAuthorName(p, this.#comment);

    p = panel.getContentPanel();
    this.#renderCommentText(p, this.#comment);

    p = panel.getExtraPanel();
    this.#renderExtra(p);
  }

  #renderAuthorIcon(panel: Panel, comment: RealTimeComment): void {
    this.#fUserIcon.attachRender(panel);
    if (!comment.isFromGuest()) {
      const userId = comment.getFromUserId();
      if (userId) {
        this.#fUserIcon.setUserId(userId);
      }
    }
    this.#fUserIcon.render();
  }

  #renderAuthorName(panel: Panel, comment: RealTimeComment): void {
    if (comment.isFromGuest()) {
      let p = new Panel();
      if (comment.isPending()) {
        p.setClassName("italic");
      }
      panel.wrapPanel(p);
      let s = "[" + (comment.getGuestName() || "") + "]";
      p.replaceContent(s);
    } else {
      this.#fUserName.attachRender(panel);
      const userId = comment.getFromUserId();
      if (userId) {
        this.#fUserName.setUserId(userId);
      }
      this.#fUserName.render();
    }
  }

  #renderCommentText(panel: Panel, comment: RealTimeComment): void {
    let p = new Panel();
    if (comment.isPending()) {
      p.setClassName("italic");
    }
    panel.wrapPanel(p);
    p.replaceContent(Utilities.escapeHtml(comment.getContent()));
  }

  #renderExtra(panel: Panel): void {
    if (this.#comment && this.#comment.isPending() &&
        this._dataSource.shouldShowAdminOptionsInCommentFragment(this)) {
      let s = _CFT_REAL_TIME_COMMENT.ICON;
      s = s.replace("__ICON__",
                    Utilities.renderSvgIcon(ICON.INFO, "stkred", "fillred"));
      this.#fAction.setIcon(s);
      this.#fAction.attachRender(panel);
      this.#fAction.render();
    } else if (this.#comment) {
      panel.replaceContent(this.#renderTime(this.#comment));
    }
  }

  #renderTime(comment: RealTimeComment): string {
    // RealTimeComment extends ChatMessage which extends ServerDataObject
    // ServerDataObject has getCreationTime() method
    const creationTime = comment.getCreationTime();
    if (creationTime) {
      return Utilities.renderSmartTime(creationTime);
    }
    return "";
  }
}
