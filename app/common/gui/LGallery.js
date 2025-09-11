(function(gui) {
window.CLC_GALLERY = {
  TOGGLE_COMMENT : "CLC_GALLERY_1",
  CLOSE : "CLC_GALLERY_2",
}

const _CLCT_GALLERY = {
  CONTROL_BAR :
      `<span class="inline-block s-icon3 clickable" onclick="javascript:G.action(CLC_GALLERY.TOGGLE_COMMENT)">__COMMENT_ICON__</span>
    <span class="inline-block s-icon3 clickable" onclick="javascript:G.action(CLC_GALLERY.CLOSE)">__CLOSE_ICON__</span>`,
}

class LGallery extends ui.Layer {
  constructor() {
    super();
    this._fGallery = new gui.FGallery();
    this._fGallery.setDataSource(this);
    this._fGallery.setDelegate(this);
    this.setChild("Gallery", this._fGallery);

    this._fComments = new socl.FRealTimeComments();
    this._fComments.setShowInputOnInit(false);
    this.setChild("Comments", this._fComments);

    this._rComment = null;
    this._rControl = null;
    this._pContent = null;
    this._mActiveTouch = new Map();
    this._currentScale = 100;
  }

  getUrlParamString() { return ""; }

  setFiles(files) { this._fGallery.setFiles(files); }
  setSelection(idx) { this._fGallery.setSelection(idx); }
  setCommentThreadId(id, type) { this._fComments.setThreadId(id, type); }
  onRemoteErrorInFragment(f, err) {
    // TODO:
  }

  action(type, ...args) {
    switch (type) {
    case CLC_GALLERY.TOGGLE_COMMENT:
      this.#toggleComment();
      break;
    case CLC_GALLERY.CLOSE:
      this.#onClose();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    p.setClassName("f-simple flex flex-column flex-center");
    p.setAttribute("onclick", "javascript:G.action(CLC_GALLERY.CLOSE)");
    render.wrapPanel(p);
    let e = p.getDomElement();
    e.addEventListener("touchstart", evt => this.#onTouchStart(evt));
    e.addEventListener("touchcancel", evt => this.#onTouchCancel(evt));
    e.addEventListener("touchmove", evt => this.#onTouchMove(evt));
    e.addEventListener("touchend", evt => this.#onTouchEnd(evt));

    let pp = new ui.PanelWrapper();
    pp.setAttribute("onclick", "javascript:G.anchorClick()");
    pp.setClassName("hmax100");
    p.pushPanel(pp);
    this._pContent = pp;

    this._fGallery.attachRender(pp);
    this._fGallery.render();

    this._rComment = new ui.PanelWrapper();
    this._rComment.setClassName("overlay-comment darkmode");
    p.pushPanel(this._rComment);
    this._rComment.setVisible(this._fGallery.isLivestreaming());
    this._fComments.attachRender(this._rComment);
    this._fComments.render();

    this._rControl = new ui.Panel();
    this._rControl.setClassName("gallery-layer-control");
    p.pushPanel(this._rControl);
    this._rControl.replaceContent(this.#renderControlBar());
  }

  #toggleComment() {
    if (this._rComment) {
      this._rComment.setVisible(!this._rComment.isVisible());
      if (this._rComment.isVisible()) {
        this._fComments.render();
      }
      this._rControl.replaceContent(this.#renderControlBar());
    }
  }

  #renderControlBar() {
    let s = _CLCT_GALLERY.CONTROL_BAR;
    let stk = "stkdimgray";
    if (this._rComment && this._rComment.isVisible()) {
      stk = "s-cprimestk";
    }
    s = s.replace("__COMMENT_ICON__",
                  Utilities.renderSvgIcon(C.ICON.COMMENT, stk, "filldimgray"));
    s = s.replace(
        "__CLOSE_ICON__",
        Utilities.renderSvgIcon(ui.ICONS.CLOSE, "stkdimgray", "filldimgray"));
    return s;
  }

  popState(state) { this._owner.onRequestPopLayer(this); }

  #onTouchStart(evt) {
    for (let t of evt.changedTouches) {
      this._mActiveTouch.set(t.identifier, t);
    }
  }
  #onTouchCancel(evt) {
    // Restore resizing
    this._currentScale = 100;
    this._pContent.setWidth(100, "%");
    this._mActiveTouch.clear();
  }
  #onTouchMove(evt) {
    let touches = evt.changedTouches;
    for (let t of touches) {
      let tLast = this._mActiveTouch.get(t.identifier);
      if (tLast) {
        let dx = Math.abs(t.pageX - tLast.pageX);
        let dy = Math.abs(t.pageY - tLast.pageY);
        if (dy > dx) {
          let ds = dy;
          let s = Math.min((1 - ds / 300) * 100, 100);
          this._pContent.setWidth(s, "%");
          this._currentScale = s;
        }
      }
    }
  }
  #onTouchEnd(evt) {
    for (let t of evt.changedTouches) {
      let tLast = this._mActiveTouch.get(t.identifier);
      if (tLast) {
        this._mActiveTouch.delete(t.identifier);
      }
    }
    if (this._mActiveTouch.size == 0) {
      if (this._currentScale < 80) {
        this.#onClose();
      } else {
        this.#onTouchCancel();
      }
    }
  }

  #onClose() { this._owner.onRequestPopLayer(this); }
};

gui.LGallery = LGallery;
}(window.gui = window.gui || {}));
