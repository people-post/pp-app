import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { ArrayPanel } from '../../lib/ui/renders/panels/ArrayPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export const CF_FOLDABLE_ITEM = {
  ITEM_CLICK : "CF_GUI_FOLDABLE_ITEM_1",
}

const _CFT_FOLDABLE_ITEM = {
  ON_CLICK_ACTION : `javascript:G.action(gui.CF_FOLDABLE_ITEM.ITEM_CLICK)`,
}

export class FoldableItemFragment extends Fragment {
  constructor() {
    super();
    this._itemId = null;
    this._isOpen = false;
    this._fHeader = null;
    this._fContent = null;
    this._fAction = null;
  }

  getItemId() { return this._itemId; }
  setItemId(id) { return this._itemId = id; }
  setHeaderFragment(f) {
    this._fHeader = f;
    this.setChild("header", f);
  }
  setContentFragment(f) {
    this._fContent = f;
    this.setChild("content", f);
  }
  setActionFragment(f) {
    this._fAction = f;
    this.setChild("action", f);
  }

  setIsOpen(b) { this._isOpen = b; }

  close() {
    if (this._isOpen) {
      this.#toggleStatus();
    }
  }

  action(type, ...args) {
    switch (type) {
    case CF_FOLDABLE_ITEM.ITEM_CLICK:
      this.#toggleStatus();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new ArrayPanel();
    pp.setTableClassName("foldable-item w100 border-collapse");
    if (this._isOpen) {
      pp.setClassName("foldable-item clickable selected");
    } else {
      pp.setClassName("foldable-item clickable");
    }
    p.pushPanel(pp);
    let ppp = new PanelWrapper();
    ppp.setAttribute("onclick", _CFT_FOLDABLE_ITEM.ON_CLICK_ACTION);
    pp.pushPanel(ppp);
    this._fHeader.attachRender(ppp);
    this._fHeader.render();

    if (this._fAction) {
      ppp = new Panel();
      ppp.setClassName("right-align");
      pp.pushPanel(ppp);
      this._fAction.attachRender(ppp);
      this._fAction.render();
    }

    if (this._isOpen && this._fContent) {
      pp = new PanelWrapper();
      pp.setClassName("foldable-item-content-wrapper");
      p.pushPanel(pp);
      ppp = new PanelWrapper();
      ppp.setClassName("foldable-item-content");
      pp.wrapPanel(ppp);
      this._fContent.attachRender(ppp);
      this._fContent.render();
    }
  }

  #toggleStatus() {
    this._isOpen = !this._isOpen;
    if (this._isOpen) {
      this._delegate.onFoldableItemOpen(this, this._itemId);
    } else {
      this._delegate.onFoldableItemClose(this, this._itemId);
    }
    this.render();
  }
};
// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.CF_FOLDABLE_ITEM = CF_FOLDABLE_ITEM;
  window.gui.FoldableItemFragment = FoldableItemFragment;
}

