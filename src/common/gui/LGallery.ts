import { Layer } from '../../lib/ui/controllers/layers/Layer.js';
import { FGallery } from './FGallery.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ICONS } from '../../lib/ui/Icons.js';
import { ICON } from '../constants/Icons.js';
import { Utilities } from '../Utilities.js';
import { FRealTimeComments } from '../social/FRealTimeComments.js';
import { RemoteFile } from '../datatypes/RemoteFile.js';
import { RemoteError } from '../datatypes/RemoteError.js';
import type { LayerOwner } from '../../lib/ui/controllers/layers/Layer.js';

export const CLC_GALLERY = {
  TOGGLE_COMMENT : "CLC_GALLERY_1",
  CLOSE : "CLC_GALLERY_2",
}

const _CLCT_GALLERY = {
  CONTROL_BAR :
      `<span class="inline-block s-icon3 clickable" onclick="javascript:G.action(CLC_GALLERY.TOGGLE_COMMENT)">__COMMENT_ICON__</span>
    <span class="inline-block s-icon3 clickable" onclick="javascript:G.action(CLC_GALLERY.CLOSE)">__CLOSE_ICON__</span>`,
}

export class LGallery extends Layer {
  _fGallery: FGallery;
  _fComments: FRealTimeComments;
  _rComment: PanelWrapper | null = null;
  _rControl: Panel | null = null;
  _pContent: PanelWrapper | null = null;
  _mActiveTouch: Map<number, Touch> = new Map();
  _currentScale = 100;

  constructor() {
    super();
    this._fGallery = new FGallery();
    this._fGallery.setDataSource(this);
    this._fGallery.setDelegate(this);
    this.setChild("Gallery", this._fGallery);

    this._fComments = new FRealTimeComments();
    this._fComments.setShowInputOnInit(false);
    this.setChild("Comments", this._fComments);
  }

  getUrlParamString(): string { return ""; }

  setFiles(files: RemoteFile[] | null): void { this._fGallery.setFiles(files); }
  setSelection(idx: number): void { this._fGallery.setSelection(idx); }
  setCommentThreadId(id: string | number | null, type: string | null): void {
    if (id !== null && type !== null) {
      this._fComments.setThreadId(id.toString(), type);
    }
  }
  onRemoteErrorInFragment(_f: unknown, _err: RemoteError): void {
    // TODO:
  }

  action(type: string, ...args: unknown[]): void {
    switch (type) {
    case CLC_GALLERY.TOGGLE_COMMENT:
      this.#toggleComment();
      break;
    case CLC_GALLERY.CLOSE:
      this.#onClose();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    const p = new ListPanel();
    p.setClassName("f-simple flex flex-column flex-center");
    p.setAttribute("onclick", "javascript:G.action(CLC_GALLERY.CLOSE)");
    render.wrapPanel(p);
    const e = p.getDomElement();
    if (e) {
      e.addEventListener("touchstart", (evt: TouchEvent) => this.#onTouchStart(evt));
      e.addEventListener("touchcancel", (evt: TouchEvent) => this.#onTouchCancel(evt));
      e.addEventListener("touchmove", (evt: TouchEvent) => this.#onTouchMove(evt));
      e.addEventListener("touchend", (evt: TouchEvent) => this.#onTouchEnd(evt));
    }

    let pp = new PanelWrapper();
    pp.setAttribute("onclick", "javascript:G.anchorClick()");
    pp.setClassName("hmax100");
    p.pushPanel(pp);
    this._pContent = pp;

    this._fGallery.attachRender(pp);
    this._fGallery.render();

    this._rComment = new PanelWrapper();
    this._rComment.setClassName("overlay-comment darkmode");
    p.pushPanel(this._rComment);
    this._rComment.setVisible(this._fGallery.isLivestreaming());
    this._fComments.attachRender(this._rComment);
    this._fComments.render();

    this._rControl = new Panel();
    this._rControl.setClassName("gallery-layer-control");
    p.pushPanel(this._rControl);
    this._rControl.replaceContent(this.#renderControlBar());
  }

  #toggleComment(): void {
    if (this._rComment) {
      this._rComment.setVisible(!this._rComment.isVisible());
      if (this._rComment.isVisible()) {
        this._fComments.render();
      }
      if (this._rControl) {
        this._rControl.replaceContent(this.#renderControlBar());
      }
    }
  }

  #renderControlBar(): string {
    let s = _CLCT_GALLERY.CONTROL_BAR;
    let stk = "stkdimgray";
    if (this._rComment && this._rComment.isVisible()) {
      stk = "s-cprimestk";
    }
    s = s.replace("__COMMENT_ICON__",
                  Utilities.renderSvgIcon(ICON.COMMENT, stk, "filldimgray"));
    s = s.replace(
        "__CLOSE_ICON__",
        Utilities.renderSvgIcon(ICONS.CLOSE, "stkdimgray", "filldimgray"));
    return s;
  }

  popState(_state: unknown): void {
    const owner = this.getOwner<LayerOwner>();
    if (owner) {
      owner.onRequestPopLayer(this);
    }
  }

  #onTouchStart(evt: TouchEvent): void {
    for (const t of evt.changedTouches) {
      this._mActiveTouch.set(t.identifier, t);
    }
  }
  #onTouchCancel(_evt: TouchEvent): void {
    // Restore resizing
    this._currentScale = 100;
    if (this._pContent) {
      this._pContent.setWidth(100, "%");
    }
    this._mActiveTouch.clear();
  }
  #onTouchMove(evt: TouchEvent): void {
    const touches = evt.changedTouches;
    for (const t of touches) {
      const tLast = this._mActiveTouch.get(t.identifier);
      if (tLast && this._pContent) {
        const dx = Math.abs(t.pageX - tLast.pageX);
        const dy = Math.abs(t.pageY - tLast.pageY);
        if (dy > dx) {
          const ds = dy;
          const s = Math.min((1 - ds / 300) * 100, 100);
          this._pContent.setWidth(s, "%");
          this._currentScale = s;
        }
      }
    }
  }
  #onTouchEnd(evt: TouchEvent): void {
    for (const t of evt.changedTouches) {
      const tLast = this._mActiveTouch.get(t.identifier);
      if (tLast) {
        this._mActiveTouch.delete(t.identifier);
      }
    }
    if (this._mActiveTouch.size == 0) {
      if (this._currentScale < 80) {
        this.#onClose();
      } else {
        this.#onTouchCancel(evt);
      }
    }
  }

  #onClose(): void {
    const owner = this.getOwner<LayerOwner>();
    if (owner) {
      owner.onRequestPopLayer(this);
    }
  }
}

