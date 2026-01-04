import { Fragment } from './Fragment.js';

const _CFT_GRID = {
  MAIN : `<div class="custom-grid">__ITEMS__</div>`,
  ITEM : `<span class="item">__CONTENT__</span>`,
} as const;

export class GridFragment extends Fragment {
  _renderContent(): string {
    let tItem = _CFT_GRID.ITEM;
    let items: string[] = [];
    if (this._dataSource && typeof (this._dataSource as any).getItemsForGridFragment === 'function') {
      for (let i of (this._dataSource as any).getItemsForGridFragment(this)) {
        if (this._delegate && typeof (this._delegate as any).renderItemForGrid === 'function') {
          let s = tItem.replace("__CONTENT__", (this._delegate as any).renderItemForGrid(i));
          items.push(s);
        }
      }
    }
    return _CFT_GRID.MAIN.replace("__ITEMS__", items.join(""));
  }
}

