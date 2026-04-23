import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { HintText } from '../../lib/ui/controllers/fragments/HintText.js';
import type { DirItem } from '../datatypes/DirItem.js';

export class FDir<TItem extends { isDir(): boolean; getName(): string | null } = DirItem<any, any>> extends Fragment {
  declare _fItems: FSimpleFragmentList;
  declare _fNewItem: Fragment | null;
  declare _nMaxItems: number;

  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this._fItems.setDataSource(this as any);
    this._fItems.setDelegate(this as any);
    this._fNewItem = null;

    this.setChild("items", this._fItems);

    this._nMaxItems = 0;
  }

  setNMaxItems(n: number): void { this._nMaxItems = n; }
  setNewItemFragment(f: Fragment): void {
    this._fNewItem = f;
    this.setChild("newItem", f);
  }

  _renderOnRender(render: any): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    this._fItems.clear();
    const items = this._getSubItems();
    for (const item of items) {
      const f = item.isDir()
        ? this._createSubDirFragment(item)
        : this._createItemFragment(item);
      this._fItems.append(f);
    }

    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fItems.attachRender(pp);
    this._fItems.render();

    if (items.length < this._nMaxItems && this._fNewItem) {
      pp = new PanelWrapper();
      p.pushPanel(pp);
      this._fNewItem.attachRender(pp);
      this._fNewItem.render();
    }
  }

  protected _createSubDirFragment(item: TItem): Fragment {
    // TODO: To improve with particular fragment
    return new HintText(item.getName() ?? '');
  }

  protected _createItemFragment(item: TItem): Fragment {
    // TODO: To improve with particular fragment
    return new HintText(item.getName() ?? '');
  }
  // Subclasses should override to return their concrete item type.
  // Default implementation returns an empty list.
  protected _getSubItems(): TItem[] { return []; }
}

