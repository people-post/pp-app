import { Fragment } from './Fragment.js';

const _CFT_GRID = {
  MAIN : `<div class="custom-grid">__ITEMS__</div>`,
  ITEM : `<span class="item">__CONTENT__</span>`,
}

export class GridFragment extends Fragment {
  _renderContent() {
    let tItem = _CFT_GRID.ITEM;
    let items = [];
    for (let i of this._dataSource.getItemsForGridFragment(this)) {
      let s = tItem.replace("__CONTENT__", this._delegate.renderItemForGrid(i));
      items.push(s);
    }
    return _CFT_GRID.MAIN.replace("__ITEMS__", items.join(""));
  }
};
