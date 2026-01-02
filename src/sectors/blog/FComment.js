import { OptionContextButton } from '../../lib/ui/controllers/fragments/OptionContextButton.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FPostBase } from './FPostBase.js';
import { R } from '../../common/constants/R.js';
import { FUserIcon } from '../../common/hr/FUserIcon.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { Blog } from '../../common/dba/Blog.js';
import { ICON } from '../../common/constants/Icons.js';
import { Utilities } from './Utilities.js';
import { Utilities as CommonUtilities } from '../../common/Utilities.js';

const _CFT_COMMENT = {
  ICON : `<span class="inline-block s-icon6">__ICON__</span>`,
};

export class FComment extends FPostBase {
  #fAction;
  #fUserIcon;
  #fUserName;
  #commentId = null;

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

  isInfoClickable() { return false; }

  setCommentId(id) { this.#commentId = id; }

  onOptionClickedInContextButtonFragment(fContextBtn, value) {
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

  _renderOnRender(postInfoPanel) {
    let c = Blog.getComment(this.#commentId);
    if (!c) {
      return;
    }
    this.#renderOwnerIcon(postInfoPanel.getOwnerIconPanel(), c);
    this.#renderOwnerName(postInfoPanel.getOwnerNamePanel(), c);
    this.#renderCommentText(postInfoPanel.getContentPanel(), c);
    this.#renderContext(postInfoPanel.getContextPanel(), c);
  }

  #onKeep() {
    let c = Blog.getComment(this.#commentId);
    if (c) {
      this.#asyncKeep(c);
    }
  }

  #onDiscard() {
    let c = Blog.getComment(this.#commentId);
    if (c) {
      this.#asyncDiscard(c);
    }
  }

  #isCommentAdmin(comment) {
    return this._dataSource.isUserAdminOfCommentTargetInCommentFragment(
        this, comment.getTargetItemId());
  }

  #renderOwnerIcon(panel, comment) {
    if (!panel) {
      return;
    }
    this.#fUserIcon.attachRender(panel);
    if (!comment.isFromGuest()) {
      this.#fUserIcon.setUserId(comment.getFromUserId());
    }
    this.#fUserIcon.render();
  }

  #renderOwnerName(panel, comment) {
    if (!panel) {
      return;
    }
    if (comment.isFromGuest()) {
      let p = new Panel();
      if (comment.isPending()) {
        p.setClassName("italic");
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

  #renderCommentText(panel, comment) {
    if (!panel) {
      return;
    }
    let p = new Panel();
    if (comment.isPending()) {
      p.setClassName("italic");
    }
    panel.wrapPanel(p);
    p.replaceContent(CommonUtilities.escapeHtml(comment.getContent()));
  }

  #renderContext(panel, comment) {
    if (!panel) {
      return;
    }

    if (comment.isPending() && this.#isCommentAdmin(comment)) {
      let s = _CFT_COMMENT.ICON;
      s = s.replace("__ICON__",
                    CommonUtilities.renderSvgIcon(ICON.INFO, "stkred", "fillred"));
      this.#fAction.setIcon(s);
      this.#fAction.attachRender(panel);
      this.#fAction.render();
    } else {
      panel.replaceContent(this.#renderTime(comment));
    }
  }

  #renderTime(comment) {
    return CommonUtilities.renderSmartTime(comment.getCreationTime());
  }

  #asyncKeep(comment) {
    let url = "api/social/keep_guest_comment";
    let fd = new FormData();
    fd.append("item_id", comment.getTargetItemId());
    fd.append("item_type", comment.getTargetItemType());
    fd.append("comment_id", comment.getId());
    glb.api.asFragmentPost(this, url, fd, d => this.#onKeepRRR(d));
  }

  #asyncDiscard(comment) {
    let url = "api/social/discard_guest_comment";
    let fd = new FormData();
    fd.append("item_id", comment.getTargetItemId());
    fd.append("item_type", comment.getTargetItemType());
    fd.append("comment_id", comment.getId());
    glb.api.asFragmentPost(this, url, fd, d => this.#onDiscardRRR(d));
  }

  #onKeepRRR(data) {
    this._delegate.onGuestCommentStatusChangeInCommentFragment(this);
  }

  #onDiscardRRR(data) {
    this._delegate.onGuestCommentStatusChangeInCommentFragment(this);
  }
};
