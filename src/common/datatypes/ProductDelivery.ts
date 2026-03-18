import { ServerDataObject } from './ServerDataObject.js';
import type { ProductDeliveryBaseData } from '../../types/backend2.js';

export class ProductDelivery<T extends ProductDeliveryBaseData> extends ServerDataObject<T> {
  getDescription(): string | null {
    return this._data.description;
  }

  setDescription(d: string): void {
    this._data.description = d;
  }
}

