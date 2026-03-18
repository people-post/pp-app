import { ProductDelivery } from './ProductDelivery.js';
import { ProductServiceLocation } from './ProductServiceLocation.js';
import type { ProductServiceLocationData, QueueServiceDeliveryData } from '../../types/backend2.js';

export class QueueServiceDelivery extends ProductDelivery<QueueServiceDeliveryData> {
  #locations: ProductServiceLocation[] = [];

  constructor(data: QueueServiceDeliveryData) {
    super(data);
    if (data.locations) {
      for (const d of data.locations) {
        this.#locations.push(this.#initLocation(d));
      }
    }
  }

  getLocations(): ProductServiceLocation[] {
    return this.#locations;
  }

  #initLocation(data: ProductServiceLocationData): ProductServiceLocation {
    return new ProductServiceLocation(data);
  }
}

