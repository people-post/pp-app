import { OptionContextButton, IOptionContextButtonDelegate } from '../../lib/ui/controllers/fragments/OptionContextButton.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { FPostBase } from './FPostBase.js';
import { R } from '../../common/constants/R.js';
import { FUserIcon } from '../../common/hr/FUserIcon.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { Blog } from '../../common/dba/Blog.js';
import { ICON } from '../../common/constants/Icons.js';
import { Utilities as CommonUtilities } from '../../common/Utilities.js';
import { UiUtilities } from '../../lib/ui/Utilities.js';
import { Api } from '../../common/plt/Api.js';
import type { Comment } from '../../common/datatypes/Comment.js';

const _CFT_COMMENT = {
  ICON : `<span class="tw:inline-block tw:w-s-icon6 tw:h-s-icon6">__ICON__</span>`,
} as const;

export interface CommentDataSource {
  isUserAdminOfCommentTargetInCommentFragment(f: FComment, itemId: string): boolean;
}

export interface CommentDelegate {
  onGuestCommentStatusChangeInCommentFragment(f: FComment): void;
}

export class FComment extends FPostBase implements IOptionContextButtonDelegate {
  #fAction: OptionContextButton;
  #fUserIcon: FUserIcon;
  #fUserName: FUserInfo;
  #commentId: string | null = null;

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

  isInfoClickable(): boolean { return false; }

  setCommentId(id: string | null): void { this.#commentId = id; }

  onOptionClickedInContextButtonFragment(_fContextBtn: OptionContextButton, value: string): void {
    // TODO: Possibly move context operations up to delegate
    switch (value) {
    case "KEEP":
      this.#onKeep();
      break;
    case "DISCARD":
      this.#onDiscard();
      break;
    default:
      break;
    }
  }

  _renderOnRender(postInfoPanel: PPostInfoBase): void {
    let c = Blog.getComment(this.#commentId);
    if (!c) {
      return;
    }
    this.#renderOwnerIcon(postInfoPanel.getOwnerIconPanel(), c);
    this.#renderOwnerName(postInfoPanel.getOwnerNamePanel() as PanelWrapper | null, c);
    this.#renderCommentText(postInfoPanel.getContentPanel() as PanelWrapper | null, c);
    this.#renderContext(postInfoPanel.getContextPanel(), c);
  }

  #onKeep(): void {
    let c = Blog.getComment(this.#commentId);
    if (c) {
      this.#asyncKeep(c);
    }
  }

  #onDiscard(): void {
    let c = Blog.getComment(this.#commentId);
    if (c) {
      this.#asyncDiscard(c);
    }
  }

  #isCommentAdmin(comment: Comment): boolean {
    const dataSource = this.getDataSource<CommentDataSource>();
    if (!dataSource) {
      return false;
    }
    return dataSource.isUserAdminOfCommentTargetInCommentFragment(
        this, comment.getTargetItemId());
  }

  #renderOwnerIcon(panel: Panel | null, comment: Comment): void {
    if (!panel) {
      return;
    }
    this.#fUserIcon.attachRender(panel);
    if (!comment.isFromGuest()) {
      this.#fUserIcon.setUserId(comment.getFromUserId());
    }
    this.#fUserIcon.render();
  }

  #renderOwnerName(panel: PanelWrapper | null, comment: Comment): void {
    if (!panel) {
      return;
    }
    if (comment.isFromGuest()) {
      let p = new Panel();
      if (comment.isPending()) {
        p.setClassName("tw:font-italic");
      }
      panel.wrapPanel(p);
      let s = "[" + comment.getGuestName() + "]";
      p.replaceContent(s);
    } else {
      this.#fUserName.attachRender(panel);
      this.#fUserName.setUserId(comment.getFromUserId());
      this.#fUserName.render();
    }
  }

  #renderCommentText(panel: PanelWrapper | null, comment: Comment): void {
    if (!panel) {
      return;
    }
    let p = new Panel();
    if (comment.isPending()) {
      p.setClassName("tw:font-italic");
    }
    panel.wrapPanel(p);
    p.replaceContent(CommonUtilities.escapeHtml(comment.getContent()));
  }

  #renderContext(panel: Panel | null, comment: Comment): void {
    if (!panel) {
      return;
    }

    if (comment.isPending() && this.#isCommentAdmin(comment)) {
      let s = _CFT_COMMENT.ICON;
      s = s.replace("__ICON__",
                    UiUtilities.renderSvgIcon(ICON.INFO, "stkred", "fillred"));
      this.#fAction.setIcon(s);
      this.#fAction.attachRender(panel);
      this.#fAction.render();
    } else {
      panel.replaceContent(this.#renderTime(comment));
    }
  }

  #renderTime(comment: Comment): string {
    const creationTime = comment.getCreationTime();
    if (!creationTime) {
      return "";
    }
    return CommonUtilities.renderSmartTime(creationTime);
  }

  #asyncKeep(comment: Comment): void {
    let url = "api/social/keep_guest_comment";
    let fd = new FormData();
    fd.append("item_id", comment.getTargetItemId());
    fd.append("item_type", comment.getTargetItemType());
    fd.append("comment_id", comment.getId());
    Api.asFragmentPost(this, url, fd).then(d => this.#onKeepRRR(d));
  }

  #asyncDiscard(comment: Comment): void {
    let url = "api/social/discard_guest_comment";
    let fd = new FormData();
    fd.append("item_id", comment.getTargetItemId());
    fd.append("item_type", comment.getTargetItemType());
    fd.append("comment_id", comment.getId());
    Api.asFragmentPost(this, url, fd).then(d => this.#onDiscardRRR(d));
  }

  #onKeepRRR(_data: unknown): void {
    this._delegate.onGuestCommentStatusChangeInCommentFragment(this);
  }

  #onDiscardRRR(_data: unknown): void {
    this._delegate.onGuestCommentStatusChangeInCommentFragment(this);
  }
}
