import { FScrollable } from '../../lib/ui/controllers/fragments/FScrollable.js';
import { FLongList } from '../../lib/ui/controllers/fragments/FLongList.js';
import type { LongListDataSource } from '../../lib/ui/controllers/fragments/FLongList.js';
import type { LongListDelegate } from '../../lib/ui/controllers/fragments/FLongList.js';
import { LongListIdRecord } from '../datatypes/LongListIdRecord.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FSocialItemList extends FScrollable implements LongListDataSource, LongListDelegate {
  #fList: FLongList;

  constructor() {
    super();
    this.#fList = new FLongList();
    this.#fList.setDataSource(this);
    this.#fList.setDelegate(this as any);
    this.setChild("list", this.#fList);
  }

  hasBufferOnTop(): boolean {
    const r = this._getIdRecord();
    if (r.isFrontComplete()) {
      return r.getFirstIdx() < (this.#fList.getFirstId() || 0);
    }
    return true;
  }

  isReloadable(): boolean { return true; }

  isMoreFrontItemsExpectedInLongListFragment(_fLongList: FLongList): boolean {
    return !this.#isListFrontLoaded();
  }
  isMoreBackItemsExpectedInLongListFragment(_fLongList: FLongList): boolean {
    return !this.#isListBackLoaded();
  }

  getCurrentId(): string | number | null { return this.#fList.getCurrentId(); }
  getIdRecordForLongListFragment(_fLongList: FLongList): LongListIdRecord { return this._getIdRecord(); }
  getItemFragmentForLongListFragment(_fLongList: FLongList, itemIndex: number): Fragment | null {
    return this.#createItemFragment(itemIndex);
  }

  onLongListFragmentRequestResetList(): void { this._getIdRecord().clear(); }

  setEnableTopBuffer(b: boolean): void { this.#fList.setEnableTopBuffer(b); }

  // Definition of reload is same as reset
  reset(): void { this.#fList.reset(); }
  reload(): void { this.#fList.reset(); }

  scrollToTop(): void {
    this.#fList.scrollToItemIndex(this._getIdRecord().getFirstIdx());
  }
  onScrollFinished(): void { this.#fList.onScrollFinished(); }

  switchToItem(id: string | number, shouldShowItemView = true): void {
    this.#fList.switchToItem(id);
    const idx = this._getIdRecord().getIndexOf(typeof id === 'string' ? id : String(id));
    if (idx != null && typeof idx === 'number') {
      this.#fList.scrollToItemIndex(idx);
    }
    if (shouldShowItemView) {
      const v = this._createItemView(id);
      if (v) {
        this.onFragmentRequestShowView(this, v, "Item" + id);
      }
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    this.#fList.attachRender(render);
    this.#fList.render();
  }

  _getIdRecord(): LongListIdRecord { throw new Error("_getIdRecord is required in FSocialItemList"); }

  _createInfoFragment(_id: string | number): Fragment { throw new Error("_createInfoFragment is not implemented"); }
  _createItemView(_id: string | number): View | null { throw new Error("_createItemView is not implemented"); }

  _asyncLoadFrontItems(): void { throw new Error("_asyncLoadFrontItems is not implemented"); }
  _asyncLoadBackItems(): void { throw new Error("_asyncLoadBackItems is not implemented"); }

  #isListFrontLoaded(): boolean { return this._getIdRecord().isFrontComplete(); }
  #isListBackLoaded(): boolean { return this._getIdRecord().isBackComplete(); }

  #createItemFragment(itemIndex: number): Fragment | null {
    const id = this._getIdRecord().getId(itemIndex);
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
}

