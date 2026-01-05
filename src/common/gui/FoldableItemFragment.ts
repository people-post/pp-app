import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { ArrayPanel } from '../../lib/ui/renders/panels/ArrayPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { RenderController } from '../../lib/ui/controllers/RenderController.js';

export const CF_FOLDABLE_ITEM = {
  ITEM_CLICK : "CF_GUI_FOLDABLE_ITEM_1",
}

const _CFT_FOLDABLE_ITEM = {
  ON_CLICK_ACTION : `javascript:G.action(gui.CF_FOLDABLE_ITEM.ITEM_CLICK)`,
}

export class FoldableItemFragment extends Fragment {
  _itemId: string | null = null;
  _isOpen = false;
  _fHeader: RenderController | null = null;
  _fContent: RenderController | null = null;
  _fAction: RenderController | null = null;

  constructor() {
    super();
  }

  getItemId(): string | null { return this._itemId; }
  setItemId(id: string | null): string | null { return this._itemId = id; }
  setHeaderFragment(f: RenderController | null): void {
    this._fHeader = f;
    this.setChild("header", f);
  }
  setContentFragment(f: RenderController | null): void {
    this._fContent = f;
    this.setChild("content", f);
  }
  setActionFragment(f: RenderController | null): void {
    this._fAction = f;
    this.setChild("action", f);
  }

  setIsOpen(b: boolean): void { this._isOpen = b; }

  close(): void {
    if (this._isOpen) {
      this.#toggleStatus();
    }
  }

  action(type: string, ...args: unknown[]): void {
    switch (type) {
    case CF_FOLDABLE_ITEM.ITEM_CLICK:
      this.#toggleStatus();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    const p = new ListPanel();
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
    if (this._fHeader) {
      this._fHeader.attachRender(ppp);
      this._fHeader.render();
    }

    if (this._fAction) {
      const pAction = new Panel();
      pAction.setClassName("right-align");
      pp.pushPanel(pAction);
      this._fAction.attachRender(pAction);
      this._fAction.render();
    }

    if (this._isOpen && this._fContent) {
      const pContentWrapper = new PanelWrapper();
      pContentWrapper.setClassName("foldable-item-content-wrapper");
      p.pushPanel(pContentWrapper);
      const pContent = new PanelWrapper();
      pContent.setClassName("foldable-item-content");
      pContentWrapper.wrapPanel(pContent);
      this._fContent.attachRender(pContent);
      this._fContent.render();
    }
  }

  #toggleStatus(): void {
    this._isOpen = !this._isOpen;
    if (this._isOpen) {
      (this._delegate as { onFoldableItemOpen(f: FoldableItemFragment, id: string | null): void }).onFoldableItemOpen(this, this._itemId);
    } else {
      (this._delegate as { onFoldableItemClose(f: FoldableItemFragment, id: string | null): void }).onFoldableItemClose(this, this._itemId);
    }
    this.render();
  }
}

