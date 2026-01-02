import { ProductDelivery } from './ProductDelivery.js';
import { ProductServiceLocation } from './ProductServiceLocation.js';

interface QueueServiceDeliveryData {
  locations?: unknown[];
  [key: string]: unknown;
}

export class QueueServiceDelivery extends ProductDelivery {
  #locations: ProductServiceLocation[] = [];
  protected _data: QueueServiceDeliveryData;

  constructor(data: QueueServiceDeliveryData) {
    super(data);
    this._data = data;
    if (data.locations) {
      for (const d of data.locations) {
        this.#locations.push(this.#initLocation(d as Record<string, unknown>));
      }
    }
  }

  getLocations(): ProductServiceLocation[] {
    return this.#locations;
  }

  #initLocation(data: Record<string, unknown>): ProductServiceLocation {
    return new ProductServiceLocation(data);
  }
}

