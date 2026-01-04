import { Fragment } from './Fragment.js';
import { BufferedList } from './BufferedList.js';

export class FLongListLegacy extends Fragment {
  declare _fItems: BufferedList;
  declare _currentId: string | null;

  constructor() {
    super();
    this._fItems = new BufferedList();
    this._fItems.setDataSource(this);
    this._fItems.setDelegate(this);
    this.setChild("items", this._fItems);

    this._currentId = null;
  }

  // Delegate protocols
  createFragmentForBufferedListItem(_fBufferedList: BufferedList, itemIndex: number): Fragment | null {
    return this._createItemFragment(itemIndex);
  }

  // Accessors
  isBufferedListExpectingMoreHeadItems(_fBufferedList: BufferedList): boolean { return false; }
  isBufferedListExpectingMoreTrailingItems(_fBufferedList: BufferedList): boolean {
    return !this._isFullListLoaded();
  }
  hasBufferOnTop(): boolean { return this._fItems.getFirstId() > 0; }
  shouldBufferedListClearBuffer(_fBufferedList: BufferedList): boolean { return false; }

  getCurrentId(): string | null { return this._currentId; }

  // Mutators
  setGridMode(b: boolean): void { this._fItems.setGridMode(b); }

  // Methods
  onScrollFinished(): void { this._fItems.onScrollFinished(); }

  scrollToItemIndex(idx: number): void { this._fItems.scrollTo(idx); }
  reload(): void {
    this._resetList();
    this._fItems.reload();
  }
  refreshItems(): void { this._fItems.refresh(); }

  switchToItem(id: string | null): void {
    this._currentId = id;
    if (id) {
      let v = this._createItemView(id);
      if (v) {
        this.onFragmentRequestShowView(this, v, "Item" + id);
      }
      this._fItems.refresh();
    }
  }

  // Virtual functions
  _renderOnRender(render: any): void {
    this._fItems.attachRender(render);
    this._fItems.render();
  }

  _isFullListLoaded(): boolean { throw "_isFullListLoaded is required"; }
  _createItemFragment(itemIndex: number): Fragment | null { throw "_createItemFragment is required"; }
  _createItemView(_id: string): any { return null; }
  _resetList(): void { throw "_resetList is required"; }
}

