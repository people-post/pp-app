import { Fragment } from './Fragment.js';
import { BufferedList } from './BufferedList.js';

export class FLongList extends Fragment {
  #fItems;
  #currentId = null;

  constructor() {
    super();
    this.#fItems = new BufferedList();
    this.#fItems.setDataSource(this);
    this.#fItems.setDelegate(this);
    this.setChild("items", this.#fItems);
  }

  // Delegate protocols
  createFragmentForBufferedListItem(fBufferedList, itemIndex) {
    return this._dataSource.getItemFragmentForLongListFragment(this, itemIndex);
  }

  // Accessors
  isBufferedListExpectingMoreHeadItems(fBufferedList) {
    return this._dataSource.isMoreFrontItemsExpectedInLongListFragment(this);
  }
  isBufferedListExpectingMoreTrailingItems(fBufferedList) {
    return this._dataSource.isMoreBackItemsExpectedInLongListFragment(this);
  }
  shouldBufferedListClearBuffer(fBufferedList) {
    return this._dataSource.getIdRecordForLongListFragment(this).isEmpty();
  }

  getFirstId() { return this.#fItems.getFirstId(); }
  getCurrentId() { return this.#currentId; }

  // Mutators
  setEnableTopBuffer(b) { this.#fItems.setEnableTopBuffer(b); }
  setGridMode(b) { this.#fItems.setGridMode(b); }

  // Methods
  onScrollFinished() { this.#fItems.onScrollFinished(); }

  scrollToItemIndex(idx) { this.#fItems.scrollTo(idx); }
  reset() {
    this._delegate.onLongListFragmentRequestResetList(this);
    this.reload();
  }
  // Reload items without reseting ids
  reload() { this.#fItems.reload(); }
  // Only refresh items
  refresh() { this.#fItems.refresh(); }

  switchToItem(id) {
    this.#currentId = id;
    this.#fItems.refresh();
  }

  // Virtual functions
  _renderOnRender(render) {
    this.#fItems.attachRender(render);
    this.#fItems.render();
  }
};

