import { ServerDataObject } from './ServerDataObject.js';
import { PreviewOrderItem } from './PreviewOrderItem.js';
import type { PreviewOrderData } from '../../types/backend2.js';

export class PreviewOrder extends ServerDataObject {
  #items: PreviewOrderItem[] = [];
  protected _data: PreviewOrderData;

  constructor(data: PreviewOrderData) {
    super(data);
    this._data = data;
    this.#items = this.#initItems(data.items || []);
  }

  getCurrencyId(): string | undefined {
    return this._data.currency_id;
  }

  getItems(): PreviewOrderItem[] {
    return this.#items;
  }

  getTotal(): number | undefined {
    return this._data.total as number | undefined;
  }

  #initItems(dataList: unknown[]): PreviewOrderItem[] {
    const items: PreviewOrderItem[] = [];
    for (const d of dataList) {
      items.push(new PreviewOrderItem(d as Record<string, unknown>));
    }
    return items;
  }
}
