import { Fragment } from './Fragment.js';
import { BufferedList } from './BufferedList.js';

interface LongListDataSource {
  getItemFragmentForLongListFragment(f: FLongList, itemIndex: number): Fragment | null;
  isMoreFrontItemsExpectedInLongListFragment(f: FLongList): boolean;
  isMoreBackItemsExpectedInLongListFragment(f: FLongList): boolean;
  getIdRecordForLongListFragment(f: FLongList): { isEmpty(): boolean };
}

interface LongListDelegate {
  onLongListFragmentRequestResetList(f: FLongList): void;
  [key: string]: unknown;
}

export class FLongList extends Fragment {
  #fItems: BufferedList;
  #currentId: number | null = null;

  protected declare _dataSource: LongListDataSource;
  protected declare _delegate: LongListDelegate;

  constructor() {
    super();
    this.#fItems = new BufferedList();
    this.#fItems.setDataSource(this);
    this.#fItems.setDelegate(this);
    this.setChild("items", this.#fItems);
  }

  // Delegate protocols
  createFragmentForBufferedListItem(_fBufferedList: BufferedList, itemIndex: number): Fragment | null {
    return this._dataSource.getItemFragmentForLongListFragment(this, itemIndex);
  }

  // Accessors
  isBufferedListExpectingMoreHeadItems(_fBufferedList: BufferedList): boolean {
    return this._dataSource.isMoreFrontItemsExpectedInLongListFragment(this);
  }
  isBufferedListExpectingMoreTrailingItems(_fBufferedList: BufferedList): boolean {
    return this._dataSource.isMoreBackItemsExpectedInLongListFragment(this);
  }
  shouldBufferedListClearBuffer(_fBufferedList: BufferedList): boolean {
    return this._dataSource.getIdRecordForLongListFragment(this).isEmpty();
  }

  getFirstId(): number { return this.#fItems.getFirstId(); }
  getCurrentId(): number | null { return this.#currentId; }

  // Mutators
  setEnableTopBuffer(b: boolean): void { this.#fItems.setEnableTopBuffer(b); }
  setGridMode(b: boolean): void { this.#fItems.setGridMode(b); }

  // Methods
  onScrollFinished(): void { this.#fItems.onScrollFinished(); }

  scrollToItemIndex(idx: number): void { this.#fItems.scrollTo(idx); }
  reset(): void {
    this._delegate.onLongListFragmentRequestResetList(this);
    this.reload();
  }
  // Reload items without reseting ids
  reload(): void { this.#fItems.reload(); }
  // Only refresh items
  refresh(): void { this.#fItems.refresh(); }

  switchToItem(id: number): void {
    this.#currentId = id;
    this.#fItems.refresh();
  }

  // Virtual functions
  _renderOnRender(render: any): void {
    this.#fItems.attachRender(render);
    this.#fItems.render();
  }
}

