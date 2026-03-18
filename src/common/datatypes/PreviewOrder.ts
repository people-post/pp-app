import { ServerDataObject } from './ServerDataObject.js';
import { PreviewOrderItem } from './PreviewOrderItem.js';
import type { PreviewOrderData, PreviewOrderItemData } from '../../types/backend2.js';

export class PreviewOrder extends ServerDataObject<PreviewOrderData> {
  #items: PreviewOrderItem[] = [];

  constructor(data: PreviewOrderData) {
    super(data);
    this.#items = this.#initItems(data.items || []);
  }

  getCurrencyId(): string {
    return this._data.currency_id;
  }

  getItems(): PreviewOrderItem[] {
    return this.#items;
  }

  getTotal(): number {
    return this._data.total;
  }

  #initItems(dataList: PreviewOrderItemData[]): PreviewOrderItem[] {
    const items: PreviewOrderItem[] = [];
    for (const d of dataList) {
      items.push(new PreviewOrderItem(d));
    }
    return items;
  }
}
