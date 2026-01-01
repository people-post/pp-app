import { FScrollable } from '../../lib/ui/controllers/fragments/FScrollable.js';
import { FLongList } from '../../lib/ui/controllers/fragments/FLongList.js';

export class FSocialItemList extends FScrollable {
  #fList;
  constructor() {
    super();
    this.#fList = new FLongList();
    this.#fList.setDataSource(this);
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);
  }

  hasBufferOnTop() {
    let r = this._getIdRecord();
    if (r.isFrontComplete()) {
      return r.getFirstIdx() < this.#fList.getFirstId();
    }
    return true;
  }

  isReloadable() { return true; }

  isMoreFrontItemsExpectedInLongListFragment(fLongList) {
    return !this.#isListFrontLoaded();
  }
  isMoreBackItemsExpectedInLongListFragment(fLongList) {
    return !this.#isListBackLoaded();
  }

  getCurrentId() { return this.#fList.getCurrentId(); }
  getIdRecordForLongListFragment(fLongList) { return this._getIdRecord(); }
  getItemFragmentForLongListFragment(fLongList, itemIndex) {
    return this.#createItemFragment(itemIndex);
  }

  onLongListFragmentRequestResetList() { this._getIdRecord().clear(); }

  setEnableTopBuffer(b) { this.#fList.setEnableTopBuffer(b); }

  // Definition of reload is same as reset
  reset() { this.#fList.reset(); }
  reload() { this.#fList.reset(); }

  scrollToTop() {
    this.#fList.scrollToItemIndex(this._getIdRecord().getFirstIdx());
  }
  onScrollFinished() { this.#fList.onScrollFinished(); }

  switchToItem(id, shouldShowItemView = true) {
    this.#fList.switchToItem(id);
    let idx = this._getIdRecord().getIndexOf(id);
    if (idx != null) {
      this.#fList.scrollToItemIndex(idx);
    }
    if (shouldShowItemView) {
      let v = this._createItemView(id);
      if (v) {
        this.onFragmentRequestShowView(this, v, "Item" + id);
      }
    }
  }

  _renderOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }

  _getIdRecord() { throw "_getIdRecord is required in FSocialItemList"; }

  _createInfoFragment(id) { throw "_createInfoFragment is not implemented"; }
  _createItemView(id) { throw "_createItemView is not implemented"; }

  _asyncLoadFrontItems() { throw "_asyncLoadFrontItems is not implemented"; }
  _asyncLoadBackItems() { throw "_asyncLoadBackItems is not implemented"; }

  #isListFrontLoaded() { return this._getIdRecord().isFrontComplete(); }
  #isListBackLoaded() { return this._getIdRecord().isBackComplete(); }

  #createItemFragment(itemIndex) {
    let id = this._getIdRecord().getId(itemIndex);
    if (id) {
      return this._createInfoFragment(id);
    }

    if (itemIndex < 0) {
      if (!this.#isListFrontLoaded()) {
        this._asyncLoadFrontItems();
      }
    } else {
      if (!this.#isListBackLoaded()) {
        this._asyncLoadBackItems();
      }
    }
    return null;
  }
};

