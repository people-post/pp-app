(function(socl) {
const _CFT_REAL_TIME_COMMENT = {
  ICON : `<span class="inline-block s-icon6">__ICON__</span>`,
};

class FRealTimeComment extends ui.Fragment {
  #fAction;
  #fUserIcon;
  #fUserName;
  #comment = null;

  constructor() {
    super();
    this.#fAction = new ui.OptionContextButton();
    this.#fAction.setTargetName(R.get("guest comment"));
    this.#fAction.addOption("Keep", "KEEP");
    this.#fAction.addOption("Discard", "DISCARD", null,
                            ui.Button.T_THEME.RISKY);
    this.#fAction.setDelegate(this);
    this.setChild("action", this.#fAction);

    this.#fUserIcon = new S.hr.FUserIcon();
    this.setChild("usericon", this.#fUserIcon);

    this.#fUserName = new S.hr.FUserInfo();
    this.#fUserName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("username", this.#fUserName);
  }

  setComment(c) { this.#comment = c; }

  onOptionClickedInContextButtonFragment(fContextBtn, value) {
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

  _renderOnRender(render) {
    let panel = new socl.PComment();
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

  #renderAuthorIcon(panel, comment) {
    this.#fUserIcon.attachRender(panel);
    if (!comment.isFromGuest()) {
      this.#fUserIcon.setUserId(comment.getFromUserId());
    }
    this.#fUserIcon.render();
  }

  #renderAuthorName(panel, comment) {
    if (comment.isFromGuest()) {
      let p = new ui.Panel();
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
    let p = new ui.Panel();
    if (comment.isPending()) {
      p.setClassName("italic");
    }
    panel.wrapPanel(p);
    p.replaceContent(Utilities.escapeHtml(comment.getContent()));
  }

  #renderExtra(panel) {
    if (this.#comment.isPending() &&
        this._dataSource.shouldShowAdminOptionsInCommentFragment(this)) {
      let s = _CFT_REAL_TIME_COMMENT.ICON;
      s = s.replace("__ICON__",
                    Utilities.renderSvgIcon(C.ICON.INFO, "stkred", "fillred"));
      this.#fAction.setIcon(s);
      this.#fAction.attachRender(panel);
      this.#fAction.render();
    } else {
      panel.replaceContent(this.#renderTime(this.#comment));
    }
  }

  #renderTime(comment) {
    return Utilities.renderSmartTime(comment.getCreationTime());
  }
};

socl.FRealTimeComment = FRealTimeComment;
}(window.socl = window.socl || {}));
