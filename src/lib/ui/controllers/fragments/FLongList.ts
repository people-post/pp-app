import { Fragment } from './Fragment.js';
import { BufferedList } from './BufferedList.js';

export interface ILongListDataSource {
  getItemFragmentForLongListFragment(f: FLongList, itemIndex: number): Fragment | null;
  isMoreFrontItemsExpectedInLongListFragment(f: FLongList): boolean;
  isMoreBackItemsExpectedInLongListFragment(f: FLongList): boolean;
  getIdRecordForLongListFragment(f: FLongList): { isEmpty(): boolean };
}

export interface ILongListDelegate {
  onLongListFragmentRequestResetList(f: FLongList): void;
}

export class FLongList extends Fragment {
  #fItems: BufferedList;
  #currentId: string | null = null;

  constructor() {
    super();
    this.#fItems = new BufferedList();
    this.#fItems.setDataSource(this);
    this.#fItems.setDelegate(this);
    this.setChild("items", this.#fItems);
  }

  // Delegate protocols
  createFragmentForBufferedListItem(_fBufferedList: BufferedList, itemIndex: number): Fragment | null {
    return this.getDataSource<ILongListDataSource>()!.getItemFragmentForLongListFragment(this, itemIndex);
  }

  // Accessors
  isBufferedListExpectingMoreHeadItems(_fBufferedList: BufferedList): boolean {
    return this.getDataSource<ILongListDataSource>()!.isMoreFrontItemsExpectedInLongListFragment(this);
  }
  isBufferedListExpectingMoreTrailingItems(_fBufferedList: BufferedList): boolean {
    return this.getDataSource<ILongListDataSource>()!.isMoreBackItemsExpectedInLongListFragment(this);
  }
  shouldBufferedListClearBuffer(_fBufferedList: BufferedList): boolean {
    return this.getDataSource<ILongListDataSource>()!.getIdRecordForLongListFragment(this).isEmpty();
  }

  getFirstId(): number { return this.#fItems.getFirstId(); }
  getCurrentId(): string | null { return this.#currentId; }

  // Mutators
  setEnableTopBuffer(b: boolean): void { this.#fItems.setEnableTopBuffer(b); }
  setGridMode(b: boolean): void { this.#fItems.setGridMode(b); }

  // Methods
  onScrollFinished(): void { this.#fItems.onScrollFinished(); }

  scrollToItemIndex(idx: number): void { this.#fItems.scrollTo(idx); }
  reset(): void {
    this.getDelegate<ILongListDelegate>()!.onLongListFragmentRequestResetList(this);
    this.reload();
  }
  // Reload items without reseting ids
  reload(): void { this.#fItems.reload(); }
  // Only refresh items
  refresh(): void { this.#fItems.refresh(); }

  switchToItem(id: string): void {
    this.#currentId = id;
    this.#fItems.refresh();
  }

  // Virtual functions
  _renderOnRender(render: any): void {
    this.#fItems.attachRender(render);
    this.#fItems.render();
  }
}
